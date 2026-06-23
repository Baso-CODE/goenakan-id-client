"use client";

import { BestPriceGuaranteeItem } from "@/app/types/bestPriceGuarantee.type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

export interface BestPricePageProps {
  title?: string;
  items: BestPriceGuaranteeItem[];
}

export function BestPricePage({
  title = "Best Price Guarantee",
  items = [],
}: BestPricePageProps) {
  const locale = useLocale();

  const [activeId, setActiveId] = useState<number | null>(null);
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      let current: number | null = null;
      items.forEach((item) => {
        const el = itemRefs.current[item.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          // Deteksi elemen yang masuk ke viewport atas
          if (rect.top <= 140) current = item.id;
        }
      });
      if (current !== null) setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToItem = (id: number) => {
    const el = itemRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  // Jika tidak ada data, tampilkan state kosong
  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500">
          {locale === "id"
            ? "Belum ada informasi Best Price Guarantee yang tersedia."
            : "No Best Price Guarantee information available yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-16 pb-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 items-start">
          {/* ── Left: Quick Nav Sidebar ── */}
          <aside className="hidden lg:block sticky top-28 self-start">
            <p className="text-[12px] font-bold text-stone-700 uppercase tracking-widest mb-4">
              Quick Nav.
            </p>
            <ol className="flex flex-col gap-2">
              {items.map((item, index) => {
                const itemTitle = locale === "id" ? item.titleId : item.titleEn;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToItem(item.id)}
                      className={`text-left text-sm leading-snug transition-colors hover:text-stone-900 ${
                        activeId === item.id
                          ? "text-stone-900 font-semibold" // Warna soft (stone) saat aktif
                          : "text-stone-400"
                      }`}>
                      {index + 1}. {itemTitle}
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* ── Right: Content ── */}
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-stone-800 mb-4">
              {title}
            </h1>

            <Accordion
              type="single"
              collapsible
              className="flex flex-col gap-3">
              {items.map((item) => {
                const itemTitle = locale === "id" ? item.titleId : item.titleEn;
                const itemContent =
                  locale === "id" ? item.contentId : item.contentEn;

                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[item.id] = el;
                    }}
                    id={item.id.toString()}>
                    <AccordionItem
                      value={item.id.toString()}
                      className={`bg-[#463b34] rounded-sm border px-5 transition-all duration-200 ${
                        activeId === item.id
                          ? "border-stone-400"
                          : "border-transparent"
                      }`}>
                      <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline py-4">
                        {itemTitle}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-stone-200">
                        <div
                          className="[&>ol]:list-decimal [&>ol]:ml-6 [&>ul]:list-disc [&>ul]:ml-6 space-y-2"
                          dangerouslySetInnerHTML={{ __html: itemContent }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                );
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
