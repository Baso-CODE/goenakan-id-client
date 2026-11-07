"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import * as React from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";

import { HeroSlidePublic } from "../types/hero.type";

type HeroCarouselProps = {
  slides: HeroSlidePublic[];
};

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const locale = useLocale();

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  React.useEffect(() => {
    if (!api) return;

    const updateSelection = () => {
      setCurrent(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };

    updateSelection();

    api.on("select", updateSelection);
    api.on("reInit", updateSelection);

    return () => {
      api.off("select", updateSelection);
      api.off("reInit", updateSelection);
    };
  }, [api]);

  const customText = locale === "en" ? "Custom Now" : "Buat Custom";
  const productsText =
    locale === "en" ? "See All Products" : "Lihat Semua Produk";

  const renderContent = (
    title: string,
    ctaText?: string | null,
    ctaLink?: string | null,
  ) => {
    const primaryText = ctaText?.trim() || customText;
    const primaryHref = ctaLink?.trim() || "/products";

    return (
      <div className="relative z-20 flex h-full w-full items-end justify-center md:justify-start">
        <div
          className="
            relative
            w-full
            px-6
            pb-24
            text-center

            sm:px-10

            md:px-12
            md:pb-16
            md:text-left

            lg:px-16
            lg:pb-20

            xl:px-20
            xl:pb-24
          ">
          <div className="max-w-4xl">
            <h1
              className="
    font-serif
    font-normal
    text-white

    text-[32px]
    leading-[1.12]
    tracking-[-0.025em]

    sm:text-[38px]

    md:text-[44px]
    md:leading-[1.15]

    lg:text-[58px]
    lg:leading-[1.12]

    xl:text-[64px]

    max-w-[850px]
  "
              style={{
                fontWeight: 400,
                fontStyle: "normal",
                WebkitTextStroke: "0px",
                textShadow: "none",
              }}>
              {title}
            </h1>
            x
            <div
              className="
                mt-7
                flex
                w-full
                flex-col
                gap-3

                sm:mx-auto
                sm:max-w-[320px]

                md:mx-0
                md:mt-10
                md:max-w-none
                md:flex-row
                md:items-center
                md:gap-4
              ">
              {/* PRIMARY BUTTON */}
              <Link
                href={primaryHref as any}
                className="
                  inline-flex
                  h-12
                  w-full
                  items-center
                  justify-center

                  border
                  border-white
                  bg-white

                  px-8
                  text-sm
                  font-medium
                  text-neutral-950

                  transition-colors
                  duration-200

                  hover:bg-stone-100

                  md:h-14
                  md:w-auto
                  md:min-w-[190px]
                  md:px-10
                ">
                {primaryText}
              </Link>

              {/* SECONDARY BUTTON */}
              <Link
                href="/products"
                className="
                  inline-flex
                  h-12
                  w-full
                  items-center
                  justify-center

                  border
                  border-white/90
                  bg-transparent

                  px-8
                  text-sm
                  font-medium
                  text-white

                  transition-colors
                  duration-200

                  hover:bg-white/15

                  md:h-14
                  md:w-auto
                  md:min-w-[190px]
                  md:px-10
                ">
                {productsText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBackground = (
    desktopUrl: string,
    mobileUrl: string,
    tabletUrl: string,
    alt: string,
    priority: boolean,
  ) => (
    <>
      {/* MOBILE */}
      <div className="absolute inset-0 block md:hidden">
        <Image
          src={mobileUrl}
          alt={alt}
          fill
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* TABLET */}
      <div className="absolute inset-0 hidden md:block lg:hidden">
        <Image
          src={tabletUrl}
          alt={alt}
          fill
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* DESKTOP */}
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src={desktopUrl}
          alt={alt}
          fill
          priority={priority}
          fetchPriority={priority ? "high" : "auto"}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </>
  );

  const overlay = (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-10

        bg-gradient-to-t
        from-black/75
        via-black/20
        to-black/10

        md:bg-gradient-to-r
        md:from-black/55
        md:via-black/15
        md:to-black/5
      "
    />
  );

  const sectionClassName =
    "relative w-full h-[calc(100svh-92px)] min-h-[520px] overflow-hidden bg-stone-900";

  if (!slides?.length) {
    return (
      <section className={sectionClassName}>
        {renderBackground(
          "/images/hero/hero-1.png",
          "/images/hero/hero-1.png",
          "/images/hero/hero-1.png",
          "Goenakan Indonesia",
          true,
        )}

        {overlay}

        {renderContent(
          locale === "en"
            ? "Explore What You Can Create With Us"
            : "Jelajahi Kreasi Bersama Kami",
        )}
      </section>
    );
  }

  return (
    <section className={sectionClassName}>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: slides.length > 1,
        }}
        plugins={slides.length > 1 ? [plugin.current] : []}
        className="h-full w-full">
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem
              key={slide.id}
              className="
                relative
                h-[calc(100svh-92px)]
                min-h-[520px]
                w-full
                overflow-hidden
              ">
              {renderBackground(
                slide.imageUrl,
                slide.imageMobileUrl || slide.imageUrl,
                slide.imageTabletUrl || slide.imageUrl,
                slide.altText || slide.title,
                index === 0,
              )}

              {overlay}

              {renderContent(slide.title, slide.ctaText, slide.ctaLink)}
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* SLIDER INDICATORS */}
        {count > 1 && (
          <div
            className="
              absolute
              bottom-8
              left-1/2
              z-30

              flex
              -translate-x-1/2
              items-center
              gap-2

              md:bottom-10
              md:left-auto
              md:right-12
              md:translate-x-0

              lg:right-16
            ">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={current === index ? "true" : undefined}
                className={`
                  h-[3px]
                  w-9
                  cursor-pointer
                  transition-all
                  duration-300

                  ${
                    current === index
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/70"
                  }
                `}
              />
            ))}
          </div>
        )}
      </Carousel>
    </section>
  );
}
