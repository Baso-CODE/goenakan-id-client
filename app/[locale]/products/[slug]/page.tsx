import { getProductBySlugAPI } from "@/app/api/products/getProductBySlug.api";
import { getRelatedProductsAPI } from "@/app/api/products/getRelatedProducts.api";
import { CustomCTA } from "@/app/components/navigation/products/customCTA";
import { ProductDetailPage } from "@/app/components/navigation/products/detail/productDetailPage";
import { RelatedProducts } from "@/app/components/navigation/products/detail/relatedProducts";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const [product, relatedProducts] = await Promise.all([
    getProductBySlugAPI(slug),
    getRelatedProductsAPI(slug),
  ]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-2">
            Product Not Found
          </h1>
          <p className="text-stone-500">
            The product &quot;{slug}&quot; does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white ">
      <ProductDetailPage product={product} />
      <RelatedProducts products={relatedProducts} title="You Might Also Like" />

      <CustomCTA
        title="Can’t Find the Product You’re Looking For?"
        description="No worries. Create it yourself with our custom mockup generator. From ideas to visuals, we’ll help bring it to life."
        buttonText="Start Customizing"
        href="/products/customize"
      />
    </div>
  );
}
