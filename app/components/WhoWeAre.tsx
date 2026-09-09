"use client";

import { Button } from "@/components/ui/button";
import { BASE_DOMAIN } from "@/lib/config";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function WhoWeAre() {
  const t = useTranslations("WhoWeAre");

  const whatsappNumber = "6282387902238";

  const rawMessage = t("whatsappMessage", { domain: BASE_DOMAIN });
  const encodedMessage = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <section className="w-full py-20 bg-white text-gray-900">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Kolom Kiri */}
          <div className="md:col-span-4 relative">
            <Image
              src={"/images/who-we-are-image.png"}
              alt="who we are product"
              width={500}
              height={800}
              className="object-cover w-full h-auto"
            />
          </div>

          {/* Kolom Tengah */}
          <div className="md:col-span-5 flex flex-col justify-center py-10">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
              {t("subtitle")}
            </span>

            <h2 className="text-3xl md:text-4xl mb-4 leading-tight max-w-lg">
              {t("title")}
            </h2>

            <div className="text-gray-600 leading-relaxed mb-10 text-justify space-y-4">
              <p>{t("description1")}</p>
              <p>{t("description2")}</p>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-3 gap-4 mb-10 border-t border-gray-100 pt-8">
              <div>
                <h4 className="text-2xl font-bold">{t("stat1Value")}</h4>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {t("stat1Label")}
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-bold">{t("stat2Value")}</h4>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {t("stat2Label")}
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-bold">{t("stat3Value")}</h4>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {t("stat3Label")}
                </p>
              </div>
            </div>

            {/* Tombol WhatsApp */}
            <div>
              <Button
                asChild
                className="bg-[#C4A48E] hover:bg-[#b08e75] text-white rounded-none px-8 py-6 text-lg font-medium transition-all">
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer">
                  {t("button")}
                </Link>
              </Button>
            </div>
          </div>

          {/* Kolom Kanan (✨ Diperbarui menggunakan Image Next.js) */}
          <div className="md:col-span-3 md:mt-40 relative">
            <div className="relative w-full h-75 md:h-100 overflow-hidden">
              <Image
                src="/images/who-we-are-image-2.webp"
                alt="who we are secondary view"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
