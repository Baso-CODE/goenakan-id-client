import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// In-memory cache to avoid repeated external lookups across requests
const ipCache = new Map<string, { country: string; expiresAt: number }>();

function isPrivateOrLocalIp(ip: string): boolean {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip === "localhost") return true;
  // Private IPv4 ranges (10.0.0.0/8, 172.16.0.0/12 including Docker bridges, 192.168.0.0/16, 127.0.0.0/8)
  const privateIpv4Regex =
    /^(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|127\.\d{1,3}\.\d{1,3}\.\d{1,3}|169\.254\.\d{1,3}\.\d{1,3})$/;
  if (privateIpv4Regex.test(ip)) return true;
  // IPv6 local / private
  if (ip.startsWith("fc00:") || ip.startsWith("fd00:") || ip.startsWith("fe80:")) return true;
  return false;
}

export default async function middleware(request: NextRequest) {
  let country = "ID";
  const countryCookie = request.cookies.get("USER_COUNTRY")?.value;

  if (countryCookie) {
    country = countryCookie;
  } else {
    // 1. Prioritaskan Header Geolocation dari Cloudflare / CDN / Reverse Proxy (0ms)
    const headerCountry =
      request.headers.get("cf-ipcountry") ||
      request.headers.get("x-country-code") ||
      request.headers.get("x-vercel-ip-country");

    if (headerCountry && headerCountry !== "XX" && headerCountry.length === 2) {
      country = headerCountry.toUpperCase();
    } else {
      // 2. Ambil IP asli client
      const forwardedFor = request.headers.get("x-forwarded-for");
      const realIp = request.headers.get("x-real-ip");
      const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp;

      // 3. Jika IP private / Docker internal bridge / localhost, jangan fetch keluar (0ms)
      if (!ip || isPrivateOrLocalIp(ip)) {
        country = "ID";
      } else {
        // 4. Periksa memory cache
        const now = Date.now();
        const cached = ipCache.get(ip);
        if (cached && cached.expiresAt > now) {
          country = cached.country;
        } else {
          try {
            // Timeout dipersingkat menjadi 800ms agar tidak membuat website lag jika API eksternal lambat
            const response = await fetch(`https://ipwhois.app/json/${ip}`, {
              signal: AbortSignal.timeout(800),
            });

            if (response.ok) {
              const data = await response.json();
              if (data && data.country_code) {
                country = data.country_code.toUpperCase();
                // Simpan di memory cache selama 12 jam (maksimal 1000 entri)
                if (ipCache.size > 1000) ipCache.clear();
                ipCache.set(ip, { country, expiresAt: now + 12 * 60 * 60 * 1000 });
              }
            }
          } catch {
            // Fallback default ID jika timeout atau error, tanpa memblokir request pengguna
            country = "ID";
          }
        }
      }
    }
  }

  const dynamicDefaultLocale = country === "ID" ? "id" : "en";

  const handleI18nRouting = createMiddleware({
    ...routing,
    defaultLocale: dynamicDefaultLocale,
  });

  const response = handleI18nRouting(request);

  if (!countryCookie) {
    response.cookies.set("USER_COUNTRY", country, {
      maxAge: 60 * 60 * 24,
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
