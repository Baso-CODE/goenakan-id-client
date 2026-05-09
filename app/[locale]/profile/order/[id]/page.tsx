"use client";

import PayNowButton from "@/app/components/checkout/payNowButton";
import { apiUrl } from "@/app/utils/ApiUrl";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Loader2,
  MapPin,
  MessageSquare,
  Package,
  Truck,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ==========================================
// 1. DEFINISI TIPE DATA (INTERFACES)
// ==========================================

interface ShippingAddress {
  recipient?: string;
  phone?: string;
  country?: string;
  province?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  fullAddress?: string;
}

interface ImageType {
  url: string;
}

interface Attribute {
  name: string;
}

interface AttributeValue {
  value: string;
  attribute: Attribute;
}

interface VariantAttributeValue {
  id: string;
  attributeValue: AttributeValue;
}

interface ProductVariant {
  variantName?: string | null;
  sku?: string;
  images?: ImageType[];
  attributeValues?: VariantAttributeValue[];
}

interface Product {
  sku?: string;
  images?: ImageType[];
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number | string;
  product?: Product;
  variant?: ProductVariant | null;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  customerNote?: string | null;
  guestName?: string | null;
  guestPhone?: string | null;
  shippingAddress: string | ShippingAddress;
  subtotal: number | string;
  shippingCost: number | string;
  totalAmount: number | string;
  paymentMethod?: string | null;
  items: OrderItem[];
}

// ==========================================
// 2. FUNGSI PEMBANTU
// ==========================================

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

function getDisplayImage(item: OrderItem): string {
  if (item.variant?.images && item.variant.images.length > 0) {
    return item.variant.images[0].url;
  }
  if (item.product?.images && item.product.images.length > 0) {
    return item.product.images[0].url;
  }
  return "/images/placeholder.png";
}

