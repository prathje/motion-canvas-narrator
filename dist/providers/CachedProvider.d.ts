import { Narration } from '../Narration';
import { NarrationOptions, NarrationProvider, Narrator } from '../Narrator';
export declare class CachedProvider implements NarrationProvider {
    name: string;
    private innerProvider;
    private audioCache;
    constructor(innerProvider: NarrationProvider);
    generateId(text: string, options: NarrationOptions): string;
    resolve(narrator: Narrator, text: string, options: NarrationOptions): Promise<Narration>;
}
//# sourceMappingURL=CachedProvider.d.ts.map