// src/app/types/itemCart/apiCartItem.type.ts

export interface ApiCartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  product: {
    name: string;
    basePrice: string | number;
    images?: { url: string }[];

    // ✨ PERBAIKAN: Sesuai Prisma, ini adalah objek relasi, bukan sekadar string
    materialType?: {
      id: string;
      name: string;
      slug?: string;
    } | null;

    // Tambahan sesuai schema yang kamu kirimkan (opsional jika di-include dari backend)
    itemCategory?: {
      id: string;
      name: string;
      slug?: string;
    } | null;
    itemName?: {
      id: string;
      name: string;
      slug?: string;
    } | null;

    weight?: number | null;
    width?: number | null;
    height?: number | null;
    length?: number | null;
  };
  variant?: {
    price: string | number;
  } | null;
  customization?: any;
}
