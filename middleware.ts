import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

export default async function middleware(request: NextRequest) {
  let country = "ID";
  const countryCookie = request.cookies.get("USER_COUNTRY")?.value;

  // ✨ 1. LOG DEBUGGING AWAL
  console.log("=== DEBUG MIDDLEWARE DIMULAI ===");
  console.log("Cookie USER_COUNTRY saat ini:", countryCookie || "Belum ada");

  if (countryCookie) {
    country = countryCookie;
    console.log("Menggunakan negara dari cookie:", country);
  } else {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp;

    // ✨ 2. LOG DEBUGGING IP
    console.log("Header x-forwarded-for:", forwardedFor);
    console.log("Header x-real-ip:", realIp);
    console.log("IP yang akan dicek:", ip);

    if (ip && ip !== "::1" && ip !== "127.0.0.1") {
      try {
        console.log(`Mengambil data lokasi untuk IP: ${ip} dari ipwhois...`);
        const response = await fetch(`https://ipwhois.app/json/${ip}`, {
          signal: AbortSignal.timeout(3000),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.country_code) {
            country = data.country_code;
            console.log("Berhasil! Negara terdeteksi:", country);
          }
        } else {
          console.log("Gagal fetch API ipwhois, status HTTP:", response.status);
        }
      } catch (error) {
        console.log("Error saat memanggil API lokasi:", error);
      }
    } else {
      console.log("IP terdeteksi sebagai localhost, menggunakan default ID");
    }
  }

  const dynamicDefaultLocale = country === "ID" ? "id" : "en";
  console.log("Bahasa yang diputuskan:", dynamicDefaultLocale);
  console.log("=== DEBUG MIDDLEWARE SELESAI ===\n");

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
