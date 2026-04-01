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
import { ChevronRight, Globe, Menu, Search, User } from "lucide-react"; // Tambah Icon Globe & Chevron
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import CartDrawer from "../CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Article", href: "/article" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out overflow-x-hidden",
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6",
      )}>
      <div className="container mx-auto px-4 md:px-8">
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
            <span className="text-sm font-medium text-gray-800 mr-2 md:mr-4 cursor-pointer hover:text-black hidden sm:block">
              ID
            </span>

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

            <CartDrawer />

            {/* --- BURGER MENU (MOBILE) --- */}
            <div className="md:hidden ml-1">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Menu className="h-6 w-6 text-gray-900" />
                  </Button>
                </SheetTrigger>

                {/* CONTENT MENU */}
                <SheetContent
                  side="left"
                  className="w-[85vw] sm:w-87.5 flex flex-col h-full p-0">
                  {/* HEADER MENU */}
                  <SheetHeader className="p-6 border-b border-gray-100">
                    <SheetTitle className="text-left flex items-center gap-3">
                      <Image
                        alt="Logo"
                        src={"/images/GG.png"}
                        width={28}
                        height={28}
                      />
                      <span className=" tracking-widest text-lg text-gray-900">
                        GOENAKAN
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  {/* BODY: MAIN LINKS */}
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="group flex items-center justify-between text-xl  text-gray-800 hover:text-[#C4A48E] transition-colors pb-2 border-b border-transparent hover:border-gray-50">
                        {link.name}

                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#C4A48E]" />
                      </Link>
                    ))}
                  </div>

                  {/* FOOTER: UTILITIES (Profile & Lang) */}
                  <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                    {/* Profile Link */}
                    <Link
                      href="/profile"
                      className="flex items-center gap-4 text-sm font-medium text-gray-600 hover:text-black transition-colors bg-white p-3 rounded-md shadow-sm border border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span>My Profile</span>
                    </Link>

                    {/* Language Switcher */}
                    <div className="flex items-center justify-between text-sm font-medium text-gray-500 px-1">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Language</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-black font-bold cursor-pointer">
                          ID
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="hover:text-black cursor-pointer">
                          EN
                        </span>
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
