import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1c1c1c] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-8">
        {/* GRID UTAMA: 4 KOLOM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* --- KOLOM 1: BRAND INFO (Lebih lebar, ambil 4 kolom) --- */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            {/* Logo GD */}
            <div className="mb-2">
              <h2 className="text-3xl  text-white tracking-widest">
                GD <br />
                <span className="text-sm font-sans tracking-widest block mt-1 text-gray-400">
                  GOENAKAN INDONESIA
                </span>
              </h2>
            </div>

            {/* About Us Text */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">About us</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm text-justify">
                Goenakan Indonesia is a brand dedicated to creating a positive
                impact on the environment through sustainable and eco-friendly
                products—where sustainability meets style in every recyclable
                and reusable piece.
              </p>
            </div>
          </div>

          {/* --- KOLOM 2: COMPANY & EXPLORE (Ambil 2-3 kolom) --- */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            {/* Group: Company */}
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Group: Explore */}
            <div>
              <h3 className="font-bold text-white mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    href="/products"
                    className="hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/stainless"
                    className="hover:text-white transition-colors">
                    Stainless Steel Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/bamboo"
                    className="hover:text-white transition-colors">
                    Bamboo Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/wooden"
                    className="hover:text-white transition-colors">
                    Wooden Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/glass"
                    className="hover:text-white transition-colors">
                    Glass Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/mix"
                    className="hover:text-white transition-colors">
                    Mix Products
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* --- KOLOM 3: FOLLOW US & HELP (Ambil 2-3 kolom) --- */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Group: Follow Us */}
            <div>
              <h3 className="font-bold text-white mb-4">Follow Us</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tiktok
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Threads
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    X/Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Youtube
                  </a>
                </li>
              </ul>
            </div>

            {/* Group: Help */}
            <div>
              <h3 className="font-bold text-white mb-4">Help</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link
                    href="/categories"
                    className="hover:text-white transition-colors">
                    Product category
                  </Link>
                </li>
                <li>
                  <Link
                    href="/details"
                    className="hover:text-white transition-colors">
                    Product detail
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policy"
                    className="hover:text-white transition-colors">
                    Our Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="hover:text-white transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* --- KOLOM 4: PAYMENT & MARKETPLACE (Ambil sisa kolom) --- */}
          <div className="lg:col-span-3 flex flex-col gap-10">
            {/* Group: Payment Method */}
            <div>
              <h3 className="font-bold text-white mb-4">Payment Method</h3>
              <div className="flex flex-wrap gap-3">
                {/* Logo 1: QRIS */}
                <div className="relative h-16 w-20  overflow-hidden">
                  <Image
                    src="/images/footer/qris.png" // Pastikan path file sesuai
                    alt="QRIS"
                    fill
                    className="object-contain "
                  />
                </div>

                {/* Logo 2: VISA */}
                <div className="relative h-16 w-20  overflow-hidden">
                  <Image
                    src="/images/footer/visa.png"
                    alt="VISA"
                    fill
                    className="object-contain "
                  />
                </div>

                {/* Logo 3: BCA */}
                <div className="relative h-16 w-20  overflow-hidden">
                  <Image
                    src="/images/footer/bca.png"
                    alt="BCA"
                    fill
                    className="object-contain "
                  />
                </div>
              </div>
            </div>

            {/* Group: Marketplace */}
            <div>
              <h3 className="font-bold text-white mb-4">Marketplace</h3>
              <div className="flex gap-4">
                {/* Icon 1 (Misal: Shopee) */}
                <div className="relative w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/images/footer/shopee.png" // Ganti dengan path gambar kamu
                    alt="Shopee"
                    fill
                    className="object-contain" // Agar gambar pas di dalam kotak tanpa gepeng
                  />
                </div>

                {/* Icon 2 (Misal: Tokopedia) */}
                <div className="relative w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/images/footer/tokopedia.png" // Ganti dengan path gambar kamu
                    alt="Tokopedia"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- COPYRIGHT SECTION --- */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>Copyright © Goenakan Indonesia 2026</p>
          <div className="mt-2 md:mt-0 flex gap-4">
            {/* Link tambahan footer jika perlu */}
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
