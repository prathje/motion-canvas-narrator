import { ThreadGenerator } from '@motion-canvas/core';
import { Narration } from './Narration';
export interface NarratorConfig {
    [key: string]: any;
}
export interface NarrationProvider {
    name: string;
    generateId(options: NarrationOptions): string;
    resolve(narrator: Narrator, textOrOptions: string | NarrationOptions): Narration | Promise<Narration>;
}
export interface NarrationOptions {
    text: string;
    [key: string]: any;
}
export interface NarrationPlaybackOptions {
    playbackRate?: number;
    gain?: number;
    detune?: number;
}
export declare class Narrator {
    private provider;
    readonly config: NarratorConfig;
    defaultPlaybackOptions: NarrationPlaybackOptions;
    constructor(provider: NarrationProvider, config?: NarratorConfig);
    setDefaultPlaybackOptions(options: NarrationPlaybackOptions): void;
    resolve(textOrOptions: string | NarrationOptions): Promise<Narration>;
    resolveAll(textOrOptionsList: (string | NarrationOptions)[]): Promise<Narration[]>;
    speak(textOrOptions: string | NarrationOptions, playbackOptions?: NarrationPlaybackOptions): ThreadGenerator;
    start(narration: Narration, playbackOptions?: NarrationPlaybackOptions): ThreadGenerator;
}
//# sourceMappingURL=Narrator.d.ts.map