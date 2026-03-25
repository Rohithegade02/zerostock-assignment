import { PRODUCTS } from '../data/product';
import { Product, SearchFilters, SearchResult } from '../types';
import { InvertedIndex } from '../lib/inverted-index';
import { SearchCache } from '../lib/search-cache';

/**
 * SearchService
 *
 * Performance strategy for large datasets:
 *
 *  1. InvertedIndex  — built once at startup; text queries run in O(k) instead
 *                      of O(n) by looking up pre-tokenised product IDs.
 *
 *  2. SearchCache    — identical filter combinations are served from a 30-second
 *                      TTL in-memory cache, short-circuiting all computation.
 *
 * Both helpers live in `src/lib/` and are independently testable.
 */
export class SearchService {
  private readonly index:  InvertedIndex;
  private readonly cache:  SearchCache;

  constructor() {
    // Index and cache are initialised once when the service is instantiated.
    this.index = new InvertedIndex(PRODUCTS);
    this.cache = new SearchCache(30); // 30-second TTL
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  search(filters: SearchFilters): SearchResult {
    // 1. Cache hit — return immediately
    const cacheKey = SearchCache.buildKey(filters as Record<string, unknown>);
    const cached   = this.cache.get<SearchResult>(cacheKey);
    if (cached) return cached;

    // 2. Resolve candidate set
    const candidates = this.resolveCandidates(filters.q);

    // 3. Apply structured filters (category, price) on the candidate set
    const data = this.applyFilters(candidates, filters);

    const result: SearchResult = { data, total: data.length };

    // 4. Store in cache before returning
    this.cache.set(cacheKey, result);

    return result;
  }

  // ─── Private helpers ─────────────────────────────────────────────────────

  /**
   * Use the inverted index for text search; fall back to the full product
   * list when no query string is provided.
   */
  private resolveCandidates(q?: string): Product[] {
    if (!q?.trim()) return PRODUCTS;
    return this.index.query(q.trim());
  }

  /**
   * Apply category and price range filters.
   * Runs on the (already narrowed) candidate set, not the full dataset.
   */
  private applyFilters(candidates: Product[], filters: SearchFilters): Product[] {
    const { category, minPrice, maxPrice } = filters;

    return candidates.filter((p) => {
      if (category?.trim() && p.category.toLowerCase() !== category.trim().toLowerCase()) {
        return false;
      }
      if (minPrice !== undefined && p.price < minPrice) return false;
      if (maxPrice !== undefined && p.price > maxPrice) return false;
      return true;
    });
  }
}
