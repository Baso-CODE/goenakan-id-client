// src/app/types/product.type.ts

export interface Product {
  id: string;
  name: string;
  regularPrice: number;
  bulkPrice: number;
  minOrder: number;
  sold: number;
  slug: string;
  image: string;
  category: string;
  availability: "in_stock" | "out_of_stock";
}

export interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  availability: string;
  sort: string;
  // ✨ PERBAIKAN: Menampung atribut apapun secara dinamis
  attributes: Record<string, string>;
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface DynamicFilterOptions {
  categories: FilterOption[];
  // ✨ PERBAIKAN: Array of object yang berisi nama atribut & opsinya
  attributes: {
    name: string;
    options: FilterOption[];
  }[];
}
