export declare class AudioUtils {
    /**
     * Converts a ReadableStream to ArrayBuffer
     */
    static streamToArrayBuffer(stream: ReadableStream): Promise<ArrayBuffer>;
    /**
     * Gets the duration of an audio blob using multiple fallback methods
     */
    static getAudioDuration(audioBlob: Blob): Promise<number>;
    /**
     * Gets audio duration using Web Audio API (most accurate)
     */
    private static getAudioDurationWebAudio;
    /**
     * Gets audio duration using HTML Audio element (fallback)
     */
    private static getAudioDurationHTMLAudio;
    /**
     * Estimates audio duration from file size (last resort fallback)
     */
    private static estimateDurationFromBlob;
    /**
     * Converts a Blob to a data URL
     */
    static blobToDataUrl(blob: Blob): Promise<string>;
    /**
     * Generates an audio ID from text and options
     */
    static generateAudioId(text: string, opts: string[]): string;
    /**
     * Simple hash function for generating cache keys
     */
    private static simpleHash;
}
//# sourceMappingURL=AudioUtils.d.ts.map