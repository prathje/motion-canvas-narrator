import {Narration} from '../Narration';
import {NarrationOptions, NarrationProvider, Narrator} from '../Narrator';
import {AudioUtils} from '../utils/AudioUtils';

export interface ElevenLabsConfig {
  apiKey?: string;
  voiceId: string;
  modelId?: string;
}

export class ElevenLabsProvider implements NarrationProvider {
  public name = 'ElevenLabs TTS';
  private config: ElevenLabsConfig;

  public constructor(config: ElevenLabsConfig) {
    this.config = {
      ...config,
      apiKey: config.apiKey,
      modelId: config.modelId || 'eleven_flash_v2_5'
    };

    if (!this.config.apiKey) {
      throw new Error(
        'ElevenLabs API key is required. Provide it via config.apiKey or set ELEVENLABS_API_KEY environment variable.',
      );
    }
  }

  public generateId(text: string, _options: NarrationOptions): string {
    return AudioUtils.generateAudioId(text, [this.config.voiceId, this.config.modelId!]);
  }

  public async resolve(
    _narrator: Narrator,
    text: string,
    options: NarrationOptions,
  ): Promise<Narration> {
    console.log(
      `Fetching audio from ElevenLabs API for: "${text.substring(
        0,
        50,
      )}..."`,
    );

    try {
      // Dynamic import to avoid bundling issues
      // This allows the package to be optional and only loaded when needed
      let ElevenLabsModule: any;
      let ElevenLabsClient: any;

      try {
        ElevenLabsModule = (await import('@elevenlabs/elevenlabs-js')) as any;
        ElevenLabsClient = ElevenLabsModule.ElevenLabsClient;
      } catch (importError) {
        throw new Error(
          'ElevenLabs package not installed. Install it with: npm install @elevenlabs/elevenlabs-js',
        );
      }

      if (!ElevenLabsClient) {
        throw new Error(
          'ElevenLabsClient not found in module exports. Please check your @elevenlabs/elevenlabs-js installation.',
        );
      }

      const elevenlabs = new ElevenLabsClient({
        apiKey: this.config.apiKey!,
      });

      const audioStream = await elevenlabs.textToSpeech.convert(
        this.config.voiceId,
        {
          text: text,
          modelId: this.config.modelId!,
        },
      );

      // Convert ReadableStream to ArrayBuffer
      const audioBuffer = await AudioUtils.streamToArrayBuffer(audioStream);

      const audioBlob = new Blob([audioBuffer], {type: 'audio/mpeg'});
      const duration = await AudioUtils.getAudioDuration(audioBlob);

      // Create blob URL for audio
      const audioUrl = URL.createObjectURL(audioBlob);

      const sound = {
        audio: audioUrl,
      };

      const id = this.generateId(text, options);

      console.log(`Audio with duration ${duration} generated`);
      return new Narration(id, text, duration, sound);
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      const duration = text.split(' ').length / 2.5;
      
      const sound = {
        audio: '',
      };
      const id = this.generateId(text, options);

      return new Narration(id, text, duration, sound);
    }
  }

}
