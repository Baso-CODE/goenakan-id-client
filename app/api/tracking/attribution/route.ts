import {
  ATTRIBUTION_COOKIE,
  parseAttributionCookie,
} from "@/app/lib/tracking/attributionCookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getGaClientId(value?: string): string | null {
  if (!value) return null;

  const match = value.match(/^GA\d+\.\d+\.(\d+)\.(\d+)$/);
  return match ? `${match[1]}.${match[2]}` : null;
}

function getGaSessionId(value?: string): string | null {
  if (!value) return null;

  const legacy = value.match(/^GS1\.\d+\.(\d+)/);
  if (legacy) return legacy[1];

  const modern = value.match(/^GS2\.\d+\.s(\d+)/);
  return modern?.[1] ?? null;
}

export async function GET() {
  const cookieStore = await cookies();

  const attribution = parseAttributionCookie(
    cookieStore.get(ATTRIBUTION_COOKIE)?.value,
  );

  // const referrer = headerStore.get("referer") || null;

  return NextResponse.json(
    {
      success: true,
      data: {
        first: attribution?.first ?? null,
        last: attribution?.last ?? null,
        ga_client_id: getGaClientId(cookieStore.get("_ga")?.value),
        ga_session_id: getGaSessionId(cookieStore.get("_ga_V764HW819M")?.value),
        fbp: cookieStore.get("_fbp")?.value ?? null,
        fbc: cookieStore.get("_fbc")?.value ?? null,
        referrer: attribution?.referrer ?? null,
      },
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
