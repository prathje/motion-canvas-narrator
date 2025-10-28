var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { useScene, waitFor, threadable } from '@motion-canvas/core';
/**
 * A batch collector for pre-fetching multiple narrations in parallel.
 * Collect narrations using .speak(), then call .resolve() to fetch all at once.
 */
export class NarrationBatch {
    constructor(narrator) {
        this.items = [];
        this.narrator = narrator;
    }
    /**
     * Add a narration to the batch.
     * @param text The text to narrate
     * @param options Optional narration options
     * @returns This batch for method chaining
     */
    speak(text, options = {}) {
        this.items.push({ text, options });
        return this;
    }
    /**
     * Resolve all collected narrations in parallel.
     * Pre-fetches audio and caches it so subsequent narrator.speak() calls are instant.
     * @returns Promise resolving to array of Narration objects
     *
     * @example
     * const batch = narrator.createBatch();
     * batch.speak("Welcome!");
     * batch.speak("Point 1");
     * batch.speak("Point 2");
     * await batch.resolve();
     *
     * // Now these are instant (cached)
     * yield* narrator.speak("Welcome!");
     * yield* narrator.speak("Point 1");
     * yield* narrator.speak("Point 2");
     */
    async resolve() {
        if (this.items.length === 0) {
            console.warn('Batch is empty, nothing to resolve');
            return [];
        }
        console.log(`Batch resolving ${this.items.length} narrations in parallel...`);
        const start = Date.now();
        try {
            const narrations = await Promise.all(this.items.map(({ text, options }) => this.narrator.resolve(text, options)));
            const elapsed = ((Date.now() - start) / 1000).toFixed(2);
            console.log(`Batch resolve completed in ${elapsed}s`);
            return narrations;
        }
        catch (error) {
            console.error('Batch resolve failed:', error);
            throw error;
        }
    }
}
export class Narrator {
    constructor(provider, config = {}) {
        this.provider = provider;
        this.config = config;
    }
    async resolve(text, options = {}) {
        try {
            const result = await this.provider.resolve(this, text, options);
            return result;
        }
        catch (error) {
            console.error(`Failed for: "${text.substring(0, 50)}..."`, error);
            throw error;
        }
    }
    /**
     * Create a batch collector for pre-fetching multiple narrations in parallel.
     *
     * @returns A NarrationBatch instance for collecting speak calls
     *
     * @example
     * // Collect narrations
     * const batch = narrator.createBatch();
     * batch.speak("Welcome!");
     * batch.speak("Here's point 1");
     * batch.speak("Here's point 2");
     *
     * // Pre-fetch all in parallel
     * yield* batch.resolve();
     *
     * // Now speak() calls are instant
     * yield* narrator.speak("Welcome!");
     * yield* narrator.speak("Here's point 1");
     * yield* narrator.speak("Here's point 2");
     */
    createBatch() {
        return new NarrationBatch(this);
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