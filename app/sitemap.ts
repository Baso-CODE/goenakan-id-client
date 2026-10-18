import type { MetadataRoute } from "next";

export const revalidate = 3600;

const SITE_URL = "https://goenakan.id";

type SeoItem = {
  slug: string;
  updatedAt: string;
  locales: string[];
};

type SeoSitemapResponse = {
  products: SeoItem[];
  articles: SeoItem[];
};

const staticPaths = [
  "",
  "/products",
  "/article",
  "/about",
  "/contact",
  "/faqs",
  "/best-price-guarantee",
  "/occasions",
  "/success-story",
  "/clients",
  "/products/customize",
];

function buildEntries(
  path: string,
  locales: string[],
  lastModified?: string,
): MetadataRoute.Sitemap {
  const available = locales.filter(
    (locale) => locale === "id" || locale === "en",
  );

  return available.map((locale) => ({
    url: `${SITE_URL}/${locale}${path}`,
    lastModified: lastModified ? new Date(lastModified) : undefined,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path.includes("/products/") ? 0.8 : 0.7,
    alternates:
      available.length > 1
        ? {
            languages: Object.fromEntries(
              available.map((lang) => [lang, `${SITE_URL}/${lang}${path}`]),
            ),
          }
        : undefined,
  }));
}

async function getSeoItems(): Promise<SeoSitemapResponse> {
  const apiUrl = process.env.SEO_SITEMAP_API_URL;

  if (!apiUrl) {
    throw new Error("SEO_SITEMAP_API_URL belum dikonfigurasi");
  }

  const response = await fetch(apiUrl, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil data sitemap: HTTP ${response.status}`);
  }

  return response.json() as Promise<SeoSitemapResponse>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getSeoItems();

  const staticEntries = staticPaths.flatMap((path) =>
    buildEntries(path, ["id", "en"]),
  );

  const productEntries = data.products.flatMap((product) =>
    buildEntries(
      `/products/${encodeURIComponent(product.slug)}`,
      product.locales,
      product.updatedAt,
    ),
  );

  const articleEntries = data.articles.flatMap((article) =>
    buildEntries(
      `/article/${encodeURIComponent(article.slug)}`,
      article.locales,
      article.updatedAt,
    ),
  );

  return [...staticEntries, ...productEntries, ...articleEntries];
}
