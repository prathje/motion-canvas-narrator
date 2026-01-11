import { Narrator, NarratorConfig } from './Narrator';
import { ElevenLabsConfig } from './providers/ElevenLabsProvider';
import { ElevenLabsSoundConfig } from './providers/ElevenLabsSoundProvider';
import { FileProviderConfig } from './providers/FileProvider';
import { MinimaxConfig } from "./providers/MinimaxProvider";
export declare function createMockNarrator(providerConfig?: {
    wordsPerMinute?: number;
}, narratorConfig?: NarratorConfig): Narrator;
export declare function createElevenLabsNarrator(providerConfig: ElevenLabsConfig, narratorConfig?: NarratorConfig): Narrator;
export declare function createFileNarrator(providerConfig?: FileProviderConfig, narratorConfig?: NarratorConfig): Narrator;
export declare function createMinimaxNarrator(providerConfig: MinimaxConfig, narratorConfig?: NarratorConfig): Narrator;
export declare function createElevenLabsSoundNarrator(providerConfig: ElevenLabsSoundConfig, narratorConfig?: NarratorConfig): Narrator;
//# sourceMappingURL=factories.d.ts.map