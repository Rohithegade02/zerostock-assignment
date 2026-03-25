'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/atoms/input';
import { useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const [local, setLocal] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external resets (e.g. "Clear all filters")
  useEffect(() => { setLocal(value); }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setLocal(val);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(val), 300);
  }

  function handleClear() {
    setLocal('');
    onChange('');
  }

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
