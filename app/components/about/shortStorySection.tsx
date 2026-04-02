import { ArrowUpRight, Linkedin } from "lucide-react";

// Data Mock untuk Owner agar kode lebih bersih
const OWNERS = [
  {
    name: "Nama owner",
    role: "Jabatan",
    linkedin: "#",
  },
  {
    name: "Nama owner",
    role: "Jabatan",
    linkedin: "#",
  },
];

export const ShortStorySection = () => {
  return (
    <section className=" bg-[#F8F8F8] py-16 px-6 md:px-12 ">
      <div className="max-w-6xl mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Kolom Kiri: Judul */}
          <div className="md:col-span-4">
            <h3 className="text-4xl md:text-5xl font-light  text-stone-900 inline-block leading-tight">
              Short <br /> Story
            </h3>
          </div>

          {/* Kolom Kanan: Deskripsi & Team */}
          <div className="md:col-span-8">
            <p className="text-lg text-slate-700 leading-relaxed mb-12 max-w-2xl mt-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            {/* Grid untuk Owner/Team */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {OWNERS.map((owner, index) => (
                <div key={index} className="flex flex-col group">
                  {/* Placeholder Gambar */}
                  <div className="aspect-4/5 bg-gray-200 mb-4 overflow-hidden">
                    {/* Nantinya bisa diganti dengan tag <img /> atau <Image /> Next.js */}
                    <div className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 bg-[#D9D9D9]" />
                  </div>

                  {/* Info Owner */}
                  <h3 className="text-xl font-medium">{owner.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{owner.role}</p>

                  {/* Footer Card: Read Bio & Social */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <a
                      href="#"
                      className="flex items-center text-xs text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest">
                      Read Bio <ArrowUpRight className="ml-1 w-3 h-3" />
                    </a>
                    <a
                      href={owner.linkedin}
                      className="text-slate-400 hover:text-blue-700 transition-colors">
                      <div className="bg-[#B8987E] p-0.5 rounded-sm">
                        {" "}
                        {/* Warna coklat kecil sesuai gambar */}
                        <Linkedin className="w-4 h-4 text-white fill-current" />
                      </div>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
