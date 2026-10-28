import legacyRedirects from "@/data/legacy-redirects.json";

const redirects = legacyRedirects as Record<string, string>;

export function normalizeLegacyPath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";

  let path = pathname;

  try {
    path = decodeURIComponent(path);
  } catch {
    return pathname;
  }

  return path.replace(/\/+/g, "/").replace(/\/+$/, "") || "/";
}

export function getLegacyRedirect(pathname: string): string | null {
  const normalized = normalizeLegacyPath(pathname);
  const destination = redirects[normalized];

  if (!destination) return null;

  // Hanya izinkan redirect internal menuju artikel atau produk.
  if (!/^\/(?:id|en)\/(?:article|products)\/[^/?#]+$/.test(destination)) {
    return null;
  }

  if (normalizeLegacyPath(destination) === normalized) {
    return null;
  }

  return destination;
}
