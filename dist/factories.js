import { Narrator } from './Narrator';
import { ElevenLabsProvider, } from './providers/ElevenLabsProvider';
import { FileProvider } from './providers/FileProvider';
import { MockProvider } from './providers/MockProvider';
import { CachedProvider } from "./providers/CachedProvider";
import { GoogleChirpProvider, } from './providers/GoogleChirpProvider';
// Mock provider factory
export function createMockNarrator(providerConfig = {}, narratorConfig = {}) {
    const provider = new MockProvider(providerConfig.wordsPerMinute);
    return new Narrator(provider, narratorConfig);
}
// ElevenLabs provider factory
export function createElevenLabsNarrator(providerConfig, narratorConfig = {}) {
    const provider = new CachedProvider(new ElevenLabsProvider(providerConfig));
    return new Narrator(provider, narratorConfig);
}
// Google Chirp provider factory
export function createGoogleChirpNarrator(providerConfig, narratorConfig = {}) {
    const provider = new CachedProvider(new GoogleChirpProvider(providerConfig));
    return new Narrator(provider, narratorConfig);
}
// File provider factory
export function createFileNarrator(providerConfig = {}, narratorConfig = {}) {
    const provider = new FileProvider(providerConfig);
    return new Narrator(provider, narratorConfig);
}
//# sourceMappingURL=factories.js.map