import { PRODUCTS } from '../data/product';
import { Product, SearchFilters, SearchResult } from '../types';



export class SearchService {
  search(filters: SearchFilters): SearchResult {
    const { q, category, minPrice, maxPrice } = filters;

    // If no filters provided at all, return everything
    const noFilters =
      !q?.trim() && !category?.trim() && minPrice === undefined && maxPrice === undefined;

    if (noFilters) {
      return { data: PRODUCTS, total: PRODUCTS.length };
    }

    const data = PRODUCTS.filter((p: Product) => {
      // q: case-insensitive partial match on name
      if (q?.trim()) {
        const haystack = p.name.toLowerCase();
        if (!haystack.includes(q.trim().toLowerCase())) return false;
      }

      // category: case-insensitive exact match
      if (category?.trim()) {
        if (p.category.toLowerCase() !== category.trim().toLowerCase()) return false;
      }

      // minPrice
      if (minPrice !== undefined && p.price < minPrice) return false;

      // maxPrice
      if (maxPrice !== undefined && p.price > maxPrice) return false;

      return true;
    });

    return { data, total: data.length };
  }
}
