"use client";

import { Button } from "@/components/ui/button"; // Import dari Shadcn
import { cn } from "@/lib/utils"; // Utilitas class merger bawaan Shadcn
import { Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Efek untuk mendeteksi scroll
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
          : "bg-transparent py-6"
      )}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-3 items-center">
          {/* Bagian Kiri: Link Navigasi */}
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

          {/* Bagian Tengah: Logo */}
          <div className="flex justify-center">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image alt="" src={"/images/GG.png"} width={40} height={40} />
            </Link>
          </div>

          {/* Bagian Kanan: Utilitas (ID, User, Search, Cart) */}
          <div className="flex items-center justify-end gap-2">
            {/* Language Selector (Text Only sesuai gambar) */}
            <span className="text-sm font-medium text-gray-800 mr-4 cursor-pointer hover:text-black">
              ID
            </span>

            {/* Icon Buttons menggunakan Shadcn */}
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5 text-gray-800" />
            </Button>

            <Button variant="ghost" size="icon" className="rounded-full">
              <Search className="h-5 w-5 text-gray-800" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full">
              <ShoppingBag className="h-5 w-5 text-gray-800" />
              {/* Badge kecil jika ada item (opsional) */}
              {/* <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" /> */}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
