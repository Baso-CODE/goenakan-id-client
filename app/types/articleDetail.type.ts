export interface ArticleDetail {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  slug: string;
  coverImage: string;
  content: string;
  source?: string;
  prevArticle?: { title: string; href: string };
  nextArticle?: { title: string; href: string };
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
