import { Narration } from '../Narration';
import { NarrationOptions, NarrationProvider, Narrator } from '../Narrator';
export interface GoogleChirpConfig {
    apiKey?: string;
    projectId?: string;
    languageCode?: string;
    voice_name?: string;
    customVoiceKey?: string;
    enableCaching?: boolean;
}
export declare class GoogleChirpProvider implements NarrationProvider {
    name: string;
    private config;
    constructor(config: GoogleChirpConfig);
    generateId(text: string, _options: NarrationOptions): string;
    resolve(_narrator: Narrator, text: string, options: NarrationOptions): Promise<Narration>;
    private synthesizeSpeech;
}
//# sourceMappingURL=GoogleChirpProvider.d.ts.map