"use client";

import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
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

import { HeroSlidePublic } from "../types/hero.type";

type HeroCarouselProps = {
  slides: HeroSlidePublic[];
};

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const plugin = React.useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  if (!slides?.length) {
    return (
      <section className="relative w-full h-[calc(100vh-92px)] overflow-hidden bg-gray-50">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-1.png"
            alt="Default Hero Banner"
            fill
            preload
            fetchPriority="high"
            sizes="100vw"
            className="object-cover"
          />
        </div>

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
        plugins={[plugin.current]}
        className="w-full h-full">
        <CarouselContent className="h-full">
          {slides.map((slide, index) => {
            const isFirstSlide = index === 0;

            return (
              <CarouselItem
                key={slide.id}
                className="relative w-full h-[calc(100vh-92px)]">
                {/* MOBILE */}
                <div className="absolute inset-0 block md:hidden">
                  <Image
                    src={slide.imageMobileUrl || slide.imageUrl}
                    alt={slide.altText || slide.title}
                    fill
                    preload={isFirstSlide}
                    fetchPriority={isFirstSlide ? "high" : "auto"}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                {/* TABLET */}
                <div className="absolute inset-0 hidden md:block lg:hidden">
                  <Image
                    src={slide.imageTabletUrl || slide.imageUrl}
                    alt={slide.altText || slide.title}
                    fill
                    preload={isFirstSlide}
                    fetchPriority={isFirstSlide ? "high" : "auto"}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                {/* DESKTOP */}
                <div className="absolute inset-0 hidden lg:block">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.altText || slide.title}
                    fill
                    preload={isFirstSlide}
                    fetchPriority={isFirstSlide ? "high" : "auto"}
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between px-6 md:pl-24 md:pr-32">
                  <div className="max-w-xl text-center md:text-left mt-32 md:mt-0">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 leading-tight font-normal italic">
                      {slide.title}
                    </h1>
                  </div>

                  {slide.ctaText && (
                    <div className="mt-8 md:mt-0 mb-32 md:mb-0 w-full md:w-auto flex justify-center">
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
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 border-none hover:bg-white/80 transition-all cursor-pointer z-30" />

        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 border-none hover:bg-white/80 transition-all cursor-pointer z-30" />
      </Carousel>
    </section>
  );
}
