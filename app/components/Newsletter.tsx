"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { useTranslations } from "next-intl";

export default function Newsletter() {
  const t = useTranslations("Newsletter");

  return (
    <section className="w-full py-24 bg-white border-t border-gray-100">
      <div className="container ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* --- KOLOM KIRI (Teks) --- */}
          <div className="flex flex-col justify-center h-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight mb-6 max-w-lg">
              {t("headline")}
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              {t("subheadline")}
            </p>
          </div>

          {/* --- KOLOM KANAN (Formulir) --- */}
          <div className="flex flex-col gap-8 mt-4 md:mt-0">
            <div className="relative">
              <Input
                type="email"
                placeholder={t("placeholder")}
                className="w-full border-0 border-b border-gray-400 rounded-none px-0 py-6 text-lg focus-visible:ring-0 focus-visible:border-black placeholder:text-gray-400 placeholder:uppercase placeholder:tracking-widest"
              />
            </div>

            {/* Checkbox Terms */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                className="mt-1 rounded-none border-gray-400 data-[state=checked]:bg-black data-[state=checked]:text-white"
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-500 leading-snug cursor-pointer">
                {t("terms")}
              </label>
            </div>

            {/* Tombol Sign Up */}
            <div>
              <Button
                variant="outline"
                className="w-full md:w-auto px-12 py-6 text-base uppercase tracking-widest border-gray-900 text-gray-900 hover:bg-[#b08e75] hover:text-white rounded-none transition-all">
                {t("button")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
