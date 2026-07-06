"use client";

import { useTranslations } from "next-intl";

export function CoreValues() {
  // Memanggil kamus bahasa dengan awalan "CoreValues"
  const t = useTranslations("CoreValues");

  // Karena subheadline bisa saja kosong, kita simpan ke variabel dulu
  const subheading = t("subheading");

  // Array untuk 4 nilai pertama (Baris 1)
  const topValues = ["item1", "item2", "item3", "item4"];

  // Kunci untuk nilai ke-5 (Baris 2)
  const bottomValue = "item5";

  return (
    <section className="w-full border-t border-stone-200 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Bagian Kiri — Heading & Subheading */}
          <div className="flex flex-col justify-start gap-4 md:pr-8">
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 leading-tight whitespace-pre-line">
              {t("heading")}
            </h2>
            {/* Hanya tampilkan elemen <p> jika subheading ada isinya */}
            {subheading && (
              <p className="text-[#464646] text-md leading-relaxed">
                {subheading}
              </p>
            )}
          </div>

          {/* Bagian Kanan — Values Grid */}
          <div className="md:col-span-2">
            {/* Baris 1: 2 Kolom untuk item 1 sampai 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
              {topValues.map((key) => (
                <ValueCard
                  key={key}
                  title={t(`values.${key}.title`)}
                  description={t(`values.${key}.description`)}
                />
              ))}
            </div>

            {/* Baris 2: Item ke-5 sendirian di kiri */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 mt-10">
              <ValueCard
                title={t(`values.${bottomValue}.title`)}
                description={t(`values.${bottomValue}.description`)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Garis Pemisah (Bottom divider) */}
      <div className="max-w-5xl mx-auto mt-16 border-t border-stone-200" />
    </section>
  );
}

// Sub-komponen yang sudah disederhanakan untuk menerima judul dan deskripsi langsung
function ValueCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 border-t border-stone-200 pt-5">
      <h3 className="text-stone-800 font-lg text-lg leading-snug">{title}</h3>
      <p className="text-[#464646] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
