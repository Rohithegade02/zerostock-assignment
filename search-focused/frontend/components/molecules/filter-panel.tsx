'use client';

import { Category, SearchFilters } from '@/lib/types';
import { CATEGORIES, isPriceRangeValid } from '@/lib/filter-utils';
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms';
import { Tag, IndianRupee, AlertCircle } from 'lucide-react';

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: Partial<SearchFilters>) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const priceValid = isPriceRangeValid(filters.minPrice, filters.maxPrice);

  return (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
          <Tag size={14} className="text-[#7C3AED]" />
          Category
        </label>
        <Select
          value={filters.category}
          onValueChange={(val) => onChange({ category: val as Category })}
        >
          <SelectTrigger
            id="category-select"
            className="h-10 rounded-xl border-border focus:ring-[#7C3AED]/40 focus:border-[#7C3AED]"
          >
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="cursor-pointer">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80">
          <IndianRupee size={14} className="text-[#7C3AED]" />
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
            <Input
              id="min-price-input"
              type="number"
              min={0}
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              className={`pl-7 h-10 rounded-xl transition-all ${!priceValid
                ? 'border-destructive focus-visible:ring-destructive/40'
                : 'focus-visible:ring-[#7C3AED]/40 focus-visible:border-[#7C3AED]'
                }`}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
            <Input
              id="max-price-input"
              type="number"
              min={0}
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className={`pl-7 h-10 rounded-xl transition-all ${!priceValid
                ? 'border-destructive focus-visible:ring-destructive/40'
                : 'focus-visible:ring-[#7C3AED]/40 focus-visible:border-[#7C3AED]'
                }`}
            />
          </div>
        </div>
        {!priceValid && (
          <p className="flex items-center gap-1.5 text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={12} />
            Min price cannot exceed max price
          </p>
        )}
      </div>
    </div>
  );
}
