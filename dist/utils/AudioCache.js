import { AudioUtils } from './AudioUtils';
export class AudioCache {
    static { this.instance = null; }
    constructor() {
        this.cache = new Map();
        this.pendingRequests = new Map();
        this.serverAvailablePromise = null;
    }
    static getInstance() {
        if (!AudioCache.instance) {
            AudioCache.instance = new AudioCache();
            AudioCache.instance.initializeHMR();
        }
        return AudioCache.instance;
    }
    initializeHMR() {
        if (import.meta.hot) {
            // Initialize server availability promise
            this.serverAvailablePromise = new Promise((resolve) => {
                // Check if server plugin is available
                console.log('Checking Motion Canvas Narrator server plugin availability...');
                import.meta.hot.send('narrator:check-available', {});
                // Set timeout
                let timeoutId = setTimeout(() => {
                    console.log('Motion Canvas Narrator server plugin not available (timeout)');
                    resolve(false);
                }, 500); // 0.5 second timeout
                // Listen for server availability response
                import.meta.hot.on('narrator:available', () => {
                    console.log('Motion Canvas Narrator server plugin is available');
                    clearTimeout(timeoutId);
                    resolve(true);
                });
            });
            // Listen for responses from the server
            import.meta.hot.on('narrator:upload-success', (data) => {
                const { cacheKey, filePath, duration } = data;
                if (cacheKey && filePath) {
                    const audioUrl = filePath;
                    const result = { audioUrl, duration };
                    // Update in-memory cache
                    this.cache.set(cacheKey, result);
                    console.log(`Server upload successful for ${cacheKey}`);
                    // Resolve pending request if any
                    const pending = this.pendingRequests.get(cacheKey);
                    if (pending) {
                        pending.resolve(result);
                        this.pendingRequests.delete(cacheKey);
                    }
                }
            });
            import.meta.hot.on('narrator:upload-error', (data) => {
                const { cacheKey, error } = data;
                console.error(`Server upload failed for ${cacheKey}:`, error);
                // Reject pending request if any
                const pending = this.pendingRequests.get(cacheKey);
                if (pending) {
                    pending.reject(new Error(error));
                    this.pendingRequests.delete(cacheKey);
                }
            });
            import.meta.hot.on('narrator:audio-exists', (data) => {
                const { cacheKey, filePath, duration } = data;
                if (cacheKey && filePath) {
                    const audioUrl = filePath;
                    const result = { audioUrl, duration };
                    this.cache.set(cacheKey, result);
                    console.log(`Found existing server audio for ${cacheKey} at ${filePath}`);
                    // Resolve pending request if any
                    const pending = this.pendingRequests.get(cacheKey);
                    if (pending) {
                        pending.resolve(result);
                        this.pendingRequests.delete(cacheKey);
                    }
                }
            });
            import.meta.hot.on('narrator:audio-not-found', (data) => {
                const { cacheKey } = data;
                console.log(`Audio not found on server for ${cacheKey}`);
                // Resolve with undefined to indicate not found
                const pending = this.pendingRequests.get(cacheKey);
                if (pending) {
                    pending.resolve(null);
                    this.pendingRequests.delete(cacheKey);
                }
            });
        }
    }
    get(cacheKey) {
        return this.cache.get(cacheKey) ?? null;
    }
    set(cacheKey, result) {
        this.cache.set(cacheKey, result);
    }
    cacheAudioResult(cacheKey, audioUrl, duration) {
        this.set(cacheKey, { audioUrl, duration });
    }
    async checkServerCache(cacheKey) {
        if (!import.meta.hot) {
            return null;
        }
        // Wait for server availability with timeout
        const serverAvailable = await this.serverAvailablePromise;
        if (!serverAvailable) {
            return null;
        }
        return new Promise((resolve, reject) => {
            // Store the promise callbacks
            this.pendingRequests.set(cacheKey, { resolve, reject });
            // Send request via HMR
            import.meta.hot.send('narrator:check-audio', { cacheKey });
            // Timeout after one second
            setTimeout(() => {
                if (this.pendingRequests.has(cacheKey)) {
                    this.pendingRequests.delete(cacheKey);
                    resolve(null); // Treat timeout as not found
                }
            }, 1000);
        });
    }
    async uploadToServer(cacheKey, audioData, duration, metadata) {
        if (!import.meta.hot) {
            console.warn('HMR not available for server upload');
            return;
        }
        // Wait for server availability with timeout
        const serverAvailable = await this.serverAvailablePromise;
        if (!serverAvailable) {
            console.log('Server plugin not available, skipping upload');
            return;
        }
        // Convert ArrayBuffer to base64 data URL
        const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
        const dataUrl = await AudioUtils.blobToDataUrl(audioBlob);
        // Send via HMR
        import.meta.hot.send('narrator:upload-audio', {
            data: dataUrl,
            mimeType: 'audio/mpeg',
            cacheKey,
            duration,
            metadata,
        });
    }
    streamToArrayBuffer(stream) {
        return AudioUtils.streamToArrayBuffer(stream);
    }
    async getAudioDuration(audioBlob) {
        return AudioUtils.getAudioDuration(audioBlob);
    }
}
//# sourceMappingURL=AudioCache.js.map