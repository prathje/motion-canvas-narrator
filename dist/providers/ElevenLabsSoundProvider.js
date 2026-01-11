import { Narration } from '../Narration';
import { AudioUtils } from '../utils/AudioUtils';
import { CacheUtils } from 'motion-canvas-cache';
export class ElevenLabsSoundProvider {
    constructor(config) {
        this.name = 'ElevenLabs Sound Effects';
        const apiKey = config.apiKey || process.env.ELEVENLABS_API_KEY;
        this.config = {
            ...config,
            apiKey: apiKey,
            modelId: config.modelId || 'eleven_text_to_sound_v2',
            loop: config.loop ?? false,
            durationSeconds: config.durationSeconds ?? null,
            promptInfluence: config.promptInfluence ?? 0.3,
            outputFormat: config.outputFormat || 'mp3_44100_128',
        };
        if (!this.config.apiKey) {
            throw new Error('ElevenLabs API key is required. Provide it via config.apiKey or set ELEVENLABS_API_KEY environment variable.');
        }
    }
    generateId(options) {
        return CacheUtils.generateCacheKey(options.text, [
            this.config.modelId,
            String(this.config.loop),
            String(this.config.durationSeconds ?? 'auto'),
            String(this.config.promptInfluence),
            this.config.outputFormat,
        ]);
    }
    async resolve(narrator, options) {
        console.log(`Fetching sound effect from ElevenLabs API for: "${options.text.substring(0, 50)}..."`);
        try {
            // Dynamic import to avoid bundling issues
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
            // Use textToSoundEffects instead of textToSpeech
            const audioStream = await elevenlabs.textToSoundEffects.convert({
                text: options.text,
                model_id: this.config.modelId,
                loop: this.config.loop,
                duration_seconds: this.config.durationSeconds,
                prompt_influence: this.config.promptInfluence,
                output_format: this.config.outputFormat,
            });
            // Convert ReadableStream to ArrayBuffer
            const audioBuffer = await CacheUtils.streamToArrayBuffer(audioStream);
            const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
            const duration = await AudioUtils.getAudioDuration(audioBlob);
            // Create blob URL for audio
            const audioUrl = URL.createObjectURL(audioBlob);
            const sound = {
                audio: audioUrl,
            };
            const id = this.generateId(options);
            console.log(`Sound effect with duration ${duration} generated`);
            return new Narration(id, options.text, duration, audioUrl);
        }
        catch (error) {
            console.error('ElevenLabs Sound Effects API error:', error);
            // For sound effects, estimate duration based on config or default
            const duration = this.config.durationSeconds ??
                Math.max(0.5, options.text.split(' ').length / 5);
            const id = this.generateId(options);
            return new Narration(id, options.text, duration, "");
        }
    }
}
//# sourceMappingURL=ElevenLabsSoundProvider.js.map