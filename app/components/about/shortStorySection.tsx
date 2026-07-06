"use client";

import { ArrowUpRight, Linkedin } from "lucide-react";
import { useTranslations } from "next-intl";

export const ShortStorySection = () => {
  const t = useTranslations("ShortStory");

  const teamKeys = ["marisa", "nadya", "group"];

  return (
    <section className="bg-[#F8F8F8] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Kolom Kiri: Judul */}
          <div className="md:col-span-4">
            <h3 className="text-4xl md:text-5xl font-light text-stone-900 inline-block leading-tight whitespace-pre-line">
              {t("title")}
            </h3>
          </div>

          {/* Kolom Kanan: Deskripsi & Team */}
          <div className="md:col-span-8">
            <p className="text-lg text-slate-700 leading-relaxed mb-12 max-w-full mt-5">
              {t("description")}
            </p>

            {/* Grid untuk Owner/Team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {teamKeys.map((key, index) => {
                // Mengambil data spesifik dari JSON
                const name = t(`team.${key}.name`);
                const role = t(`team.${key}.role`);
                const bio = t(`team.${key}.bio`);
                const linkedin = t(`team.${key}.linkedin`);

                return (
                  <div key={index} className="flex flex-col group h-full">
                    {/* Placeholder Gambar */}
                    <div className="aspect-4/5 bg-gray-200 mb-4 overflow-hidden shrink-0">
                      <div className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 bg-[#D9D9D9]" />
                    </div>

                    {/* Info Owner */}
                    <h3 className="text-xl font-medium">{name}</h3>
                    <p className="text-slate-500 text-sm mb-3">{role}</p>

                    {/* Bio Teks */}
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed grow">
                      {bio}
                    </p>

                    {/* Footer Card: Read Bio & Social */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                      <button className="flex items-center text-xs text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest cursor-pointer">
                        {t("readBioText")}{" "}
                        <ArrowUpRight className="ml-1 w-3 h-3" />
                      </button>

                      {/* Hanya tampilkan ikon LinkedIn jika link-nya ada (tidak kosong) */}
                      {linkedin && (
                        <a
                          href={linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-700 transition-colors">
                          <div className="bg-[#B8987E] p-1 rounded-sm">
                            <Linkedin className="w-4 h-4 text-white fill-current" />
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
