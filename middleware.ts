import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Hanya jalankan middleware pada path halaman, abaikan file statis & API
  matcher: ["/", "/(id|en)/:path*"],
};
