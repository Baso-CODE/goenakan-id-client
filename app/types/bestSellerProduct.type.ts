export interface BestSellerProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  regularPrice: number;
  bulkPrice: number;
  minOrder: number;
  sold: number;
  isCustom: boolean;
  categoryName: string;
}
