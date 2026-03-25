export type Category =
  | 'All'
  | 'Electronics'
  | 'Clothing'
  | 'Books'
  | 'Home & Garden'
  | 'Sports';

export type SortField = 'name' | 'category' | 'price' | 'rating' | 'stock';
export type SortDirection = 'asc' | 'desc';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Exclude<Category, 'All'>;
  price: number;
  rating: number;
  stock: number;
}

export type SearchFilters = Map<string, string>;

export type SortConfig = Map<string, string>;
