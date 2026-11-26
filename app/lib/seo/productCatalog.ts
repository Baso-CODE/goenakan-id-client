import type { ProductDetail } from "@/app/types/productDetail.type";
import { convert } from "html-to-text";

export const CATALOG_SITE_URL = "https://goenakan.id";
export const CATALOG_BRAND = "Goenakan";

export type CatalogLocale = "id" | "en";

export interface CatalogOffer {
  freightMode: "SEA" | "AIR";
  minQty: number;
  pricePerPcs: number;
  totalPrice: number;
  currency: "IDR";
}

export interface CatalogItem {
  id: string;
  title: string;
  description: string;
  link: string;
  imageLink: string;
  additionalImages: string[];
  productType: string;
  availability: "in_stock" | "out_of_stock";
  offer: CatalogOffer;
}

// ==========================================
// 1. MINIMUM ORDER PRICING
// ==========================================
export function getCatalogOffer(product: ProductDetail): CatalogOffer | null {
  if (product.currencyCode !== "IDR") {
    return null;
  }

  const freightMode = product.availableFreightModes === "AIR" ? "AIR" : "SEA";

  const tiers =
    freightMode === "AIR"
      ? (product.priceTiersAir ?? [])
      : (product.priceTiers ?? []);

  const sortedTiers = [...tiers]
    .filter(
      (tier) =>
        Number.isInteger(Number(tier.minQty)) && Number(tier.minQty) > 0,
    )
    .sort((a, b) => Number(a.minQty) - Number(b.minQty));

  const minimumTier = sortedTiers[0];

  if (!minimumTier) {
    return null;
  }

  const minQty = Number(minimumTier.minQty);
  const pricePerPcs = Number(minimumTier.pricePerPcs);

  if (!Number.isFinite(pricePerPcs) || pricePerPcs <= 0) {
    return null;
  }

  const totalPrice = Number((minQty * pricePerPcs).toFixed(2));

  if (!Number.isFinite(totalPrice) || totalPrice <= 0) {
    return null;
  }

  return {
    freightMode,
    minQty,
    pricePerPcs,
    totalPrice,
    currency: "IDR",
  };
}

// ==========================================
// 2. HTML TO PLAIN TEXT
// ==========================================
export function catalogPlainText(value?: string | null): string {
  if (!value) return "";

  return convert(value, {
    wordwrap: false,
    selectors: [
      {
        selector: "a",
        options: { ignoreHref: true },
      },
      {
        selector: "img",
        format: "skip",
      },
      {
        selector: "script",
        format: "skip",
      },
      {
        selector: "style",
        format: "skip",
      },
    ],
  })
    .replace(/\s+/g, " ")
    .trim();
}

// ==========================================
// 3. CLOUDINARY IMAGE NORMALIZATION
// ==========================================
export function normalizeCatalogImage(value?: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:") {
      return null;
    }

    const isCloudinaryImage =
      url.hostname === "res.cloudinary.com" &&
      url.pathname.includes("/image/upload/");

    if (isCloudinaryImage) {
      url.pathname = url.pathname.replace(
        /(^|[/,])f_(?:auto|webp|png|avif|jpeg)(?=[/,])/g,
        "$1f_jpg",
      );

      url.pathname = url.pathname.replace(
        /\.(webp|avif|png|jpeg|gif|jpg)$/i,
        ".jpg",
      );
    }

    if (!/\.(jpg|jpeg|png)$/i.test(url.pathname)) {
      return null;
    }

    url.hash = "";

    return url.toString();
  } catch {
    return null;
  }
}

// ==========================================
// 4. PRODUCT IMAGES
// ==========================================
export function getCatalogImages(product: ProductDetail): string[] {
  const images = (product.media ?? [])
    .filter((media) => media.type === "image")
    .sort(
      (a, b) =>
        Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)) ||
        (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    )
    .map((media) => normalizeCatalogImage(media.url))
    .filter((url): url is string => Boolean(url));

  return [...new Set(images)].slice(0, 11);
}

// ==========================================
// 5. PRODUCT AVAILABILITY
// ==========================================
function getCatalogAvailability(
  product: ProductDetail,
): CatalogItem["availability"] {
  if (product.isMadeByOrder) {
    return "in_stock";
  }

  if (product.variants?.length) {
    return product.variants.some((variant) => Number(variant.stock) > 0)
      ? "in_stock"
      : "out_of_stock";
  }

  return Number(product.stock) > 0 ? "in_stock" : "out_of_stock";
}

// ==========================================
// 6. SHARED CATALOG ITEM
// ==========================================
export function buildCatalogItem(
  product: ProductDetail,
  slug: string,
  locale: CatalogLocale = "id",
): CatalogItem | null {
  const offer = getCatalogOffer(product);

  if (!offer) return null;

  const images = getCatalogImages(product);
  const title = catalogPlainText(product.name);
  const description = catalogPlainText(product.description);

  if (!product.id || !title || !description || images.length === 0) {
    return null;
  }

  return {
    id: product.id,
    title,
    description,
    link: `${CATALOG_SITE_URL}/${locale}/products/` + encodeURIComponent(slug),
    imageLink: images[0],
    additionalImages: images.slice(1, 11),
    productType: product.itemCategoryEn?.trim() || "",
    availability: getCatalogAvailability(product),
    offer,
  };
}

// ==========================================
// 7. XML ESCAPING
// ==========================================
export function escapeXml(value: string | number): string {
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ==========================================
// 8. GOOGLE & META RSS XML
// ==========================================
export function buildProductsXml(items: CatalogItem[]): string {
  const xmlItems = items.map((item) => {
    const additionalImages = item.additionalImages
      .map(
        (image) =>
          `<g:additional_image_link>${escapeXml(image)}</g:additional_image_link>`,
      )
      .join("\n");

    return `
    <item>
      <g:id>${escapeXml(item.id)}</g:id>
      <g:title>${escapeXml(item.title)}</g:title>
      <g:description>${escapeXml(item.description)}</g:description>
      <g:link>${escapeXml(item.link)}</g:link>
      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>
      ${additionalImages}
      <g:price>${item.offer.totalPrice.toFixed(2)} IDR</g:price>
      <g:availability>${item.availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${CATALOG_BRAND}</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      ${item.productType ? `<g:product_type>${escapeXml(item.productType)}</g:product_type>` : ""}
    </item>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Goenakan Indonesia Product Catalog</title>
    <link>${CATALOG_SITE_URL}</link>
    <description>Goenakan Indonesia merchandise product catalog</description>
    ${xmlItems.join("\n")}
  </channel>
</rss>`;
}

// ==========================================
// 9. PRODUCT STRUCTURED DATA
// ==========================================
export function buildProductJsonLd(
  product: ProductDetail,
  slug: string,
  locale: CatalogLocale,
) {
  const item = buildCatalogItem(product, slug, locale);

  if (!item) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.title,
    image: [item.imageLink, ...item.additionalImages],
    description: item.description,
    sku: item.id,
    brand: {
      "@type": "Brand",
      name: CATALOG_BRAND,
    },
    offers: {
      "@type": "Offer",
      url: item.link,
      price: item.offer.totalPrice,
      priceCurrency: item.offer.currency,
      availability:
        item.availability === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
