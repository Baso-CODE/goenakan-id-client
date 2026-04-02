"use client";

import { OrderTrackingResultProps } from "@/app/types/trackingDetail.type";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import Image from "next/image";

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function OrderTrackingResult({
  orderId,
  createdDate,
  status,
  items,
  subtotal,
  shipping,
  trackingSteps,
  onClose,
}: OrderTrackingResultProps) {
  const total = subtotal + shipping;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
      {/* ── Left: Order Detail ── */}
      <div className="border border-stone-200 rounded-sm bg-white overflow-hidden">
        {/* Order ID */}
        <div className="bg-stone-100 px-5 py-4 flex items-start justify-between">
          <div>
            <p className="text-xs text-stone-500 mb-1">Order ID Detail</p>
            <p className="text-xl font-bold text-stone-900 tracking-tight">
              {orderId}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-7 h-7 rounded-sm text-stone-500 hover:text-stone-800 hover:bg-stone-200">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Created Date & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-stone-400">Created Date</p>
              <p className="text-sm text-stone-700 mt-0.5">{createdDate}</p>
            </div>
            <Badge
              className={`text-xs font-semibold rounded-sm px-3 py-1 ${
                status === "Paid"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : status === "Pending"
                    ? "bg-amber-50 text-amber-600 border border-amber-200"
                    : "bg-red-50 text-red-500 border border-red-200"
              }`}>
              {status === "Paid" && "✦ "}
              {status}
            </Badge>
          </div>

          <Separator className="bg-stone-100" />

          {/* Order Items */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-stone-500 mb-2">
              Order Items
            </p>
            <div className="flex flex-col divide-y divide-stone-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 py-3">
                  {/* Image */}
                  <div className="relative w-14 h-16 shrink-0 bg-stone-100 rounded-sm overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1"
                      sizes="56px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 min-w-0 justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-stone-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-stone-400">
                        Dimensi: {item.dimensions}
                      </p>
                      <p className="text-xs text-stone-400">
                        Berat: {item.weight}
                      </p>
                      <p className="text-xs text-stone-400">
                        Warna: {item.color}
                      </p>
                      <p className="text-xs text-stone-400">
                        Bahan: {item.material}
                      </p>
                      <p className="text-xs text-stone-400">
                        Jumlah: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-stone-800 shrink-0">
                      {formatRupiah(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-stone-100" />

          {/* Payment Summary */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-stone-500">Payment</p>
            <div className="flex justify-between text-sm text-stone-600">
              <span>Subtotal</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-600">
              <span>Shipping</span>
              <span>{formatRupiah(shipping)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-1">
              <span>Total</span>
              <span>{formatRupiah(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Tracking Timeline ── */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-stone-800">Order Tracking</p>

        <div className="flex flex-col">
          {trackingSteps.map((step, index) => (
            <div key={index} className="flex gap-3">
              {/* Dot & line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${
                    step.done ? "bg-[#c6a28d]" : "bg-[#9d9d9d]"
                  }`}
                />
                {index < trackingSteps.length - 1 && (
                  <div className="w-px flex-1 bg-stone-200 my-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col pb-5 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-stone-400">{step.label}</p>
                    <p className="text-sm font-medium text-stone-700 leading-snug">
                      {step.location}
                    </p>
                  </div>
                  <p className="text-xs text-stone-400 shrink-0 whitespace-nowrap">
                    {step.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
