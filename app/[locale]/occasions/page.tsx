import { getEventCategoryList } from "@/app/api/portfolio/getEventCategory.api";
import { Link } from "@/i18n/routing";
import { ImageOff } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function OccasionsPage() {
  const t = await getTranslations("Occasions");

  // ✨ Mendapatkan bahasa aktif saat ini dari server
  const locale = await getLocale();

  // ✨ Mengambil data dari API backend berdasarkan bahasa
  const categories = await getEventCategoryList(locale);

  return (
    <main className="w-full min-h-screen bg-white py-16 md:py-24">
      <div className="container ">
        {/* === Header Section === */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-16 mb-16">
          {/* Judul (Kiri) */}
          <h1 className="text-2xl md:text-2.8xl lg:text-[40px] font-normal text-gray-900 leading-tight lg:w-1/2">
            {t("title")}
          </h1>

          {/* Deskripsi (Kanan) */}
          <p className="text-base md:text-lg text-gray-800 leading-relaxed lg:w-1/2 lg:pt-3">
            {t("description")}
          </p>
        </div>

        {/* === Grid Section === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {categories.length > 0 ? (
            categories.map((category) => (
              <Link
                href={`/occasions/${category.slug}`}
                key={category.id}
                className="group block">
                <div className="flex flex-col items-center">
                  {/* Kotak Gambar */}
                  <div className="relative w-full aspect-square bg-[#E5E5E5] mb-5 overflow-hidden transition-all duration-300 group-hover:shadow-lg flex items-center justify-center">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      /* Fallback jika gambar tidak tersedia dari API */
                      <div className="flex flex-col items-center text-gray-400">
                        <ImageOff className="w-12 h-12 mb-2 stroke-[1.5]" />
                        <span className="text-sm font-medium uppercase tracking-wider">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Teks Judul Kategori */}
                  <h3 className="text-lg md:text-xl font-normal text-gray-900 text-center mb-1 group-hover:text-[#C4A48E] transition-colors">
                    {category.title}
                  </h3>

                  {/* Teks Subtitle (Jumlah Pesanan) */}
                  <p className="text-sm italic text-gray-600 text-center">
                    {t("orderedTimes", { count: category.orderCount || 0 })}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            /* Empty State jika API mengembalikan array kosong */
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-gray-500">
              Belum ada kategori yang tersedia saat ini.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
