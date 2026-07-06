import { Article } from "./articleList.type";

export interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  href: string;
}

export interface ArticleDetail {
  id: string;
  title: string; // Akan diisi title_id atau title_en dari server
  author: string;
  date: string;
  category: string;
  slug?: string;
  coverImage: string;
  content: string; // Akan diisi content_id atau content_en dari server
  source?: string | null;
  prevArticle?: { title: string; href: string } | null;
  nextArticle?: { title: string; href: string } | null;
  relevantArticles?: Article[];
  relatedProducts?: RelatedProduct[];
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export interface RelevantArticle {
  id: string;
  title: string;
  slug: string;
  content?: string;
  coverImage?: string;
}
