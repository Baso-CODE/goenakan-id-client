export interface AttributionPayload {
  first: Record<string, unknown> | null;
  last: Record<string, unknown> | null;
  ga_client_id: string | null;
  ga_session_id: string | null;
  fbp: string | null;
  fbc: string | null;
  referrer: string | null;
}

export async function getAttribution(): Promise<AttributionPayload | null> {
  try {
    const response = await fetch("/api/tracking/attribution", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });

    if (!response.ok) return null;

    const result = await response.json();

    return result.success ? result.data : null;
  } catch (error) {
    console.error("[ATTRIBUTION] Failed to load:", error);
    return null;
  }
}
