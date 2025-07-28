var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { useScene, waitFor, threadable } from '@motion-canvas/core';
export class Narrator {
    constructor(provider, config = {}) {
        this.provider = provider;
        this.config = config;
    }
    async resolve(text, options = {}) {
        return await this.provider.resolve(this, text, options);
    }
    *speak(text, options = {}) {
        // Await the narration preparation
        const narration = yield this.resolve(text, options);
        // and start it
        yield* this.start(narration);
    }
    *start(narration) {
        // Get scene within the generator context
        const scene = useScene();
        if (narration.sound.audio) {
            // Add sound, no offset for now
            scene.sounds.add(narration.sound, 0);
        }
        else {
            console.warn(`No audio provided for narration: ${narration.text}`);
        }
        // Wait for the narration to complete
        yield* waitFor(narration.duration);
    }
}
__decorate([
    threadable()
], Narrator.prototype, "speak", null);
__decorate([
    threadable()
], Narrator.prototype, "start", null);
//# sourceMappingURL=Narrator.js.map