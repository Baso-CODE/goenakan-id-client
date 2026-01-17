"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

// --- DATA DUMMY ---
const eventCategories = [
  {
    id: 1,
    title: "Wedding Souvenir",
    count: "ordered 47 times",
    image: "/images/events/wedding.jpg",
  },
  {
    id: 2,
    title: "Hotel Amenities",
    count: "ordered 75 times",
    image: "/images/events/hotel.jpg",
  },
  {
    id: 3,
    title: "Corporate Events",
    count: "ordered 120 times",
    image: "/images/events/corporate.jpg",
  },
  {
    id: 4,
    title: "Birthday Party",
    count: "ordered 30 times",
    image: "/images/events/birthday.jpg",
  },
];

// Buat array kosong isi 14 item untuk simulasi logo client
const clients = Array.from({ length: 14 }).map((_, i) => ({ id: i }));

export default function PortfolioEventsAndClients() {
  return (
    <section className="w-full py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto">
        {/* =========================================
            BAGIAN 1: PORTFOLIO BY EVENT
           ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-32">
          {/* --- KOLOM KIRI (LABEL) --- */}
          <div className="lg:col-span-3">
            <h3 className="text-[#C4A48E] font-bold text-sm md:text-base uppercase tracking-wider border-b-2 border-[#C4A48E] inline-block pb-2 mb-4">
              Portfolio Categorized <br /> by Event
            </h3>
          </div>

          {/* --- KOLOM KANAN (CONTENT) --- */}
          <div className="lg:col-span-9">
            {/* Headline */}
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl  text-gray-900 leading-tight mb-4">
                A curated selection of our custom{" "}
                <br className="hidden md:block" />
                products, organized by event type.
              </h2>

              <Link
                href="/portfolio"
                className="inline-flex items-center text-[#C4A48E] hover:text-[#a88b75] font-medium transition-colors">
                See more <ArrowUpRight className="ml-1 w-4 h-4" />
              </Link>
            </div>

            {/* Carousel */}
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4">
                {eventCategories.map((item) => (
                  <CarouselItem
                    key={item.id}
                    className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="group cursor-pointer">
                      {/* Kotak Gambar Abu-abu */}
                      <div className="w-full aspect-square bg-gray-200 mb-4 overflow-hidden relative">
                        {/* Placeholder Image - Ganti dengan <Image /> nanti */}
                        {/* <Image src={item.image} fill className="object-cover transition-transform duration-500 group-hover:scale-110" /> */}
                        <div className="w-full h-full flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500">
                          FOTO
                        </div>
                      </div>

                      {/* Teks Bawah */}
                      <h4 className="text-lg font-bold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500 italic">
                        {item.count}
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
              Our Clients
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
                and many more <ArrowUpRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
