import {Narration} from '../Narration';
import {NarrationOptions, NarrationProvider, Narrator} from '../Narrator';
import {Cache} from 'motion-canvas-cache';

export class CachedProvider implements NarrationProvider {
  public name: string;
  private innerProvider: NarrationProvider;
  private cache: Cache;

  public constructor(innerProvider: NarrationProvider) {
    this.innerProvider = innerProvider;
    this.name = `Cached ${innerProvider.name}`;
    this.cache = Cache.getInstance();
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
    let cachedResult = this.cache.get(cacheKey);

    // If not in memory, check server cache
    if (!cachedResult) {
      cachedResult = await this.cache.checkServerCache(cacheKey);
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
            await this.cache.uploadToServer(cacheKey, audioBuffer, 'audio/mpeg', {
              duration: narration.duration,
              generatedAt: new Date().toISOString()
            });
          } catch (error) {
            console.warn('Failed to upload audio to server cache:', error);
          }
        }

        // Cache in memory
        this.cache.cacheResult(cacheKey, narration.audio, {
          duration: narration.duration
        });
      }

      return narration;
    } else {
      console.log(`Cache hit for "${text.substring(0, 50)}..."`);

      const id = this.generateId(options);
      return new Narration(id, options.text, cachedResult.metadata?.duration || 0, cachedResult.url);
    }
  }
}
