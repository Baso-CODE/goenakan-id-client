"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

// Data dummy untuk portofolio
const portfolioItems = [
  {
    id: 1,
    title: "Eco Tumbler",
    client: "Bank BCA",
    image: "/images/portfolio/item-1.jpg", // Ganti dengan path gambarmu nanti
  },
  {
    id: 2,
    title: "Canvas Tote Bag",
    client: "Universitas Indonesia",
    image: "/images/portfolio/item-2.jpg",
  },
  {
    id: 3,
    title: "Premium Notebook",
    client: "Pertamina",
    image: "/images/portfolio/item-3.jpg",
  },
  {
    id: 4,
    title: "Bamboo Cutlery",
    client: "Tokopedia",
    image: "/images/portfolio/item-4.jpg",
  },
  {
    id: 5,
    title: "Corporate Gift Set",
    client: "Google Indonesia",
    image: "/images/portfolio/item-5.jpg",
  },
];

export default function Portfolio() {
  return (
    <section className="w-full bg-white pb-20">
      {/* --- BAGIAN ATAS: Banner Image & Text --- */}
      <div className="relative w-full h-[400px] md:h-[500px] mb-16">
        {/* Gambar Background */}
        <div className="absolute inset-0">
          {/* Ganti src ini dengan gambar header portofolio yang sudah kamu punya */}
          <Image
            src="/images/portfolio.png"
            alt="Our Portfolio Background"
            fill
            className="object-cover"
          />
          {/* Overlay Gradient Hitam */}
          {/* Ini membuat efek gelap di sebelah kanan agar tulisan putih terbaca jelas */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/40 to-black/90" />
        </div>

        {/* Tulisan OUR PORTFOLIO */}
        <div className="absolute inset-0 container mx-auto px-4 md:px-8 flex items-center justify-end">
          <h2 className="text-4xl md:text-7xl text-white tracking-widest uppercase text-right">
            Our <br className="hidden md:block" /> Portfolio
          </h2>
        </div>
      </div>

      {/* --- BAGIAN BAWAH: Carousel Card --- */}
      <div className="container mx-auto px-8 md:px-12 relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full">
          <CarouselContent className="-ml-4">
            {portfolioItems.map((item) => (
              // md:basis-1/3 artinya di layar desktop akan muncul 3 item sekaligus
              <CarouselItem
                key={item.id}
                className="pl-4 md:basis-1/3 lg:basis-1/3">
                <div className="p-1">
                  {/* Card Shadcn */}
                  <Card className="border-none shadow-none bg-transparent">
                    <CardContent className="p-0">
                      {/* Container Gambar Produk (Rasio 4:5 agar kotak agak tinggi) */}
                      <div className="relative aspect-[4/5] w-full bg-gray-200 overflow-hidden mb-4 group cursor-pointer">
                        {/* Placeholder Image */}
                        {/* <Image 
                              src={item.image} 
                              alt={item.title} 
                              fill 
                              className="object-cover transition-transform duration-500 group-hover:scale-110" 
                            /> */}
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          FOTO PRODUK
                        </div>
                      </div>

                      {/* Detail Teks di Bawah Gambar */}
                      <div className="text-center">
                        <h3 className="text-lg font-bold  text-gray-900 uppercase tracking-wide">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 italic mt-1">
                          for client{" "}
                          <span className="font-medium">{item.client}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Tombol Navigasi Kanan Kiri */}
          <CarouselPrevious className="hidden md:flex -left-12 bg-white border-gray-200 hover:bg-gray-100" />
          <CarouselNext className="hidden md:flex -right-12 bg-white border-gray-200 hover:bg-gray-100" />
        </Carousel>
      </div>
    </section>
  );
}
