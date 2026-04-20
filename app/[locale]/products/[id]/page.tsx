import { CustomCTA } from "@/app/components/products/customCTA";
import { ProductDetailPage } from "@/app/components/products/detail/productDetailPage";
import { RelatedProducts } from "@/app/components/products/detail/relatedProducts";
import { MOCK_PRODUCTS } from "@/app/data/product.data";
import { MOCK_PRODUCT_DETAILS } from "@/app/data/productDetail.data";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = MOCK_PRODUCT_DETAILS[id as keyof typeof MOCK_PRODUCT_DETAILS];

  if (!product) {
    return <div>Product tidak ditemukan: {id}</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-28">
      <ProductDetailPage product={product} />
      <RelatedProducts
        products={MOCK_PRODUCTS.filter((p) => p.id !== product.id)}
        title="You Might Also Like"
      />
      <CustomCTA
        title="Can’t Find the Product You’re Looking For?"
        description="No worries. Create it yourself with our custom mockup generator. From ideas to visuals, we’ll help bring it to life."
        buttonText="Start Customizing"
        href="/products/customize"
      />
    </div>
  );
}
