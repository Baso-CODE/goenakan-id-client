/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { SnapOptions } from "@/app/types/midtrans/snapOptions.type";
import { apiUrl } from "@/app/utils/ApiUrl";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link, useRouter } from "@/i18n/routing";
import { Loader2, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Script from "next/script";
import { useEffect, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: SnapOptions) => void;
    };
  }
}
interface Address {
  isDefault: boolean;
  recipient?: string;
  phone?: string;
  country?: string;
  city?: string;
  fullAddress?: string;
}

const SHIPPING_COST = 10000;

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { cartItems, fetchCart } = useCartStore();

  const [addNote, setAddNote] = useState(false);
  const [note, setNote] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [form, setForm] = useState({
    email: session?.user?.email || "",
    fullName: session?.user?.name || "",
    phone: "",
    country: "Indonesia",
    city: "",
    address: "",
  });
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal + SHIPPING_COST;
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async () => {
    // 1. Validasi Sederhana
    if (!form.fullName || !form.phone || !form.address) {
      toast.error(
        "Mohon lengkapi Nama, Nomor Telepon, dan Detail Alamat Anda.",
      );
      return;
    }

    setIsProcessing(true);
    try {
      // 2. BUAT PESANAN (ORDER) DI DATABASE
      const createOrderRes = await fetch(`${apiUrl}/web-orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          form,
          items: cartItems,
          note,
          subtotal,
          shippingCost: SHIPPING_COST,
          totalAmount: total,
        }),
      });

      const orderData = await createOrderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.message || "Gagal membuat pesanan.");
      }

      const newOrderId = orderData.data.id;

      // 3. MINTA TOKEN MIDTRANS
      const payRes = await fetch(`${apiUrl}/web-orders/${newOrderId}/pay`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const payData = await payRes.json();

      if (!payData.success) {
        throw new Error("Gagal mendapatkan token pembayaran Midtrans.");
      }

      const snapToken = payData.data.token;

      // 4. MUNCULKAN POP-UP MIDTRANS
      // Tidak perlu lagi menulis 'result: any' karena sudah didefinisikan di interface SnapOptions
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          toast.success("Pembayaran berhasil!");
          router.push(`/order-success?id=${newOrderId}`);
        },
        onPending: function (result) {
          toast.info("Menunggu pembayaran Anda.");
          router.push(`/order-pending?id=${newOrderId}`);
        },
        onError: function (result) {
          toast.error("Pembayaran gagal.");
        },
        onClose: function () {
          toast.warning("Anda belum menyelesaikan pembayaran.");
          router.push(`/profile?tab=orders`);
        },
      });

      // Gunakan 'unknown' alih-alih 'any' untuk keamanan tipe
    } catch (error: unknown) {
      console.error(error);

      // Periksa apakah error ini adalah bentuk standar dari objek Error
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan pada sistem.";

      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const loadProfileAddress = async () => {
      if (!token) return;

      setIsLoadingProfile(true);
      try {
        const res = await fetch(`${apiUrl}/customer-profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();

        if (json.success && json.data) {
          const profile = json.data;
          const defaultAddress =
            profile.addresses?.find((a: Address) => a.isDefault) ||
            profile.addresses?.[0];

          setForm((prev) => ({
            ...prev,
            email: profile.user?.email || prev.email,
            fullName:
              defaultAddress?.recipient || profile.user?.name || prev.fullName,
            phone: defaultAddress?.phone || profile.phone || prev.phone,
            country: defaultAddress?.country || "Indonesia",
            city: defaultAddress?.city || "",
            address: defaultAddress?.fullAddress || "",
          }));
        }
      } catch (error) {
        console.error("Gagal memuat alamat", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfileAddress();

    if (cartItems.length === 0) {
      fetchCart(token);
    }
  }, [token, fetchCart]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Tampilan jika keranjang kosong
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 gap-4">
        <p className="text-stone-500 uppercase tracking-widest text-sm">
          Keranjang Anda kosong
        </p>
        <Button asChild className="bg-[#463b34] rounded-none">
          <Link href="/products">Kembali Belanja</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <div className="min-h-screen bg-stone-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
            {/* ── Left: Form ── */}
            <div className="flex flex-col gap-8">
              {/* Address Detail */}
              <div className="flex flex-col gap-4 relative">
                {isLoadingProfile && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-md">
                    <Loader2 className="w-6 h-6 animate-spin text-stone-500" />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-stone-800">
                    Address Detail
                  </h2>
                  {token && (
                    <Button
                      variant="link"
                      asChild
                      className="text-xs text-blue-500 p-0 h-auto">
                      <Link href="/profile?tab=address">Manage Addresses</Link>
                    </Button>
                  )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                  <Input
                    name="email"
                    type="email"
                    placeholder="E-mail Address (optional)"
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white"
                  />
                  <p className="text-[11px] text-stone-400 px-1">
                    Order detail will be send to your e-mail
                  </p>
                </div>

                {/* Full Name */}
                <Input
                  name="fullName"
                  placeholder="Full Name / Penerima"
                  value={form.fullName}
                  onChange={handleChange}
                  className="rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white"
                />

                {/* Phone */}
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white"
                />

                {/* Country */}
                <div className="relative">
                  <Label className="absolute top-2 left-3 text-[10px] text-stone-400">
                    Country
                  </Label>
                  <Input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white pt-6 pb-2"
                  />
                </div>

                {/* City with search icon */}
                <div className="relative">
                  <Input
                    name="city"
                    placeholder="Kota dan Kecamatan"
                    value={form.city}
                    onChange={handleChange}
                    className="rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                </div>

                {/* Detail Address */}
                <div className="relative">
                  <Textarea
                    name="address"
                    placeholder="Detail Address (Nama Jalan, No Rumah, RT/RW)"
                    value={form.address}
                    onChange={handleChange}
                    rows={4}
                    maxLength={300}
                    className="rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white resize-none"
                  />
                  <span className="absolute bottom-2 right-3 text-[10px] text-stone-400">
                    {form.address.length}/300
                  </span>
                </div>
              </div>

              <Separator className="bg-stone-200" />

              {/* Payment */}
              <div className="flex flex-col gap-3">
                <div>
                  <h2 className="text-base font-semibold text-stone-800">
                    Payment
                  </h2>
                  <p className="text-xs text-stone-400 mt-0.5">
                    All transactions are secure and encrypted.
                  </p>
                </div>

                {/* Payment option */}
                <div className="border border-stone-300 rounded-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-white">
                    <p className="text-sm text-stone-700">
                      Xendit – Cards, Bank Transfers, QR, Ewallets
                    </p>
                    <Image
                      src="/images/xendit-logo.png"
                      alt="Xendit"
                      width={48}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  <div className="bg-stone-50 px-4 py-4 text-center border-t border-stone-200">
                    <p className="text-xs text-stone-500 leading-relaxed">
                      You&apos;ll be redirected to Xendits – Cards, Bank
                      Transfers,
                      <br />
                      WR, Ewallets to complete your purchase.
                    </p>
                  </div>
                </div>
              </div>

              {/* Return to Cart */}
              <div>
                <Button
                  variant="link"
                  asChild
                  className="p-0 h-auto text-sm text-stone-500 hover:text-stone-800">
                  <Link href="/cart">
                    <span className="mr-1">←</span> Return to Cart
                  </Link>
                </Button>
              </div>
            </div>

            {/* ── Right: Order Summary ── */}
            <div className="sticky top-24 flex flex-col gap-4">
              <div className="border border-stone-200 rounded-sm bg-white overflow-hidden">
                {/* Order Items */}
                <div className="flex flex-col divide-y divide-stone-100 max-h-100 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 p-3">
                      {/* Image with qty badge */}
                      <div className="relative w-14 h-14 shrink-0 bg-stone-100 rounded-sm overflow-hidden border border-stone-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover p-1"
                          sizes="56px"
                        />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-stone-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col flex-1 min-w-0 gap-0.5">
                        <p className="text-xs font-semibold text-stone-800 leading-tight">
                          {item.name}
                        </p>

                        {/* Render Spesifikasi Dinamis */}
                        <div className="mt-0.5 flex flex-col gap-0.5 text-[10px] text-stone-500">
                          {item.materialType && (
                            <p>
                              <span className="font-medium text-stone-600">
                                Bahan:
                              </span>{" "}
                              {item.materialType}
                            </p>
                          )}
                          {item.dimensions && (
                            <p>
                              <span className="font-medium text-stone-600">
                                Dimensi:
                              </span>{" "}
                              {item.dimensions}
                            </p>
                          )}
                          {item.weight && (
                            <p>
                              <span className="font-medium text-stone-600">
                                Berat:
                              </span>{" "}
                              {item.weight}
                            </p>
                          )}
                          {/* Opsional: Render warna/atribut lainnya jika ada dari varian */}
                          {/* {item.color && <p><span className="font-medium text-stone-600">Warna:</span> {item.color}</p>} */}
                        </div>
                      </div>

                      {/* Price */}
                      <p className="text-xs font-semibold text-stone-800 shrink-0">
                        {formatRupiah(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="bg-stone-100" />
                {/* Add Note */}
                <div className="px-3 py-3 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="addNote"
                      checked={addNote}
                      onCheckedChange={(v) => setAddNote(!!v)}
                      className="rounded-sm"
                    />
                    <Label
                      htmlFor="addNote"
                      className="text-xs text-stone-500 cursor-pointer">
                      Add a note to your order
                    </Label>
                  </div>
                  {addNote && (
                    <Textarea
                      placeholder="Catatan untuk pesanan..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      className="rounded-sm border-stone-200 text-xs resize-none focus-visible:ring-stone-400"
                    />
                  )}
                </div>
                <Separator className="bg-stone-100" />
                {/* Pricing */}
                <div className="px-3 py-3 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-stone-500">
                      Subtotal · {totalQty} products
                    </p>
                    <p className="text-xs text-stone-700 font-medium">
                      {formatRupiah(subtotal)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-stone-500">
                      Pengiriman · 100 gr
                    </p>
                    <p className="text-xs text-stone-700 font-medium">
                      {formatRupiah(SHIPPING_COST)}
                    </p>
                  </div>
                </div>
                <Separator className="bg-stone-100" />
                <div className="px-3 py-3 flex justify-between items-center">
                  <p className="text-sm font-semibold text-stone-800">
                    Total Payment
                  </p>
                  <p className="text-sm font-bold text-stone-900">
                    {formatRupiah(total)}
                  </p>
                </div>
                {/* Place Order */}
                <div className="px-3 pb-4 flex flex-col gap-2">
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-[#463b34] hover:bg-stone-700 text-white text-xs font-bold tracking-widest uppercase rounded-none py-5 disabled:opacity-70">
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        MEMPROSES...
                      </>
                    ) : (
                      "PLACE ORDER"
                    )}
                  </Button>
                  <p className="text-[10px] text-stone-400 text-center leading-relaxed">
                    By proceeding with your purchase you agree to our{" "}
                    <Link
                      href="/terms"
                      className="underline hover:text-stone-600">
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="underline hover:text-stone-600">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
