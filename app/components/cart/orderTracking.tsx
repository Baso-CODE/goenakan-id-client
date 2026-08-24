"use client";

import { apiUrl } from "@/app/utils/ApiUrl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderTrackingResult } from "./orderTrackingResult";

export function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleTrack = async () => {
    if (!orderId || !email) {
      toast.error("Nomor pesanan dan Email/No HP wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      // Panggil API backend public tracking yang sudah kita buat
      const res = await fetch(`${apiUrl}/tracking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: orderId,
          contactInfo: email,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.message || "Pesanan tidak ditemukan atau data kontak salah.",
        );
      }

      // Jika berhasil, simpan data ke state result untuk ditampilkan
      setResult(json.data);
      toast.success("Berhasil memuat data pelacakan pesanan!");
    } catch (error: any) {
      console.error("Tracking error:", error);
      toast.error(error.message || "Terjadi kesalahan saat melacak pesanan.");
    } finally {
      setIsLoading(false);
    }
  };

  if (result) {
    return <OrderTrackingResult {...result} onClose={() => setResult(null)} />;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Description */}
      <p className="text-sm text-stone-500 leading-relaxed">
        To track your order please enter your Order ID in the box below and
        press the &quot;Track&quot; button. This was given to you on your
        receipt and in the confirmation email you should have received.
      </p>

      {/* Form */}
      <div className="border border-stone-200 rounded-sm bg-white p-6 flex flex-col gap-4">
        {/* Order ID */}
        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
          <Label className="text-sm text-stone-700 font-medium">
            Order Number
          </Label>
          <Input
            placeholder="Found in your order confirmation email"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            disabled={isLoading}
            className="rounded-xs border-stone-300 focus-visible:ring-stone-400 text-sm placeholder:text-stone-400"
          />
        </div>

        {/* Email / Phone */}
        <div className="grid grid-cols-[120px_1fr] items-center gap-4">
          <Label className="text-sm text-stone-700 font-medium">
            E-mail/Numbers
          </Label>
          <Input
            placeholder="Email/Phone numbers you used during checkout"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="rounded-xs border-stone-300 focus-visible:ring-stone-400 text-sm placeholder:text-stone-400"
          />
        </div>

        {/* Track Button */}
        <div className="flex">
          <Button
            onClick={handleTrack}
            disabled={!orderId || !email || isLoading}
            className="bg-[#463b34] hover:bg-stone-700 text-white text-xs font-bold tracking-widest uppercase rounded-none px-16 py-6 flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Tracking..." : "Track Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
