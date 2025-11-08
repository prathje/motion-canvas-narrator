import {useScene, waitFor, threadable} from '@motion-canvas/core';
import {ThreadGenerator} from '@motion-canvas/core';
import {Narration} from './Narration';

export interface NarratorConfig {
  [key: string]: any; // Allow provider-specific settings
}

export interface NarrationProvider {
  name: string;
  generateId(options: NarrationOptions): string;
  resolve(
    narrator: Narrator,
    textOrOptions: string|NarrationOptions,
  ): Narration | Promise<Narration>;
}

export interface NarrationOptions {
  text: string, // the main text to be narrated
  [key: string]: any; // Allow provider-specific settings
}

export interface NarrationPlaybackOptions {
  playbackRate?: number;
  gain?: number;
  detune?: number;
}

export class Narrator {
  private provider: NarrationProvider;
  public readonly config: NarratorConfig;
  public defaultPlaybackOptions: NarrationPlaybackOptions = {}; // default playback options

  constructor(provider: NarrationProvider, config: NarratorConfig = {}) {
    this.provider = provider;
    this.config = config;
  }

  public setDefaultPlaybackOptions(options: NarrationPlaybackOptions) {
    this.defaultPlaybackOptions = options;
  }

  public async resolve(textOrOptions: string|NarrationOptions): Promise<Narration> {
    const options = typeof textOrOptions === 'string' ? {text: textOrOptions} : textOrOptions;
    return this.provider.resolve(this, options);
  }

  @threadable()
  public *speak(textOrOptions: string|NarrationOptions, playbackOptions: NarrationPlaybackOptions = {}): ThreadGenerator {

    // Await the narration preparation by yielding the promise
    const narration: Narration = yield this.resolve(textOrOptions);

    // and start it
    yield* this.start(narration, playbackOptions);
  }

  @threadable()
  public *start(narration: Narration, playbackOptions: NarrationPlaybackOptions = {}): ThreadGenerator {
    // Get scene within the generator context
    const scene = useScene();

    if (narration.audio) {

      playbackOptions = {...this.defaultPlaybackOptions, ...playbackOptions}; // use narrator's default playback options if none provided

      const sound = {
        audio: narration.audio,
        playbackRate: playbackOptions.playbackRate ?? 1,
        gain: playbackOptions.gain ?? 0,
        detune: playbackOptions.detune ?? 0,
      };

      scene.sounds.add(sound, 0);
    } else {
      console.warn(`No audio provided for narration: ${narration.text}`);
    }

    // Wait for the narration to complete
    yield* waitFor(narration.duration);
  }
}
