"use client";

import PayNowButton from "@/app/components/checkout/payNowButton";
import { apiUrl } from "@/app/utils/ApiUrl";
import { Link } from "@/i18n/routing";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

interface WebOrder {
  id: string;
  orderNumber: string;
  status: string;
}

interface OrderResponse {
  success: boolean;
  message?: string;
  data?: WebOrder;
}

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const locale = useLocale();
  const isEnglish = locale === "en";

  const { data: session, status: sessionStatus } = useSession();
  const token = session?.user?.accessToken || "";

  const [order, setOrder] = useState<WebOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [pollCount, setPollCount] = useState(0);

  const fetchOrder = useCallback(
    async (silent = false) => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);

      try {
        const response = await fetch(
          `${apiUrl}/web-orders/${encodeURIComponent(orderId)}`,
          {
            method: "GET",
            headers: {
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            cache: "no-store",
          },
        );

        const result: OrderResponse = await response.json();

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.message || "Gagal mengambil status pesanan.");
        }

        setOrder(result.data);
        setError("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat memeriksa pesanan.",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [orderId, token],
  );

  useEffect(() => {
    if (sessionStatus === "loading") return;
    void fetchOrder();
  }, [fetchOrder, sessionStatus]);

  useEffect(() => {
    if (!orderId || !order) return;

    const pending =
      order.status === "PENDING" || order.status === "PENDING_PAYMENT";

    if (!pending || pollCount >= 20 || error) return;

    const timeout = window.setTimeout(() => {
      void fetchOrder(true);
      setPollCount((count) => count + 1);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [orderId, order, pollCount, error, fetchOrder]);

  const message = {
    notFound: isEnglish ? "Order Not Found" : "Pesanan Tidak Ditemukan",
    invalidLink: isEnglish
      ? "The order link is invalid."
      : "Tautan pesanan tidak valid.",
    home: isEnglish ? "Back to Home" : "Kembali ke Beranda",
    loading: isEnglish ? "Checking your order..." : "Memeriksa pesanan Anda...",
    success: isEnglish ? "Payment Successful!" : "Pembayaran Berhasil!",
    successDesc: isEnglish
      ? "Your payment has been confirmed."
      : "Pembayaran Anda telah dikonfirmasi.",
    pending: isEnglish
      ? "Waiting for Payment Confirmation"
      : "Menunggu Konfirmasi Pembayaran",
    pendingDesc: isEnglish
      ? "Your order has been recorded. We are checking its payment status."
      : "Pesanan Anda telah tercatat. Kami sedang memeriksa status pembayarannya.",
    failed: isEnglish ? "Payment Not Completed" : "Pembayaran Belum Selesai",
    failedDesc: isEnglish
      ? "This order cannot be paid through the current payment session."
      : "Pesanan ini tidak dapat dibayar melalui sesi pembayaran saat ini.",
    detail: isEnglish ? "Order Details" : "Detail Pesanan",
    shop: isEnglish ? "Shop Again" : "Belanja Lagi",
    refresh: isEnglish ? "Check Status" : "Periksa Status",
    refreshing: isEnglish ? "Checking..." : "Memeriksa...",
    orderLabel: isEnglish ? "Order Number" : "Nomor Pesanan",
    retry: isEnglish ? "Try Again" : "Coba Lagi",
  };

  const containerClass =
    "min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-4";

  if (!orderId) {
    return (
      <div className={containerClass}>
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold text-stone-800">
          {message.notFound}
        </h1>
        <p className="text-stone-500">{message.invalidLink}</p>
        <Link href="/" className="px-6 py-2 bg-[#463b34] text-white rounded-md">
          {message.home}
        </Link>
      </div>
    );
  }

  if (isLoading || sessionStatus === "loading") {
    return (
      <div className={containerClass}>
        <Loader2 className="w-10 h-10 animate-spin text-stone-600" />
        <p className="text-stone-500">{message.loading}</p>
      </div>
    );
  }

  if (!order && error) {
    return (
      <div className={containerClass}>
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold text-stone-800">
          {message.notFound}
        </h1>
        <p className="text-stone-500 max-w-md">{error}</p>
        <button
          type="button"
          onClick={() => void fetchOrder()}
          className="px-6 py-3 bg-[#463b34] text-white rounded-none">
          {message.retry}
        </button>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const isPaid = order.status === "PAID" || order.status === "COMPLETED";

  const isPending =
    order.status === "PENDING" || order.status === "PENDING_PAYMENT";

  const orderLabel = order.orderNumber || order.id;

  if (isPaid) {
    return (
      <div className={containerClass}>
        <CheckCircle2 className="w-20 h-20 text-green-500" />
        <h1 className="text-3xl font-bold text-stone-800">{message.success}</h1>
        <p className="text-stone-600 max-w-md">{message.successDesc}</p>
        <p className="text-sm text-stone-500">
          {message.orderLabel}: <span className="font-bold">{orderLabel}</span>
        </p>
        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="px-6 py-3 border border-[#463b34] text-[#463b34] hover:bg-stone-100">
            {message.shop}
          </Link>
          <Link
            href={`/profile/order/${order.id}`}
            className="px-6 py-3 bg-[#463b34] text-white hover:bg-stone-800">
            {message.detail}
          </Link>
        </div>
      </div>
    );
  }

  if (!isPending) {
    return (
      <div className={containerClass}>
        <AlertCircle className="w-20 h-20 text-red-500" />
        <h1 className="text-3xl font-bold text-stone-800">{message.failed}</h1>
        <p className="text-stone-600 max-w-md">{message.failedDesc}</p>
        <p className="text-sm text-stone-500">
          {message.orderLabel}: {orderLabel}
        </p>
        <p className="text-xs text-stone-400">Status: {order.status}</p>
        <Link href="/" className="px-6 py-3 bg-[#463b34] text-white">
          {message.home}
        </Link>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <Clock className="w-20 h-20 text-orange-500" />

      <h1 className="text-3xl font-bold text-stone-800">{message.pending}</h1>

      <p className="text-stone-600 max-w-md">{message.pendingDesc}</p>

      <p className="text-sm text-stone-600">
        {message.orderLabel}: <span className="font-bold">{orderLabel}</span>
      </p>

      {isRefreshing && (
        <p className="flex items-center gap-2 text-xs text-stone-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          {message.refreshing}
        </p>
      )}

      {error && <p className="text-sm text-red-600 max-w-md">{error}</p>}

      <div className="pt-4 flex flex-col sm:flex-row gap-3">
        <PayNowButton orderId={order.id} token={token} apiUrl={apiUrl || ""} />

        <button
          type="button"
          onClick={() => {
            setPollCount(0);
            void fetchOrder(true);
          }}
          disabled={isRefreshing}
          className="px-6 py-3 border border-[#463b34] text-[#463b34] text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-2 disabled:opacity-50">
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? message.refreshing : message.refresh}
        </button>

        <Link
          href={`/profile/order/${order.id}`}
          className="px-6 py-3 border border-stone-300 text-stone-700 text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center hover:bg-stone-100">
          {message.detail}
        </Link>
      </div>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <Suspense
        fallback={
          <div className="text-center py-20 text-stone-500 animate-pulse">
            Loading...
          </div>
        }>
        <OrderStatusContent />
      </Suspense>
    </div>
  );
}
