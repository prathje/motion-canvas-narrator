import { Narration } from '../Narration';
import { NarrationOptions, NarrationProvider, Narrator } from '../Narrator';
export interface ElevenLabsSoundConfig {
    apiKey?: string;
    modelId?: string;
    loop?: boolean;
    durationSeconds?: number | null;
    promptInfluence?: number | null;
    outputFormat?: string;
}
export declare class ElevenLabsSoundProvider implements NarrationProvider {
    name: string;
    private config;
    constructor(config: ElevenLabsSoundConfig);
    generateId(options: NarrationOptions): string;
    resolve(narrator: Narrator, options: NarrationOptions): Promise<Narration>;
}
//# sourceMappingURL=ElevenLabsSoundProvider.d.ts.map