import {Narrator, NarratorConfig} from './Narrator';
import {
  ElevenLabsConfig,
  ElevenLabsProvider,
} from './providers/ElevenLabsProvider';
import {FileProvider, FileProviderConfig} from './providers/FileProvider';
import {MockProvider} from './providers/MockProvider';
import {CachedProvider} from "./providers/CachedProvider";
import {
  GoogleChirpConfig,
  GoogleChirpProvider,
} from './providers/GoogleChirpProvider';

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
  const provider = new CachedProvider(new ElevenLabsProvider(providerConfig));
  return new Narrator(provider, narratorConfig);
}

// Google Chirp provider factory
export function createGoogleChirpNarrator(
  providerConfig: GoogleChirpConfig,
  narratorConfig: NarratorConfig = {},
): Narrator {
  const provider = new CachedProvider(new GoogleChirpProvider(providerConfig));
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
