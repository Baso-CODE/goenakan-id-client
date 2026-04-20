"use client"; // ✨ Wajib ada karena menggunakan useTranslations

import { Link } from "@/i18n/routing"; // 🔄 Ganti next/link dengan i18n routing kamu
import { useTranslations } from "next-intl"; // ✨ Import next-intl
import Image from "next/image";

interface PlanningLargerOrderProps {
  image?: string;
  imageAlt?: string;
  ctaHref?: string;
}

export function PlanningLargerOrder({
  image = "/images/article/banner-dummy.png",
  imageAlt = "Goenakan Indonesia Products",
  ctaHref = "/contact",
}: PlanningLargerOrderProps) {
  // ✨ Inisialisasi fungsi translasi
  const t = useTranslations("PlanningLargerOrder");

  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 min-h-130">
      {/* Left — Image */}
      <div className="relative w-full min-h-85 md:min-h-130 overflow-hidden bg-stone-100">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Right — Content */}
      <div className="flex flex-col justify-center px-12 py-16 bg-white">
        <div className="max-w-md">
          <h2 className="font-serif text-2xl md:text-3xl text-stone-900 leading-tight mb-6">
            {t("heading")}
          </h2>

          <div className="flex flex-col gap-4 mb-8">
            <p className="text-stone-600 text-base leading-relaxed">
              {t("paragraph1")}
            </p>
            <p className="text-stone-600 text-base leading-relaxed">
              {t("paragraph2")}
            </p>
          </div>

          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center border border-stone-800 text-stone-800 text-sm px-10 py-4 hover:bg-stone-800 hover:text-white transition-colors duration-200 w-full max-w-sm">
            {t("ctaLabel")}
          </Link>
        </div>
      </div>
    </section>
  );
}
