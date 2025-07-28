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
export declare class Narrator {
    private provider;
    readonly config: NarratorConfig;
    constructor(provider: NarrationProvider, config?: NarratorConfig);
    resolve(text: string, options?: NarrationOptions): Promise<Narration>;
    speak(text: string, options?: NarrationOptions): ThreadGenerator;
    start(narration: Narration): ThreadGenerator;
}
//# sourceMappingURL=Narrator.d.ts.map