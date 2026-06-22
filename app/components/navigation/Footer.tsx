"use client";
import { getCategoryList } from "@/app/api/products/getCategoryProductList.api";
import { CategoryPublic } from "@/app/types/categoryProduct.type";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Footer() {
  const [categories, setCategories] = useState<CategoryPublic[]>([]);
  const t = useTranslations("Footer");
  useEffect(() => {
    // 🔄 Gunakan fungsi service agar lebih rapi
    const loadCategories = async () => {
      const data = await getCategoryList();
      setCategories(data);
    };

    loadCategories();
  }, []);
  return (
    <footer className="w-full bg-[#1c1c1c] text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container ">
        {/* GRID UTAMA: 4 KOLOM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* --- KOLOM 1: BRAND INFO (Lebih lebar, ambil 4 kolom) --- */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            {/* Logo GD */}
            <div className="mb-2">
              <Image
                src={"/images/footer/geonakan-logo-footer.png"}
                alt="logo-goenakan-id-footer"
                width={200}
                height={200}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">
                {t("aboutUsTitle")}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm text-justify">
                {t("aboutUsDesc")}
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
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?category=${cat.id}`}
                      className="hover:text-white transition-colors capitalize">
                      {cat.name}
                    </Link>
                  </li>
                ))}
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
                    Best Price Guarantee
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
                {/* Shopee */}
                <a
                  href="https://shopee.co.id/goenakan.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/images/footer/shopee.png"
                    alt="Shopee"
                    fill
                    className="object-contain"
                  />
                </a>

                {/* Tokopedia */}
                <a
                  href="https://www.tokopedia.com/goenakanid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/images/footer/tokopedia.png"
                    alt="Tokopedia"
                    fill
                    className="object-contain"
                  />
                </a>

                {/* TikTok Shop */}
                <a
                  href="https://vt.tiktok.com/ZSQT9hvku/?page=Mall"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity">
                  <Image
                    src="/images/footer/tiktok.png"
                    alt="TikTok Shop"
                    fill
                    className="object-contain"
                  />
                </a>
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
