"use client";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import {
  buildTrackedWhatsappUrl,
  generateWhatsappCode,
  getWhatsappAttribution,
  trackWhatsappClick,
} from "@/app/lib/tracking/whatsappTracking";

// ==========================================
// CONFIG
// ==========================================

const SALES_WHATSAPP_NUMBER = "6282387902238";

// ==========================================
// HELPERS
// ==========================================

function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

function isSalesWhatsappLink(url: URL): boolean {
  const host = url.hostname.toLowerCase();

  if (host !== "wa.me" && host !== "www.wa.me" && host !== "api.whatsapp.com") {
    return false;
  }

  let phone = "";

  if (host === "api.whatsapp.com") {
    phone = url.searchParams.get("phone") ?? "";
  } else {
    phone = url.pathname.replace(/^\/+/, "").split("/")[0];
  }

  return normalizePhone(phone) === SALES_WHATSAPP_NUMBER;
}

// ==========================================
// RESOLVE CTA NAME
// ==========================================

const VALID_CTA_NAMES = [
  "floating_consultation",
  "home_custom_project",
  "product_request_quote",
  "product_description_b2b",
  "customize_request_whatsapp",
  "unknown_wa_cta",
] as const;

function getCtaName(anchor: HTMLAnchorElement): string {
  const ctaName = anchor.dataset.waCta;

  if (ctaName && VALID_CTA_NAMES.some((name) => name === ctaName)) {
    return ctaName;
  }

  return "unknown_wa_cta";
}
// ==========================================
// PROVIDER
// ==========================================

export default function WhatsAppTrackingProvider() {
  const locale = useLocale();

  useEffect(() => {
    // Prefetch attribution agar tersedia
    // saat pengguna membuka WhatsApp.
    void getWhatsappAttribution().catch((error) => {
      console.warn("[WhatsApp Tracking] Attribution preload gagal:", error);
    });

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a[href]");

      if (!(anchor instanceof HTMLAnchorElement)) {
        return;
      }

      // Tombol yang sengaja dikecualikan.
      if (anchor.dataset.waTracking === "ignore") {
        return;
      }

      let url: URL;

      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }

      // Hanya tracking WhatsApp Sales Goenakan.
      if (!isSalesWhatsappLink(url)) {
        return;
      }

      // ======================================
      // 1. GENERATE CODE
      // ======================================

      const code = generateWhatsappCode();

      // ======================================
      // 2. RESOLVE LOCALE
      // ======================================

      // ======================================
      // 3. BUILD URL
      // ======================================

      let trackedUrl: string;

      try {
        trackedUrl = buildTrackedWhatsappUrl(
          anchor.href,
          code,
          locale === "en" ? "en" : "id",
        );
      } catch (error) {
        console.error("[WhatsApp Tracking] Gagal membuat URL:", error);

        return;
      }

      // Ubah href sebelum navigasi browser.
      anchor.href = trackedUrl;

      // ======================================
      // 4. RESOLVE CTA
      // ======================================

      const ctaName = getCtaName(anchor);

      const pagePath = window.location.pathname;

      // ======================================
      // 5. SAVE CLICK TO BACKEND
      // ======================================

      void trackWhatsappClick({
        code,
        ctaName,
        pagePath,
      });
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [locale]);

  return null;
}
