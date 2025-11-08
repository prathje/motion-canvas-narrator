import {Narration} from '../Narration';
import {NarrationOptions, NarrationProvider, Narrator} from '../Narrator';

/**
 * A provider wrapper that deduplicates simultaneous requests for the same cache key.
 */
export class DedupedProvider implements NarrationProvider {
  public name: string;
  private innerProvider: NarrationProvider;
  private pendingRequests: Map<string, Promise<Narration>>;

  public constructor(innerProvider: NarrationProvider) {
    this.innerProvider = innerProvider;
    this.name = `Deduped ${innerProvider.name}`;
    this.pendingRequests = new Map();
  }

  public generateId(options: NarrationOptions): string {
    return this.innerProvider.generateId(options);
  }

  public async resolve(
    narrator: Narrator,
    options: NarrationOptions
  ): Promise<Narration> {
    const cacheKey = this.generateId(options);

    // Check if there's already a pending request for this cache key
    const existingRequest = this.pendingRequests.get(cacheKey);
    if (existingRequest) {
      console.log(`Deduplicating request for "${options.text.substring(0, 50)}..."`);
      return existingRequest;
    }

    // Create a new request - wrap in Promise.resolve to handle both sync and async returns
    const requestPromise = Promise.resolve(
      this.innerProvider.resolve(narrator, options)
    );

    // Store the pending request
    this.pendingRequests.set(cacheKey, requestPromise);

    return requestPromise;
  }
}
