"use client";

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";

export default function Testimonials() {
  return (
    <section className="w-full py-24 bg-[#f9f9f9]">
      <div className="container mx-auto px-4 md:px-8">
        {/* --- HEADER SECTION --- */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl text-gray-900 mb-4">
            What they say about us
          </h2>
          <p className="text-gray-500 text-lg">
            with a huge number of clients served here&apos;s what they have say
          </p>
        </div>

        {/* --- GRID CONTAINER --- 
            Kita gunakan Grid 3 Kolom.
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ================= BARIS 1 ================= */}

          {/* 1. Testimoni 1 (Olivia) */}
          <Card className="border-none shadow-sm bg-white p-6 md:p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              {/* Header: Nama & Bintang */}
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Olivia</h4>
                  <p className="text-xs text-gray-400">CEO Company</p>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>
              {/* Isi Review */}
              <p className="text-gray-600 text-sm leading-relaxed">
                &quot;Goenakan Indonesia very very good, help us a lot with
                their high quality custom products. Thank you!&quot;
              </p>
            </div>
          </Card>

          {/* 2. Testimoni 2 (Pendek) */}
          <Card className="border-none shadow-sm bg-white p-6 md:p-8 flex flex-col justify-center">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-900 font-medium text-lg mb-6">
              &quot;Thanks&quot;
            </p>
            <div>
              <h4 className="font-bold text-sm text-gray-900">Olivia</h4>
              <p className="text-xs text-gray-400">CEO Company</p>
            </div>
          </Card>

          {/* 3. Stat Card Horizontal (300+ Brands) */}
          <Card className="border-none shadow-sm bg-white overflow-hidden flex flex-row h-full min-h-[160px]">
            <div className="relative w-1/2 bg-gray-200">
              <Image
                src="/images/testimonials/contoh.png"
                alt="Brands Served"
                fill
                className="object-cover"
              />
            </div>

            {/* BAGIAN KANAN: TEKS 
      - flex flex-col: Agar teks menumpuk ke bawah (Angka di atas, Label di bawah)
      - justify-center: Menengahkan secara vertikal
      - items-center: Menengahkan secara horizontal
  */}
            <div className="w-1/2 p-4 flex flex-col justify-center items-center text-center bg-white">
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                300+
              </h3>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                Brands Served
              </p>
            </div>
          </Card>

          {/* ================= BARIS 2 ================= */}

          {/* 4. Stat Card Vertical (500+ Customers) */}
          <Card className="border-none shadow-sm bg-white overflow-hidden flex flex-col h-full">
            {/* Bagian Foto Atas (Tinggi flex-grow agar mengisi ruang) */}
            <div className="grow bg-gray-200 min-h-[150px] flex items-center justify-center text-gray-400 text-sm font-medium">
              Foto
              {/* <Image src="..." fill className="object-cover" /> */}
            </div>
            {/* Bagian Teks Bawah */}
            <div className="p-6 flex items-center justify-between">
              <h3 className="text-4xl font-bold text-gray-900">500+</h3>
              <div className="text-right">
                <p className="text-sm text-gray-500 leading-tight">Customers</p>
                <p className="text-sm text-gray-500 leading-tight">Satisfied</p>
              </div>
            </div>
          </Card>

          {/* 5. Testimoni 3 (Olivia - Full) */}
          <Card className="border-none shadow-sm bg-white p-6 md:p-8 flex flex-col justify-center">
            <div className="mb-4">
              <h4 className="font-bold text-lg text-gray-900">Olivia</h4>
              <p className="text-xs text-gray-400">CEO Company</p>
            </div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              &quot;Goenakan Indonesia very very good, help us a lot with their
              high quality custom products. Thank you! and fast shipped&quot;
            </p>
          </Card>

          {/* 6. Testimoni 4 (Olivia - Full) */}
          <Card className="border-none shadow-sm bg-white p-6 md:p-8 flex flex-col justify-center">
            <div className="mb-4">
              <h4 className="font-bold text-lg text-gray-900">Olivia</h4>
              <p className="text-xs text-gray-400">CEO Company</p>
            </div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              &quot;Goenakan Indonesia very very good, help us a lot with their
              high quality custom products. Thank you! and fast shipped&quot;
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
