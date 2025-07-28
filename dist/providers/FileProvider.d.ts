import { Narration } from '../Narration';
import { NarrationOptions, NarrationProvider, Narrator } from '../Narrator';
export interface FileProviderConfig {
    audioDirectory?: string;
}
export declare class FileProvider implements NarrationProvider {
    name: string;
    private config;
    constructor(config?: FileProviderConfig);
    generateId(text: string, _options: NarrationOptions): string;
    resolve(_narrator: Narrator, text: string, options: NarrationOptions): Promise<Narration>;
    private resolveAudioPath;
    private isAbsoluteUrl;
    private getAudioDuration;
}
//# sourceMappingURL=FileProvider.d.ts.map