export interface ArticleApiItem {
  id: string;
  title: string;
  content: string;
  coverImage?: string;
  category?: { name: string };
  publishedAt?: string;
  createdAt: string;
  slug?: string;
}
