export interface BestSellerProduct {
  id: string;
  name: string;
  slug: string;
  image: string | null;

  regularPrice: number;
  bulkPrice: number;
  minOrder: number;

  currencyCode: string;

  sold: number;
  isCustom: boolean;
  categoryName: string;
}
