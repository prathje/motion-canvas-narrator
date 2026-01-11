import { Narrator } from './Narrator';
import { ElevenLabsProvider, } from './providers/ElevenLabsProvider';
import { ElevenLabsSoundProvider, } from './providers/ElevenLabsSoundProvider';
import { FileProvider } from './providers/FileProvider';
import { MockProvider } from './providers/MockProvider';
import { CachedProvider } from "./providers/CachedProvider";
import { DedupedProvider } from "./providers/DedupedProvider";
import { MinimaxProvider } from "./providers/MinimaxProvider";
// Mock provider factory
export function createMockNarrator(providerConfig = {}, narratorConfig = {}) {
    const provider = new MockProvider(providerConfig.wordsPerMinute);
    return new Narrator(provider, narratorConfig);
}
// ElevenLabs provider factory
export function createElevenLabsNarrator(providerConfig, narratorConfig = {}) {
    const provider = new DedupedProvider(new CachedProvider(new ElevenLabsProvider(providerConfig)));
    return new Narrator(provider, narratorConfig);
}
// File provider factory
export function createFileNarrator(providerConfig = {}, narratorConfig = {}) {
    const provider = new FileProvider(providerConfig);
    return new Narrator(provider, narratorConfig);
}
export function createMinimaxNarrator(providerConfig, narratorConfig = {}) {
    const provider = new DedupedProvider(new CachedProvider(new MinimaxProvider(providerConfig)));
    return new Narrator(provider, narratorConfig);
}
// ElevenLabs Sound Effects provider factory
export function createElevenLabsSoundNarrator(providerConfig, narratorConfig = {}) {
    const provider = new DedupedProvider(new CachedProvider(new ElevenLabsSoundProvider(providerConfig)));
    return new Narrator(provider, narratorConfig);
}
//# sourceMappingURL=factories.js.map