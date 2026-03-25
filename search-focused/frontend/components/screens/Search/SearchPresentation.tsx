import { SearchFilters, SortConfig, SortField, Product } from '@/lib/types';
import { Skeleton } from '@/components/atoms';
import { SearchBar, FilterPanel, ProductTable, EmptyState } from '@/components/molecules';


interface SearchPresentationProps {
  filters: SearchFilters;
  sort: SortConfig;
  products: Product[];
  totalProducts: number;
  loading: boolean;
  error: string | null;
  onFilterChange: (patch: Partial<SearchFilters>) => void;
  onSortChange: (field: SortField) => void;
  onClearFilters: () => void;
}

export default function SearchPresentation({
  filters,
  sort,
  products,
  totalProducts,
  loading,
  error,
  onFilterChange,
  onSortChange,
  onClearFilters,
}: SearchPresentationProps) {
  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="pb-5 border-b border-border/60">
        <h1 className="text-3xl font-bold tracking-tight text-[#0F172A] relative inline-block">
          Discover Products
          <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-linear-to-r from-[#7C3AED] to-transparent rounded-full" />
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sticky filter sidebar */}
        <aside className="lg:col-span-1 border border-border/50 bg-white/50 backdrop-blur-sm rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] h-fit lg:sticky lg:top-8">
          <FilterPanel filters={filters} onChange={onFilterChange} />
        </aside>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          <div className="max-w-md">
            <SearchBar
              value={filters.query}
              onChange={(q) => onFilterChange({ query: q })}
            />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] border border-border/40">
            {error ? (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-center text-sm">
                {error}
              </div>
            ) : loading ? (
              <div className="space-y-4">
                <Skeleton className="h-5 w-40 rounded-full" />
                <div className="space-y-2 pt-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            ) : products.length > 0 ? (
              <ProductTable
                products={products}
                total={totalProducts}
                sort={sort}
                onSortChange={onSortChange}
              />
            ) : (
              <EmptyState onClear={onClearFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}