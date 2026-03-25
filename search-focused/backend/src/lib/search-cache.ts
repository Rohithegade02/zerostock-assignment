import NodeCache from 'node-cache';

/**
 * SearchCache
 *
 * A thin, typed TTL wrapper around NodeCache.
 * Identical filter combinations (same q + category + price range) are served
 * from memory for `ttlSeconds` without re-running the search logic.
 */
export class SearchCache {
  private readonly store: NodeCache;

  constructor(ttlSeconds: number = 60) {
    this.store = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2, // GC sweep at 20% of TTL
      useClones: false,              // avoid deep-clone overhead for read-heavy workloads
    });
  }

  get<T>(key: string): T | undefined {
    return this.store.get<T>(key);
  }

  set<T>(key: string, value: T): void {
    this.store.set(key, value);
  }

  /** Deterministic, order-insensitive key from any plain object */
  static buildKey(obj: Record<string, unknown>): string {
    const sorted = Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((acc, k) => {
        if (obj[k] !== undefined) acc[k] = obj[k];
        return acc;
      }, {});
    return JSON.stringify(sorted);
  }

  flush(): void {
    this.store.flushAll();
  }
}
