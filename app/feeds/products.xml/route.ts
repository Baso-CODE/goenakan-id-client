import {
  buildCatalogItem,
  buildProductsXml,
  CatalogItem,
  getCatalogOffer,
} from "@/app/lib/seo/productCatalog";
import type { ProductDetail } from "@/app/types/productDetail.type";

export const dynamic = "force-dynamic";

type SitemapProduct = {
  slug: string;
  updatedAt: string;
  locales: string[];
};

type SitemapResponse = {
  products: SitemapProduct[];
};

const BATCH_SIZE = 5;

// ==========================================
// 1. BACKEND API CONFIGURATION
// ==========================================
function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_API;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL_API is not configured");
  }

  return baseUrl.replace(/\/+$/, "");
}

// ==========================================
// 2. GET ALL PUBLIC PRODUCT SLUGS
// ==========================================
async function getPublicProductSlugs(baseUrl: string): Promise<string[]> {
  const sitemapApiUrl =
    process.env.SEO_SITEMAP_API_URL || `${baseUrl}/seo/sitemap`;

  const response = await fetch(sitemapApiUrl, {
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`Product sitemap HTTP ${response.status}`);
  }

  const data = (await response.json()) as SitemapResponse;

  if (!Array.isArray(data.products)) {
    throw new Error("Invalid product sitemap response");
  }

  const slugs = data.products.map((product) => {
    if (typeof product.slug !== "string" || !product.slug.trim()) {
      throw new Error("Invalid product slug in sitemap");
    }

    return product.slug;
  });

  return [...new Set(slugs)];
}

// ==========================================
// 3. FETCH PRODUCT DETAIL
// ==========================================
async function getCatalogProduct(
  baseUrl: string,
  slug: string,
): Promise<CatalogItem | null> {
  const params = new URLSearchParams({
    country: "ID",
    lang: "id",
  });

  const response = await fetch(
    `${baseUrl}/products/public/${encodeURIComponent(slug)}?${params.toString()}`,
    {
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    },
  );

  if (!response.ok) {
    throw new Error(`Product ${slug}: HTTP ${response.status}`);
  }

  const json = await response.json();

  const product = json.data as ProductDetail | undefined;

  if (!product?.id) {
    throw new Error(`Product ${slug}: invalid API response`);
  }

  if (product.currencyCode !== "IDR") {
    throw new Error(`Product ${slug}: currency must be IDR`);
  }

  const offer = getCatalogOffer(product);

  if (!offer) {
    console.info(
      `[Catalog Feed] Excluded ${slug}: no valid minimum order price`,
    );

    return null;
  }

  const item = buildCatalogItem(product, slug, "id");

  if (!item) {
    throw new Error(`Product ${slug}: missing required catalog data`);
  }

  return item;
}

// ==========================================
// 4. BUILD PRODUCT CATALOG
// ==========================================
async function getCatalogItems(): Promise<CatalogItem[]> {
  const baseUrl = getApiBaseUrl();

  const slugs = await getPublicProductSlugs(baseUrl);

  if (slugs.length === 0) {
    throw new Error("No public products returned by sitemap");
  }

  const items: CatalogItem[] = [];

  for (let index = 0; index < slugs.length; index += BATCH_SIZE) {
    const batch = slugs.slice(index, index + BATCH_SIZE);

    const results = await Promise.all(
      batch.map((slug) => getCatalogProduct(baseUrl, slug)),
    );

    for (const item of results) {
      if (item) {
        items.push(item);
      }
    }
  }

  if (items.length === 0) {
    throw new Error("No eligible catalog products");
  }

  const ids = new Set<string>();

  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`Duplicate catalog product ID: ${item.id}`);
    }

    ids.add(item.id);
  }

  console.info(
    `[Catalog Feed] Generated ${items.length} of ${slugs.length} products`,
  );

  return items;
}

// ==========================================
// 5. PUBLIC XML PRODUCT FEED
// ==========================================
export async function GET() {
  try {
    const items = await getCatalogItems();

    const xml = buildProductsXml(items);

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("[Catalog Feed] Failed:", error);

    return new Response("Product feed is temporarily unavailable.", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "Retry-After": "300",
      },
    });
  }
}
