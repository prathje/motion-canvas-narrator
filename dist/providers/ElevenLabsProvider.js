import { Narration } from '../Narration';
import { AudioUtils } from '../utils/AudioUtils';
import { CacheUtils } from 'motion-canvas-cache';
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
    generateId(options) {
        return CacheUtils.generateCacheKey(options.text, [this.config.voiceId, this.config.modelId]);
    }
    async resolve(_narrator, options) {
        const text = options.text;
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
            const audioBuffer = await CacheUtils.streamToArrayBuffer(audioStream);
            const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
            const duration = await AudioUtils.getAudioDuration(audioBlob);
            // Create blob URL for audio
            const audioUrl = URL.createObjectURL(audioBlob);
            const id = this.generateId(options);
            console.log(`Audio with duration ${duration} generated`);
            return new Narration(id, text, duration, audioUrl);
        }
        catch (error) {
            console.error('ElevenLabs API error:', error);
            const duration = text.split(' ').length / 2.5;
            const id = this.generateId(options);
            return new Narration(id, text, duration, '');
        }
    }
}
//# sourceMappingURL=ElevenLabsProvider.js.map