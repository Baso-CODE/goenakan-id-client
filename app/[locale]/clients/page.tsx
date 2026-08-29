"use client";

import { getClientLogos } from "@/app/api/client-logos/getClientLogo.api";
import { BrandClient } from "@/app/types/brandClient.type";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ImageOff } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function AllClientsPage() {
  const t = useTranslations("AllClients");

  const [clients, setClients] = useState<BrandClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        // Mengambil seluruh data klien tanpa batasan (slice)
        const clientsData = await getClientLogos();
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <main className="w-full min-h-screen bg-gray-50/50 py-10">
      <div className="container mx-auto px-4 md:px-6">
        {/* === TOMBOL KEMBALI === */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#C4A48E] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backButton")}
          </Link>
        </div>

        {/* === HEADER HALAMAN === */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            {t("title")}
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl">
            {t("subtitle")}
          </p>
        </div>

        {/* === KONTEN GRID CLIENTS === */}
        {isLoading ? (
          // Loading Skeleton: Menampilkan kerangka kotak berkedip saat data dimuat
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-200 animate-pulse rounded-lg w-full"
              />
            ))}
          </div>
        ) : clients.length > 0 ? (
          // Render Logo Clients
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {clients.map((client) => {
              const imageContent = (
                <div className="relative w-full h-full p-4 md:p-6 flex items-center justify-center bg-white border border-gray-100 hover:border-[#C4A48E]/30 hover:shadow-md rounded-lg cursor-pointer grayscale hover:grayscale-0 transition-all duration-300 group">
                  <Image
                    src={client.logo}
                    alt={client.name || "Client Logo"}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
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
        ) : (
          // Empty State: Jika tidak ada data client di database
          <div className="w-full h-64 flex flex-col items-center justify-center bg-white border border-dashed border-gray-200 rounded-xl">
            <ImageOff className="w-10 h-10 text-gray-300 mb-4" />
            <p className="text-gray-600 font-medium text-lg">
              {t("emptyStateTitle")}
            </p>
            <p className="text-sm text-gray-400 mt-1">{t("emptyStateDesc")}</p>
          </div>
        )}
      </div>
    </main>
  );
}
