import {Narration} from '../Narration';
import {NarrationOptions, NarrationProvider, Narrator} from '../Narrator';
import {AudioUtils} from '../utils/AudioUtils';

export class MockProvider implements NarrationProvider {
  public name = 'Mock Provider';
  private wordsPerMinute: number;

  public constructor(wordsPerMinute: number = 120) {
    this.wordsPerMinute = wordsPerMinute;
  }

  public generateId(text: string, _options: NarrationOptions): string {
    return AudioUtils.generateAudioId(text, ['mock', this.wordsPerMinute.toString()]);
  }

  public resolve(
    _narrator: Narrator,
    text: string,
    options: NarrationOptions,
  ): Narration {
    const words = text.split(' ').length;
    const baseDuration = (words / this.wordsPerMinute) * 60; // Convert words per minute to seconds

    const sound = {
      audio: '', // empty audio for mock
    };

    const id = this.generateId(text, options);
    return new Narration(id, text, baseDuration, sound);
  }
}
