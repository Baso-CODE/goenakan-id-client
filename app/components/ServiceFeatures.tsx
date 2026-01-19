"use client";

import Image from "next/image";

const features = [
  {
    id: 1,
    title: "Efficient Low MOQ Production",
    icon: "/images/services/icon-1.png",
  },
  {
    id: 2,
    title: "Free Shipping Indonesia",
    icon: "/images/services/icon-2.png",
  },
  {
    id: 3,
    title: "Fully Custom, No Limits.",
    icon: "/images/services/icon-3.png",
  },
  {
    id: 4,
    title: "WORLDWIDE ORDERS",
    icon: "/images/services/icon-4.png",
  },
  {
    id: 5,
    title: "ECO FRIENDLY AT OUR CORE",
    icon: "/images/services/icon-5.png",
  },
];

export default function ServiceFeatures() {
  return (
    <section className="w-full py-16 bg-[#1E1E1E] border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-12 gap-x-4 items-start justify-center">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center group cursor-default">
              {/* --- ICON --- */}
              <div className="relative w-12 h-12 md:w-16 md:h-16 mb-4 transition-transform duration-300 group-hover:-translate-y-1">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="text-xs md:text-sm font-bold  text-gray-100 uppercase tracking-widest max-w-40 leading-relaxed">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
