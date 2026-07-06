export interface ArticleApiItem {
  id: string;
  slug?: string;
  title_id: string;
  title_en?: string | null;
  content_id: string;
  content_en?: string | null;
  coverImage: string;
  category?: { name: string };
  publishedAt?: string | Date;
  createdAt: string | Date;
}
