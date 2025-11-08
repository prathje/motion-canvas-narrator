import {Narrator, NarratorConfig} from './Narrator';
import {
  ElevenLabsConfig,
  ElevenLabsProvider,
} from './providers/ElevenLabsProvider';
import {FileProvider, FileProviderConfig} from './providers/FileProvider';
import {MockProvider} from './providers/MockProvider';
import {CachedProvider} from "./providers/CachedProvider";
import {DedupedProvider} from "./providers/DedupedProvider";
import {MinimaxProvider, MinimaxConfig} from "./providers/MinimaxProvider";

// Mock provider factory
export function createMockNarrator(
  providerConfig: {
    wordsPerMinute?: number;
  } = {},
  narratorConfig: NarratorConfig = {},
): Narrator {
  const provider = new MockProvider(providerConfig.wordsPerMinute);
  return new Narrator(provider, narratorConfig);
}

// ElevenLabs provider factory
export function createElevenLabsNarrator(
  providerConfig: ElevenLabsConfig,
  narratorConfig: NarratorConfig = {},
): Narrator {
  const provider = new DedupedProvider(new CachedProvider(new ElevenLabsProvider(providerConfig)));
  return new Narrator(provider, narratorConfig);
}

// File provider factory
export function createFileNarrator(
  providerConfig: FileProviderConfig = {},
  narratorConfig: NarratorConfig = {},
): Narrator {
  const provider = new FileProvider(providerConfig);
  return new Narrator(provider, narratorConfig);
}

export function createMinimaxNarrator(
  providerConfig: MinimaxConfig,
  narratorConfig: NarratorConfig = {},
): Narrator {
  const provider = new DedupedProvider(new CachedProvider(new MinimaxProvider(providerConfig)));
  return new Narrator(provider, narratorConfig);
}
