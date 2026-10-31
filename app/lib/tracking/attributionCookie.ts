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

// ==========================================
// TYPES
// ==========================================

export interface AttributionVisit {
  landing_page: string;
  timestamp: string;
  params: Partial<Record<AttributionParam, string>>;
  referrer: string | null;
}

export interface AttributionCookie {
  first?: AttributionVisit;
  last?: AttributionVisit;
}

// ==========================================
// REFERRER NORMALIZATION
// ==========================================

function normalizeReferrer(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    const hostname = url.hostname.toLowerCase();

    if (
      hostname === "goenakan.id" ||
      hostname.endsWith(".goenakan.id") ||
      hostname === "midtrans.com" ||
      hostname.endsWith(".midtrans.com") ||
      hostname === "veritrans.co.id" ||
      hostname.endsWith(".veritrans.co.id")
    ) {
      return null;
    }

    return url.origin.slice(0, 1000);
  } catch {
    return null;
  }
}

// ==========================================
// NORMALIZE VISIT
// ==========================================

function normalizeVisit(
  value: unknown,
  legacyReferrer: string | null,
): AttributionVisit | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const visit = value as Record<string, unknown>;

  if (
    typeof visit.landing_page !== "string" ||
    typeof visit.timestamp !== "string" ||
    !visit.params ||
    typeof visit.params !== "object" ||
    Array.isArray(visit.params)
  ) {
    return undefined;
  }

  const params: Partial<Record<AttributionParam, string>> = {};

  const rawParams = visit.params as Record<string, unknown>;

  for (const key of ATTRIBUTION_PARAMS) {
    const param = rawParams[key];

    if (typeof param === "string" && param.trim()) {
      params[key] = param.slice(0, 500);
    }
  }

  return {
    landing_page: visit.landing_page,
    timestamp: visit.timestamp,
    params,
    referrer: Object.prototype.hasOwnProperty.call(visit, "referrer")
      ? normalizeReferrer(visit.referrer)
      : legacyReferrer,
  };
}

// ==========================================
// PARSE COOKIE
// ==========================================

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

    // Mendukung cookie lama dengan referrer di root.
    const legacyReferrer = normalizeReferrer(data.referrer);

    const first = normalizeVisit(data.first, legacyReferrer);
    const last = normalizeVisit(data.last, legacyReferrer);

    if (!first && !last) {
      return null;
    }

    return {
      first,
      last,
    };
  } catch {
    return null;
  }
}

// ==========================================
// GET ATTRIBUTION FROM URL
// ==========================================

export function getAttributionFromUrl(url: URL): AttributionVisit | null {
  const params: Partial<Record<AttributionParam, string>> = {};

  for (const key of ATTRIBUTION_PARAMS) {
    const value = url.searchParams.get(key)?.trim();

    if (value) {
      params[key] = value.slice(0, 500);
    }
  }

  if (Object.keys(params).length === 0) {
    return null;
  }

  return {
    landing_page: url.pathname,
    timestamp: new Date().toISOString(),
    params,
    referrer: null,
  };
}

// ==========================================
// FIRST TOUCH & LAST TOUCH
// ==========================================

export function mergeAttribution(
  previous: AttributionCookie | null,
  current: AttributionVisit,
): AttributionCookie {
  return {
    first: previous?.first ?? current,
    last: current,
  };
}

// ==========================================
// GET EXTERNAL REFERRER
// ==========================================

export function getLandingReferrer(
  requestUrl: URL,
  refererHeader: string | null,
): string | null {
  const referrer = normalizeReferrer(refererHeader);

  if (!referrer) return null;

  try {
    const hostname = new URL(referrer).hostname.toLowerCase();

    if (hostname === requestUrl.hostname.toLowerCase()) {
      return null;
    }

    return referrer;
  } catch {
    return null;
  }
}
