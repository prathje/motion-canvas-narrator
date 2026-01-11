import { Narration } from '../Narration';
import { NarrationOptions, NarrationProvider, Narrator } from '../Narrator';
/**
 * A provider wrapper that deduplicates simultaneous requests for the same cache key.
 */
export declare class DedupedProvider implements NarrationProvider {
    name: string;
    private innerProvider;
    private pendingRequests;
    constructor(innerProvider: NarrationProvider);
    generateId(options: NarrationOptions): string;
    resolve(narrator: Narrator, options: NarrationOptions): Promise<Narration>;
}
//# sourceMappingURL=DedupedProvider.d.ts.map