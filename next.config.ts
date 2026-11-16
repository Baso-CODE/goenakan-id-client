import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { legacyArticleRedirects } from "./config/legacy-article-redirects";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "*.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" },
      { protocol: "https", hostname: "goenakan.id", pathname: "/**" },
      { protocol: "https", hostname: "*.goenakan.id", pathname: "/**" },
      { protocol: "https", hostname: "static.midtrans.com", pathname: "/**" },
    ],
  },

  // ==========================================
  // SEO PERMANENT REDIRECTS
  // ==========================================
  async redirects() {
    return [
      // Legacy Shop URLs
      {
        source: "/shop",
        destination: "/id/products",
        statusCode: 301,
      },
      {
        source: "/id/shop",
        destination: "/id/products",
        statusCode: 301,
      },
      {
        source: "/en/shop",
        destination: "/en/products",
        statusCode: 301,
      },

      // Existing legacy article redirects
      ...legacyArticleRedirects,
    ];
  },
};

export default withNextIntl(nextConfig);
