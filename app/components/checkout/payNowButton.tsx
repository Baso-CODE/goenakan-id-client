"use client";

import { SnapOptions } from "@/app/types/midtrans/snapOptions.type";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: SnapOptions) => void;
    };
  }
}

interface PayNowButtonProps {
  orderId: string;
  token: string;
  apiUrl: string;
}

interface PaymentResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string | null;
    redirect_url?: string | null;
    reused?: boolean;
  };
}

export default function PayNowButton({
  orderId,
  token,
  apiUrl,
}: PayNowButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSnapReady, setIsSnapReady] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const isEnglish = locale === "en";

  useEffect(() => {
    const snapScript =
      process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";

    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    if (!clientKey) {
      console.error("Midtrans Client Key belum dikonfigurasi");
      return;
    }

    if (window.snap?.pay) {
      setIsSnapReady(true);
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${snapScript}"]`,
    );

    const handleLoad = () => setIsSnapReady(true);
    const handleError = () => {
      setIsSnapReady(false);
      console.error("Gagal memuat Midtrans Snap.js");
    };

    if (!script) {
      script = document.createElement("script");
      script.src = snapScript;
      script.setAttribute("data-client-key", clientKey);
      script.async = true;
      document.body.appendChild(script);
    }

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);

    return () => {
      script?.removeEventListener("load", handleLoad);
      script?.removeEventListener("error", handleError);
    };
  }, []);

  const handlePay = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      const response = await fetch(`${apiUrl}/web-orders/${orderId}/pay`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
      });

      const result: PaymentResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal membuat sesi pembayaran.");
      }

      const payment = result.data;

      if (!payment) {
        throw new Error("Data pembayaran tidak ditemukan.");
      }

      const snapToken = payment.token;
      const redirectUrl = payment.redirect_url;

      if (snapToken && window.snap?.pay && isSnapReady) {
        window.snap.pay(snapToken, {
          onSuccess: () => {
            toast.success(
              "Pembayaran diterima. Sedang memverifikasi status pesanan.",
            );
            router.push(`/order-status?id=${orderId}&status=success`);
            router.refresh();
          },
          onPending: () => {
            toast.info("Menunggu penyelesaian pembayaran.");
            router.push(`/order-status?id=${orderId}&status=pending`);
            router.refresh();
          },
          onError: () => {
            toast.error("Pembayaran gagal. Silakan coba lagi.");
            setIsProcessing(false);
          },
          onClose: () => {
            toast.info(
              "Jendela pembayaran ditutup. Pesanan masih dapat dibayar.",
            );
            setIsProcessing(false);
          },
        });

        return;
      }

      if (redirectUrl) {
        window.location.assign(redirectUrl);
        return;
      }

      if (snapToken && !window.snap?.pay) {
        throw new Error("Midtrans Snap belum tersedia. Muat ulang halaman.");
      }

      throw new Error("Snap Token dan URL pembayaran tidak tersedia.");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan pada sistem pembayaran.";

      toast.error(message);
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePay}
      disabled={isProcessing}
      className="w-full sm:w-auto bg-[#463b34] hover:bg-stone-800 text-white text-xs font-bold tracking-[0.2em] rounded-none py-6 transition-all uppercase shadow-sm">
      {isProcessing
        ? isEnglish
          ? "PROCESSING..."
          : "MEMPROSES..."
        : isEnglish
          ? "PAY NOW"
          : "BAYAR SEKARANG"}
    </Button>
  );
}
