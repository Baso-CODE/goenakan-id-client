"use client";

import PayNowButton from "@/app/components/checkout/payNowButton";
import { apiUrl } from "@/app/utils/ApiUrl";
import { Link } from "@/i18n/routing";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Komponen utama yang berisi logika
function OrderStatusContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const status = searchParams.get("status");

  const { data: session } = useSession();
  const token = session?.user?.accessToken || "";

  if (!orderId) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold text-stone-800">
          Pesanan Tidak Ditemukan
        </h1>
        <p className="text-stone-500">Tautan yang Anda kunjungi tidak valid.</p>
        <Link
          href="/"
          className="px-6 py-2 bg-[#463b34] text-white rounded-md hover:bg-[#342b26] transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Tampilan jika pembayaran BERHASIL
  if (status === "success") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
        <CheckCircle2 className="w-20 h-20 text-green-500" />
        <h1 className="text-3xl font-bold text-stone-800">
          Pembayaran Berhasil!
        </h1>
        <p className="text-stone-600 max-w-md">
          Terima kasih atas pesanan Anda. Kami telah menerima pembayaran untuk
          Order ID: <span className="font-bold">{orderId}</span>.
        </p>
        <p className="text-sm text-stone-500">
          Silakan cek email Anda untuk detail pesanan dan resi pengiriman nanti.
        </p>
        <div className="pt-4 flex gap-4">
          <Link
            href="/products"
            className="px-6 py-2 border border-[#463b34] text-[#463b34] rounded-md hover:bg-stone-50 transition-colors">
            Belanja Lagi
          </Link>
          <Link
            href={`/order-detail/${orderId}`}
            className="px-6 py-2 bg-[#463b34] text-white rounded-md hover:bg-[#342b26] transition-colors">
            Lihat Pesanan
          </Link>
        </div>
      </div>
    );
  }

  // Tampilan jika pembayaran PENDING (Menunggu / Pop-up diclose)
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
      <Clock className="w-20 h-20 text-orange-500" />
      <h1 className="text-3xl font-bold text-stone-800">Menunggu Pembayaran</h1>
      <p className="text-stone-600 max-w-md">
        Pesanan Anda dengan ID <span className="font-bold">{orderId}</span>{" "}
        telah tercatat, namun kami masih menunggu pembayaran Anda.
      </p>

      <div className="p-4 bg-orange-50 rounded-lg border border-orange-100 text-sm text-orange-800 max-w-md text-left mt-2 mb-4">
        <p className="font-semibold mb-1">Catatan Penting:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Silakan selesaikan pembayaran Anda sekarang agar pesanan dapat
            segera diproses.
          </li>
          <li>
            Anda juga dapat melihat rincian lengkap pesanan dengan mengklik
            tombol detail di bawah.
          </li>
        </ul>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <PayNowButton orderId={orderId} token={token} apiUrl={apiUrl || ""} />

        <Link
          href={`/profile/order/${orderId}`}
          className="px-6 py-3 border border-[#463b34] text-[#463b34] text-xs font-bold tracking-[0.2em] rounded-none hover:bg-stone-100 transition-colors uppercase flex items-center justify-center">
          Detail Pesanan
        </Link>
      </div>
    </div>
  );
}

// Komponen pembungkus (Wajib di Next.js saat menggunakan useSearchParams)
export default function OrderStatusPage() {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <Suspense
        fallback={
          <div className="text-center py-20 text-stone-500 animate-pulse">
            Memuat data pesanan...
          </div>
        }>
        <OrderStatusContent />
      </Suspense>
    </div>
  );
}
