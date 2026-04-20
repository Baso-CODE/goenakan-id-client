import { Button } from "@/components/ui/button";
// import Image from "next/image"; // Aktifkan jika sudah ada gambar asli

// ✨ 1. Import useTranslations dari next-intl
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function WhoWeAre() {
  // ✨ 2. Inisialisasi translation dengan mengarahkan ke object "WhoWeAre" di JSON
  const t = useTranslations("WhoWeAre");

  return (
    <section className="w-full py-20 bg-white text-gray-900">
      <div className="container mx-auto px-4 md:px-8">
        {/* Grid Container: 12 Kolom untuk Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* --- KOLOM KIRI (Gambar Tinggi) --- */}
          <div className="md:col-span-4 relative">
            <Image
              src={"/images/who-we-are-image.png"}
              alt="who we are product"
              width={500}
              height={800}
            />
          </div>

          {/* --- KOLOM TENGAH (Konten Teks) --- */}
          <div className="md:col-span-5 flex flex-col justify-center py-10">
            {/* 🔄 Subtitle */}
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
              {t("subtitle")}
            </span>

            {/* 🔄 Judul Utama */}
            <h2 className="text-3xl md:text-4xl mb-4 leading-tight max-w-lg">
              {t("title")}
            </h2>

            {/* 🔄 Deskripsi (Saya bagi jadi dua paragraf menggunakan div pembungkus berjarak space-y-4) */}
            <div className="text-gray-600 leading-relaxed mb-10 text-justify space-y-4">
              <p>{t("description1")}</p>
              <p>{t("description2")}</p>
            </div>

            {/* 🔄 Statistik */}
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

            {/* 🔄 Tombol CTA */}
            <div>
              <Button className="bg-[#C4A48E] hover:bg-[#b08e75] text-white rounded-none px-8 py-6 text-lg font-medium transition-all">
                {t("button")}
              </Button>
            </div>
          </div>

          {/* --- KOLOM KANAN (Gambar Pendek / Turun) --- */}
          <div className="md:col-span-3 md:mt-40 relative">
            <div className="bg-gray-200 w-full h-75 md:h-100 flex items-center justify-center">
              <span className="text-gray-500 font-bold tracking-widest">
                FOTO
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
