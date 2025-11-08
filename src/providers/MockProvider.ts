import {Narration} from '../Narration';
import {NarrationOptions, NarrationProvider, Narrator} from '../Narrator';
import {AudioUtils} from '../utils/AudioUtils';

export class MockProvider implements NarrationProvider {
  public name = 'Mock Provider';
  private wordsPerMinute: number;

  public constructor(wordsPerMinute: number = 120) {
    this.wordsPerMinute = wordsPerMinute;
  }

  public generateId(options: NarrationOptions): string {
    return AudioUtils.generateAudioId(options.text, ['mock', this.wordsPerMinute.toString()]);
  }

  public resolve(
    _narrator: Narrator,
    options: NarrationOptions
  ): Narration {
    const text = options.text;
    const words = text.split(' ').length;
    const baseDuration = (words / this.wordsPerMinute) * 60; // Convert words per minute to seconds

    const id = this.generateId(options);
    return new Narration(id, text, baseDuration, '');
  }
}
