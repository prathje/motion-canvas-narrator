import { Narration } from '../Narration';
import { AudioUtils } from '../utils/AudioUtils';
export class ElevenLabsProvider {
    constructor(config) {
        this.name = 'ElevenLabs TTS';
        this.config = {
            ...config,
            apiKey: config.apiKey,
            modelId: config.modelId || 'eleven_flash_v2_5'
        };
        if (!this.config.apiKey) {
            throw new Error('ElevenLabs API key is required. Provide it via config.apiKey or set ELEVENLABS_API_KEY environment variable.');
        }
    }
    generateId(text, _options) {
        return AudioUtils.generateAudioId(text, [this.config.voiceId, this.config.modelId]);
    }
    async resolve(_narrator, text, options) {
        console.log(`Fetching audio from ElevenLabs API for: "${text.substring(0, 50)}..."`);
        try {
            // Dynamic import to avoid bundling issues
            // This allows the package to be optional and only loaded when needed
            let ElevenLabsModule;
            let ElevenLabsClient;
            try {
                ElevenLabsModule = (await import('@elevenlabs/elevenlabs-js'));
                ElevenLabsClient = ElevenLabsModule.ElevenLabsClient;
            }
            catch (importError) {
                throw new Error('ElevenLabs package not installed. Install it with: npm install @elevenlabs/elevenlabs-js');
            }
            if (!ElevenLabsClient) {
                throw new Error('ElevenLabsClient not found in module exports. Please check your @elevenlabs/elevenlabs-js installation.');
            }
            const elevenlabs = new ElevenLabsClient({
                apiKey: this.config.apiKey,
            });
            const audioStream = await elevenlabs.textToSpeech.convert(this.config.voiceId, {
                text: text,
                modelId: this.config.modelId,
            });
            // Convert ReadableStream to ArrayBuffer
            const audioBuffer = await AudioUtils.streamToArrayBuffer(audioStream);
            const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
            const duration = await AudioUtils.getAudioDuration(audioBlob);
            // Create blob URL for audio
            const audioUrl = URL.createObjectURL(audioBlob);
            const sound = {
                audio: audioUrl,
            };
            const id = this.generateId(text, options);
            console.log(`Audio with duration ${duration} generated`);
            return new Narration(id, text, duration, sound);
        }
        catch (error) {
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
//# sourceMappingURL=ElevenLabsProvider.js.map