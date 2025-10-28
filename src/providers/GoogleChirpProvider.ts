import {Narration} from '../Narration';
import {NarrationOptions, NarrationProvider, Narrator} from '../Narrator';
import {AudioUtils} from '../utils/AudioUtils';

export interface GoogleChirpConfig {
  apiKey?: string;
  projectId?: string; // Optional - for reference only, not required for API calls
  languageCode?: string;
  voice_name?: string; // Google voice name (e.g., 'en-US-Neural2-C')
  customVoiceKey?: string; // For Chirp 3 instant custom voice
  enableCaching?: boolean;
}

export class GoogleChirpProvider implements NarrationProvider {
  public name = 'Google Cloud Chirp TTS';
  private config: GoogleChirpConfig;

  public constructor(config: GoogleChirpConfig) {
    this.config = {
      ...config,
      apiKey: config.apiKey || process.env.GOOGLE_API_KEY,
      languageCode: config.languageCode || 'en-US',
      enableCaching: config.enableCaching !== false,
    };

    if (!this.config.apiKey) {
      throw new Error(
        'Google API key is required. Provide it via config.apiKey or set GOOGLE_API_KEY environment variable.',
      );
    }
  }

  public generateId(text: string, _options: NarrationOptions): string {
    const voiceIdentifier = this.config.customVoiceKey || 
                           this.config.voice_name || 
                           this.config.languageCode ||
                           'default';
    return AudioUtils.generateAudioId(text, [voiceIdentifier, 'chirp']);
  }

  public async resolve(
    _narrator: Narrator,
    text: string,
    options: NarrationOptions,
  ): Promise<Narration> {
    console.log(
      `Fetching audio from Google Chirp API for: "${text.substring(
        0,
        50,
      )}..."`,
    );

    try {
      const audioContent = await this.synthesizeSpeech(text);
      
      // Convert base64 to ArrayBuffer
      const binaryString = atob(audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const audioBuffer = bytes.buffer;

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
      console.error('Google Chirp API error:', error);
      // Fallback duration estimation
      const duration = text.split(' ').length / 2.5;
      
      const sound = {
        audio: '',
      };
      const id = this.generateId(text, options);

      return new Narration(id, text, duration, sound);
    }
  }

  private async synthesizeSpeech(text: string): Promise<string> {
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.config.apiKey}`;

    // Build the voice configuration
    const voiceConfig: any = {
      languageCode: this.config.languageCode,
    };

    // Add custom voice key if provided (for Chirp 3 instant custom voice)
    if (this.config.customVoiceKey) {
      voiceConfig.customVoiceKey = this.config.customVoiceKey;
    } else if (this.config.voice_name) {
      // Use specific voice name if provided
      voiceConfig.name = this.config.voice_name;
    }

    const requestBody = {
      input: {
        text: text,
      },
      voice: voiceConfig,
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0.0,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Google Chirp API error: ${response.status} - ${JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json();

    if (!data.audioContent) {
      throw new Error('No audio content in response from Google Chirp API');
    }

    return data.audioContent;
  }
}
