"use client";

import { PolicyCategory } from "@/app/types/policy.type";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

export interface PolicyPageProps {
  categories: PolicyCategory[];
  title?: string;
}

export function PolicyPage({
  categories = [],
  title = "Policies",
}: PolicyPageProps) {
  const locale = useLocale();
  const [activeId, setActiveId] = useState<number>(0);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(categories.length > 0 ? [categories[0]?.id] : []),
  );
  const policyRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    const handleScroll = () => {
      let current: number | null = null;
      categories.forEach((category) => {
        category.policies.forEach((policy) => {
          const el = policyRefs.current[policy.id];
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 140) current = policy.id;
          }
        });
      });
      if (current !== null) setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories]);

  const scrollToPolicy = (policyId: number, categoryId: number) => {
    // id adalah number
    const el = policyRefs.current[policyId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(policyId);
    }
    if (!expandedCategories.has(categoryId)) {
      setExpandedCategories(new Set([...expandedCategories, categoryId]));
    }
  };
  const toggleCategory = (categoryId: number) => {
    // id adalah number
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };
  if (!categories || categories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <p className="text-stone-500">No policies available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-12 pb-16">
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold text-stone-800 mb-3">{title}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 items-start">
          {/* ── Left: Quick Nav Sidebar ── */}
          <aside className="hidden lg:block sticky top-28 self-start max-h-[calc(100vh-120px)] overflow-y-auto">
            <p className="text-[12px] font-bold text-stone-700 uppercase tracking-widest mb-4">
              Quick Nav.
            </p>
            <div className="flex flex-col gap-1">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full text-left text-sm font-medium text-stone-700 hover:text-stone-900 py-2 flex items-center justify-between transition-colors group">
                    <span>
                      {locale === "id" ? category.nameId : category.nameEn}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${expandedCategories.has(category.id) ? "rotate-180" : ""}`}
                    />
                  </button>

                  {expandedCategories.has(category.id) && (
                    <ul className="pl-3 flex flex-col gap-1 border-l border-stone-200">
                      {category.policies.map((policy, index) => (
                        <li key={policy.id}>
                          <button
                            onClick={() =>
                              scrollToPolicy(policy.id, category.id)
                            }
                            className={`text-left text-xs leading-snug transition-colors py-1.5 ${
                              activeId === policy.id
                                ? "text-stone-900 font-semibold"
                                : "text-stone-500 hover:text-stone-700"
                            }`}>
                            {index + 1}.{" "}
                            {locale === "id" ? policy.titleId : policy.titleEn}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </aside>

          {/* ── Right: Content ── */}
          <div className="flex flex-col gap-8">
            {categories.map((category) => (
              <section key={category.id} className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-stone-800">
                  {locale === "id" ? category.nameId : category.nameEn}
                </h2>

                {category.descriptionId && (
                  <p className="text-stone-600 italic">
                    {locale === "id"
                      ? category.descriptionId
                      : category.descriptionEn}
                  </p>
                )}

                <div className="flex flex-col gap-4">
                  {category.policies.map((policy, index) => (
                    <div
                      key={policy.id}
                      ref={(el) => {
                        policyRefs.current[policy.id] = el;
                      }}
                      id={policy.id.toString()}
                      className="transition-all duration-200">
                      {/* Box Content - Warna tetap #463b34 tapi border hover lebih soft */}
                      <div className="bg-[#463b34] rounded-md border-2 border-transparent px-6 py-5 transition-all duration-200 hover:border-stone-400">
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-3">
                          <span className="text-stone-400 font-bold text-lg">
                            {index + 1}.
                          </span>
                          {locale === "id" ? policy.titleId : policy.titleEn}
                        </h3>
                        <div
                          className="[&>ol]:list-decimal [&>ol]:ml-6 [&>ul]:list-disc [&>ul]:ml-6 space-y-2 text-stone-100 text-sm"
                          dangerouslySetInnerHTML={{
                            __html:
                              locale === "id"
                                ? policy.contentId
                                : policy.contentEn,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
