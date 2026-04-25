export interface EventCategory {
  id: string;
  title: string;
  slug: string;
  orderCount: number;
  image: string;
  imageId?: string;
  displayOrder?: number;
  isActive?: boolean;
}
