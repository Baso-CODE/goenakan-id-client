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

  // ===================================================
  // SEO: LEGACY ARTICLE 301 REDIRECTS
  // ===================================================
  async redirects() {
    return [...legacyArticleRedirects];
  },
};

export default withNextIntl(nextConfig);
