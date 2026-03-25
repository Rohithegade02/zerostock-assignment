import { SearchX } from 'lucide-react';
import { Button } from '@/components/atoms';

interface EmptyStateProps {
  onClear: () => void;
}

export function EmptyState({ onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="w-20 h-20 rounded-2xl bg-violet-50 flex items-center justify-center shadow-inner">
        <SearchX size={36} className="text-[#7C3AED]/60" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-foreground">No products found</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Try adjusting your search or filter criteria to find what you&apos;re looking for.
        </p>
      </div>
      <Button
        onClick={onClear}
        className="mt-1 bg-[#7C3AED] hover:bg-[#6d28d9] text-white rounded-xl px-6 transition-all"
      >
        Clear all filters
      </Button>
    </div>
  );
}
