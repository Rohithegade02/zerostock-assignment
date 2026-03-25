'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/atoms/input';
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [local, setLocal] = useState(value);
  const debouncedLocal = useDebounce(local, 300);

  // Sync external resets (e.g. "Clear all filters")
  useEffect(() => { setLocal(value); }, [value]);

  // Propagate debounced changes upstream
  useEffect(() => {
    if (debouncedLocal !== value) {
      onChange(debouncedLocal);
    }
  }, [debouncedLocal, onChange, value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocal(e.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setLocal('');
    onChange('');
  }, [onChange]);

  return (
    <div className="relative group">
      <Search
        size={18}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-[#7C3AED]"
      />
      <Input
        id="product-search-input"
        type="text"
        placeholder="Search by name or description…"
        value={local}
        onChange={handleChange}
        className="pl-10 pr-10 h-11 rounded-xl border-border bg-white focus-visible:ring-[#7C3AED]/40 focus-visible:border-[#7C3AED] transition-all"
      />
      {local && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
