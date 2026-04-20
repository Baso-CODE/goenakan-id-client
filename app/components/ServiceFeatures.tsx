"use client";

import Image from "next/image";
// ✨ 1. Import Hover Card Shadcn UI
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
// ✨ 2. Import next-intl
import { useTranslations } from "next-intl";

const featuresConfig = [
  { id: 1, keyPrefix: "f1", icon: "/images/services/icon-1.png" },
  { id: 2, keyPrefix: "f2", icon: "/images/services/icon-2.png" },
  { id: 3, keyPrefix: "f3", icon: "/images/services/icon-3.png" },
  { id: 4, keyPrefix: "f4", icon: "/images/services/icon-4.png" },
  { id: 5, keyPrefix: "f5", icon: "/images/services/icon-5.png" },
  { id: 6, keyPrefix: "f6", icon: "/images/services/icon-2.png" },
];

export default function ServiceFeatures() {
  const t = useTranslations("ServiceFeatures");

  return (
    <section className="w-full py-32 bg-[#1E1E1E] border-b border-gray-100 ">
      <div className="container mx-auto px-4 md:px-8">
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-white leading-tight mb-6">
            {t("headline")}
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-3xl mx-auto">
            {t("subheadline")}
          </p>
        </div>

        {/* --- GRID ICONS --- */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-y-14 gap-x-6 items-start justify-center">
          {featuresConfig.map((feature) => (
            <HoverCard key={feature.id} openDelay={200} closeDelay={200}>
              <HoverCardTrigger asChild>
                <div className="flex flex-col items-center text-center group cursor-pointer">
                  {/* ICON */}
                  <div className="relative w-12 h-12 md:w-16 md:h-16 mb-5 transition-transform duration-300 group-hover:-translate-y-2">
                    <Image
                      src={feature.icon}
                      alt={t(`${feature.keyPrefix}Title`)}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xs md:text-sm font-bold text-gray-100 uppercase tracking-widest max-w-48 leading-relaxed group-hover:text-[#C4A48E] transition-colors">
                    {t(`${feature.keyPrefix}Title`)}
                  </h3>
                </div>
              </HoverCardTrigger>

              <HoverCardContent
                side="bottom"
                align="center"
                className="w-72 bg-white/95 backdrop-blur-sm border-none shadow-2xl p-5">
                {/* <h4 className="font-bold text-sm text-gray-900 mb-2 uppercase tracking-wide">
                  {t(`${feature.keyPrefix}Title`)}
                </h4> */}
                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                  {t(`${feature.keyPrefix}Desc`)}
                </p>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}
