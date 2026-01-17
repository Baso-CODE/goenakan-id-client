"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Data dummy produk (Disamakan dengan gambar referensi)
const products = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  name: "Custom Steel Tumbler",
  price: "Rp 19,900/pcs",
  minPrice: "Rp 17,900/pcs min. 100 pcs",
  sold: "1000 Sold",
  image: "/images/products/tumbler.jpg", // Ganti path ini nanti
}));

export default function BestSeller() {
  return (
    <section className="w-full py-20 bg-gray-50/50">
      <div className="container mx-auto px-4 md:px-8">
        {/* --- Header Section --- */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl text-gray-900 uppercase tracking-wide">
            Best Seller Products
          </h2>
        </div>

        {/* --- Grid Produk --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {products.map((product) => (
            <Card
              key={product.id}
              className="bg-white border border-gray-200 rounded-none shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer">
              <CardContent className="p-0">
                {/* Bagian Gambar */}
                <div className="relative aspect-square bg-white flex items-center justify-center border-b border-gray-100">
                  {/* Placeholder jika belum ada gambar */}
                  <div className="w-full h-full relative">
                    {/* <Image 
                          src={product.image} 
                          alt={product.name} 
                          fill 
                          className="object-contain p-8 group-hover:scale-105 transition-transform duration-500" 
                        /> */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                      <span className="text-xs uppercase tracking-widest">
                        Product Image
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bagian Informasi Produk */}
                <div className="p-6 text-left">
                  {/* Nama Produk */}
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {product.name}
                  </h3>

                  {/* Harga Satuan */}
                  <p className="text-sm text-gray-600 mb-1">{product.price}</p>

                  {/* Harga Grosir (Bold/Highlight) */}
                  <p className="text-sm font-semibold text-gray-900 mb-6">
                    {product.minPrice}
                  </p>

                  {/* Label Terjual (Kecil di bawah) */}
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    {product.sold}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- Tombol View All --- */}
        <div className="flex justify-center md:justify-end">
          <Button className="bg-[#C4A48E] hover:bg-[#b08e75] text-white rounded-none px-10 py-6 text-base uppercase tracking-widest">
            View All
          </Button>
        </div>
      </div>
    </section>
  );
}
