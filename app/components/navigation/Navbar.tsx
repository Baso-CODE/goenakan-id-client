"use client";

import CurrencySelector from "@/app/components/currency/CurrencySelector";
import { useCartStore } from "@/app/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  Globe,
  Menu,
  Search,
  ShoppingBag,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import * as React from "react";

export default function Navbar() {
  // ==========================================
  // STATE
  // ==========================================
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  // ==========================================
  // CART
  // ==========================================
  const cartItems = useCartStore((state) => state.cartItems);
  const totalItems = cartItems.length;

  // ==========================================
  // INTERNATIONALIZATION
  // ==========================================
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const isEnglish = locale === "en";

  // ==========================================
  // EFFECTS
  // ==========================================
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname, locale]);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ==========================================
  // NAVIGATION LINKS
  // ==========================================
  const navLinks = [
    {
      name: t("home"),
      href: "/",
    },
    {
      name: t("products"),
      href: "/products",
    },
    {
      name: t("about"),
      href: "/about",
    },
    {
      name: t("contact"),
      href: "/contact",
    },
    {
      name: t("article"),
      href: "/article",
    },
    {
      name: t("success-story"),
      href: "/success-story",
    },
  ];

  // ==========================================
  // HANDLERS
  // ==========================================
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const switchLanguage = (newLocale: "id" | "en") => {
    if (newLocale === locale) return;

    const queryString = window.location.search;

    router.replace(`${pathname}${queryString}`, {
      locale: newLocale,
      scroll: false,
    });

    setIsMobileMenuOpen(false);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchQuery.trim()) return;

    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);

    setIsSearchOpen(false);
    setSearchQuery("");
    setIsMobileMenuOpen(false);
  };

  // ==========================================
  // SHARED UTILITY BUTTON STYLE
  // ==========================================
  const utilityButtonClass =
    "h-9 w-9 shrink-0 rounded-full p-0 text-[#463B34] " +
    "transition-colors duration-200 hover:bg-stone-100 " +
    "hover:text-[#463B34] focus-visible:ring-2 " +
    "focus-visible:ring-[#C4A48E]/40";

  return (
    <header
      className={cn(
        "sticky top-0 left-0 right-0 z-50 w-full",
        "transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-white/95 py-3 shadow-[0_2px_15px_rgba(70,59,52,0.05)] backdrop-blur-xl"
          : "bg-transparent py-4 lg:py-5",
      )}>
      <div className="container">
        <div
          className="
            relative
            flex
            min-h-10
            items-center
            justify-between
            gap-3
            xl:grid
            xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]
            xl:gap-5
          ">
          {/* ==========================================
              1. DESKTOP NAVIGATION
          ========================================== */}
          <nav
            aria-label={isEnglish ? "Main navigation" : "Navigasi utama"}
            className="
              hidden
              min-w-0
              items-center
              gap-3
              xl:flex
              2xl:gap-6
            ">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="
                  group
                  relative
                  whitespace-nowrap
                  text-[13px]
                  font-medium
                  tracking-wide
                  text-stone-700
                  transition-colors
                  duration-200
                  hover:text-[#463B34]
                  2xl:text-sm
                ">
                {link.name}

                <span
                  aria-hidden="true"
                  className="
                    absolute
                    -bottom-1.5
                    left-0
                    h-px
                    w-full
                    origin-left
                    scale-x-0
                    bg-[#C4A48E]
                    transition-transform
                    duration-300
                    group-hover:scale-x-100
                  "
                />
              </Link>
            ))}
          </nav>

          {/* ==========================================
              2. MOBILE & TABLET LOGO
          ========================================== */}
          <div className="flex shrink-0 items-center xl:hidden">
            <Link
              href="/"
              aria-label="Goenakan Indonesia"
              className="transition-opacity duration-200 hover:opacity-75">
              <Image
                alt="Goenakan Logo"
                src="/images/GG.png"
                width={34}
                height={34}
                className="h-[34px] w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* ==========================================
              3. DESKTOP CENTER LOGO
          ========================================== */}
          <div className="hidden shrink-0 items-center justify-center xl:flex">
            <Link
              href="/"
              aria-label="Goenakan Indonesia"
              className="transition-opacity duration-200 hover:opacity-75">
              <Image
                alt="Goenakan Logo"
                src="/images/GG.png"
                width={44}
                height={44}
                className="h-11 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* ==========================================
              4. RIGHT UTILITIES
          ========================================== */}
          <div
            className="
              flex
              min-w-0
              items-center
              justify-end
              gap-0.5
              sm:gap-1.5
              xl:gap-2
            ">
            {/* ======================================
                CURRENCY & LANGUAGE
            ====================================== */}
            <div className="flex shrink-0 items-center gap-2 xl:mr-2 xl:gap-3">
              {/* CURRENCY SELECTOR */}
              <CurrencySelector />

              {/* DESKTOP DIVIDER */}
              <span
                aria-hidden="true"
                className="hidden h-5 w-px shrink-0 bg-stone-200 xl:block"
              />

              {/* DESKTOP LANGUAGE SWITCHER */}
              <div className="hidden h-9 items-center gap-2 font-sans text-[12px] tracking-wide xl:flex">
                <button
                  type="button"
                  aria-label="Bahasa Indonesia"
                  aria-pressed={locale === "id"}
                  onClick={() => switchLanguage("id")}
                  className={cn(
                    "cursor-pointer rounded-sm px-1 py-1 transition-colors duration-200",
                    locale === "id"
                      ? "font-semibold text-[#463B34]"
                      : "font-medium text-stone-400 hover:text-[#463B34]",
                  )}>
                  ID
                </button>

                <span aria-hidden="true" className="h-3 w-px bg-stone-200" />

                <button
                  type="button"
                  aria-label="English"
                  aria-pressed={locale === "en"}
                  onClick={() => switchLanguage("en")}
                  className={cn(
                    "cursor-pointer rounded-sm px-1 py-1 transition-colors duration-200",
                    locale === "en"
                      ? "font-semibold text-[#463B34]"
                      : "font-medium text-stone-400 hover:text-[#463B34]",
                  )}>
                  EN
                </button>
              </div>
            </div>

            {/* ======================================
                DESKTOP PROFILE
            ====================================== */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={cn(utilityButtonClass, "hidden xl:inline-flex")}>
              <Link
                href="/profile"
                aria-label={isEnglish ? "My account" : "Akun saya"}>
                <User className="h-[18px] w-[18px]" strokeWidth={1.7} />
              </Link>
            </Button>

            {/* ======================================
                SEARCH
            ====================================== */}
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={isEnglish ? "Search products" : "Cari produk"}
                  className={utilityButtonClass}>
                  <Search className="h-[18px] w-[18px]" strokeWidth={1.7} />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="end"
                sideOffset={14}
                className="
                  z-[60]
                  w-[320px]
                  max-w-[calc(100vw-2rem)]
                  rounded-xl
                  border
                  border-stone-200
                  bg-white
                  p-4
                  font-sans
                  shadow-[0_12px_40px_rgba(70,59,52,0.10)]
                ">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-stone-800">
                    {isEnglish ? "Find a product" : "Temukan produk"}
                  </p>

                  <p className="mt-1 text-[11px] leading-relaxed text-stone-500">
                    {isEnglish
                      ? "Explore our custom merchandise collections."
                      : "Jelajahi koleksi merchandise custom kami."}
                  </p>
                </div>

                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center gap-2">
                  <Input
                    type="search"
                    aria-label={
                      isEnglish ? "Product search" : "Pencarian produk"
                    }
                    placeholder={
                      isEnglish ? "Search product..." : "Cari produk..."
                    }
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="
                      h-10
                      min-w-0
                      rounded-md
                      border-stone-200
                      bg-stone-50
                      text-xs
                      focus-visible:ring-1
                      focus-visible:ring-[#C4A48E]
                    "
                    autoFocus
                  />

                  <Button
                    type="submit"
                    size="icon"
                    aria-label={isEnglish ? "Search" : "Cari"}
                    className="
                      h-10
                      w-10
                      shrink-0
                      cursor-pointer
                      rounded-md
                      bg-[#463B34]
                      text-white
                      hover:bg-[#605047]
                    ">
                    <Search className="h-4 w-4" strokeWidth={1.7} />
                  </Button>
                </form>
              </PopoverContent>
            </Popover>

            {/* ======================================
                SHOPPING CART
            ====================================== */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className={cn(utilityButtonClass, "group relative")}>
              <Link
                href="/cart"
                aria-label={
                  isEnglish
                    ? `Shopping cart, ${totalItems} items`
                    : `Keranjang belanja, ${totalItems} produk`
                }>
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.7} />

                {totalItems > 0 && (
                  <span
                    className="
                      absolute
                      -right-0.5
                      -top-0.5
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-[#463B34]
                      px-0.5
                      font-sans
                      text-[9px]
                      font-semibold
                      leading-none
                      text-white
                      transition-transform
                      duration-200
                      group-hover:scale-110
                    ">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
            </Button>

            {/* ======================================
                MOBILE & TABLET MENU
            ====================================== */}
            <div className="shrink-0 xl:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={isEnglish ? "Open navigation" : "Buka navigasi"}
                    className={utilityButtonClass}>
                    <Menu className="h-5 w-5" strokeWidth={1.7} />
                  </Button>
                </SheetTrigger>

                <SheetContent
                  side="left"
                  className="
                    flex
                    h-full
                    w-[85vw]
                    max-w-[380px]
                    flex-col
                    gap-0
                    border-r
                    border-stone-200
                    bg-white
                    p-0
                  ">
                  {/* ==============================
                      MOBILE MENU HEADER
                  ============================== */}
                  <SheetHeader className="border-b border-stone-100 px-6 py-7">
                    <SheetTitle className="flex items-center text-left">
                      <Image
                        alt="Goenakan Indonesia"
                        src="/images/gg-nav-menu.webp"
                        width={128}
                        height={80}
                        className="h-auto w-32 object-contain"
                      />
                    </SheetTitle>

                    <p className="mt-2 text-left font-sans text-[11px] uppercase tracking-[0.15em] text-stone-400">
                      {isEnglish ? "Explore Goenakan" : "Jelajahi Goenakan"}
                    </p>
                  </SheetHeader>

                  {/* ==============================
                      MOBILE NAVIGATION LINKS
                  ============================== */}
                  <nav
                    aria-label={
                      isEnglish ? "Mobile navigation" : "Navigasi mobile"
                    }
                    className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className="
                          group
                          flex
                          items-center
                          justify-between
                          border-b
                          border-stone-100
                          py-4
                          text-lg
                          font-medium
                          text-stone-800
                          transition-colors
                          duration-200
                          hover:text-[#A38773]
                        ">
                        <span>{link.name}</span>

                        <ChevronRight
                          strokeWidth={1.5}
                          className="
                            h-4
                            w-4
                            text-stone-400
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                            group-hover:text-[#A38773]
                          "
                        />
                      </Link>
                    ))}
                  </nav>

                  {/* ==============================
                      MOBILE ACCOUNT & LANGUAGE
                  ============================== */}
                  <div
                    className="
                      shrink-0
                      space-y-4
                      border-t
                      border-stone-200
                      bg-[#FAF9F7]
                      p-5
                      font-sans
                    ">
                    {/* PROFILE */}
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="
                        group
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        border
                        border-stone-200
                        bg-white
                        p-3
                        text-sm
                        font-medium
                        text-stone-700
                        transition-colors
                        duration-200
                        hover:border-[#C4A48E]
                      ">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3EEEA]">
                        <User
                          className="h-4 w-4 text-[#8B7565]"
                          strokeWidth={1.6}
                        />
                      </div>

                      <span className="flex-1">{t("profile")}</span>

                      <ChevronRight
                        className="h-4 w-4 text-stone-400"
                        strokeWidth={1.5}
                      />
                    </Link>

                    {/* MOBILE LANGUAGE */}
                    <div className="flex items-center justify-between gap-3 px-1">
                      <div className="flex items-center gap-2.5 text-xs font-medium text-stone-600">
                        <Globe className="h-4 w-4" strokeWidth={1.6} />

                        <span>{t("language")}</span>
                      </div>

                      <div className="flex items-center rounded-md border border-stone-200 bg-white p-0.5">
                        <button
                          type="button"
                          aria-pressed={locale === "id"}
                          onClick={() => switchLanguage("id")}
                          className={cn(
                            "min-w-10 cursor-pointer rounded px-3 py-1.5 text-xs font-medium transition-colors",
                            locale === "id"
                              ? "bg-[#F3EEEA] text-[#463B34]"
                              : "text-stone-400 hover:text-[#463B34]",
                          )}>
                          ID
                        </button>

                        <button
                          type="button"
                          aria-pressed={locale === "en"}
                          onClick={() => switchLanguage("en")}
                          className={cn(
                            "min-w-10 cursor-pointer rounded px-3 py-1.5 text-xs font-medium transition-colors",
                            locale === "en"
                              ? "bg-[#F3EEEA] text-[#463B34]"
                              : "text-stone-400 hover:text-[#463B34]",
                          )}>
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
