import {AudioUtils} from './AudioUtils';

// Vite HMR types
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

export class AudioCache {
  private static instance: AudioCache | null = null;
  private cache = new Map<AudioId, CachedAudioResult>();
  private pendingRequests = new Map<
    AudioId,
    {
      resolve: (result: CachedAudioResult | null) => void;
      reject: (error: any) => void;
    }
  >();
  private serverAvailablePromise: Promise<boolean> | null = null;

  private constructor() {}

  public static getInstance(): AudioCache {
    if (!AudioCache.instance) {
      AudioCache.instance = new AudioCache();
      AudioCache.instance.initializeHMR();
    }

    return AudioCache.instance;
  }

  private initializeHMR(): void {
    if (import.meta.hot) {
      // Initialize server availability promise
      this.serverAvailablePromise = new Promise((resolve) => {
        // Check if server plugin is available
        console.log('Checking Motion Canvas Narrator server plugin availability...');
        import.meta.hot!.send('narrator:check-available', {});

        // Set timeout
        let timeoutId = setTimeout(() => {
            console.log('Motion Canvas Narrator server plugin not available (timeout)');
            resolve(false);
        }, 500); // 0.5 second timeout
        
        // Listen for server availability response
        import.meta.hot!.on('narrator:available', () => {
          console.log('Motion Canvas Narrator server plugin is available');
          clearTimeout(timeoutId);
          resolve(true);
        });
      });

      // Listen for responses from the server
      import.meta.hot.on('narrator:upload-success', (data: any) => {
        const {cacheKey, filePath, duration} = data;
        if (cacheKey && filePath) {
          const audioUrl = filePath;
          const result = {audioUrl, duration};

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

      import.meta.hot.on('narrator:upload-error', (data: any) => {
        const {cacheKey, error} = data;
        console.error(`Server upload failed for ${cacheKey}:`, error);

        // Reject pending request if any
        const pending = this.pendingRequests.get(cacheKey);
        if (pending) {
          pending.reject(new Error(error));
          this.pendingRequests.delete(cacheKey);
        }
      });

      import.meta.hot.on('narrator:audio-exists', (data: any) => {
        const {cacheKey, filePath, duration} = data;
        if (cacheKey && filePath) {
          const audioUrl = filePath;
          const result = {audioUrl, duration};
          this.cache.set(cacheKey, result);

          console.log(
            `Found existing server audio for ${cacheKey} at ${filePath}`,
          );

          // Resolve pending request if any
          const pending = this.pendingRequests.get(cacheKey);
          if (pending) {
            pending.resolve(result);
            this.pendingRequests.delete(cacheKey);
          }
        }
      });

      import.meta.hot.on('narrator:audio-not-found', (data: any) => {
        const {cacheKey} = data;
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


  public get(cacheKey: AudioId): CachedAudioResult | null {
    return this.cache.get(cacheKey) ?? null;
  }

  private set(cacheKey: AudioId, result: CachedAudioResult): void {
    this.cache.set(cacheKey, result);
  }

  public cacheAudioResult(cacheKey: AudioId, audioUrl: string, duration: number): void {
    this.set(cacheKey, { audioUrl, duration });
  }

  public async checkServerCache(
    cacheKey: AudioId,
  ): Promise<CachedAudioResult | null> {
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
      this.pendingRequests.set(cacheKey, {resolve, reject});

      // Send request via HMR
      import.meta.hot!.send('narrator:check-audio', {cacheKey});

      // Timeout after one second
      setTimeout(() => {
        if (this.pendingRequests.has(cacheKey)) {
          this.pendingRequests.delete(cacheKey);
          resolve(null); // Treat timeout as not found
        }
      }, 1000);
    });
  }

  public async uploadToServer(
    cacheKey: AudioId,
    audioData: ArrayBuffer,
    duration: number,
    metadata: {
      //voiceId: 'unknown', // TODO:add Provider-specific metadata
      generatedAt: string;
    },
  ): Promise<void> {
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
    const audioBlob = new Blob([audioData], {type: 'audio/mpeg'});
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

  public streamToArrayBuffer(stream: ReadableStream): Promise<ArrayBuffer> {
    return AudioUtils.streamToArrayBuffer(stream);
  }

  public async getAudioDuration(audioBlob: Blob): Promise<number> {
    return AudioUtils.getAudioDuration(audioBlob);
  }
}
