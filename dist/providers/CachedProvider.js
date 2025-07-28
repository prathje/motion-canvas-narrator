import { Narration } from '../Narration';
import { AudioCache } from '../utils/AudioCache';
export class CachedProvider {
    constructor(innerProvider) {
        this.innerProvider = innerProvider;
        this.name = `Cached ${innerProvider.name}`;
        this.audioCache = AudioCache.getInstance();
    }
    generateId(text, options) {
        // For cached provider, use the inner provider's generateId method
        return this.innerProvider.generateId(text, options);
    }
    async resolve(narrator, text, options) {
        const cacheKey = this.generateId(text, options);
        // First check in-memory cache
        let cachedResult = this.audioCache.get(cacheKey);
        // If not in memory, check server cache
        if (!cachedResult) {
            cachedResult = await this.audioCache.checkServerCache(cacheKey);
        }
        // If still not found, delegate to inner provider
        if (!cachedResult) {
            console.log(`Cache miss for "${text.substring(0, 50)}..." - delegating to ${this.innerProvider.name}`);
            const narration = await this.innerProvider.resolve(narrator, text, options);
            // Cache the result if we got valid audio
            if (narration.sound.audio) {
                // Extract audio data for server upload if needed
                if (narration.sound.audio.startsWith('blob:')) {
                    try {
                        const response = await fetch(narration.sound.audio);
                        const audioBuffer = await response.arrayBuffer();
                        // Upload to server cache
                        await this.audioCache.uploadToServer(cacheKey, audioBuffer, narration.duration, {
                            generatedAt: new Date().toISOString()
                        });
                    }
                    catch (error) {
                        console.warn('Failed to upload audio to server cache:', error);
                    }
                }
                // Cache in memory
                this.audioCache.cacheAudioResult(cacheKey, narration.sound.audio, narration.duration);
            }
            return narration;
        }
        else {
            console.log(`Cache hit for "${text.substring(0, 50)}..."`);
            const sound = {
                audio: cachedResult.audioUrl,
            };
            const id = this.generateId(text, options);
            return new Narration(id, text, cachedResult.duration, sound);
        }
    }
}
//# sourceMappingURL=CachedProvider.js.map