"use client";

import { Button } from "@/components/ui/button";
import { BASE_DOMAIN } from "@/lib/config";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getWhoWeAreStats } from "../api/stats/getStatsOrder";

export default function WhoWeAre() {
  const t = useTranslations("WhoWeAre");

  const whatsappNumber = "6282387902238";

  const rawMessage = t("whatsappMessage", { domain: BASE_DOMAIN });
  const encodedMessage = encodeURIComponent(rawMessage);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // State untuk menyimpan data statistik dengan nilai awal terjemahan bawaan
  const [stats, setStats] = useState({
    stat1Value: t("stat1Value"),
    stat2Value: t("stat2Value"),
    stat3Value: t("stat3Value"),
  });
  useEffect(() => {
    const fetchStats = async () => {
      const data = await getWhoWeAreStats();

      if (data) {
        setStats({
          stat1Value: data.stat1Value,
          stat2Value: data.stat2Value,
          stat3Value: data.stat3Value,
        });
      }
    };

    fetchStats();
  }, []); // Array kosong memastikan hanya berjalan sekali saat pertama kali dimuat

  return (
    <section className="w-full py-20 bg-white text-gray-900">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Kolom Kiri: Gambar Utama */}
          <div className="md:col-span-5 relative">
            <Image
              src={"/images/who-we-are-image.png"}
              alt="who we are product"
              width={500}
              height={700}
              className="object-contain w-full h-auto rounded-sm shadow-sm"
            />
          </div>

          {/* Kolom Kanan: Teks, Statistik, dan Tombol */}
          <div className="md:col-span-7 flex flex-col justify-center py-6">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">
              {t("subtitle")}
            </span>

            <h2 className="text-3xl md:text-4xl font-serif mb-4 leading-tight">
              {t("title")}
            </h2>

            <div className="text-gray-600 leading-relaxed mb-8 text-justify space-y-4">
              <p>{t("description1")}</p>
              <p>{t("description2")}</p>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-3 gap-6 mb-8 border-t border-gray-100 pt-6">
              <div>
                {/* Menampilkan nilai dari state stats */}
                <h4 className="text-2xl font-bold">{stats.stat1Value}</h4>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {t("stat1Label")}
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-bold">{stats.stat2Value}</h4>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {t("stat2Label")}
                </p>
              </div>
              <div>
                <h4 className="text-2xl font-bold">{stats.stat3Value}</h4>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {t("stat3Label")}
                </p>
              </div>
            </div>

            {/* Tombol WhatsApp */}
            <div>
              <Button
                asChild
                className="bg-[#C4A48E] hover:bg-[#b08e75] text-white rounded-none px-8 py-6 text-sm font-medium transition-all">
                <Link
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer">
                  {t("button")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
