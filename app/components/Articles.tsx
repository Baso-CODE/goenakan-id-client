"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import * as React from "react";

// --- DATA DUMMY ---
// Data untuk Slider Banner Atas
const bannerSlides = [
  { id: 1, image: "/images/blog/banner-article.png" },
  { id: 2, image: "/images/blog/banner-article.png" },
  { id: 3, image: "/images/blog/banner-article.png" },
];

// Data untuk Grid Artikel (6 item sesuai gambar)
const articles = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: "15 Ide Hampers Premium Korporat: Eksklusif dan Tepat untuk Klien VIP",
  excerpt:
    "Dalam dunia bisnis yang kompetitif, menjaga hubungan dengan klien VIP memerlukan sentuhan khusus. Salah satunya melalui pemberian hampers yang personal dan mewah...",
  image: `/images/blog/article-${i + 1}.jpg`, // Placeholder path
}));

export default function Articles() {
  // Plugin untuk Autoplay Slider Banner
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );

  return (
    <section className="w-full bg-white pb-24">
      {/* =========================================
          BAGIAN 1: TOP SLIDER BANNER
         ========================================= */}
      <div className="w-full h-100 md:h-[500px] relative mb-16 bg-gray-100">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{ loop: true }}>
          <CarouselContent>
            {bannerSlides.map((slide) => (
              <CarouselItem
                key={slide.id}
                className="relative w-full h-100 md:h-[500px]">
                <div className="relative w-full h-full">
                  {/* Placeholder Background jika gambar belum ada */}
                  {/* <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold tracking-widest text-2xl">
                    BANNER IMAGE {slide.id}
                  </div> */}

                  <Image
                    src={slide.image}
                    alt="Blog Banner"
                    fill
                    className="object-cover"
                    priority={slide.id === 1}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Tombol Navigasi Slider (Opsional, bisa dihapus jika ingin polos) */}
          <CarouselPrevious className="left-4 bg-white/50 border-none hover:bg-white hidden md:flex" />
          <CarouselNext className="right-4 bg-white/50 border-none hover:bg-white hidden md:flex" />
        </Carousel>
      </div>

      {/* =========================================
          BAGIAN 2: ARTICLE GRID
         ========================================= */}
      <div className="container mx-auto px-4 md:px-8">
        {/* Judul Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl  text-gray-900 uppercase tracking-wide">
            Articles
          </h2>
        </div>

        {/* Grid Container (3 Kolom) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 mb-16">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group cursor-pointer flex flex-col h-full">
              {/* Gambar Artikel */}
              <div className="relative aspect-square w-full bg-gray-200 mb-6 overflow-hidden">
                {/* Placeholder Image */}
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                  FOTO ARTIKEL
                </div>
                {/* <Image 
                    src={article.image} 
                    alt={article.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                 /> 
                 */}
              </div>

              {/* Konten Teks */}
              <div className="flex flex-col grow">
                {/* Judul */}
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3 line-clamp-2 group-hover:text-[#C4A48E] transition-colors">
                  {article.title}
                </h3>

                {/* Deskripsi Singkat */}
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Read More */}
        <div className="flex justify-center">
          <Button className="bg-[#C4A48E] hover:bg-[#b08e75] text-white rounded-none px-10 py-6 text-base font-medium">
            Read more
          </Button>
        </div>
      </div>
    </section>
  );
}
