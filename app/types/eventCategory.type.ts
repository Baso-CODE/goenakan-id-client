import { PortfolioPublic } from "./portfolioPublic.type";

export interface EventCategory {
  id: string;
  title: string;
  slug: string;
  orderCount: number;
  image: string;
  imageId?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  portfolios?: PortfolioPublic[];
}
