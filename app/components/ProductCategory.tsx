import Link from "next/link";

// Data dummy kategori (bisa ditambah sesuai kebutuhan)
const categories = [
  { id: 1, name: "Bamboo", href: "/products/bamboo" },
  { id: 2, name: "Stainless Steel", href: "/products/stainless" },
  { id: 3, name: "Tote Bags", href: "/products/bags" }, // Contoh nama
  { id: 4, name: "Notebooks", href: "/products/notebooks" }, // Contoh nama
  { id: 5, name: "Apparel", href: "/products/apparel" }, // Contoh nama
  { id: 6, name: "Drinkware", href: "/products/drinkware" }, // Contoh nama
  { id: 7, name: "Tech Accessories", href: "/products/tech" }, // Contoh nama
  { id: 8, name: "Gift Sets", href: "/products/sets" }, // Contoh nama
];

export default function ProductCategory() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        {/* Judul Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl  text-gray-900 uppercase tracking-wide">
            Product Category
          </h2>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group relative block w-full aspect-square" // aspect-square membuat kotak selalu persegi
            >
              {/* Container Card
                 - transition-all duration-300: Animasi halus
                 - hover:scale-110: Membesar saat hover (Zoom effect)
                 - hover:shadow-2xl: Bayangan besar saat hover
                 - hover:z-10: Agar saat membesar, dia berada di atas elemen lain
              */}
              <div className="w-full h-full bg-gray-300 flex items-center justify-center transition-all duration-300 ease-out transform group-hover:scale-110 group-hover:shadow-2xl group-hover:z-10 cursor-pointer">
                {/* Placeholder Image (Jika nanti mau pakai gambar background) */}
                {/* <Image src={...} fill className="object-cover" /> 
                  Jangan lupa tambahkan 'relative' di div parent jika pakai Image fill
                */}

                {/* Teks Kategori */}
                <span className="text-white text-xl md:text-2xl font-bold  uppercase tracking-widest z-20 drop-shadow-md">
                  {category.name}
                </span>

                {/* Overlay Gelap Tipis (Opsional, agar teks makin jelas) */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
