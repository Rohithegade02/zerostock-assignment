import { Product, SortConfig } from './types';

// Filtering is handled by the backend — only client-side sort remains
export function sortProducts(products: Product[], sort: SortConfig): Product[] {
  return [...products].sort((a, b) => {
    let cmp = 0;
    if (sort.field === 'name')          cmp = a.name.localeCompare(b.name);
    else if (sort.field === 'category') cmp = a.category.localeCompare(b.category);
    else if (sort.field === 'price')    cmp = a.price - b.price;
    else if (sort.field === 'stock')    cmp = a.stock - b.stock;
    return sort.direction === 'asc' ? cmp : -cmp;
  });
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function isPriceRangeValid(min: string, max: string): boolean {
  if (min === '' || max === '') return true;
  const minVal = parseFloat(min);
  const maxVal = parseFloat(max);
  if (isNaN(minVal) || isNaN(maxVal)) return true;
  return minVal <= maxVal;
}
