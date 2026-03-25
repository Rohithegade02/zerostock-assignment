'use client';

import { Product, SortConfig, SortField } from '@/lib/types';
import { formatPrice } from '@/lib/filter-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/atoms/table';
import { Badge } from '@/components/atoms/badge';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  total: number;
  sort: SortConfig;
  onSortChange: (field: SortField) => void;
}

const COLUMNS: { key: SortField; label: string }[] = [
  { key: 'name', label: 'Product Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Stock Status' },
];

function SortIcon({ field, sort }: { field: SortField; sort: SortConfig }) {
  if (sort.field !== field) return <ChevronsUpDown size={14} className="text-muted-foreground/50" />;
  return sort.direction === 'asc'
    ? <ChevronUp size={14} className="text-[#7C3AED]" />
    : <ChevronDown size={14} className="text-[#7C3AED]" />;
}

export function ProductTable({ products, total, sort, onSortChange }: ProductTableProps) {
  return (
    <div className="space-y-3">
      {/* Count */}
      <p className="text-sm text-muted-foreground">
        Showing{' '}
        <span className="font-semibold text-foreground">{products.length}</span>
        {' '}of{' '}
        <span className="font-semibold text-foreground">{total}</span>
        {' '}products
      </p>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0F172A] hover:bg-[#0F172A]">
              {COLUMNS.map(({ key, label }) => (
                <TableHead
                  key={key}
                  onClick={() => onSortChange(key)}
                  className="text-slate-300 font-semibold cursor-pointer select-none whitespace-nowrap hover:text-white transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    {label}
                    <SortIcon field={key} sort={sort} />
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p, idx) => (
              <TableRow
                key={p.id}
                className={`transition-colors hover:bg-violet-50/60 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'
                  }`}
              >
                <TableCell className="font-medium max-w-[200px]">
                  <div>
                    <p className="font-semibold text-sm truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">{p.description}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {p.category}
                  </span>
                </TableCell>
                <TableCell className="font-mono font-semibold text-[#7C3AED]">
                  {formatPrice(p.price)}
                </TableCell>
                <TableCell>
                  {p.stock > 0 ? (
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                      In Stock ({p.stock})
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-600 border-red-200 hover:bg-red-100">
                      Out of Stock
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
