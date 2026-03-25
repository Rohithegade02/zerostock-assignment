'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchPresentation from './SearchPresentation';
import { Product, SearchFilters, SortConfig, SortField } from '@/lib/types';
import { sortProducts } from '@/lib/filter-utils';


const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export const DEFAULT_FILTERS: SearchFilters = new Map([
  ['query', ''],
  ['category', 'All'],
  ['minPrice', ''],
  ['maxPrice', ''],
]);

export const DEFAULT_SORT: SortConfig = new Map([
  ['field', 'name'],
  ['direction', 'asc'],
]);
// Container: wires the model hook → presentation component
export const Search = () => {
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortConfig>(DEFAULT_SORT);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.get('query')?.trim()) params.append('q', filters.get('query')!.trim());
      if (filters.get('category') !== 'All') params.append('category', filters.get('category')!);
      if (filters.get('minPrice') !== '') params.append('minPrice', filters.get('minPrice')!);
      if (filters.get('maxPrice') !== '') params.append('maxPrice', filters.get('maxPrice')!);

      const res = await fetch(`${API_BASE}/search?${params}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const json = await res.json();
      setProducts(json.data ?? []);
      setTotalProducts(json.total ?? 0);
    } catch (err) {
      console.error('[useSearchModel]', err);
      setError('Could not load products. Is the backend running?');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Only sorting stays on the client — filtering is owned by the backend
  const sortedProducts = useMemo(
    () => sortProducts(products, sort),
    [products, sort],
  );

  const handleFilterChange = (patch: Partial<SearchFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const handleSortChange = (field: SortField) =>
    setSort((prev) => {
      const currentDirection = prev.get('direction');
      return new Map([
        ['field', field],
        ['direction', currentDirection === 'asc' ? 'desc' : 'asc'],
      ]);
    });

  const handleClearFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <SearchPresentation
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
