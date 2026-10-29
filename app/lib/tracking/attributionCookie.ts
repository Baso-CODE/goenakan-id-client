export const ATTRIBUTION_COOKIE = "gk_attr";
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 90;

export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "gbraid",
  "wbraid",
  "gad_source",
  "gad_campaignid",
  "fbclid",
  "ttclid",
] as const;

export type AttributionParam = (typeof ATTRIBUTION_PARAMS)[number];

export interface AttributionVisit {
  landing_page: string;
  timestamp: string;
  params: Partial<Record<AttributionParam, string>>;
}

export interface AttributionCookie {
  first?: AttributionVisit;
  last?: AttributionVisit;
  referrer?: string | null;
}

export function parseAttributionCookie(
  value?: string,
): AttributionCookie | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }

    const data = parsed as Record<string, unknown>;

    const isVisit = (value: unknown): value is AttributionVisit => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false;
      }

      const visit = value as Record<string, unknown>;

      return (
        typeof visit.landing_page === "string" &&
        typeof visit.timestamp === "string" &&
        visit.params !== null &&
        typeof visit.params === "object" &&
        !Array.isArray(visit.params)
      );
    };

    const first = isVisit(data.first) ? data.first : undefined;
    const last = isVisit(data.last) ? data.last : undefined;

    const referrer = typeof data.referrer === "string" ? data.referrer : null;

    if (!first && !last && !referrer) return null;

    return { first, last, referrer };
  } catch {
    return null;
  }
}
export function getAttributionFromUrl(url: URL): AttributionVisit | null {
  const params: Partial<Record<AttributionParam, string>> = {};

  for (const key of ATTRIBUTION_PARAMS) {
    const value = url.searchParams.get(key)?.trim();

    if (value) {
      params[key] = value.slice(0, 500);
    }
  }

  if (!Object.keys(params).length) return null;

  return {
    landing_page: url.pathname,
    timestamp: new Date().toISOString(),
    params,
  };
}

export function mergeAttribution(
  previous: AttributionCookie | null,
  current: AttributionVisit,
): AttributionCookie {
  return {
    first: previous?.first ?? current,
    last: current,
    referrer: previous?.referrer ?? null,
  };
}

export function getLandingReferrer(
  requestUrl: URL,
  refererHeader: string | null,
): string | null {
  if (!refererHeader) return null;

  try {
    const referrer = new URL(refererHeader);

    if (!["http:", "https:"].includes(referrer.protocol)) {
      return null;
    }

    // Referrer dari domain sendiri bukan sumber kunjungan eksternal.
    if (referrer.hostname === requestUrl.hostname) {
      return null;
    }

    if (
      referrer.hostname === "goenakan.id" ||
      referrer.hostname.endsWith(".goenakan.id")
    ) {
      return null;
    }

    // Hindari menyimpan query string yang berpotensi berisi PII.
    return `${referrer.origin}${referrer.pathname}`.slice(0, 1000);
  } catch {
    return null;
  }
}
