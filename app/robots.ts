import type { MetadataRoute } from "next";

const SITE_URL = "https://goenakan.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/*/cart",
          "/*/cart/",
          "/*/checkout",
          "/*/checkout/",
          "/*/profile",
          "/*/profile/",
          "/*/login",
          "/*/register",
          "/*/reset-password",
          "/*/verify-email",
          "/*/order-status",
          "/*/order-status/",
          "/*?*q=",
          "/*?*search=",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
