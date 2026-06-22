// types/policyLanding.type.ts

export interface PolicyItem {
  id: number;
  titleId: string;
  titleEn: string;
  contentId: string;
  contentEn: string;
  displayOrder: number;
}

export interface PolicyCategory {
  id: number;
  nameId: string;
  nameEn: string;
  slug: string;
  descriptionId?: string | null;
  descriptionEn?: string | null;
  policies: PolicyItem[];
}
