"use client"; // ✨ Wajib ada karena menggunakan useTranslations

import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Factory,
  MessageCircle,
  PenTool,
  Truck,
} from "lucide-react";

import { useTranslations } from "next-intl";

const stepsConfig = [
  {
    id: "01",
    keyPrefix: "step1",
    icon: MessageCircle,
  },
  {
    id: "02",
    keyPrefix: "step2",
    icon: PenTool,
  },
  {
    id: "03",
    keyPrefix: "step3",
    icon: Factory,
  },
  {
    id: "04",
    keyPrefix: "step4",
    icon: Truck,
  },
];

export default function HowItWorks() {
  // ✨ Panggil fungsi translasi untuk object "HowItWorks"
  const t = useTranslations("HowItWorks");

  return (
    <section className="w-full py-20 bg-[#f9f9f9]">
      <div className="container ">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl text-gray-900 uppercase tracking-wide mb-4">
            {t("headline")}
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">{t("subheadline")}</p>
        </div>

        {/* Steps Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {stepsConfig.map((step, index) => (
            <div key={step.id} className="relative group">
              <Card className="border-none shadow-none bg-transparent flex flex-col items-center text-center h-full">
                <CardContent className="p-0 flex flex-col items-center">
                  {/* Icon Wrapper dengan Nomor */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-8 h-8 text-[#C4A48E]" />
                    </div>

                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold ">
                      {step.id}
                    </div>
                  </div>

                  {/* Konten Teks */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t(`${step.keyPrefix}Title`)}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {t(`${step.keyPrefix}Desc`)}
                  </p>
                </CardContent>
              </Card>

              {index !== stepsConfig.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-4 transform translate-x-1/2 text-gray-300">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
