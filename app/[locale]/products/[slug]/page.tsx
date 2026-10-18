import { getProductBySlugAPI } from "@/app/api/products/getProductBySlug.api";
import { getRelatedProductsAPI } from "@/app/api/products/getRelatedProducts.api";
import { CustomCTA } from "@/app/components/products/customCTA";
import { ProductDetailPage } from "@/app/components/products/detail/productDetailPage";
import { RelatedProducts } from "@/app/components/products/detail/relatedProducts";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const SITE_URL = "https://goenakan.id";

interface ProductPageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

type ProductSeo = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
};

type SeoProduct = {
  name?: string | null;
  description?: string | null;
  seo?: ProductSeo | null;
  media?: Array<{
    url?: string | null;
    type?: string;
    isFeatured?: boolean;
  }>;
};

function plainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getCanonical(
  value: string | null | undefined,
  fallback: string,
): string {
  if (!value) return fallback;

  try {
    const parsed = new URL(value, SITE_URL);
    if (parsed.origin !== SITE_URL) return fallback;
    if (!["/id/", "/en/"].some((p) => parsed.pathname.startsWith(p))) {
      return fallback;
    }
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return fallback;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const language = locale === "en" ? "en" : "id";

  // Metadata tidak menggunakan cookie negara agar stabil untuk crawler.
  const product = (await getProductBySlugAPI(
    slug,
    language,
    "ID",
  )) as SeoProduct | null;

  if (!product) {
    return {
      title: language === "en" ? "Product Not Found" : "Produk Tidak Ditemukan",
      robots: { index: false, follow: false },
    };
  }

  const fallbackUrl = `${SITE_URL}/${language}/products/${encodeURIComponent(slug)}`;

  const title =
    product.seo?.metaTitle?.trim() ||
    `${product.name || "Produk"} | Goenakan Indonesia`;

  const description =
    product.seo?.metaDescription?.trim() ||
    plainText(product.description || "").slice(0, 160) ||
    (language === "en"
      ? "Explore custom merchandise and bulk order solutions at Goenakan Indonesia."
      : "Temukan produk merchandise custom dan solusi pemesanan grosir di Goenakan Indonesia.");

  const canonical = getCanonical(product.seo?.canonicalUrl, fallbackUrl);

  const image =
    product.seo?.ogImage ||
    product.media?.find((item) => item.isFeatured && item.type === "image")
      ?.url ||
    product.media?.find((item) => item.type === "image")?.url;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: product.seo?.ogTitle || title,
      description: product.seo?.ogDescription || description,
      url: canonical,
      siteName: "Goenakan Indonesia",
      locale: language === "en" ? "en_US" : "id_ID",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.seo?.ogTitle || title,
      description: product.seo?.ogDescription || description,
      images: image ? [image] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug, locale } = await params;
  const language = locale === "en" ? "en" : "id";

  const cookieStore = await cookies();
  const userCountry = cookieStore.get("USER_COUNTRY")?.value || "ID";

  const [product, relatedProducts] = await Promise.all([
    getProductBySlugAPI(slug, language, userCountry),
    getRelatedProductsAPI(slug),
  ]);

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-white">
      <ProductDetailPage product={product} />
      <RelatedProducts
        products={relatedProducts}
        title={
          language === "en"
            ? "You Might Also Like"
            : "Produk Lainnya untuk Anda"
        }
      />
      <CustomCTA
        title={
          language === "en"
            ? "Can’t Find the Product You’re Looking For?"
            : "Tidak Menemukan Produk yang Anda Cari?"
        }
        description={
          language === "en"
            ? "No worries. Create it yourself with our custom mockup generator. From ideas to visuals, we’ll help bring it to life."
            : "Tenang saja. Buat sendiri dengan generator mockup kustom kami. Dari ide hingga visual, kami siap mewujudkannya."
        }
        buttonText={
          language === "en" ? "Start Customizing" : "Mulai Kustomisasi"
        }
        href="/products/customize"
      />
    </div>
  );
}
