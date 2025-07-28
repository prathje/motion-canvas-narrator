import { Narration } from '../Narration';
import { NarrationOptions, NarrationProvider, Narrator } from '../Narrator';
export interface ElevenLabsConfig {
    apiKey?: string;
    voiceId: string;
    modelId?: string;
}
export declare class ElevenLabsProvider implements NarrationProvider {
    name: string;
    private config;
    constructor(config: ElevenLabsConfig);
    generateId(text: string, _options: NarrationOptions): string;
    resolve(_narrator: Narrator, text: string, options: NarrationOptions): Promise<Narration>;
}
//# sourceMappingURL=ElevenLabsProvider.d.ts.map