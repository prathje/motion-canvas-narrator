var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { useScene, waitFor, threadable } from '@motion-canvas/core';
export class Narrator {
    constructor(provider, config = {}) {
        this.defaultPlaybackOptions = {}; // default playback options
        this.provider = provider;
        this.config = config;
    }
    setDefaultPlaybackOptions(options) {
        this.defaultPlaybackOptions = options;
    }
    async resolve(textOrOptions) {
        const options = typeof textOrOptions === 'string' ? { text: textOrOptions } : textOrOptions;
        return this.provider.resolve(this, options);
    }
    async resolveAll(textOrOptionsList) {
        return Promise.all(textOrOptionsList.map((textOrOptions) => this.resolve(textOrOptions)));
    }
    *speak(textOrOptions, playbackOptions = {}) {
        // Await the narration preparation by yielding the promise
        const narration = yield this.resolve(textOrOptions);
        // and start it
        yield* this.start(narration, playbackOptions);
    }
    *start(narration, playbackOptions = {}) {
        // Get scene within the generator context
        const scene = useScene();
        playbackOptions = { ...this.defaultPlaybackOptions, ...playbackOptions }; // use narrator's default playback options if none provided
        const sound = {
            audio: narration.audio,
            playbackRate: playbackOptions.playbackRate ?? 1,
            gain: playbackOptions.gain ?? 0,
            detune: playbackOptions.detune ?? 0,
        };
        const adjustedDuration = narration.duration / sound.playbackRate;
        if (sound.audio) {
            scene.sounds.add(sound, 0);
        }
        else {
            console.warn(`No audio provided for narration: ${narration.text}`);
        }
        // Wait for the narration to complete
        yield* waitFor(adjustedDuration);
    }
}
__decorate([
    threadable()
], Narrator.prototype, "speak", null);
__decorate([
    threadable()
], Narrator.prototype, "start", null);
//# sourceMappingURL=Narrator.js.map