'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchPresentation from './SearchPresentation';
import { Product, SearchFilters, SortConfig, SortField } from '@/types';
import { sortProducts } from '@/lib/filter-utils';


const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  category: 'All',
  minPrice: '',
  maxPrice: '',
};

export const DEFAULT_SORT: SortConfig = {
  field: 'name',
  direction: 'asc',
};
// Container: wires the model hook → presentation component
export const Search = () => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortConfig>(DEFAULT_SORT);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.query.trim()) params.append('q', filters.query.trim());
      if (filters.category !== 'All') params.append('category', filters.category);
      if (filters.minPrice !== '') params.append('minPrice', filters.minPrice);
      if (filters.maxPrice !== '') params.append('maxPrice', filters.maxPrice);

      const res = await fetch(`${API_BASE}/search?${params}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const json = await res.json();
      const newProducts = json.data ?? [];
      setProducts(newProducts);
      setTotalProducts(json.total ?? 0);

      setCategories((prev) => {
        const catSet = new Set(prev);
        let added = false;
        newProducts.forEach((p: Product) => {
          if (p.category && !catSet.has(p.category)) {
            catSet.add(p.category);
            added = true;
          }
        });
        if (added) {
          const others = Array.from(catSet).filter(c => c !== 'All').sort();
          return ['All', ...others];
        }
        return prev;
      });
    } catch (err) {
      setError('Could not load products. Is the backend running?');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Only sorting stays on the client — filtering is owned by the backend
  const sortedProducts = useMemo(
    () => sortProducts(products, sort),
    [products, sort],
  );

  const handleFilterChange = useCallback((patch: Partial<SearchFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch })),
    []);

  const handleSortChange = useCallback((field: SortField) =>
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    })),
    []);

  const handleClearFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  return (
    <SearchPresentation
      categories={categories}
      filters={filters}
      sort={sort}
      products={products}
      totalProducts={totalProducts}
      loading={loading}
      error={error}
      onFilterChange={handleFilterChange}
      onSortChange={handleSortChange}
      onClearFilters={handleClearFilters}
    />
  );
};
