import { Narrator, NarratorConfig } from './Narrator';
import { ElevenLabsConfig } from './providers/ElevenLabsProvider';
import { FileProviderConfig } from './providers/FileProvider';
export declare function createMockNarrator(providerConfig?: {
    wordsPerMinute?: number;
}, narratorConfig?: NarratorConfig): Narrator;
export declare function createElevenLabsNarrator(providerConfig: ElevenLabsConfig, narratorConfig?: NarratorConfig): Narrator;
export declare function createFileNarrator(providerConfig?: FileProviderConfig, narratorConfig?: NarratorConfig): Narrator;
//# sourceMappingURL=factories.d.ts.map