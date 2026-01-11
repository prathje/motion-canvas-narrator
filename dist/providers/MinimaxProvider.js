import { Narration } from '../Narration';
import { AudioUtils } from '../utils/AudioUtils';
import { CacheUtils } from 'motion-canvas-cache';
export class MinimaxProvider {
    constructor(config) {
        this.name = 'MiniMax TTS';
        this.defaultEndpoint = 'https://api.minimaxi.com/v1/t2a_v2';
        if (!config.apiKey) {
            throw new Error('MiniMax API key is required. Provide it via config.apiKey or set MINIMAX_API_KEY environment variable.');
        }
        this.config = {
            emotion: 'neutral',
            speed: 1,
            volume: 1,
            pitch: 0,
            model: 'speech-2.6-turbo',
            format: 'mp3',
            sampleRate: 32000,
            bitrate: 128000,
            channel: 1,
            outputFormat: 'hex',
            subtitle: false,
            ...config,
            apiKey: config.apiKey,
            voiceId: config.voiceId,
        };
    }
    generateId(options) {
        return CacheUtils.generateCacheKey(options.text, [
            this.config.voiceId,
            this.config.model ?? 'speech-2.6-turbo',
            this.config.format ?? 'mp3',
        ]);
    }
    async resolve(_narrator, options) {
        const text = options.text;
        console.log(`Fetching audio from MiniMax API for: "${text.substring(0, 50)}..."`);
        try {
            const response = await fetch(this.getEndpoint(), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.buildRequestBody(options)),
            });
            if (!response.ok) {
                const message = await response.text();
                throw new Error(`MiniMax request failed with status ${response.status}: ${message}`);
            }
            const payload = await response.json();
            const baseResp = payload?.base_resp;
            if (baseResp?.status_code !== 0) {
                throw new Error(`MiniMax API error: ${baseResp?.status_msg ?? 'unknown error'}`);
            }
            const audioResult = payload?.data?.audio;
            if (!audioResult) {
                throw new Error('MiniMax API returned no audio data.');
            }
            const audioBlob = await this.buildAudioBlob(audioResult);
            const duration = await AudioUtils.getAudioDuration(audioBlob);
            const audioUrl = URL.createObjectURL(audioBlob);
            const id = this.generateId(options);
            console.log(`Audio with duration ${duration} generated`);
            return new Narration(id, text, duration, audioUrl);
        }
        catch (error) {
            console.error('MiniMax API error:', error);
            const duration = text.split(' ').length / 2.5;
            const id = this.generateId(options);
            return new Narration(id, text, duration, '');
        }
    }
    getEndpoint() {
        return this.config.endpoint ?? this.defaultEndpoint;
    }
    buildRequestBody(options) {
        const { voiceId, model, speed, volume, pitch, emotion, sampleRate, bitrate, format, channel, subtitle, outputFormat, } = this.config;
        const text = options.text;
        const body = {
            model,
            text,
            stream: false,
            voice_setting: {
                voice_id: voiceId,
                speed,
                vol: volume,
                pitch,
                emotion,
            },
            audio_setting: {
                sample_rate: sampleRate,
                bitrate,
                format,
                channel,
            },
            subtitle_enable: subtitle,
            output_format: outputFormat,
        };
        return body;
    }
    async buildAudioBlob(audio) {
        const format = this.config.format ?? 'mp3';
        const mimeType = this.getMimeType(format);
        if ((this.config.outputFormat ?? 'hex') === 'url') {
            const audioResponse = await fetch(audio);
            if (!audioResponse.ok) {
                throw new Error(`Failed to download audio from MiniMax CDN (status ${audioResponse.status}).`);
            }
            const buffer = await audioResponse.arrayBuffer();
            return new Blob([buffer], { type: mimeType });
        }
        const buffer = this.hexToArrayBuffer(audio);
        return new Blob([buffer], { type: mimeType });
    }
    hexToArrayBuffer(hex) {
        const normalized = hex.trim();
        if (normalized.length % 2 !== 0) {
            throw new Error('Invalid hex string length.');
        }
        const buffer = new Uint8Array(normalized.length / 2);
        for (let i = 0; i < normalized.length; i += 2) {
            buffer[i / 2] = parseInt(normalized.substring(i, i + 2), 16);
        }
        return buffer.buffer;
    }
    getMimeType(format) {
        switch (format) {
            case 'wav':
                return 'audio/wav';
            case 'flac':
                return 'audio/flac';
            case 'mp3':
            default:
                return 'audio/mpeg';
        }
    }
}
//# sourceMappingURL=MinimaxProvider.js.map