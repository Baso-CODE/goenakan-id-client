"use client";

import { useEffect } from "react";

import {
  buildTrackedWhatsappUrl,
  generateWhatsappCode,
  getWhatsappAttribution,
  trackWhatsappClick,
} from "@/app/lib/tracking/whatsappTracking";

// Nomor tujuan WhatsApp sales Goenakan.
const SALES_WHATSAPP_NUMBER = "6282387902238";

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

function getCtaName(anchor: HTMLAnchorElement): string {
  const explicitName = anchor.dataset.waCta;

  if (explicitName) {
    return explicitName;
  }

  const pathname = window.location.pathname;

  if (/\/products?\//.test(pathname)) {
    return "product_whatsapp";
  }

  if (/\/contact(?:\/|$)/.test(pathname)) {
    return "contact_whatsapp";
  }

  return "general_whatsapp";
}

export default function WhatsAppTrackingProvider() {
  useEffect(() => {
    // Prefetch attribution agar data sudah tersedia
    // ketika pengguna mengklik tombol WhatsApp.
    void getWhatsappAttribution().catch((error) => {
      console.warn("[WhatsApp Tracking] Attribution preload gagal:", error);
    });

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented) {
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

      if (anchor.dataset.waTracking === "ignore") {
        return;
      }

      let url: URL;

      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }

      if (!isSalesWhatsappLink(url)) {
        return;
      }

      const code = generateWhatsappCode();

      const trackedUrl = buildTrackedWhatsappUrl(anchor.href, code);

      // Ubah href sebelum browser menjalankan
      // navigasi bawaan link.
      anchor.href = trackedUrl;

      const ctaName = getCtaName(anchor);

      const pagePath = window.location.pathname;

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
  }, []);

  return null;
}
