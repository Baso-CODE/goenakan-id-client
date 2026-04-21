"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getBestSellerProductsAPI } from "../api/products/getBestSellerProduct.api";
import { BestSellerProduct } from "../types/bestSellerProduct.type";

import { useTranslations } from "next-intl";

// Fungsi format Rupiah
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("IDR", "Rp")
    .trim();
}

export default function BestSeller() {
  const [products, setProducts] = useState<BestSellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const t = useTranslations("BestSeller");

  useEffect(() => {
    const fetchBestSellers = async () => {
      setIsLoading(true);
      const data = await getBestSellerProductsAPI();
      setProducts(data);
      setIsLoading(false);
    };

    fetchBestSellers();
  }, []);

  return (
    <section className="w-full py-20 bg-gray-50/50">
      <div className="container mx-auto px-4 md:px-8">
        {/* --- Header Section --- */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl text-gray-900 uppercase tracking-wide">
            {/* 🔄 3. Ganti teks statis */}
            {t("title")}
          </h2>
        </div>

        {/* --- Grid Produk --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {isLoading ? (
            /* --- Loading State (Skeleton) --- */
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-none shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-6">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-6" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            /* --- Data Produk Nyata --- */
            products.map((product) => (
              <Link
                href={`/products/${product.slug}`}
                key={product.id}
                className="group cursor-pointer">
                <Card className="bg-white border border-gray-200 rounded-none shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Bagian Gambar */}
                    <div className="relative aspect-square bg-white flex items-center justify-center border-b border-gray-100 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover p-4 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    {/* Bagian Informasi Produk */}
                    <div className="p-6 text-left flex flex-col grow">
                      <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      <p className="text-sm text-gray-400 line-through mb-1">
                        {/* 🔄 Ganti satuan pcs */}
                        {formatRupiah(product.regularPrice)}/{t("pcs")}
                      </p>

                      <p className="text-sm font-semibold text-gray-900 mb-6">
                        {/* 🔄 Ganti satuan pcs dan min */}
                        {formatRupiah(product.bulkPrice)}/{t("pcs")}{" "}
                        <span className="font-normal text-gray-500 text-xs ml-1">
                          {t("min")} {product.minOrder} {t("pcs")}
                        </span>
                      </p>

                      {/* Spacer agar tulisan 'Sold' selalu ada di bawah */}
                      <div className="mt-auto pt-4">
                        <p className="text-xs text-[#C4A48E] font-bold uppercase tracking-wider">
                          {/* 🔄 Ganti Sold / Terjual */}
                          {product.sold.toLocaleString("id-ID")} {t("sold")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            /* --- Empty State --- */
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
              {/* 🔄 Ganti pesan kosong */}
              {t("emptyState")}
            </div>
          )}
        </div>

        {/* --- Tombol View All --- */}
        <div className="flex justify-center md:justify-end">
          <Link href="/products">
            <Button className="bg-[#C4A48E] hover:bg-[#b08e75] text-white rounded-none px-10 py-6 text-base uppercase tracking-widest cursor-pointer transition-colors">
              {/* 🔄 Ganti tombol lihat semua */}
              {t("viewAll")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
