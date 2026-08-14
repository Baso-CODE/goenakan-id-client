import { getProductBySlugAPI } from "@/app/api/products/getProductBySlug.api";
import { getRelatedProductsAPI } from "@/app/api/products/getRelatedProducts.api";
import { CustomCTA } from "@/app/components/navigation/products/customCTA";
import { ProductDetailPage } from "@/app/components/navigation/products/detail/productDetailPage";
import { RelatedProducts } from "@/app/components/navigation/products/detail/relatedProducts";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const locale = await getLocale();

  const cookieStore = await cookies();
  const userCountry = cookieStore.get("USER_COUNTRY")?.value || "ID";

  const [product, relatedProducts] = await Promise.all([
    getProductBySlugAPI(slug, locale, userCountry),
    getRelatedProductsAPI(slug),
  ]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-2">
            {locale === "en" ? "Product Not Found" : "Produk Tidak Ditemukan"}
          </h1>
          <p className="text-stone-500">
            {locale === "en"
              ? `The product "${slug}" does not exist or has been removed.`
              : `Produk "${slug}" tidak ditemukan atau telah dihapus.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ProductDetailPage product={product} />
      <RelatedProducts
        products={relatedProducts}
        title={
          locale === "en" ? "You Might Also Like" : "Produk Lainnya untuk Anda"
        }
      />
      <CustomCTA
        title={
          locale === "en"
            ? "Can’t Find the Product You’re Looking For?"
            : "Tidak Menemukan Produk yang Anda Cari?"
        }
        description={
          locale === "en"
            ? "No worries. Create it yourself with our custom mockup generator. From ideas to visuals, we’ll help bring it to life."
            : "Tenang saja. Buat sendiri dengan generator mockup kustom kami. Dari ide hingga visual, kami siap mewujudkannya."
        }
        buttonText={locale === "en" ? "Start Customizing" : "Mulai Kustomisasi"}
        href="/products/customize"
      />
    </div>
  );
}
