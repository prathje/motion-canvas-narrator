import {Narration} from '../Narration';
import {NarrationOptions, NarrationProvider, Narrator} from '../Narrator';
import {AudioUtils} from '../utils/AudioUtils';

export interface FileProviderConfig {
  audioDirectory?: string;
}

export class FileProvider implements NarrationProvider {
  public name = 'File Provider';
  private config: FileProviderConfig;

  public constructor(config: FileProviderConfig = {}) {
    this.config = config;
  }

  public generateId(text: string, _options: NarrationOptions): string {
    const audioDirectory = this.config.audioDirectory || 'default';
    return AudioUtils.generateAudioId(text, ['file', audioDirectory]);
  }

  public async resolve(
    _narrator: Narrator,
    text: string,
    options: NarrationOptions,
  ): Promise<Narration> {
    // For FileProvider, the "text" parameter should be the file path
    const audioUrl = this.resolveAudioPath(text);
    const sound = {
      audio: audioUrl,
    };

    // Get actual audio duration
    const duration = await this.getAudioDuration(audioUrl);
    const id = this.generateId(text, options);

    return new Narration(id, text, duration, sound);
  }

  private resolveAudioPath(filePath: string): string {
    if (this.isAbsoluteUrl(filePath)) {
      return filePath;
    }

    if (this.config.audioDirectory) {
      return `${this.config.audioDirectory}/${filePath}`;
    }

    return filePath;
  }

  private isAbsoluteUrl(url: string): boolean {
    return (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('blob:') ||
      url.startsWith('data:') ||
      url.startsWith('/')
    );
  }

  private async getAudioDuration(audioUrl: string): Promise<number> {
    try {
      // Load the audio file as a blob and use AudioUtils
      const response = await fetch(audioUrl);
      const audioBlob = await response.blob();
      return await AudioUtils.getAudioDuration(audioBlob);
    } catch (error) {
      console.warn(`Failed to get audio duration for ${audioUrl}:`, error);
      // Fallback to a reasonable default
      return 3.0;
    }
  }
}
