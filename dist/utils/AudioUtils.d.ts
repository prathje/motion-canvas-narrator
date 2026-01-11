export declare class AudioUtils {
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
}
//# sourceMappingURL=AudioUtils.d.ts.map