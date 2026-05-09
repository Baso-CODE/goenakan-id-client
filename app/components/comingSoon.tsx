"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Settings, Wrench } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UnderConstruction() {
  const t = useTranslations("UnderConstruction");

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-stone-50 px-4 text-center">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Ikon Animasi */}
        <div className="relative mb-8 flex items-center justify-center">
          <Settings className="w-24 h-24 text-stone-200 animate-[spin_5s_linear_infinite]" />
          <Wrench className="w-10 h-10 text-[#463b34] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Teks Konten */}
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-4 tracking-wide">
          {t("title")}
        </h1>

        <p className="text-sm md:text-base text-stone-500 leading-relaxed mb-8">
          {t("description")}
        </p>

        {/* Tombol Aksi */}
        <Button
          asChild
          className="bg-[#463b34] hover:bg-stone-800 text-white rounded-none px-8 py-6 text-xs font-bold uppercase tracking-[0.2em] transition-all">
          <Link href="/">{t("backHome")}</Link>
        </Button>
      </div>
    </div>
  );
}
