"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface AboutUsTimelineProps {
  backgroundImage?: string;
}

export function AboutUsTimeline({
  backgroundImage = "/images/about/bg-about-timeline.png",
}: AboutUsTimelineProps) {
  const t = useTranslations("AboutTimeline");

  const timelineKeys = ["item1", "item2", "item3", "item4"];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="About us background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/65 to-black/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-stone-400 text-xs tracking-widest uppercase mb-3">
            {t("tagline")}
          </p>
          <h1 className="text-white font-serif text-3xl md:text-5xl leading-tight whitespace-pre-line mb-6">
            {t("heading")}
          </h1>
          {/* Sub-heading baru untuk mengakomodasi teks paragraf di bawah judul */}
          <p className="text-stone-300 text-sm md:text-base leading-relaxed whitespace-pre-line max-w-2xl mx-auto">
            {t("subHeading")}
          </p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col">
          {timelineKeys.map((key, index) => {
            const year = t(`timeline.${key}.year`);
            const title = t(`timeline.${key}.title`);
            const description = t(`timeline.${key}.description`);

            return (
              <div key={index}>
                {/* Divider */}
                <div className="h-px bg-white/20 w-full" />

                <div className="grid grid-cols-[100px_1fr] gap-6 py-7">
                  {/* Date */}
                  <div className="flex flex-col justify-start">
                    <span className="text-white text-2xl font-light tracking-wide">
                      {year}
                    </span>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col gap-2">
                    {/* Render elemen <h3> HANYA jika title tidak kosong */}
                    {title && (
                      <h3 className="text-white font-medium text-base leading-snug">
                        {title}
                      </h3>
                    )}
                    <p className="text-stone-100 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Last divider */}
          <div className="h-px bg-white/20 w-full" />
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10">
          <Link
            href={t("buttonLink")}
            target="_blank"
            rel="noopener noreferrer"
            className="border hover:border-[#c4a882] hover:text-[#c4a882] text-white border-white bg-[#c6a28d] hover:bg-transparent text-sm px-8 py-3 rounded-sm transition-colors text-center">
            {t("buttonText")}
          </Link>
        </div>
      </div>
    </section>
  );
}
