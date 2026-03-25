
export type SortField = 'name' | 'category' | 'price' | 'stock';
export type SortDirection = 'asc' | 'desc';

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    rating: number;
    stock: number;
}

export interface SearchFilters {
    query: string;
    category: string;
    minPrice: string;
    maxPrice: string;
}

export interface SortConfig {
    field: SortField;
    direction: SortDirection;
}
