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
  itemCategoryName?: string | null;
  itemNameString?: string | null;
}

export interface FilterState {
  category: string;
  itemCategory?: string;
  itemName?: string;

  minPrice: string;
  maxPrice: string;
  availability: string;
  sort: string;
  attributes: Record<string, string>;
}

export interface FilterOption {
  label: string;
  value: string;
}

// ==========================================
// ✨ INTERFACE BARU: Struktur Hierarki Kategori
// ==========================================
export interface ItemNameOption extends FilterOption {
  id: string;
}

export interface ItemCategoryOption extends FilterOption {
  id: string;
  itemNames: ItemNameOption[];
}

export interface CategoryOption extends FilterOption {
  id: string;
  itemCategories: ItemCategoryOption[];
}
// ==========================================

export interface DynamicFilterOptions {
  categories: CategoryOption[];
  attributes: {
    name: string;
    options: FilterOption[];
  }[];
}
