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
  // ✨ OPSIONAL: Jika kamu butuh menampilkan nama turunannya di UI card produk
  itemCategoryName?: string | null;
  itemNameString?: string | null;
}

export interface FilterState {
  category: string;
  // ✨ TAMBAHAN BARU: Menampung nilai filter untuk anak dan cucu kategori
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
  // ✨ PERBAIKAN: Menggunakan interface CategoryOption agar mendeteksi anak-anaknya (itemCategories & itemNames)
  categories: CategoryOption[];
  attributes: {
    name: string;
    options: FilterOption[];
  }[];
}
