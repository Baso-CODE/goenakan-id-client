"use client";

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

export default function Hero() {
  const slides = [
    {
      id: 1,
      image: "/images/hero/hero-1.png",
      title: "Where Ideas Become Custom Products.",
      cta: "Custom Now",
    },
    {
      id: 2,
      image: "/images/hero/hero-1.png",
      title: "Where Ideas Become Custom Products.",
      cta: "Custom Now",
    },
    {
      id: 3,
      image: "/images/hero/hero-1.png",
      title: "Where Ideas Become Custom Products.",
      cta: "Custom Now",
    },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="relative w-full h-screen">
              {/* Gambar Background Full */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={slide.id === 1}
                />
              </div>

              {/* Konten Teks */}
              <div className="relative z-10 container  h-full  flex items-center justify-between">
                <div className="max-w-xl -mt-24 md:-mt-40 animate-in fade-in slide-in-from-top-16 duration-1000 ease-out fill-mode-forwards">
                  <h1 className="text-4xl md:text-5xl text-gray-800 leading-tight">
                    {slide.title}
                  </h1>
                </div>

                <div className="hidden md:block mt-32 md:mt-64 animate-in fade-in slide-in-from-bottom-16 duration-1000 ease-out delay-300 fill-mode-forwards">
                  <p className="text-3xl md:text-5xl italic text-gray-800">
                    {slide.cta}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Tombol Navigasi */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 border-none hover:bg-white transition-all hover:scale-110" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 border-none hover:bg-white transition-all hover:scale-110" />
      </Carousel>

      {/* Indikator Slide */}
      <div className="absolute bottom-10 right-10 flex gap-4 z-20">
        <div className="h-1 w-12 bg-gray-400"></div>
        <div className="h-1 w-12 bg-white"></div>
        <div className="h-1 w-12 bg-white"></div>
      </div>
    </section>
  );
}
