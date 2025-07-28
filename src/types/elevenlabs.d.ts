// Type declaration for optional ElevenLabs dependency
declare module '@elevenlabs/elevenlabs-js' {
  export class ElevenLabs {
    constructor(config: {apiKey: string});
    textToSpeech: {
      textToSpeech(voiceId: string, options: any): Promise<any>;
    };
    voices: {
      getVoices(): Promise<{voices: any[]}>;
    };
    user: {
      getUserInfo(): Promise<any>;
    };
  }
}
