import {
  ATTRIBUTION_COOKIE,
  parseAttributionCookie,
} from "@/app/lib/tracking/attributionCookie";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getGaClientId(value?: string): string | null {
  if (!value) return null;

  const match = value.match(/^GA\d+\.\d+\.(\d+)\.(\d+)$/);

  return match ? `${match[1]}.${match[2]}` : null;
}

function getGaSessionId(value?: string): string | null {
  if (!value) return null;

  // Legacy GA4 session cookie.
  const legacy = value.match(/^GS1\.\d+\.(\d+)/);
  if (legacy) return legacy[1];

  // Modern GA4 session cookie.
  const modern = value.match(/^GS2\.\d+\.s(\d+)/);
  return modern?.[1] ?? null;
}

export async function GET() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const attribution = parseAttributionCookie(
    cookieStore.get(ATTRIBUTION_COOKIE)?.value,
  );

  const gaClientId = getGaClientId(cookieStore.get("_ga")?.value);

  const gaSessionId = getGaSessionId(cookieStore.get("_ga_V764HW819M")?.value);

  return NextResponse.json(
    {
      success: true,
      data: {
        first: attribution?.first ?? null,
        last: attribution?.last ?? null,

        ga_client_id: gaClientId,
        ga_session_id: gaSessionId,

        fbp: cookieStore.get("_fbp")?.value ?? null,
        fbc: cookieStore.get("_fbc")?.value ?? null,

        referrer: headerStore.get("referer") ?? null,
      },
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
