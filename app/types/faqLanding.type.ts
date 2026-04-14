export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  categoryId?: string | null;
  createdAt: string;
  updatedAt: string;
}
