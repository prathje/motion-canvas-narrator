export class AudioUtils {
    /**
     * Gets the duration of an audio blob using multiple fallback methods
     */
    static async getAudioDuration(audioBlob) {
        // Try Web Audio API first for most accurate duration
        try {
            return await AudioUtils.getAudioDurationWebAudio(audioBlob);
        }
        catch (error) {
            console.warn('Web Audio API failed, trying HTML Audio element');
            // Fallback to HTML Audio element
            try {
                return await AudioUtils.getAudioDurationHTMLAudio(audioBlob);
            }
            catch (error) {
                console.warn('HTML Audio failed, using file size estimation');
                // Final fallback to file size estimation
                return AudioUtils.estimateDurationFromBlob(audioBlob);
            }
        }
    }
    /**
     * Gets audio duration using Web Audio API (most accurate)
     */
    static async getAudioDurationWebAudio(audioBlob) {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        try {
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            await audioContext.close();
            return audioBuffer.duration;
        }
        catch (error) {
            await audioContext.close();
            throw error;
        }
    }
    /**
     * Gets audio duration using HTML Audio element (fallback)
     */
    static async getAudioDurationHTMLAudio(audioBlob) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            const audioUrl = URL.createObjectURL(audioBlob);
            const cleanup = () => URL.revokeObjectURL(audioUrl);
            audio.addEventListener('loadedmetadata', () => {
                cleanup();
                resolve(audio.duration);
            });
            audio.addEventListener('error', _error => {
                cleanup();
                reject(new Error('Could not load audio metadata'));
            });
            // Set a timeout to avoid hanging
            setTimeout(() => {
                cleanup();
                reject(new Error('Audio loading timeout'));
            }, 5000);
            audio.src = audioUrl;
        });
    }
    /**
     * Estimates audio duration from file size (last resort fallback)
     */
    static estimateDurationFromBlob(audioBlob) {
        // Rough estimation based on MP3 file size
        // Average MP3 bitrate is ~128kbps = 16KB/s
        const estimatedSeconds = audioBlob.size / (16 * 1024);
        return Math.max(0.1, estimatedSeconds); // Minimum 0.1 seconds
    }
}
//# sourceMappingURL=AudioUtils.js.map