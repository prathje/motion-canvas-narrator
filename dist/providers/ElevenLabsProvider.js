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
        console.log(`[ElevenLabs] 🚀 Starting API call for: "${text.substring(0, 50)}..." (Voice: ${this.config.voiceId}, Model: ${this.config.modelId})`);
        try {
            // Dynamic import to avoid bundling issues
            // This allows the package to be optional and only loaded when needed
            let ElevenLabsModule;
            let ElevenLabsClient;
            try {
                console.log('[ElevenLabs] Importing @elevenlabs/elevenlabs-js...');
                ElevenLabsModule = (await import('@elevenlabs/elevenlabs-js'));
                ElevenLabsClient = ElevenLabsModule.ElevenLabsClient;
                console.log('[ElevenLabs] ✅ Successfully imported ElevenLabs module');
            }
            catch (importError) {
                console.error('[ElevenLabs] ❌ Failed to import @elevenlabs/elevenlabs-js:', importError);
                throw new Error('ElevenLabs package not installed. Install it with: npm install @elevenlabs/elevenlabs-js');
            }
            if (!ElevenLabsClient) {
                throw new Error('ElevenLabsClient not found in module exports. Please check your @elevenlabs/elevenlabs-js installation.');
            }
            console.log('[ElevenLabs] Creating ElevenLabsClient with API key...');
            const elevenlabs = new ElevenLabsClient({
                apiKey: this.config.apiKey,
            });
            console.log('[ElevenLabs] Calling textToSpeech.convert()...');
            const audioStream = await elevenlabs.textToSpeech.convert(this.config.voiceId, {
                text: text,
                modelId: this.config.modelId,
            });
            console.log('[ElevenLabs] ✅ Got audio stream from API');
            // Convert ReadableStream to ArrayBuffer
            console.log('[ElevenLabs] Converting stream to ArrayBuffer...');
            const audioBuffer = await AudioUtils.streamToArrayBuffer(audioStream);
            console.log('[ElevenLabs] ✅ Converted to ArrayBuffer, size:', audioBuffer.byteLength, 'bytes');
            const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
            const duration = await AudioUtils.getAudioDuration(audioBlob);
            console.log('[ElevenLabs] ✅ Audio duration:', duration.toFixed(2), 'seconds');
            // Create blob URL for audio
            const audioUrl = URL.createObjectURL(audioBlob);
            const sound = {
                audio: audioUrl,
            };
            const id = this.generateId(text, options);
            console.log(`[ElevenLabs] ✅ Successfully generated audio for: "${text.substring(0, 50)}..." (${duration.toFixed(2)}s)`);
            return new Narration(id, text, duration, sound);
        }
        catch (error) {
            console.error('[ElevenLabs] ❌ API error:', error);
            const duration = text.split(' ').length / 2.5;
            const sound = {
                audio: '',
            };
            const id = this.generateId(text, options);
            console.log(`[ElevenLabs] ⚠️  Returning fallback narration with ${duration.toFixed(2)}s duration`);
            return new Narration(id, text, duration, sound);
        }
    }
}
//# sourceMappingURL=ElevenLabsProvider.js.map