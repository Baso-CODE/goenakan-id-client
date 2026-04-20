"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

// --- DATA DUMMY ---
// Ubah struktur data agar count menggunakan angka (number) untuk ditranslasi
const eventCategories = [
  {
    id: 1,
    title: "Wedding Souvenir",
    orderCount: 47,
    slug: "wedding-celebrations", // Tambahkan slug agar bisa diklik ke detail jika perlu
    image: "/images/events/wedding.jpg",
  },
  {
    id: 2,
    title: "Hotel Amenities",
    orderCount: 75,
    slug: "hospitality-amenities",
    image: "/images/events/hotel.jpg",
  },
  {
    id: 3,
    title: "Corporate Events",
    orderCount: 120,
    slug: "corporate-mice-community",
    image: "/images/events/corporate.jpg",
  },
  {
    id: 4,
    title: "Birthday Party",
    orderCount: 30,
    slug: "wedding-celebrations",
    image: "/images/events/birthday.jpg",
  },
];

const clients = Array.from({ length: 14 }).map((_, i) => ({ id: i }));

export default function PortfolioEventsAndClients() {
  // ✨ Panggil translasi
  const t = useTranslations("PortfolioSection");

  return (
    <section className="w-full py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        {/* =========================================
            BAGIAN 1: PORTFOLIO BY EVENT
           ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-32">
          {/* --- KOLOM KIRI (LABEL) --- */}
          <div className="lg:col-span-3">
            <h3 className="text-[#C4A48E] font-bold text-sm md:text-base uppercase tracking-wider border-b-2 border-[#C4A48E] inline-block pb-2 mb-4">
              {/* 🔄 Gunakan t.rich agar <br> di JSON berubah menjadi tag HTML asli */}
              {t.rich("portfolioLabel", {
                br: () => <br />,
              })}
            </h3>
          </div>

          {/* --- KOLOM KANAN (CONTENT) --- */}
          <div className="lg:col-span-9">
            {/* Headline */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight mb-4">
                {/* 🔄 Sama seperti di atas, kita render <br> khusus untuk layar medium ke atas */}
                {t.rich("portfolioHeadline", {
                  br: () => <br className="hidden md:block" />,
                })}
              </h2>

              {/* ✨ Ubah href menjadi /occasions sesuai halaman baru kita */}
              <Link
                href="/occasions"
                className="inline-flex items-center text-[#C4A48E] hover:text-[#a88b75] font-medium transition-colors">
                {t("seeMore")} <ArrowUpRight className="ml-1 w-4 h-4" />
              </Link>
            </div>

            {/* Carousel */}
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {eventCategories.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3">
                    {/* Kamu bisa membungkus ini dengan Link menuju /occasions/${item.slug} */}
                    <div className="group cursor-pointer">
                      {/* Kotak Gambar */}
                      <div className="w-full aspect-square bg-gray-200 mb-4 overflow-hidden relative">
                        <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500">
                          FOTO
                        </div>
                      </div>

                      {/* Teks Bawah */}
                      <h4 className="text-lg font-bold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 italic">
                        {/* 🔄 Render angka dinamis menggunakan JSON terjemahan */}
                        {t("orderedTimes", { count: item.orderCount })}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Navigasi (Panah) */}
              <CarouselPrevious className="hidden md:flex -left-4 bg-white border-gray-300" />
              <CarouselNext className="hidden md:flex -right-4 bg-white border-gray-300" />
            </Carousel>
          </div>
        </div>

        {/* =========================================
            BAGIAN 2: OUR CLIENTS
           ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* --- KOLOM KIRI (LABEL) --- */}
          <div className="lg:col-span-3">
            <h3 className="text-[#C4A48E] font-bold text-sm md:text-base uppercase tracking-wider border-b-2 border-[#C4A48E] inline-block pb-2 mb-4">
              {t("clientsLabel")}
            </h3>
          </div>

          {/* --- KOLOM KANAN (GRID LOGO) --- */}
          <div className="lg:col-span-9">
            {/* Grid Logo Client */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 mb-6">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="aspect-square bg-gray-200 hover:bg-gray-300 transition-colors w-full">
                  {/* Tempat Logo Client (Gunakan Image nanti) */}
                </div>
              ))}
            </div>

            {/* Link di kanan bawah */}
            <div className="flex justify-end">
              <Link
                href="/clients"
                className="inline-flex items-center text-[#C4A48E] hover:text-[#a88b75] font-medium text-sm transition-colors">
                {t("andManyMore")} <ArrowUpRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
