import type { Metadata } from "next";
import { Gilda_Display } from "next/font/google";
import Navbar from "./components/navigation/Navbar";
import "./globals.css";

// Menginisialisasi font Gilda Display
const gilda = Gilda_Display({
  weight: "400", // Gilda Display membutuhkan spesifikasi weight
  subsets: ["latin"],
  variable: "--font-gilda", // Variabel CSS untuk Tailwind
});

export const metadata: Metadata = {
  title: "Goenakan Indonesia", // Saya sesuaikan judulnya dengan project kamu
  description: "Platform Goenakan Indonesia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gilda.variable} ${gilda.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
