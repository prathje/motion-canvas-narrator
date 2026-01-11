/**
 * A provider wrapper that deduplicates simultaneous requests for the same cache key.
 */
export class DedupedProvider {
    constructor(innerProvider) {
        this.innerProvider = innerProvider;
        this.name = `Deduped ${innerProvider.name}`;
        this.pendingRequests = new Map();
    }
    generateId(options) {
        return this.innerProvider.generateId(options);
    }
    async resolve(narrator, options) {
        const cacheKey = this.generateId(options);
        // Check if there's already a pending request for this cache key
        const existingRequest = this.pendingRequests.get(cacheKey);
        if (existingRequest) {
            console.log(`Deduplicating request for "${options.text.substring(0, 50)}..."`);
            return existingRequest;
        }
        // Create a new request - wrap in Promise.resolve to handle both sync and async returns
        const requestPromise = Promise.resolve(this.innerProvider.resolve(narrator, options));
        // Store the pending request
        this.pendingRequests.set(cacheKey, requestPromise);
        return requestPromise;
    }
}
//# sourceMappingURL=DedupedProvider.js.map