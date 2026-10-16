"use client";

import { ArrowUpRight, MessageCircle, X } from "lucide-react";
import { useState } from "react";

type FloatingWhatsAppCTAProps = {
  locale?: "id" | "en" | string;
};

const WHATSAPP_NUMBER = "6282387902238";

const translations = {
  id: {
    online: "Siap membantu Anda",
    greeting: "Halo! Ada yang bisa MinGoena bantu?",
    description:
      "Konsultasikan kebutuhan produk, custom merchandise, dan pemesanan bulk order bersama tim Sales kami.",
    button: "Chat via WhatsApp",
    floatingLabel: "Konsultasi Gratis",
    close: "Tutup",
    message:
      "Halo MinGoena, saya ingin menanyakan informasi produk dan konsultasi pemesanan bulk order di Goenakan Indonesia.\n\nBisakah tim Sales membantu saya?",
  },
  en: {
    online: "We're here to help",
    greeting: "Hi! How can MinGoena help you?",
    description:
      "Ask about our products, custom merchandise, and bulk orders with our Sales team.",
    button: "Chat on WhatsApp",
    floatingLabel: "Free Consultation",
    close: "Close",
    message:
      "Hi MinGoena, I would like to inquire about product information and bulk order consultation at Goenakan Indonesia.\n\nCould someone from the Sales team assist me?",
  },
} as const;

export default function FloatingWhatsAppCTA({
  locale = "id",
}: FloatingWhatsAppCTAProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = locale.toLowerCase().startsWith("en")
    ? translations.en
    : translations.id;

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t.message)}`;

  const openWhatsApp = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      {isOpen && (
        <div
          role="dialog"
          aria-label="WhatsApp Consultation"
          className="w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.18)]">
          <div className="relative bg-[#075E54] px-5 py-5 text-white">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t.close}
              className="absolute right-3 top-3 rounded-full p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white">
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3 pr-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/20">
                <MessageCircle className="h-6 w-6" />
              </div>

              <div className="min-w-0">
                <p className="text-base font-semibold">MinGoena</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-white/85">
                  <span className="h-2 w-2 rounded-full bg-[#B9F6CA]" />
                  <span>{t.online}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="rounded-xl rounded-tl-sm bg-[#F0FDF4] px-4 py-3">
              <h3 className="text-sm font-semibold leading-6 text-slate-900">
                {t.greeting}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                {t.description}
              </p>
            </div>

            <button
              type="button"
              onClick={openWhatsApp}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1DB954] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2">
              <MessageCircle className="h-5 w-5" />
              <span>{t.button}</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? t.close : t.floatingLabel}
        aria-expanded={isOpen}
        className="group flex items-center gap-3 rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_8px_30px_rgba(37,211,102,0.3)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#1DB954] hover:shadow-[0_12px_36px_rgba(37,211,102,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 sm:px-5 sm:py-3.5">
        {isOpen ? (
          <X className="h-6 w-6 shrink-0" />
        ) : (
          <MessageCircle className="h-6 w-6 shrink-0" />
        )}
        <span className="hidden text-sm font-semibold sm:inline">
          {isOpen ? t.close : t.floatingLabel}
        </span>
      </button>
    </div>
  );
}
