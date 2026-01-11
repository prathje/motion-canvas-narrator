import { Narration } from '../Narration';
import { NarrationOptions, NarrationProvider, Narrator } from '../Narrator';
export declare class MockProvider implements NarrationProvider {
    name: string;
    private wordsPerMinute;
    constructor(wordsPerMinute?: number);
    generateId(options: NarrationOptions): string;
    resolve(_narrator: Narrator, options: NarrationOptions): Narration;
}
//# sourceMappingURL=MockProvider.d.ts.map