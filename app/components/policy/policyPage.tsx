"use client";

import { PolicyCategory } from "@/app/types/policy.type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale } from "next-intl";

export interface PolicyPageProps {
  categories: PolicyCategory[];
}

export function PolicyPage({ categories = [] }: PolicyPageProps) {
  const locale = useLocale(); // Mendapatkan locale aktif dari next-intl

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-20 text-stone-500">
        No policies available.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {categories.map((category) => (
          <section key={category.id} className="mb-12">
            {/* Kategori Title */}
            <h2 className="text-2xl font-bold text-stone-800 mb-6 border-b pb-2">
              {locale === "id" ? category.nameId : category.nameEn}
            </h2>

            {/* Deskripsi Kategori */}
            {category.descriptionId && (
              <p className="text-stone-600 mb-6 italic">
                {locale === "id"
                  ? category.descriptionId
                  : category.descriptionEn}
              </p>
            )}

            {/* List Policies per Kategori */}
            <Accordion
              type="single"
              collapsible
              className="flex flex-col gap-4">
              {category.policies.map((policy) => (
                <AccordionItem
                  key={policy.id}
                  value={`item-${policy.id}`}
                  className="bg-white border rounded-lg px-5 shadow-sm">
                  <AccordionTrigger className="text-left font-semibold text-stone-800 hover:no-underline">
                    {locale === "id" ? policy.titleId : policy.titleEn}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-600 leading-relaxed">
                    <div
                      className="[&>ol]:list-decimal [&>ol]:ml-6 [&>ul]:list-disc [&>ul]:ml-6 space-y-2"
                      dangerouslySetInnerHTML={{
                        __html:
                          locale === "id" ? policy.contentId : policy.contentEn,
                      }}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>
    </div>
  );
}
