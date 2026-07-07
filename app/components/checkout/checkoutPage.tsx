/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { SnapOptions } from "@/app/types/midtrans/snapOptions.type";
import { apiUrl } from "@/app/utils/ApiUrl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Loader2, Lock, MapPin, ShieldCheck, X } from "lucide-react";
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

interface CustomerAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  country: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  fullAddress: string;
  isDefault: boolean;
}

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

interface CustomizationZone {
  image: string;
  fileName: string;
  label: string;
  logoCount?: number;
}

function getCustomizationDetails(
  customization: string,
): CustomizationZone[] | null {
  if (!customization) return null;
  try {
    const data =
      typeof customization === "string"
        ? JSON.parse(customization)
        : customization;
    if (data && data.zones) {
      return Object.values(data.zones) as CustomizationZone[];
    }
  } catch (e) {
    console.error("Failed to parse customization", e);
  }
  return null;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { cartItems, fetchCart, clearCart } = useCartStore();

  const [addNote, setAddNote] = useState(false);
  const [note, setNote] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [userAddresses, setUserAddresses] = useState<CustomerAddress[]>([]);
  console.log("ini adalah userAddress", userAddresses);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const [form, setForm] = useState({
    email: session?.user?.email || "",
    fullName: "",
    phone: "",
    country: "Indonesia",
    province: "",
    city: "",
    district: "",
    postalCode: "",
    address: "",
    label: "",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Total sekarang sama dengan subtotal karena tidak ada biaya pengiriman
  const total = subtotal;
  const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [isProcessing, setIsProcessing] = useState(false);

  const applyAddressToForm = (addr: CustomerAddress) => {
    setForm((prev) => ({
      ...prev,
      fullName: addr.recipient,
      phone: addr.phone,
      country: addr.country || "Indonesia",
      province: addr.province || "",
      city: addr.city || "",
      district: addr.district || "",
      postalCode: addr.postalCode || "",
      address: addr.fullAddress,
      label: addr.label,
    }));
  };

  const handlePlaceOrder = async () => {
    if (!form.fullName || !form.phone || !form.address) {
      toast.error("Mohon lengkapi data pengiriman Anda.");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Buat Order
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
          shippingCost: 0, // Set nilai pengiriman menjadi 0
          totalAmount: total,
        }),
      });

      const orderData = await createOrderRes.json();
      if (!orderData.success)
        throw new Error(orderData.message || "Gagal membuat pesanan.");

      const newOrderId = orderData.data.id;

      // 2. Minta Token Pembayaran
      const payRes = await fetch(`${apiUrl}/web-orders/${newOrderId}/pay`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });

      const payData = await payRes.json();
      if (!payData.success)
        throw new Error("Gagal mendapatkan token pembayaran.");

      const snapTokenFromApi = payData.data.token;

      // 3. Munculkan Pop-up Midtrans
      window.snap.pay(snapTokenFromApi, {
        onSuccess: async function (result) {
          toast.success("Pembayaran berhasil!");
          await clearCart(token || undefined);
          router.push(`/order-status?id=${newOrderId}&status=success`);
        },
        onPending: async function (result) {
          toast.info("Menunggu pembayaran Anda.");
          await clearCart(token || undefined);
          router.push(`/order-status?id=${newOrderId}&status=pending`);
        },
        onError: function (result) {
          toast.error("Pembayaran gagal.");
        },
        onClose: async function () {
          toast.warning("Anda belum menyelesaikan pembayaran.");
          await clearCart(token || undefined);

          if (token) {
            router.push(`/profile?tab=orders`);
          } else {
            router.push(`/order-status?id=${newOrderId}&status=pending`);
          }
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(errorMessage || "Terjadi kesalahan.");
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
          const addresses = profile.addresses || [];
          setUserAddresses(addresses);

          const defaultAddr =
            addresses.find((a: CustomerAddress) => a.isDefault) || addresses[0];
          if (defaultAddr) applyAddressToForm(defaultAddr);

          setForm((prev) => ({
            ...prev,
            email: profile.user?.email || prev.email,
          }));
        }
      } catch (error) {
        console.error("Gagal memuat profil", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfileAddress();
    if (cartItems.length === 0) fetchCart(token);
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

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
        <div className="container ">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
            {/* ── Left Side ── */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4 relative">
                {isLoadingProfile && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-md">
                    <Loader2 className="w-6 h-6 animate-spin text-stone-500" />
                  </div>
                )}

                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-stone-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Shipping Address
                  </h2>
                  {token && userAddresses.length > 0 && (
                    <Button
                      variant="link"
                      onClick={() => setShowAddressModal(true)}
                      className="text-xs text-blue-600 p-0 h-auto font-bold uppercase tracking-tighter">
                      Change Address
                    </Button>
                  )}
                </div>

                {/* Email Section */}
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold text-stone-400 ml-1">
                    Contact Email
                  </Label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Order detail will be sent to this email"
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-none border-stone-300 bg-white"
                  />
                </div>

                {/* Address Selection / Manual Form */}
                {token && userAddresses.length > 0 ? (
                  <div className="p-4 border border-stone-200 bg-white shadow-sm space-y-2">
                    <Badge
                      variant="outline"
                      className="text-[9px] uppercase rounded-none border-stone-300 text-stone-500 font-bold">
                      {form.label || "Address"}
                    </Badge>
                    <div className="flex flex-col gap-0.5">
                      <p className="text-sm font-bold text-stone-800">
                        {form.fullName}
                      </p>
                      <p className="text-xs text-stone-500">{form.phone}</p>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {form.address}
                      </p>
                      <p className="text-xs text-stone-400 font-medium uppercase">
                        {form.district ? `${form.district}, ` : ""}
                        {form.city}, {form.province} {form.postalCode}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="fullName"
                      placeholder="Recipient Name"
                      value={form.fullName}
                      onChange={handleChange}
                      className="rounded-none border-stone-300 bg-white"
                    />
                    <Input
                      name="phone"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={handleChange}
                      className="rounded-none border-stone-300 bg-white"
                    />
                    <Input
                      name="province"
                      placeholder="Province"
                      value={form.province}
                      onChange={handleChange}
                      className="rounded-none border-stone-300 bg-white"
                    />
                    <Input
                      name="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                      className="rounded-none border-stone-300 bg-white"
                    />
                    <Input
                      name="district"
                      placeholder="District (Kecamatan)"
                      value={form.district}
                      onChange={handleChange}
                      className="rounded-none border-stone-300 bg-white"
                    />
                    <Input
                      name="postalCode"
                      placeholder="Postal Code"
                      value={form.postalCode}
                      onChange={handleChange}
                      className="rounded-none border-stone-300 bg-white"
                    />
                    <div className="md:col-span-2">
                      <Textarea
                        name="address"
                        placeholder="Full Address (Street, House No, etc.)"
                        value={form.address}
                        onChange={handleChange}
                        rows={3}
                        className="rounded-none border-stone-300 bg-white resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
              <Separator />

              {/* Payment Info */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-stone-800">
                    Payment Method
                  </h2>
                  <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold uppercase tracking-tighter">
                    <ShieldCheck className="w-3 h-3" />
                    Secure Payment
                  </div>
                </div>

                <div className="border border-stone-200 rounded-none bg-white overflow-hidden">
                  <div className="bg-stone-50 p-4 border-b border-stone-100 flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <p className="text-xs font-bold text-stone-700">
                        Midtrans Payment Gateway
                      </p>
                      <p className="text-[10px] text-stone-500 uppercase tracking-tight flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Encrypted & Secured
                      </p>
                    </div>
                    <Image
                      src="/images/midtrans-payment.png"
                      alt="Midtrans"
                      width={70}
                      height={18}
                      className="object-contain transition-all"
                    />
                  </div>

                  <div className="p-4 space-y-5">
                    {/* Category: E-Wallet & QRIS */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                        QRIS & E-Wallet
                      </p>
                      <div className="flex flex-wrap gap-2 items-center transition-all duration-300">
                        <div className="relative h-12 w-30">
                          <Image
                            src="/images/payment/qris.png"
                            alt="QRIS"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-12 w-20">
                          <Image
                            src="/images/payment/gopay_landscape.png"
                            alt="GoPay"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-4 w-20">
                          <Image
                            src="/images/payment/shopeepay.png"
                            alt="ShopeePay"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category: Virtual Accounts */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                        Virtual Account (VA)
                      </p>
                      <div className="flex flex-wrap gap-3 items-center transition-all duration-300">
                        <div className="relative h-4 w-12">
                          <Image
                            src="/images/payment/bca.png"
                            alt="BCA"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-5 w-16">
                          <Image
                            src="/images/payment/mandiri.png"
                            alt="Mandiri"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-4 w-12">
                          <Image
                            src="/images/payment/bni.png"
                            alt="BNI"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-4 w-12">
                          <Image
                            src="/images/payment/bri.png"
                            alt="BRI"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-6 w-24">
                          <Image
                            src="/images/payment/permata_bank.png"
                            alt="Permata"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-8 w-24">
                          <Image
                            src="/images/payment/cimbniaga.png"
                            alt="Cimb Niaga"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-8 w-24">
                          <Image
                            src="/images/payment/maybank.png"
                            alt="May Bank"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-8 w-24">
                          <Image
                            src="/images/payment/bank_mega.png"
                            alt="Bank Mega"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category: Cards */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                        Credit / Debit Card
                      </p>
                      <div className="flex flex-wrap gap-5 items-center transition-all duration-300">
                        <div className="relative h-5 w-10">
                          <Image
                            src="/images/payment/visa.png"
                            alt="Visa"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-5 w-10">
                          <Image
                            src="/images/payment/mastercard.png"
                            alt="Mastercard"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-5 w-10">
                          <Image
                            src="/images/payment/jcb.png"
                            alt="JCB"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-5 w-16">
                          <Image
                            src="/images/payment/american_express.png"
                            alt="Amex"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Category: Convenience Store */}
                    <div className="space-y-3">
                      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                        Convenience Store
                      </p>
                      <div className="flex flex-wrap gap-5 items-center transition-all duration-300">
                        <div className="relative h-5 w-14">
                          <Image
                            src="/images/payment/alfamart.png"
                            alt="Alfamart"
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="relative h-5 w-14">
                          <Image
                            src="/images/payment/indomaret.png"
                            alt="Indomaret"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3 text-center border-t border-stone-100">
                    <p className="text-[9px] text-stone-400 leading-relaxed italic">
                      Anda akan diarahkan ke halaman pembayaran aman Midtrans
                      untuk menyelesaikan transaksi.
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="link"
                asChild
                className="p-0 h-auto text-xs text-stone-400 hover:text-stone-800 uppercase tracking-widest font-bold">
                <Link href="/cart">← Return to Cart</Link>
              </Button>
            </div>

            {/* ── Right Side: Summary ── */}
            <div className="sticky top-24">
              <div className="border border-stone-200 rounded-none bg-white shadow-sm overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-200 font-bold uppercase text-xs tracking-widest text-stone-800">
                  Order Summary
                </div>

                <div className="flex flex-col divide-y divide-stone-100 max-h-80 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 p-4">
                      <div className="relative w-16 h-16 shrink-0 bg-stone-100 border border-stone-200">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover p-1"
                          sizes="64px"
                        />
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-[#463b34] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex flex-col flex-1 min-w-0 gap-1">
                        <p className="text-[11px] font-bold text-stone-800 leading-tight uppercase">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-stone-400 italic">
                          {item.materialType}
                        </p>
                        <p className="text-xs font-bold text-stone-800 mt-1">
                          {formatRupiah(item.price)}
                        </p>
                        {getCustomizationDetails(item.customization) && (
                          <div className="mt-1.5 p-1.5 bg-stone-100 rounded-sm border border-stone-200 self-start max-w-full">
                            <p className="text-[8px] font-bold text-stone-600 uppercase tracking-widest mb-1">
                              Logo Kustom:
                            </p>
                            <div className="flex flex-col gap-1">
                              {getCustomizationDetails(item.customization)!.map(
                                (zone, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-1.5 text-[9px] text-stone-600">
                                    <div className="relative w-5 h-5 bg-white border border-stone-300 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                                      <Image
                                        width={100}
                                        height={100}
                                        src={zone.image}
                                        alt={zone.label}
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <span className="font-semibold text-stone-800 block leading-none">
                                        {zone.label}{" "}
                                        {zone.logoCount && zone.logoCount > 1
                                          ? `(x${zone.logoCount})`
                                          : ""}
                                      </span>
                                      <span className="text-stone-400 text-[8px] truncate block max-w-30">
                                        {zone.fileName}
                                      </span>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-3 bg-white border-t border-stone-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="addNote"
                      checked={addNote}
                      onCheckedChange={(v) => setAddNote(!!v)}
                      className="rounded-none border-stone-300"
                    />
                    <Label
                      htmlFor="addNote"
                      className="text-[11px] text-stone-500 cursor-pointer uppercase font-bold tracking-tighter">
                      Add a note to your order
                    </Label>
                  </div>
                  {addNote && (
                    <Textarea
                      placeholder="Contoh: Packing kayu, atau warna cadangan..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      className="rounded-none border-stone-200 border-2 text-xs resize-none focus-visible:ring-stone-400"
                    />
                  )}
                </div>

                <div className="p-4 space-y-3 bg-white border-t border-stone-200">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">
                      Subtotal ({totalQty} items)
                    </span>
                    <span className="font-bold text-stone-800">
                      {formatRupiah(subtotal)}
                    </span>
                  </div>
                  {/* Bagian Flat Shipping dihapus dari sini */}
                  <Separator />
                  <div className="flex justify-between items-center py-2 font-bold uppercase tracking-widest text-stone-900">
                    <span className="text-sm">Total</span>
                    <span className="text-base">{formatRupiah(total)}</span>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-[#463b34] hover:bg-stone-800 text-white text-xs font-bold tracking-[0.2em] rounded-none py-6 transition-all">
                    {isProcessing ? "PROCESSING..." : "CONFIRM ORDER"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✨ Modal Choice Address */}
      {showAddressModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-lg bg-white rounded-none shadow-2xl overflow-hidden border-none">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h3 className="font-bold uppercase text-xs tracking-[0.2em] text-stone-800">
                My Saved Addresses
              </h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="hover:rotate-90 transition-transform">
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {userAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
                    applyAddressToForm(addr);
                    setShowAddressModal(false);
                  }}
                  className={cn(
                    "p-4 border cursor-pointer transition-all group relative",
                    form.address === addr.fullAddress
                      ? "border-[#463b34] bg-stone-50/50"
                      : "border-stone-200 hover:border-stone-400",
                  )}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="text-[9px] uppercase rounded-none border-stone-300 font-bold px-2">
                      {addr.label}
                    </Badge>
                    {addr.isDefault && (
                      <Badge className="bg-blue-600 text-[8px] uppercase rounded-none px-2 font-bold border-none text-white">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-bold text-stone-800 mb-0.5">
                    {addr.recipient}
                  </p>
                  <p className="text-xs text-stone-500 mb-2">{addr.phone}</p>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {addr.fullAddress}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1 uppercase font-medium">
                    {addr.district}, {addr.city}, {addr.province},{" "}
                    {addr.postalCode}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-stone-100 bg-stone-50 text-center">
              <Button
                asChild
                variant="outline"
                className="w-full rounded-none border-stone-300 text-[10px] font-bold tracking-widest uppercase py-6">
                <Link href="/profile?tab=address">+ Add New Address</Link>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
