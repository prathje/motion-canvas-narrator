import {Narration} from '../Narration';
import {NarrationOptions, NarrationProvider, Narrator} from '../Narrator';
import {AudioCache} from '../utils/AudioCache';

export class CachedProvider implements NarrationProvider {
  public name: string;
  private innerProvider: NarrationProvider;
  private audioCache: AudioCache;

  public constructor(innerProvider: NarrationProvider) {
    this.innerProvider = innerProvider;
    this.name = `Cached ${innerProvider.name}`;
    this.audioCache = AudioCache.getInstance();
  }

  public generateId(options: NarrationOptions): string {
    // For cached provider, use the inner provider's generateId method
    return this.innerProvider.generateId(options);
  }

  public async resolve(
    narrator: Narrator,
    options: NarrationOptions
  ): Promise<Narration> {
    const text = options.text;
    const cacheKey = this.generateId(options);

    // First check in-memory cache
    let cachedResult = this.audioCache.get(cacheKey);

    // If not in memory, check server cache
    if (!cachedResult) {
      cachedResult = await this.audioCache.checkServerCache(cacheKey);
    }

    // If still not found, delegate to inner provider
    if (!cachedResult) {
      console.log(`Cache miss for "${text.substring(0, 50)}..." - delegating to ${this.innerProvider.name}`);

      const narration = await this.innerProvider.resolve(narrator, options);

      // Cache the result if we got valid audio
      if (narration.audio) {
        // Extract audio data for server upload if needed
        if (narration.audio.startsWith('blob:')) {
          try {
            const response = await fetch(narration.audio);
            const audioBuffer = await response.arrayBuffer();

            // Upload to server cache
            await this.audioCache.uploadToServer(cacheKey, audioBuffer, narration.duration, {
              generatedAt: new Date().toISOString()
            });
          } catch (error) {
            console.warn('Failed to upload audio to server cache:', error);
          }
        }

        // Cache in memory
        this.audioCache.cacheAudioResult(cacheKey, narration.audio, narration.duration);
      }

      return narration;
    } else {
      console.log(`Cache hit for "${text.substring(0, 50)}..."`);

      const id = this.generateId(options);
      return new Narration(id, options.text, cachedResult.duration, cachedResult.audioUrl);
    }
  }
}
