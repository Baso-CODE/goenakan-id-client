"use client";

import { DUMMY_ORDER_RESULT } from "@/app/data/trackingDetail.data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { OrderTrackingResult } from "./orderTrackingResult";

export function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<typeof DUMMY_ORDER_RESULT | null>(null);

  const handleTrack = () => {
    // Nanti ganti dengan fetch API berdasarkan orderId & email
    setResult({ ...DUMMY_ORDER_RESULT, orderId });
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
          <Label className="text-sm text-stone-700 font-medium">Order ID</Label>
          <Input
            placeholder="Found in your order confirmation email"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
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
            className="rounded-xs border-stone-300 focus-visible:ring-stone-400 text-sm placeholder:text-stone-400"
          />
        </div>

        {/* Track Button */}
        <div className="flex">
          <Button
            onClick={handleTrack}
            disabled={!orderId || !email}
            className="bg-[#463b34] hover:bg-stone-700 text-white text-xs font-bold tracking-widest uppercase rounded-none px-16 py-6">
            Track Now
          </Button>
        </div>
      </div>
    </div>
  );
}
