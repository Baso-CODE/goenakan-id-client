import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import Image from "next/image";
import { getPublicPortfolios } from "../api/portfolio/getPublicPorfolio";

export default async function Portfolio() {
  const portfolios = await getPublicPortfolios();

  if (portfolios.length === 0) return null;

  return (
    <section className="w-full bg-white pb-20">
      {/* --- BAGIAN ATAS: Banner Image & Text --- */}
      <div className="relative w-full h-100 md:h-125 mb-16">
        {/* Gambar Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/portfolio.png"
            alt="Our Portfolio Background"
            fill
            className="object-cover"
          />
          {/* Overlay Gradient Hitam */}
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
                        {/* Overlay tipis saat dihover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>

                      {/* Detail Teks di Bawah Gambar */}
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 italic mt-1">
                          for{" "}
                          <span className="font-medium">{item.clientName}</span>
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
