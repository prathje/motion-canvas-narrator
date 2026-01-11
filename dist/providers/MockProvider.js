import { Narration } from '../Narration';
import { CacheUtils } from 'motion-canvas-cache';
export class MockProvider {
    constructor(wordsPerMinute = 120) {
        this.name = 'Mock Provider';
        this.wordsPerMinute = wordsPerMinute;
    }
    generateId(options) {
        return CacheUtils.generateCacheKey(options.text, ['mock', this.wordsPerMinute.toString()]);
    }
    resolve(_narrator, options) {
        const text = options.text;
        const words = text.split(' ').length;
        const baseDuration = (words / this.wordsPerMinute) * 60; // Convert words per minute to seconds
        const id = this.generateId(options);
        return new Narration(id, text, baseDuration, '');
    }
}
//# sourceMappingURL=MockProvider.js.map