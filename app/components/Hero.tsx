"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import * as React from "react";
import { useEffect, useState } from "react";
import { getPublicHeroSlides } from "../api/hero/getHero.api";
import { HeroSlidePublic } from "../types/hero.type";

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlidePublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data dari server saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await getPublicHeroSlides();
        setSlides(data);
      } catch (error) {
        console.error("Error loading hero slides:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  // Jika sedang loading atau data kosong, tampilkan placeholder sederhana
  if (isLoading) {
    return (
      <section className="relative w-full h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">
          Memuat konten...
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-gray-900">
        {/* Gambar Banner Cadangan (Fallback) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/hero/hero-1.png"
            alt="Default Hero Banner"
            fill
            className="object-cover opacity-90"
            priority
          />
        </div>

        {/* Konten Teks Cadangan */}
        <div className="relative z-10 container h-full flex items-center justify-between">
          <div className="max-w-xl -mt-24 md:-mt-40">
            <h1 className="text-4xl md:text-5xl text-gray-800 leading-tight font-bold">
              Where Ideas Become Custom Products.
            </h1>
          </div>

          <div className="hidden md:block mt-32 md:mt-64">
            <p className="text-3xl md:text-5xl italic text-gray-800">
              Custom Now
            </p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}>
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="relative w-full h-screen">
              {/* Gambar Background Full (Menggunakan imageUrl dari database) */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.imageUrl}
                  alt={slide.altText || slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              {/* Konten Teks */}
              <div className="relative z-10 container h-full flex items-center justify-between">
                <div className="max-w-xl -mt-24 md:-mt-40 animate-in fade-in slide-in-from-top-16 duration-1000 ease-out fill-mode-forwards">
                  <h1 className="text-3xl md:text-4xl text-gray-800 leading-tight italic">
                    {slide.title}
                  </h1>
                </div>

                {slide.ctaText && (
                  <div className="hidden md:block mt-32 md:mt-64 animate-in fade-in slide-in-from-bottom-16 duration-1000 ease-out delay-300 fill-mode-forwards">
                    {slide.ctaLink ? (
                      <Link
                        href={slide.ctaLink}
                        className="text-3xl md:text-5xl italic text-gray-800 hover:opacity-80 transition-opacity">
                        {slide.ctaText}
                      </Link>
                    ) : (
                      <p className="text-3xl md:text-5xl italic text-gray-800">
                        {slide.ctaText}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Tombol Navigasi */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 border-none hover:bg-white transition-all hover:scale-110 cursor-pointer" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 border-none hover:bg-white transition-all hover:scale-110 cursor-pointer" />
      </Carousel>

      {/* Indikator Slide Sederhana */}
      <div className="absolute bottom-10 right-10 flex gap-2 z-20">
        {slides.map((_, index) => (
          <div key={index} className="h-1 w-12 bg-white/60"></div>
        ))}
      </div>
    </section>
  );
}
