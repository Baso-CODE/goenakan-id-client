"use client";
import { PortfolioPublic } from "@/app/types/portfolioPublic.type";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { FileQuestion } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import * as React from "react";
import { useEffect, useState } from "react";
import { getPublicPortfolios } from "../api/portfolio/getPublicPorfolio";

export default function Portfolio() {
  const locale = useLocale();
  const t = useTranslations("PortfolioSection");

  const [portfolios, setPortfolios] = useState<PortfolioPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const plugin = React.useRef(
    Autoplay({
      delay: 2000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    }),
  );

  useEffect(() => {
    const fetchPortfolios = async () => {
      setIsLoading(true);
      const data = await getPublicPortfolios(locale);
      setPortfolios(data);
      setIsLoading(false);
    };
    fetchPortfolios();
  }, [locale]);

  return (
    <section className="w-full bg-white pb-20">
      {/* --- BAGIAN ATAS: Banner Image & Text --- */}
      <div className="relative w-full h-100 md:h-125 mb-16">
        <div className="absolute inset-0">
          <Image
            src="/images/portfolio.png"
            alt="Our Portfolio Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/40 to-black/90" />
        </div>

        <div className="absolute inset-0 container flex items-center justify-end">
          <h2 className="text-4xl md:text-7xl text-white tracking-widest uppercase text-right leading-tight">
            Our <br className="hidden md:block" /> Portfolio
          </h2>
        </div>
      </div>

      {/* --- BAGIAN BAWAH: Carousel Card atau Empty State --- */}
      <div className="container relative">
        {isLoading ? (
          <div className="w-full py-24 text-center text-stone-400">
            {t("loading")}
          </div>
        ) : portfolios.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full">
            <CarouselContent className="-ml-4">
              {portfolios.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-4 md:basis-1/3 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="border-none shadow-none bg-transparent">
                      <CardContent className="p-0">
                        <div className="relative aspect-4/5 w-full bg-gray-200 overflow-hidden mb-4 group cursor-pointer">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>

                        <div className="text-center">
                          <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 italic mt-1">
                            for{" "}
                            <span className="font-medium">
                              {item.clientName}
                            </span>
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="hidden md:flex -left-12 bg-white border-gray-200 hover:bg-gray-100" />
            <CarouselNext className="hidden md:flex -right-12 bg-white border-gray-200 hover:bg-gray-100" />
          </Carousel>
        ) : (
          <div className="w-full py-24 flex flex-col items-center justify-center border border-dashed border-stone-200 rounded-sm bg-stone-50/50">
            <FileQuestion className="w-12 h-12 text-stone-300 mb-4 stroke-[1.5]" />
            <h3 className="text-lg font-medium text-stone-600 tracking-wide uppercase">
              {t("emptyTitle")}
            </h3>
            <p className="text-stone-400 text-sm italic mt-1">
              {t("emptyDescription")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
