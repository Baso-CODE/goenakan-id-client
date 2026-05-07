"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  // Memastikan script Midtrans dimuat di halaman ini
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
    setIsProcessing(true);
    try {
      // 1. Panggil API pembayaran
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

      // 2. Munculkan Pop-up Midtrans
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
        },
        onClose: function () {
          toast.warning(
            "Anda menutup pop-up sebelum menyelesaikan pembayaran.",
          );
        },
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan pada sistem.";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePay}
      disabled={isProcessing}
      className="w-full sm:w-auto bg-[#463b34] text-white hover:bg-[#342b26] transition-all duration-200 shadow-sm">
      {isProcessing ? "Memproses..." : "Bayar Sekarang"}
    </Button>
  );
}
