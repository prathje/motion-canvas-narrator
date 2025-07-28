export class AudioUtils {
  /**
   * Converts a ReadableStream to ArrayBuffer
   */
  public static async streamToArrayBuffer(stream: ReadableStream): Promise<ArrayBuffer> {
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let totalLength = 0;

    try {
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        chunks.push(value);
        totalLength += value.length;
      }
    } finally {
      reader.releaseLock();
    }

    // Combine all chunks into a single ArrayBuffer
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return result.buffer;
  }

  /**
   * Gets the duration of an audio blob using multiple fallback methods
   */
  public static async getAudioDuration(audioBlob: Blob): Promise<number> {
    // Try Web Audio API first for most accurate duration
    try {
      return await AudioUtils.getAudioDurationWebAudio(audioBlob);
    } catch (error) {
      console.warn('Web Audio API failed, trying HTML Audio element');
      // Fallback to HTML Audio element
      try {
        return await AudioUtils.getAudioDurationHTMLAudio(audioBlob);
      } catch (error) {
        console.warn('HTML Audio failed, using file size estimation');
        // Final fallback to file size estimation
        return AudioUtils.estimateDurationFromBlob(audioBlob);
      }
    }
  }

  /**
   * Gets audio duration using Web Audio API (most accurate)
   */
  private static async getAudioDurationWebAudio(audioBlob: Blob): Promise<number> {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();

    try {
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      await audioContext.close();
      return audioBuffer.duration;
    } catch (error) {
      await audioContext.close();
      throw error;
    }
  }

  /**
   * Gets audio duration using HTML Audio element (fallback)
   */
  private static async getAudioDurationHTMLAudio(audioBlob: Blob): Promise<number> {
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
  private static estimateDurationFromBlob(audioBlob: Blob): number {
    // Rough estimation based on MP3 file size
    // Average MP3 bitrate is ~128kbps = 16KB/s
    const estimatedSeconds = audioBlob.size / (16 * 1024);
    return Math.max(0.1, estimatedSeconds); // Minimum 0.1 seconds
  }

  /**
   * Converts a Blob to a data URL
   */
  public static blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Generates an audio ID from text and options
   */
  public static generateAudioId(text: string, opts: string[]): string {
    const content = `${text}-${opts.join('-')}`;
    return AudioUtils.simpleHash(content);
  }

  /**
   * Simple hash function for generating cache keys
   */
  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Convert to hex and ensure exactly 8 characters by padding with zeros or truncating
    return Math.abs(hash).toString(16).padStart(8, '0').slice(0, 8);
  }
}