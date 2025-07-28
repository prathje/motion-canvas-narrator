import {useScene, waitFor, threadable} from '@motion-canvas/core';
import {SoundSettings, ThreadGenerator} from '@motion-canvas/core';
import {Narration} from './Narration';

export interface NarratorConfig {
  [key: string]: any; // Allow provider-specific settings
}

export interface NarrationProvider {
  name: string;
  generateId(text: string, options: NarrationOptions): string;
  resolve(
    narrator: Narrator,
    text: string,
    options: NarrationOptions,
  ): Narration | Promise<Narration>;
}

export interface NarrationOptions {
  soundSettings?: SoundSettings; // Custom sound settings
  [key: string]: any; // Allow provider-specific settings
}

export class Narrator {
  private provider: NarrationProvider;
  public readonly config: NarratorConfig;

  constructor(provider: NarrationProvider, config: NarratorConfig = {}) {
    this.provider = provider;
    this.config = config;
  }

  public async resolve(
    text: string,
    options: NarrationOptions = {},
  ): Promise<Narration> {
    return await this.provider.resolve(this, text, options);
  }

  @threadable()
  public *speak(text: string, options: NarrationOptions = {}): ThreadGenerator {
    // Await the narration preparation
    const narration: Narration = yield this.resolve(text, options);

    // and start it
    yield* this.start(narration);
  }

  @threadable()
  public *start(narration: Narration): ThreadGenerator {
    // Get scene within the generator context
    const scene = useScene();

    if (narration.sound.audio) {
      // Add sound, no offset for now
      scene.sounds.add(narration.sound, 0);
    } else {
      console.warn(`No audio provided for narration: ${narration.text}`);
    }

    // Wait for the narration to complete
    yield* waitFor(narration.duration);
  }
}
