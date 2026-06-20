import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// 🔄 Path disesuaikan (tanpa src)
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "*.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "static.midtrans.com", pathname: "/**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "/**" },
      { protocol: "https", hostname: "goenakan.id", pathname: "/**" },
    ],
  },
};

export default withNextIntl(nextConfig);
