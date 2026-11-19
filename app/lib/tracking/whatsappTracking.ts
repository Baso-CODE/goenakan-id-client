import { apiUrl } from "@/app/utils/ApiUrl";

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

const WHATSAPP_CODE_LENGTH = 5;

const WHATSAPP_TRACKING_PATH = "/tracking/whatsapp-click";

interface AttributionVisit {
  landing_page: string;
  timestamp: string;
  params: Record<string, string>;
  referrer: string | null;
}

interface WhatsappAttribution {
  first: AttributionVisit | null;
  last: AttributionVisit | null;
  ga_client_id: string | null;
  ga_session_id: string | null;
}

interface AttributionResponse {
  success: boolean;
  data?: Partial<WhatsappAttribution>;
}

interface TrackWhatsappClickParams {
  code: string;
  ctaName: string;
  pagePath: string;
}

let attributionCache: WhatsappAttribution | null = null;

let attributionPromise: Promise<WhatsappAttribution> | null = null;

// Baca cookie persis ketika tombol WA diklik. Jangan cache GA ID.
function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const entry = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));

  if (!entry) return null;
  const raw = entry.slice(name.length + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function readGaIdsAtClick(): Pick<
  WhatsappAttribution,
  "ga_client_id" | "ga_session_id"
> {
  const gaCookie = readCookie("_ga");
  const sessionCookie = readCookie("_ga_V764HW819M");

  const clientMatch = gaCookie?.match(/^GA\d+\.\d+\.(\d+)\.(\d+)$/);
  const modernSession = sessionCookie?.match(/^GS2\.\d+\.s(\d+)/);
  const legacySession = sessionCookie?.match(/^GS1\.\d+\.(\d+)/);

  return {
    ga_client_id: clientMatch ? `${clientMatch[1]}.${clientMatch[2]}` : null,
    ga_session_id: modernSession?.[1] ?? legacySession?.[1] ?? null,
  };
}

// ==========================================
// GENERATE WHATSAPP CODE
// ==========================================

export function generateWhatsappCode(): string {
  const bytes = new Uint8Array(WHATSAPP_CODE_LENGTH);

  crypto.getRandomValues(bytes);

  let result = "GK-";

  for (const byte of bytes) {
    result += CODE_ALPHABET[byte % CODE_ALPHABET.length];
  }

  return result;
}

// ==========================================
// LOAD ATTRIBUTION
// ==========================================

export async function getWhatsappAttribution(): Promise<WhatsappAttribution> {
  if (attributionCache) {
    return attributionCache;
  }

  if (attributionPromise) {
    return attributionPromise;
  }

  attributionPromise = (async () => {
    const response = await fetch("/api/tracking/attribution", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil attribution");
    }

    const result = (await response.json()) as AttributionResponse;

    if (!result.success) {
      throw new Error("Response attribution tidak valid");
    }

    return {
      first: result.data?.first ?? null,
      last: result.data?.last ?? null,
      ga_client_id: result.data?.ga_client_id ?? null,
      ga_session_id: result.data?.ga_session_id ?? null,
    };
  })();

  try {
    const attribution = await attributionPromise;

    attributionCache = attribution;

    return attribution;
  } finally {
    attributionPromise = null;
  }
}

// ==========================================
// APPEND REFERENCE CODE
// ==========================================

// ==========================================
// APPEND WHATSAPP REFERENCE CODE
// ==========================================

export type WhatsappLocale = "id" | "en";

export function appendWhatsappCode(
  message: string,
  code: string,
  locale: WhatsappLocale = "id",
): string {
  const cleanMessage = message
    .replace(
      /(?:\r?\n){1,2}(?:Kode WA|Kode|Code):\s*GK-[A-Z0-9]{5}(?:[ \t]*\((?:mohon jangan dihapus ya|please keep this)\))?[ \t]*$/i,
      "",
    )
    .trim();

  const referenceText =
    locale === "en"
      ? `Code: ${code} (please keep this)`
      : `Kode: ${code} (mohon jangan dihapus ya)`;

  return cleanMessage ? `${cleanMessage}\n\n${referenceText}` : referenceText;
}

export function buildTrackedWhatsappUrl(
  originalUrl: string,
  code: string,
  locale: WhatsappLocale = "id",
): string {
  const url = new URL(originalUrl);

  const message = url.searchParams.get("text") ?? "";

  url.searchParams.set("text", appendWhatsappCode(message, code, locale));

  return url.toString();
}

// ==========================================
// POST WHATSAPP CLICK
// ==========================================

export async function trackWhatsappClick({
  code,
  ctaName,
  pagePath,
}: TrackWhatsappClickParams): Promise<void> {
  if (!apiUrl) {
    console.error(
      "[WhatsApp Tracking] NEXT_PUBLIC_BASE_URL_API belum dikonfigurasi",
    );
    return;
  }

  try {
    // Ambil GA ID sebelum operasi async agar cocok dengan waktu klik.
    const gaIdsAtClick = readGaIdsAtClick();
    const attribution = await getWhatsappAttribution();

    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}${WHATSAPP_TRACKING_PATH}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          page_path: pagePath,
          cta_name: ctaName,
          attribution: {
            ...attribution, // first dan last touch yang ada tetap dipakai.
            ...gaIdsAtClick, // GA ID harus berasal dari cookie saat klik.
          },
        }),
        keepalive: true,
        cache: "no-store",
      },
    );

    if (!response.ok) {
      console.error(
        "[WhatsApp Tracking] Gagal menyimpan klik:",
        response.status,
      );
    }
  } catch (error) {
    console.error("[WhatsApp Tracking] Error:", error);
  }
}
