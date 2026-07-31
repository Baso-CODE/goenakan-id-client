"use client";

import { FaqItem } from "@/app/types/faqLanding.type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export interface FaqPageProps {
  title?: string;
  faqs: FaqItem[];
}

export function FaqPage({
  title = "Frequently Asked Questions",
  faqs = [],
}: FaqPageProps) {
  const [activeId, setActiveId] = useState<string>("");
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const locale = useLocale();
  const t = useTranslations("Faq");

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      faqs.forEach((faq) => {
        const el = itemRefs.current[faq.id];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) current = faq.id;
        }
      });
      if (current) setActiveId(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [faqs]);

  const scrollToFaq = (id: string) => {
    const el = itemRefs.current[id];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  if (!faqs || faqs.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500">No FAQ available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-16 pb-16">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-10 items-start">
          <aside className="hidden lg:block sticky top-28 self-start">
            <p className="text-[12px] font-bold text-stone-700 uppercase tracking-widest mb-3">
              Quick Nav.
            </p>
            <ol className="flex flex-col gap-2">
              {faqs.map((faq, index) => {
                const question =
                  locale === "id"
                    ? faq.questionId || faq.questionEn
                    : faq.questionEn || faq.questionId;

                return (
                  <li key={faq.id}>
                    <button
                      onClick={() => scrollToFaq(faq.id)}
                      className={`text-left text-sm leading-snug transition-colors hover:text-stone-800 ${
                        activeId === faq.id
                          ? "text-stone-800 font-medium"
                          : "text-stone-400"
                      }`}>
                      {index + 1}. {question}
                    </button>
                  </li>
                );
              })}
            </ol>
          </aside>

          {/* ── Right: Content ── */}
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-semibold text-stone-800 mb-4">
              {title || t("title")}
            </h1>

            <Accordion
              type="single"
              collapsible
              className="flex flex-col gap-3">
              {faqs.map((faq) => {
                const question =
                  locale === "id"
                    ? faq.questionId || faq.questionEn
                    : faq.questionEn || faq.questionId;
                const answer =
                  locale === "id"
                    ? faq.answerId || faq.answerEn || ""
                    : faq.answerEn || faq.answerId || "";

                return (
                  <div
                    key={faq.id}
                    ref={(el) => {
                      itemRefs.current[faq.id] = el;
                    }}
                    id={faq.id}>
                    <AccordionItem
                      value={faq.id}
                      className={`bg-[#463b34] rounded-sm border px-5 transition-all duration-200 ${
                        activeId === faq.id
                          ? "border-blue-400"
                          : "border-transparent"
                      }`}>
                      <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline py-4">
                        {question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-white">
                        <div
                          className="[&>ol]:list-decimal [&>ol]:ml-6 [&>ul]:list-disc [&>ul]:ml-6 space-y-2"
                          dangerouslySetInnerHTML={{
                            __html: answer,
                          }}
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
