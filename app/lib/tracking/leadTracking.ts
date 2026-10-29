import { pushDataLayer } from "./dataLayer";

// function normalizeEmail(email: string): string {
//   const normalized = email.trim().toLowerCase();
//   const atIndex = normalized.lastIndexOf("@");
//   if (atIndex < 0) return "";

//   const local = normalized.slice(0, atIndex);
//   const domain = normalized.slice(atIndex + 1);

//   if (domain === "gmail.com" || domain === "googlemail.com") {
//     return `${local.replace(/\./g, "")}@${domain}`;
//   }

//   return normalized;
// }

// function normalizePhone(phone: string): string {
//   const cleaned = phone.trim().replace(/[^\d+]/g, "");
//   let normalized = cleaned;

//   if (normalized.startsWith("0")) {
//     normalized = `+62${normalized.slice(1)}`;
//   } else if (normalized.startsWith("62")) {
//     normalized = `+${normalized}`;
//   }

//   if (!/^\+[1-9]\d{7,14}$/.test(normalized)) return "";
//   return normalized;
// }

// async function sha256(value: string): Promise<string> {
//   if (!crypto?.subtle) {
//     throw new Error("SHA-256 tidak tersedia");
//   }

//   const encoded = new TextEncoder().encode(value);
//   const buffer = await crypto.subtle.digest("SHA-256", encoded);

//   return Array.from(new Uint8Array(buffer))
//     .map((byte) => byte.toString(16).padStart(2, "0"))
//     .join("");
// }

// export interface LeadHashes {
//   sha256_email_address?: string;
//   sha256_phone_number?: string;
// }

// export async function prepareLeadHashes(
//   email: string,
//   phone: string,
// ): Promise<LeadHashes> {
//   const normalizedEmail = normalizeEmail(email);
//   const normalizedPhone = normalizePhone(phone);

//   const hashes: LeadHashes = {};

//   if (normalizedEmail) {
//     hashes.sha256_email_address = await sha256(normalizedEmail);
//   }

//   if (normalizedPhone) {
//     hashes.sha256_phone_number = await sha256(normalizedPhone);
//   }

//   return hashes;
// }

export function trackGenerateLead(leadId: number): void {
  if (!Number.isSafeInteger(leadId) || leadId <= 0) return;

  pushDataLayer({
    event: "generate_lead",
    event_id: `lead_${leadId}`,
    form_name: "contact_form",
    lead_id: leadId,
  });
}
