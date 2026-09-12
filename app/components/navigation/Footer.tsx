"use client";
import { getCategoryList } from "@/app/api/products/getCategoryProductList.api";
import { CategoryPublic } from "@/app/types/categoryProduct.type";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Footer() {
  const locale = useLocale();
  const [categories, setCategories] = useState<CategoryPublic[]>([]);
  const t = useTranslations("Footer");
  const isEn = locale === "en";

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategoryList(locale);
      setCategories(data);
    };

    loadCategories();
  }, [locale]);
  return (
    <footer className="mt-auto w-full bg-[#1c1c1c] text-white pt-16 pb-8 border-t border-gray-800">
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
                    href="/faqs"
                    className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/policies"
                    className="hover:text-white transition-colors">
                    Our Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/best-price-guarantee"
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
              <h3 className="font-bold text-white mb-4">
                {isEn ? "Payment Method" : "Metode Pembayaran"}
              </h3>

              {/* Container daftar metode pembayaran yang lebih lengkap */}
              <div className="flex flex-col gap-4">
                {/* Baris 1: QRIS & E-Wallets */}
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative h-6 w-14 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/qris.png"
                      alt="QRIS"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="relative h-6 w-12 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/gopay_landscape.png"
                      alt="GoPay"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="relative h-6 w-14 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/shopeepay.png"
                      alt="ShopeePay"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                </div>

                {/* Baris 2: Virtual Accounts */}
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative h-5 w-10 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/bca.png"
                      alt="BCA"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="relative h-5 w-12 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/mandiri.png"
                      alt="Mandiri"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="relative h-5 w-10 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/bni.png"
                      alt="BNI"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="relative h-5 w-10 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/bri.png"
                      alt="BRI"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="relative h-5 w-14 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/permata_bank.png"
                      alt="Permata"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="relative h-5 w-14 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/cimbniaga.png"
                      alt="Cimb Niaga"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                </div>

                {/* Baris 3: Cards & Retail */}
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="relative h-5 w-8 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/visa.png"
                      alt="Visa"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="relative h-5 w-8 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/mastercard.png"
                      alt="Mastercard"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="relative h-5 w-12 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/alfamart.png"
                      alt="Alfamart"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="relative h-5 w-12 bg-white/10 p-1 rounded-sm">
                    <Image
                      src="/images/payment/indomaret.png"
                      alt="Indomaret"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Group: Marketplace */}
            <div>
              <h3 className="font-bold text-white mb-4">Marketplace</h3>
              <div className="flex gap-4">
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
