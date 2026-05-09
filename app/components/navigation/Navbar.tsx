"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Globe,
  Menu,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { useLocale, useTranslations } from "next-intl";

import { useCartStore } from "@/app/store/useCartStore";
import { Link, usePathname, useRouter } from "@/i18n/routing";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const cartItems = useCartStore((state) => state.cartItems);
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("home"), href: "/" },
    { name: t("products"), href: "/products" },
    { name: t("about"), href: "/about" },
    { name: t("contact"), href: "/contact" },
    { name: t("article"), href: "/article" },
  ];

  // ✨ 4. Fungsi untuk mengubah bahasa
  const switchLanguage = (newLocale: "id" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out", // Ganti fixed jadi sticky
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6",
      )}>
      <div className="container ">
        <div className="flex items-center justify-between md:grid md:grid-cols-3">
          {/* --- 1. DESKTOP NAV --- */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-800 hover:text-black transition-colors tracking-wide">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* --- 2. LOGO (MOBILE) --- */}
          <div className="md:hidden flex">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                alt="Goenakan Logo"
                src={"/images/GG.png"}
                width={32}
                height={32}
              />
            </Link>
          </div>

          {/* --- 3. LOGO (DESKTOP) --- */}
          <div className="hidden md:flex justify-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                alt="Goenakan Logo"
                src={"/images/GG.png"}
                width={40}
                height={40}
              />
            </Link>
          </div>

          {/* --- 4. UTILITIES --- */}
          <div className="flex items-center justify-end gap-1 md:gap-2">
            {/* 🔄 5. TOMBOL BAHASA DESKTOP */}
            <div className="hidden sm:flex items-center gap-2 mr-2 md:mr-4 text-sm font-medium">
              <button
                onClick={() => switchLanguage("id")}
                className={cn(
                  "transition-colors",
                  locale === "id"
                    ? "text-black font-bold"
                    : "text-gray-400 hover:text-black",
                )}>
                ID
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => switchLanguage("en")}
                className={cn(
                  "transition-colors",
                  locale === "en"
                    ? "text-black font-bold"
                    : "text-gray-400 hover:text-black",
                )}>
                EN
              </button>
            </div>

            <Link href={"/profile"}>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hidden sm:flex">
                <User className="h-5 w-5 text-gray-800" />
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5 text-gray-800" />
            </Button>

            <div className="flex items-center gap-2">
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative group">
                  <ShoppingBag className="h-5 w-5 text-gray-800" />

                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#463b34] text-[10px] font-bold text-white transition-transform group-hover:scale-110">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* --- BURGER MENU (MOBILE) --- */}
            <div className="md:hidden ml-1">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-6 w-6 text-gray-900" />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="w-[85vw] sm:w-87.5 flex flex-col h-full p-0">
                  <SheetHeader className="p-6 border-b border-gray-100">
                    <SheetTitle className="text-left flex items-center gap-3">
                      <Image
                        alt="Logo"
                        src={"/images/GG.png"}
                        width={28}
                        height={28}
                      />
                      <span className="tracking-widest text-lg text-gray-900">
                        GOENAKAN
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="group flex items-center justify-between text-xl text-gray-800 hover:text-[#C4A48E] transition-colors pb-2 border-b border-transparent hover:border-gray-50">
                        {link.name}
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#C4A48E]" />
                      </Link>
                    ))}
                  </div>

                  <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                    <Link
                      href="/profile"
                      className="flex items-center gap-4 text-sm font-medium text-gray-600 hover:text-black transition-colors bg-white p-3 rounded-md shadow-sm border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span>{t("profile")}</span>
                    </Link>

                    {/* 🔄 6. TOMBOL BAHASA MOBILE */}
                    <div className="flex items-center justify-between text-sm font-medium text-gray-500 px-1">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>{t("language")}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => switchLanguage("id")}
                          className={
                            locale === "id"
                              ? "text-black font-bold"
                              : "hover:text-black"
                          }>
                          ID
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => switchLanguage("en")}
                          className={
                            locale === "en"
                              ? "text-black font-bold"
                              : "hover:text-black"
                          }>
                          EN
                        </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
