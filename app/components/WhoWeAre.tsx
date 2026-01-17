import { Button } from "@/components/ui/button";
// import Image from "next/image"; // Aktifkan jika sudah ada gambar asli

export default function WhoWeAre() {
  return (
    <section className="w-full py-20 bg-white text-gray-900">
      <div className="container mx-auto px-4 md:px-8">
        {/* Grid Container: 12 Kolom untuk Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* --- KOLOM KIRI (Gambar Tinggi) --- 
              md:col-span-4 artinya mengambil 4 bagian dari 12 kolom
          */}
          <div className="md:col-span-4 relative">
            {/* Placeholder Gambar (Ganti dengan <Image /> nanti) */}
            <div className="bg-gray-200 w-full h-[400px] md:h-[600px] flex items-center justify-center">
              <span className="text-gray-500 font-bold tracking-widest">
                FOTO
              </span>
            </div>
            {/* Contoh jika pakai Image Next.js:
            <div className="relative w-full h-[600px]">
               <Image src="/images/about-1.jpg" alt="About Us" fill className="object-cover" />
            </div>
            */}
          </div>

          {/* --- KOLOM TENGAH (Konten Teks) --- 
              md:col-span-5 artinya mengambil 5 bagian. 
              Kita beri padding top (pt) agar tidak terlalu nempel ke atas.
          */}
          <div className="md:col-span-5 flex flex-col justify-center py-10">
            {/* Label Kecil */}
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
              Who we are
            </span>

            {/* Judul Utama (Font Gilda Display) */}
            <h2 className="text-4xl md:text-5xl  mb-6 leading-tight">
              Where Ideas Become <br />
              Custom Products.
            </h2>

            {/* Deskripsi */}
            <p className="text-gray-600 leading-relaxed mb-10 text-justify">
              Goenakan Indonesia is a custom product vendor dedicated to turning
              ideas into tangible products. We work closely with our clients to
              deliver tailored solutions—crafted to meet specific needs, styles,
              and purposes. From concept to production, we make customization
              seamless and reliable.
            </p>

            {/* Statistik */}
            <div className="grid grid-cols-3 gap-4 mb-10 border-t border-gray-100 pt-8">
              <div>
                <h4 className="text-2xl font-bold ">300+</h4>
                <p className="text-xs text-gray-500 mt-1">Happy Customers</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold ">10,000+</h4>
                <p className="text-xs text-gray-500 mt-1">Products Created</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold ">500+</h4>
                <p className="text-xs text-gray-500 mt-1">Orders Completed</p>
              </div>
            </div>

            {/* Tombol CTA */}
            <div>
              <Button className="bg-[#C4A48E] hover:bg-[#b08e75] text-white rounded-none px-8 py-6 text-lg font-medium transition-all">
                Custom Yours Now
              </Button>
            </div>
          </div>

          {/* --- KOLOM KANAN (Gambar Pendek / Turun) --- 
              md:col-span-3 mengambil sisa ruang.
              mt-0 md:mt-32 kuncinya: di desktop dia akan turun jauh ke bawah (offset).
          */}
          <div className="md:col-span-3 md:mt-40 relative">
            {/* Placeholder Gambar Kanan */}
            <div className="bg-gray-200 w-full h-[300px] md:h-[400px] flex items-center justify-center">
              <span className="text-gray-500 font-bold tracking-widest">
                FOTO
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
