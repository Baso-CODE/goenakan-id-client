"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getPublicHeroSlides } from "../api/hero/getHero.api";
import { HeroSlidePublic } from "../types/hero.type";

export default function Hero() {
  const [slides, setSlides] = useState<HeroSlidePublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );
  if (isLoading) {
    return (
      <section className="relative w-full h-[calc(100vh-92px)] bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">
          Memuat konten...
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative w-full h-[calc(100vh-92px)] overflow-hidden bg-gray-50">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/hero/hero-1.png"
            alt="Default Hero Banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Konten Kiri-Kanan */}
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between px-6 md:px-20 lg:px-24">
          <div className="max-w-xl text-center md:text-left mt-15 md:mt-0">
            <h1 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 leading-tight font-normal">
              Where Ideas Become Custom Products.
            </h1>
          </div>

          <div className="mt-8 md:mt-0 mb-32 md:mb-0 w-full md:w-auto flex justify-center">
            <Button
              asChild
              className="bg-white hover:bg-gray-50 text-gray-900 rounded-full px-12 md:px-16 py-6 text-sm md:text-base shadow-sm group min-w-55 md:min-w-65 justify-between">
              <Link
                href="/products"
                className="flex items-center justify-center gap-4">
                <span>Custom Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[calc(100vh-92px)] overflow-hidden bg-gray-50">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin]}
        className="w-full h-full">
        {/* Pastikan Content juga h-full */}
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem
              key={slide.id}
              // ✨ KUNCI PERBAIKAN: Berikan tinggi pasti (calc) ke CarouselItem agar tidak menciut
              className="relative w-full h-[calc(100vh-92px)]">
              {/* === GAMBAR RESPONSIF === */}
              <div className="absolute inset-0 w-full h-full block md:hidden">
                <Image
                  src={slide.imageMobileUrl || slide.imageUrl}
                  alt={slide.altText || slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              <div className="absolute inset-0 w-full h-full hidden md:block lg:hidden">
                <Image
                  src={slide.imageTabletUrl || slide.imageUrl}
                  alt={slide.altText || slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              <div className="absolute inset-0 w-full h-full hidden lg:block">
                <Image
                  src={slide.imageUrl}
                  alt={slide.altText || slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              {/* ✨ KONTEN TEKS (KIRI) & TOMBOL (KANAN) */}
              <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between px-6 md:pl-24 md:pr-32">
                <div className="max-w-xl text-center md:text-left mt-32 md:mt-0 animate-in fade-in slide-in-from-left-8 duration-1000 ease-out fill-mode-forwards">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 leading-tight font-normal italic">
                    {slide.title}
                  </h1>
                </div>

                {slide.ctaText && (
                  <div className="mt-8 md:mt-0 mb-32 md:mb-0 animate-in fade-in slide-in-from-right-8 duration-1000 ease-out delay-300 fill-mode-forwards w-full md:w-auto flex justify-center">
                    {slide.ctaLink ? (
                      <Button
                        asChild
                        className="bg-white hover:bg-gray-50 text-gray-900 rounded-full px-12 md:px-16 py-6 text-sm md:text-base shadow-sm group transition-all min-w-55 md:min-w-65 justify-between">
                        <Link
                          href={slide.ctaLink}
                          className="flex items-center justify-center gap-4">
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    ) : (
                      <Button className="bg-white hover:bg-gray-50 text-gray-900 rounded-full px-12 md:px-16 py-6 text-sm md:text-base shadow-sm group transition-all min-w-55 md:min-w-65 justify-between">
                        <span className="flex items-center justify-center gap-4 w-full">
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 border-none hover:bg-white/80 transition-all cursor-pointer z-30" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 border-none hover:bg-white/80 transition-all cursor-pointer z-30" />
      </Carousel>
    </section>
  );
}
