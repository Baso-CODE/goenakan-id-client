"use client";

import { SnapOptions } from "@/app/types/midtrans/snapOptions.type";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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

export default function PayNowButton({
  orderId,
  token,
  apiUrl,
}: PayNowButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    if (!document.querySelector(`script[src="${snapScript}"]`)) {
      const script = document.createElement("script");
      script.src = snapScript;
      script.setAttribute("data-client-key", clientKey);
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePay = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      if (typeof window.snap === "undefined") {
        throw new Error(
          "Sistem pembayaran belum siap. Silakan tunggu sebentar.",
        );
      }

      const payRes = await fetch(`${apiUrl}/web-orders/${orderId}/pay`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const payData = await payRes.json();

      if (!payData.success) {
        throw new Error("Gagal memuat pembayaran.");
      }

      const snapToken = payData.data.token;

      window.snap.pay(snapToken, {
        onSuccess: function () {
          toast.success("Pembayaran berhasil!");
          router.push(`/order-status?id=${orderId}&status=success`);
        },
        onPending: function () {
          toast.info("Menunggu pembayaran Anda.");
          router.push(`/order-status?id=${orderId}&status=pending`);
        },
        onError: function () {
          toast.error("Pembayaran gagal. Silakan coba lagi.");
          setIsProcessing(false);
        },
        onClose: function () {
          toast.warning(
            "Anda menutup pop-up sebelum menyelesaikan pembayaran.",
          );
          setIsProcessing(false);
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan pada sistem.";
      toast.error(errorMessage);

      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePay}
      disabled={isProcessing}
      className="w-full sm:w-auto bg-[#463b34] hover:bg-stone-800 text-white text-xs font-bold tracking-[0.2em] rounded-none py-6 transition-all uppercase shadow-sm">
      {isProcessing ? "PROCESSING..." : "BAYAR SEKARANG"}
    </Button>
  );
}
