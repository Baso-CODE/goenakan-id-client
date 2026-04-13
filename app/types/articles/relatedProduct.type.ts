export interface RelatedProduct {
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{ url: string }>;
  };
}
