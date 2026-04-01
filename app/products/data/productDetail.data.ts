import { ProductDetail } from "../types/productDetail.type";

// Buat helper agar tidak copy-paste
const makeTumbler = (id: string): ProductDetail => ({
  id,
  category: "STAINLESS STEEL",
  name: "Custom Steel Tumbler",
  sold: 1000,
  images: ["/images/products/demo-products.png"],
  priceTiers: [
    {
      label: "Starter Order",
      subtitle: "Perfect for small batches & trial orders",
      pricePerPcs: 19900,
      minQty: 1,
      maxQty: 100,
    },
    {
      label: "Standard Order",
      subtitle: "Ideal for growing needs & mid-scale orders",
      pricePerPcs: 17900,
      minQty: 101,
      maxQty: 500,
    },
    {
      label: "Premium Order",
      subtitle: "Tailored for large-scale & corporate projects",
      pricePerPcs: 15900,
      minQty: 501,
      maxQty: null,
      badge: "Best Value!",
    },
  ],
  description:
    "Custom Steel Tumbler premium dengan bahan stainless steel food-grade berkualitas tinggi.",
  weight: "0,35 kg",
  dimensions: "8 × 8 × 22 cm",
  accessories: "Sedotan, Pouch",
  whatsappNumber: "6281234567890",
});

export const MOCK_PRODUCT_DETAILS: Record<string, ProductDetail> = {
  "product-1": makeTumbler("product-1"),
  "product-2": makeTumbler("product-2"),
  "product-3": makeTumbler("product-3"),
  "product-4": makeTumbler("product-4"),
  "product-5": makeTumbler("product-5"),
  "product-6": makeTumbler("product-6"),
};