// ==========================================
// 3. KOMPONEN UTAMA
// ==========================================

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

        if (!response.ok || !json.success) throw new Error(json.message);

        setOrder(json.data);
      } catch (error: unknown) {
        // Penanganan error tanpa any
        const errorMessage =
          error instanceof Error ? error.message : "Gagal memuat pesanan";
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-10 h-10 animate-spin text-[#463b34]" />
      </div>
    );
  }

  if (!order) return <div className="text-center p-20">Order not found</div>;

  const isPending =
    order.status === "PENDING" || order.status === "PENDING_PAYMENT";

  // Parse JSON Alamat secara aman dan casting ke interface ShippingAddress
  const address: ShippingAddress =
    typeof order.shippingAddress === "string"
      ? JSON.parse(order.shippingAddress)
      : order.shippingAddress;

  return (
    <div className="min-h-screen bg-stone-50 pt-10 ">
      <div className="container space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Link
            href="/profile?tab=orders"
            className="flex items-center text-stone-500 hover:text-stone-900 transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Riwayat Pesanan
          </Link>
          <div className="flex items-center gap-2 text-stone-400 text-sm">
            <Calendar className="w-4 h-4" />
            {new Date(order.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Kolom Kiri: Detail Produk & Pembayaran */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Info Card */}
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-[#463b34] p-6 text-white flex justify-between items-center">
                <div>
                  <p className="text-stone-300 text-[10px] uppercase tracking-widest font-bold">
                    Order Number
                  </p>
                  <h1 className="text-xl font-serif">{order.orderNumber}</h1>
                </div>
                <span
                  className={`px-4 py-1 text-[10px] uppercase font-bold rounded-full border ${
                    order.status === "PAID"
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : "bg-orange-500/20 text-orange-300 border-orange-500/30"
                  }`}>
                  {order.status.replace("_", " ")}
                </span>
              </div>

              {/* Product Items */}
              <div className="p-6 divide-y divide-stone-100">
                <h2 className="text-sm font-bold uppercase tracking-widest text-stone-800 mb-4 flex items-center gap-2">
                  <Package className="w-4 h-4 text-stone-400" /> Item Details
                </h2>
                {order.items?.map((item: OrderItem) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 first:pt-0 last:pb-0">
                    {/* Gambar Cerdas (Varian / Produk) */}
                    <div className="relative w-24 h-24 bg-stone-100 rounded-lg overflow-hidden border border-stone-100 shrink-0">
                      <Image
                        src={getDisplayImage(item)}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Rincian Produk & Varian */}
                    <div className="flex-1 flex flex-col justify-center">
                      <h3 className="text-sm font-bold text-stone-800 uppercase tracking-tight">
                        {item.productName}
                      </h3>

                      {item.variant && (
                        <div className="mt-1 space-y-1">
                          {item.variant.variantName && (
                            <p className="text-[10px] font-bold text-[#463b34] uppercase tracking-tighter">
                              Varian: {item.variant.variantName}
                            </p>
                          )}

                          {/* Mapping Detail Atribut (contoh: Warna: Merah) */}
                          <div className="flex flex-wrap gap-x-2">
                            {item.variant.attributeValues?.map((av) => (
                              <span
                                key={av.id}
                                className="text-[10px] text-stone-500">
                                <span className="font-medium">
                                  {av.attributeValue.attribute.name}:
                                </span>{" "}
                                {av.attributeValue.value}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="text-[10px] text-stone-400 mt-1">
                        SKU: {item.variant?.sku || item.product?.sku || "-"}
                      </p>

                      <p className="text-xs text-stone-500 mt-2">
                        {item.quantity} x {formatRupiah(Number(item.price))}
                      </p>
                    </div>

                    {/* Total Harga Item */}
                    <div className="flex flex-col justify-center items-end">
                      <p className="text-sm font-bold text-stone-800">
                        {formatRupiah(item.quantity * Number(item.price))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note & Info Section */}
            {order.customerNote && (
              <div className="bg-stone-100/50 border border-stone-200 p-6 rounded-xl">
                <h3 className="text-xs font-bold uppercase tracking-widest text-stone-600 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Catatan Pesanan
                </h3>
                <p className="text-sm text-stone-600 italic">
                  &quot;{order.customerNote}&quot;
                </p>
              </div>
            )}
          </div>

          {/* Kolom Kanan: Summary & Shipping */}
          <div className="space-y-6">
            {/* Status Pembayaran */}
            {isPending && (
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl space-y-4">
                <p className="text-xs text-orange-700 font-medium">
                  Pesanan ini menunggu pembayaran. Silakan selesaikan transaksi
                  Anda.
                </p>
                <PayNowButton
                  orderId={order.id}
                  token={token || ""}
                  apiUrl={apiUrl || ""}
                />
              </div>
            )}

            {/* Alamat Pengiriman */}
            <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-4 flex items-center gap-2 border-b pb-2">
                <MapPin className="w-4 h-4 text-stone-400" /> Shipping Info
              </h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <User className="w-4 h-4 text-stone-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-stone-800">
                      {address?.recipient || order.guestName}
                    </p>
                    <p className="text-xs text-stone-500">
                      {address?.phone || order.guestPhone}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Truck className="w-4 h-4 text-stone-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {address?.fullAddress}
                      <br />
                      {address?.district ? `${address.district}, ` : ""}
                      {address?.city}
                      <br />
                      {address?.province} {address?.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rincian Biaya */}
            <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-800 mb-2 border-b pb-2">
                Payment Summary
              </h3>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Subtotal</span>
                <span>{formatRupiah(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Shipping Cost</span>
                <span>{formatRupiah(Number(order.shippingCost))}</span>
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between text-xs text-stone-500 border-t pt-2 mt-2 border-dashed">
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> Method
                  </span>
                  <span className="uppercase font-bold text-stone-700">
                    {order.paymentMethod.replace("_", " ")}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#463b34] pt-4 border-t border-stone-100">
                <span>Total</span>
                <span>{formatRupiah(Number(order.totalAmount))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
