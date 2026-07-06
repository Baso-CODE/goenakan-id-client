export interface BestPriceGuaranteeCategory {
  id: number;
  nameId: string;
  nameEn: string;
  slug: string;
}

export interface BestPriceGuaranteeItem {
  id: number;
  titleId: string;
  titleEn: string;
  contentId: string;
  contentEn: string;
  displayOrder: number;
  isActive: boolean;
  categoryId: number;
  category?: BestPriceGuaranteeCategory;
}
