"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, ImageOff } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getClientLogos } from "../api/client-logos/getClientLogo.api";
import { getPublicEventCategories } from "../api/portfolio/getEventCategory.api";
import { BrandClient } from "../types/brandClient.type";
import { EventCategory } from "../types/eventCategory.type";

export default function PortfolioEventsAndClients() {
  const t = useTranslations("PortfolioSection");

  const [clients, setClients] = useState<BrandClient[]>([]);
  console.log("ini adalah data client", clients);

  const [isClientsLoading, setIsClientsLoading] = useState(true);
  const [events, setEvents] = useState<EventCategory[]>([]);
  const [isEventsLoading, setIsEventsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, eventsData] = await Promise.all([
          getClientLogos(),
          getPublicEventCategories(),
        ]);

        setClients(clientsData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsClientsLoading(false);
        setIsEventsLoading(false);
      }
    };

    fetchData();
  }, []);

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
              {t.rich("portfolioLabel", {
                br: () => <br />,
              })}
            </h3>
          </div>

          {/* --- KOLOM KANAN (CONTENT) --- */}
          <div className="lg:col-span-9">
            {/* Headline */}
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <h2 className="text-3xl md:text-4xl text-gray-900 leading-tight">
                {t.rich("portfolioHeadline", {
                  br: () => <br className="hidden md:block" />,
                })}
              </h2>

              {/* Tampilkan link See More hanya jika ada data */}
              {!isEventsLoading && events.length > 0 && (
                <Link
                  href="/occasions"
                  className="inline-flex items-center text-[#C4A48E] hover:text-[#a88b75] font-medium transition-colors mb-1">
                  {t("seeMore")} <ArrowUpRight className="ml-1 w-4 h-4" />
                </Link>
              )}
            </div>

            {/* Content Area (Carousel or Empty State) */}
            {isEventsLoading ? (
              <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full">
                <CarouselContent className="-ml-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <CarouselItem
                      key={i}
                      className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="w-full aspect-square bg-gray-100 animate-pulse mb-4 rounded-sm" />
                      <div className="h-6 bg-gray-100 animate-pulse w-3/4 mb-2 rounded-sm" />
                      <div className="h-4 bg-gray-100 animate-pulse w-1/2 rounded-sm" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            ) : events.length > 0 ? (
              <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full">
                <CarouselContent className="-ml-4">
                  {events.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <Link
                        href={`/occasions/${item.slug}`}
                        className="block group cursor-pointer">
                        {/* Kotak Gambar */}
                        <div className="w-full aspect-square bg-gray-100 mb-4 overflow-hidden relative rounded-sm">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>

                        {/* Teks Bawah */}
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#C4A48E] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 italic mt-1">
                          {t("orderedTimes", { count: item.orderCount })}
                        </p>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4 bg-white border-gray-300" />
                <CarouselNext className="hidden md:flex -right-4 bg-white border-gray-300" />
              </Carousel>
            ) : (
              // ✨ EMPTY STATE UNTUK EVENT
              <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-sm">
                <ImageOff className="w-8 h-8 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 font-medium">
                  No events available yet
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Check back later for updates.
                </p>
              </div>
            )}
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

          <div className="lg:col-span-9">
            {isClientsLoading ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 mb-6">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-100 animate-pulse rounded-sm w-full"
                  />
                ))}
              </div>
            ) : clients.length > 0 ? (
              <>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 mb-6">
                  {clients.map((client) => {
                    const imageContent = (
                      <div className="relative w-full h-full p-4 flex items-center justify-center bg-white border border-gray-100 hover:shadow-sm rounded-sm cursor-pointer grayscale hover:grayscale-0 transition-all duration-300">
                        <Image
                          src={client.logo}
                          alt={client.name || client.name}
                          fill
                          className="object-contain p-4"
                          sizes="(max-width: 768px) 33vw, 15vw"
                        />
                      </div>
                    );

                    return client.websiteUrl ? (
                      <a
                        key={client.id}
                        href={client.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="aspect-square w-full block">
                        {imageContent}
                      </a>
                    ) : (
                      <div key={client.id} className="aspect-square w-full">
                        {imageContent}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/clients"
                    className="inline-flex items-center text-[#C4A48E] hover:text-[#a88b75] font-medium text-sm transition-colors">
                    {t("andManyMore")} <ArrowUpRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </>
            ) : (
              // ✨ EMPTY STATE UNTUK CLIENTS
              <div className="w-full h-32 flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-200 rounded-sm">
                <p className="text-sm text-gray-400">
                  Client logos will appear here soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
