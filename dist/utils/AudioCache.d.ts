declare global {
    interface ImportMeta {
        hot?: {
            on: (event: string, callback: (data: any) => void) => void;
            send: (event: string, data: any) => void;
        };
    }
}
export interface CachedAudioResult {
    audioUrl: string;
    duration: number;
}
type AudioId = string;
export declare class AudioCache {
    private static instance;
    private cache;
    private pendingRequests;
    private serverAvailablePromise;
    private constructor();
    static getInstance(): AudioCache;
    private initializeHMR;
    get(cacheKey: AudioId): CachedAudioResult | null;
    private set;
    cacheAudioResult(cacheKey: AudioId, audioUrl: string, duration: number): void;
    checkServerCache(cacheKey: AudioId): Promise<CachedAudioResult | null>;
    uploadToServer(cacheKey: AudioId, audioData: ArrayBuffer, duration: number, metadata: {
        generatedAt: string;
    }): Promise<void>;
    streamToArrayBuffer(stream: ReadableStream): Promise<ArrayBuffer>;
    getAudioDuration(audioBlob: Blob): Promise<number>;
}
export {};
//# sourceMappingURL=AudioCache.d.ts.map