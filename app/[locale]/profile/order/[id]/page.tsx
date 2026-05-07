"use client";

import PayNowButton from "@/app/components/checkout/payNowButton";
import { apiUrl } from "@/app/utils/ApiUrl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Loader2, Package, Receipt, Truck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingCost: number;
  subtotal: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!token) return;

      try {
        const response = await fetch(`${apiUrl}/web-orders/${orderId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await response.json();

        if (!response.ok || !json.success) {
          throw new Error(json.message || "Gagal mengambil detail pesanan");
        }

        setOrder(json.data);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-stone-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#463b34]" />
        <p className="text-stone-500 font-medium tracking-widest uppercase text-sm">
          Memuat Rincian Pesanan...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 text-center bg-stone-50">
        <Package className="w-20 h-20 text-stone-300" />
        <h2 className="text-2xl font-bold text-stone-800">
          Pesanan Tidak Ditemukan
        </h2>
        <Button
          asChild
          variant="outline"
          className="mt-4 border-[#463b34] text-[#463b34] hover:bg-stone-100">
          <Link href="/profile?tab=orders">Kembali ke Riwayat Pesanan</Link>
        </Button>
      </div>
    );
  }

  // ✨ PERBAIKAN LOGIKA STATUS: Mendeteksi PENDING atau PENDING_PAYMENT
  const isPending =
    order.status === "PENDING" || order.status === "PENDING_PAYMENT";

  return (
    // ✨ PERBAIKAN LAYOUT: Menambahkan pt-32 agar tidak tertutup Navbar atas
    <div className="min-h-screen bg-stone-50 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto space-y-8">
        {/* Kartu Utama */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header Pesanan */}
          <div className="bg-[#463b34] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="text-stone-300 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4" /> Order ID
              </p>
              <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-wide">
                {order.orderNumber}
              </h1>
              <p className="text-stone-400 text-xs sm:text-sm pt-1">
                Dibuat pada:{" "}
                {new Date(order.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                WIB
              </p>
            </div>

            {/* Bagian Kanan: Status dan Aksi Pembayaran */}
            <div className="flex flex-col items-start sm:items-end gap-4 mt-4 sm:mt-0">
              {/* Badge Status */}
              <span
                className={`px-4 py-1.5 text-[11px] uppercase tracking-widest font-bold rounded-full border shadow-sm ${
                  order.status === "COMPLETED"
                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : isPending
                      ? "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      : order.status === "CANCELLED"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-stone-500/10 text-stone-500 border-stone-500/20"
                }`}>
                {order.status.replace("_", " ")}
              </span>

              {/* Area Tombol Pembayaran (Hanya jika Pending) */}
              {isPending && (
                <div className="flex flex-col items-start sm:items-end w-full sm:w-auto pt-2">
                  {/* ✨ PERBAIKAN TYPESCRIPT: apiUrl={apiUrl || ""} */}
                  <PayNowButton
                    orderId={order.id}
                    token={token || ""}
                    apiUrl={apiUrl || ""}
                  />
                  <p className="text-[10px] text-stone-400 mt-2.5 leading-relaxed max-w-50 text-left sm:text-right italic">
                    *Klik untuk melanjutkan atau mengganti metode pembayaran
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Rincian Produk */}
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-serif font-bold text-stone-800 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-stone-400" /> Rincian Produk
            </h2>

            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-4 border-b border-stone-100 last:border-0">
                  <div className="flex-1">
                    <p className="font-bold text-stone-800 text-base">
                      {item.productName}
                    </p>
                    <p className="text-sm text-stone-500 mt-1">
                      {item.quantity} x Rp{" "}
                      {Number(item.price).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <p className="font-bold text-stone-800 text-base">
                    Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
            </div>

            {/* Rincian Biaya */}
            <div className="mt-8 pt-6 border-t border-stone-200">
              <div className="w-full sm:w-1/2 ml-auto space-y-3">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal Produk</span>
                  <span>
                    Rp {Number(order.subtotal).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-stone-500">
                  <span className="flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Biaya Pengiriman
                  </span>
                  <span>
                    Rp {Number(order.shippingCost).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-lg sm:text-xl font-bold text-[#463b34] pt-4 border-t border-stone-200 mt-4">
                  <span>Total Pembayaran</span>
                  <span>
                    Rp {Number(order.totalAmount).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigasi Kembali */}
        <Link
          href="/profile?tab=orders"
          className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Riwayat Pesanan
        </Link>
      </div>
    </div>
  );
}
