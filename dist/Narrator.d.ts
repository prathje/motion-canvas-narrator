import { SoundSettings, ThreadGenerator } from '@motion-canvas/core';
import { Narration } from './Narration';
export interface NarratorConfig {
    [key: string]: any;
}
export interface NarrationProvider {
    name: string;
    generateId(text: string, options: NarrationOptions): string;
    resolve(narrator: Narrator, text: string, options: NarrationOptions): Narration | Promise<Narration>;
}
export interface NarrationOptions {
    soundSettings?: SoundSettings;
    [key: string]: any;
}
/**
 * A batch collector for pre-fetching multiple narrations in parallel.
 * Collect narrations using .speak(), then call .resolve() to fetch all at once.
 */
export declare class NarrationBatch {
    private narrator;
    private items;
    constructor(narrator: Narrator);
    /**
     * Add a narration to the batch.
     * @param text The text to narrate
     * @param options Optional narration options
     * @returns This batch for method chaining
     */
    speak(text: string, options?: NarrationOptions): this;
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
    resolve(): Promise<Narration[]>;
}
export declare class Narrator {
    private provider;
    readonly config: NarratorConfig;
    constructor(provider: NarrationProvider, config?: NarratorConfig);
    resolve(text: string, options?: NarrationOptions): Promise<Narration>;
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
    createBatch(): NarrationBatch;
    speak(text: string, options?: NarrationOptions): ThreadGenerator;
    start(narration: Narration): ThreadGenerator;
}
//# sourceMappingURL=Narrator.d.ts.map