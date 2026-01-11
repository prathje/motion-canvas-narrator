import { Narration } from '../Narration';
import { NarrationOptions, NarrationProvider, Narrator } from '../Narrator';
export interface MinimaxConfig {
    apiKey?: string;
    voiceId: string;
    model?: 'speech-2.6-hd' | 'speech-2.6-turbo' | 'speech-02-hd' | 'speech-02-turbo' | 'speech-01-hd' | 'speech-01-turbo';
    emotion?: string;
    speed?: number;
    volume?: number;
    pitch?: number;
    sampleRate?: number;
    bitrate?: number;
    format?: 'mp3' | 'wav' | 'flac';
    channel?: 1 | 2;
    subtitle?: boolean;
    outputFormat?: 'hex' | 'url';
    endpoint?: string;
}
export declare class MinimaxProvider implements NarrationProvider {
    name: string;
    private readonly config;
    private readonly defaultEndpoint;
    constructor(config: MinimaxConfig);
    generateId(options: NarrationOptions): string;
    resolve(_narrator: Narrator, options: NarrationOptions): Promise<Narration>;
    private getEndpoint;
    private buildRequestBody;
    private buildAudioBlob;
    private hexToArrayBuffer;
    private getMimeType;
}
//# sourceMappingURL=MinimaxProvider.d.ts.map