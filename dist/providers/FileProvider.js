import { Narration } from '../Narration';
import { AudioUtils } from '../utils/AudioUtils';
import { CacheUtils } from 'motion-canvas-cache';
export class FileProvider {
    constructor(config = {}) {
        this.name = 'File Provider';
        this.config = config;
    }
    generateId(options) {
        const audioDirectory = this.config.audioDirectory || 'default';
        return CacheUtils.generateCacheKey(options.text, ['file', audioDirectory]);
    }
    async resolve(_narrator, options) {
        const text = options.text;
        // For FileProvider, the "text" parameter should be the file path
        const audioUrl = this.resolveAudioPath(text);
        // Get actual audio duration
        const duration = await this.getAudioDuration(audioUrl);
        const id = this.generateId(options);
        return new Narration(id, text, duration, audioUrl);
    }
    resolveAudioPath(filePath) {
        if (this.isAbsoluteUrl(filePath)) {
            return filePath;
        }
        if (this.config.audioDirectory) {
            return `${this.config.audioDirectory}/${filePath}`;
        }
        return filePath;
    }
    isAbsoluteUrl(url) {
        return (url.startsWith('http://') ||
            url.startsWith('https://') ||
            url.startsWith('blob:') ||
            url.startsWith('data:') ||
            url.startsWith('/'));
    }
    async getAudioDuration(audioUrl) {
        try {
            // Load the audio file as a blob and use AudioUtils
            const response = await fetch(audioUrl);
            const audioBlob = await response.blob();
            return await AudioUtils.getAudioDuration(audioBlob);
        }
        catch (error) {
            console.warn(`Failed to get audio duration for ${audioUrl}:`, error);
            // Fallback to a reasonable default
            return 3.0;
        }
    }
}
//# sourceMappingURL=FileProvider.js.map