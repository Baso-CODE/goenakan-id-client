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
  first: AttributionVisit;
  last: AttributionVisit;
}

export function parseAttributionCookie(
  value?: string,
): AttributionCookie | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);

    if (!parsed || typeof parsed !== "object") return null;
    if (!("first" in parsed) || !("last" in parsed)) return null;

    const { first, last } = parsed;

    const isVisit = (value: unknown): value is AttributionVisit => {
      if (!value || typeof value !== "object") return false;

      return (
        "landing_page" in value &&
        typeof value.landing_page === "string" &&
        "timestamp" in value &&
        typeof value.timestamp === "string" &&
        "params" in value &&
        typeof value.params === "object" &&
        value.params !== null &&
        !Array.isArray(value.params)
      );
    };

    return isVisit(first) && isVisit(last) ? { first, last } : null;
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
  };
}
