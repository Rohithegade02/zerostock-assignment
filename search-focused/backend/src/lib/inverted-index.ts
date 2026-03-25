import { Product } from '../types';

/**
 * InvertedIndex
 *
 * Tokenises each product's `name` field at startup and maps every token
 * to the set of product IDs that contain it.  At query time we do a fast
 * prefix-match per query token and intersect the resulting id sets — O(k)
 * where k is the number of distinct tokens, instead of O(n) per request.
 */
export class InvertedIndex {
  /** token → set of product ids */
  private readonly index: Map<string, Set<string>> = new Map();

  /** id → product (for O(1) hydration after id lookup) */
  private readonly productMap: Map<string, Product> = new Map();

  constructor(products: Product[]) {
    this.build(products);
  }


  private build(products: Product[]): void {
    for (const product of products) {
      this.productMap.set(product.id, product);

      const tokens = this.tokenise(product.name);
      for (const token of tokens) {
        if (!this.index.has(token)) {
          this.index.set(token, new Set());
        }
        this.index.get(token)!.add(product.id);
      }
    }
  }

  /**
   * Returns all products whose name matches every token in the query string.
   * Uses prefix matching so "wire" matches "Wireless".
   */
  query(q: string): Product[] {
    const tokens = this.tokenise(q);
    if (tokens.length === 0) return [];

    const idSetsPerToken: Set<string>[] = tokens.map((queryToken) => {
      const matched = new Set<string>();
      for (const [indexToken, ids] of this.index.entries()) {
        if (indexToken.startsWith(queryToken)) {
          ids.forEach((id) => matched.add(id));
        }
      }
      return matched;
    });

    const [first, ...rest] = idSetsPerToken;
    const resultIds = rest.reduce<Set<string>>((acc, set) => {
      for (const id of acc) {
        if (!set.has(id)) acc.delete(id);
      }
      return acc;
    }, new Set(first));

    return [...resultIds]
      .map((id) => this.productMap.get(id)!)
      .filter(Boolean);
  }

  private tokenise(text: string): string[] {
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 0);
  }
}
