"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, X } from "lucide-react";
import Image from "next/image";

// Fungsi format mata uang dinamis
function formatCurrency(amount: number, currencyCode: string = "IDR") {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function OrderTrackingResult({
  orderNumber,
  dateOrder,
  status,
  totalAmount,
  currencyCode = "IDR",
  shippingAddress,
  items,
  productionDetails,
  shippingDetails,
  onClose,
}: any) {
  let parsedAddress = shippingAddress;
  try {
    if (typeof shippingAddress === "string") {
      parsedAddress = JSON.parse(shippingAddress);
    }
  } catch (e) {
    parsedAddress = { fullAddress: shippingAddress };
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
      {/* ── Left: Order Detail ── */}
      <div className="border border-stone-200 rounded-sm bg-white overflow-hidden shadow-sm">
        {/* Order Number Header */}
        <div className="bg-stone-100 px-5 py-4 flex items-start justify-between">
          <div>
            <p className="text-xs text-stone-500 mb-1">Order Number Detail</p>
            <p className="text-xl font-bold text-stone-900 tracking-tight">
              {orderNumber}
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
              <p className="text-sm text-stone-700 mt-0.5">
                {new Date(dateOrder).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <Badge
              className={`text-xs font-semibold rounded-sm px-3 py-1 ${
                status === "PAID" || status === "COMPLETED"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : status === "PENDING" || status === "PENDING_PAYMENT"
                    ? "bg-amber-50 text-amber-600 border border-amber-200"
                    : "bg-red-50 text-red-500 border border-red-200"
              }`}>
              {status}
            </Badge>
          </div>

          <Separator className="bg-stone-100" />

          {/* Order Items */}
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-stone-500 mb-2">
              Order Items ({items?.length || 0})
            </p>
            <div className="flex flex-col divide-y divide-stone-100">
              {items?.map((item: any, index: number) => (
                <div key={index} className="flex gap-3 py-3 items-start">
                  {/* Gambar Produk */}
                  <div className="relative w-16 h-16 shrink-0 bg-stone-100 rounded-sm overflow-hidden border border-stone-200">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-[10px] text-stone-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Informasi Produk & Varian */}
                  <div className="flex flex-1 min-w-0 justify-between gap-2">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-semibold text-stone-800">
                        {item.name}{" "}
                        {item.variantName ? `- ${item.variantName}` : ""}
                      </p>

                      {/* Tampilkan atribut varian jika ada */}
                      {item.attributes && item.attributes.length > 0 && (
                        <div className="text-xs text-stone-500 flex flex-wrap gap-x-2">
                          {item.attributes.map((attr: any, aIdx: number) => (
                            <span key={aIdx}>
                              <span className="capitalize">{attr.name}</span>:{" "}
                              {attr.value}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-stone-500 mt-1">
                        Jumlah (Qty):{" "}
                        <span className="font-medium text-stone-800">
                          {item.quantity}
                        </span>
                      </p>
                    </div>

                    {/* Harga */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-stone-800 font-mono">
                        {formatCurrency(item.totalPrice, currencyCode)}
                      </p>
                      <p className="text-[11px] text-stone-400 font-mono">
                        {item.quantity} x{" "}
                        {formatCurrency(item.unitPrice, currencyCode)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-stone-100" />

          {/* Payment & Shipping Address Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-stone-500">
                Total Pembayaran
              </p>
              <p className="text-base font-bold text-stone-900 font-mono">
                {formatCurrency(Number(totalAmount), currencyCode)}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold text-stone-500">
                Alamat Pengiriman
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                {typeof parsedAddress === "object"
                  ? parsedAddress.fullAddress || JSON.stringify(parsedAddress)
                  : parsedAddress}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: Tracking Timeline (Production & Shipping) ── */}
      <div className="flex flex-col gap-4">
        {/* Production Tracking Section */}
        <div className="border border-stone-200 rounded-sm bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-blue-600" /> Status Produksi
          </p>

          {!productionDetails || productionDetails.length === 0 ? (
            <p className="text-xs text-stone-400 italic">
              Belum ada tahap produksi tercatat.
            </p>
          ) : (
            <div className="flex flex-col space-y-3">
              {productionDetails.map((prod: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-xs border-b border-stone-100 pb-2">
                  <div>
                    <span className="font-semibold text-stone-700">
                      Langkah {prod.step}
                    </span>
                    <p className="text-stone-500 text-[11px]">
                      {prod.notes || "Dalam proses"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {prod.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shipping & Delivery Timeline Section */}
        <div className="border border-stone-200 rounded-sm bg-white p-4 shadow-sm">
          <p className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-600" /> Riwayat Pengiriman
          </p>

          {!shippingDetails || shippingDetails.length === 0 ? (
            <p className="text-xs text-stone-400 italic">
              Belum ada data pengiriman aktif.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {shippingDetails.map((ship: any, sIdx: number) => (
                <div key={sIdx} className="flex flex-col gap-2">
                  <div className="bg-stone-50 p-2 rounded text-xs border border-stone-100">
                    <span className="font-bold text-stone-700">
                      Resi: {ship.trackingNumber || "Belum tersedia"}
                    </span>
                    <p className="text-stone-500 text-[11px]">
                      Kurir / Metode: {ship.method}
                    </p>
                  </div>

                  {/* Timeline Perjalanan */}
                  <div className="flex flex-col pl-2 mt-1 border-l-2 border-stone-200 space-y-3">
                    {ship.timeline?.map((t: any, tIdx: number) => (
                      <div key={tIdx} className="relative pl-3 text-xs">
                        <div className="absolute -left-4.25 top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                        <p className="font-semibold text-stone-800">
                          {t.status}
                        </p>
                        {t.city && (
                          <p className="text-stone-500 text-[11px]">
                            Lokasi: {t.city}
                          </p>
                        )}
                        {t.note && (
                          <p className="text-stone-400 text-[10px] italic">
                            {t.note}
                          </p>
                        )}
                        <span className="text-[10px] text-stone-400">
                          {new Date(t.date).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
