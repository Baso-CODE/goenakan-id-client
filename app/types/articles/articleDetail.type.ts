// 🟢 Tambahkan interface untuk struktur produk terkait (Sidebar)
export interface RelatedProduct {
  id: string;
  name: string;
  image: string;
  href: string;
}

export interface ArticleDetail {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  slug?: string;
  coverImage: string;
  content: string;
  source?: string | null;
  prevArticle?: { title: string; href: string } | null;
  nextArticle?: { title: string; href: string } | null;

  relatedProducts?: RelatedProduct[];
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
