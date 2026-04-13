export interface BannerItem {
  id: string;
  article?: {
    publishedAt?: string;
    category?: {
      name: string;
    };
    title?: string;
    slug: string;
    coverImage?: string;
  };
  ctaLink?: string;
  backgroundColor?: string;
  buttonText?: string;
}
