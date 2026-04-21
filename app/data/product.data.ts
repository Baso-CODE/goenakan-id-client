import { Product } from "../types/product.type";

export const MOCK_PRODUCTS: Product[] = Array.from({ length: 6 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: "Custom Steel Tumbler",
  regularPrice: 19900,
  bulkPrice: 17900,
  minOrder: 100,
  sold: 1000,
  slug: "custom-steel-tumbler",
  image: "/images/products/demo-products.png",
  category: "STAINLESS STEEL",
  color: "brown",
  size: "medium",
  availability: "in_stock" as const,
}));
