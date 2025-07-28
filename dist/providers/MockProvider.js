import { Narration } from '../Narration';
import { AudioUtils } from '../utils/AudioUtils';
export class MockProvider {
    constructor(wordsPerMinute = 120) {
        this.name = 'Mock Provider';
        this.wordsPerMinute = wordsPerMinute;
    }
    generateId(text, _options) {
        return AudioUtils.generateAudioId(text, ['mock', this.wordsPerMinute.toString()]);
    }
    resolve(_narrator, text, options) {
        const words = text.split(' ').length;
        const baseDuration = (words / this.wordsPerMinute) * 60; // Convert words per minute to seconds
        const sound = {
            audio: '', // empty audio for mock
        };
        const id = this.generateId(text, options);
        return new Narration(id, text, baseDuration, sound);
    }
}
//# sourceMappingURL=MockProvider.js.map