"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/routing";
import { Loader2, Minus, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import { OrderTracking } from "./orderTracking";

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function CartPage() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const { cartItems, loading, fetchCart, updateQty, removeItem } =
    useCartStore();

  useEffect(() => {
    fetchCart(token);
  }, [token, fetchCart]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs defaultValue="cart">
          <TabsList className="bg-transparent border-b border-stone-200 rounded-none w-full justify-start h-auto p-0 mb-8 gap-0">
            <TabsTrigger
              value="cart"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-stone-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 mr-6 text-sm text-stone-400 data-[state=active]:text-stone-900 data-[state=active]:font-semibold px-0">
              My Cart
              {cartItems.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-800 text-white text-[10px] font-bold">
                  {cartItems.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="tracking"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-stone-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 mr-6 text-sm text-stone-400 data-[state=active]:text-stone-900 data-[state=active]:font-semibold px-0">
              Order Tracking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cart" className="mt-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
                <p className="text-stone-400 text-sm italic tracking-widest">
                  Updating your cart...
                </p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                <p className="text-stone-400 text-sm">Your cart is empty.</p>
                <Button variant="link" asChild className="text-stone-600 p-0">
                  <Link href="/products">Continue shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-base font-semibold text-stone-700 uppercase tracking-widest pb-3 border-b border-stone-200">
                  Product
                </p>

                <div className="flex flex-col">
                  {cartItems.map((item, i) => (
                    <div key={item.id}>
                      <div className="flex gap-5 py-6">
                        {/* ── Image ── */}
                        <div className="relative w-28 h-28 shrink-0 bg-stone-100 rounded-sm overflow-hidden border border-stone-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover p-1"
                            sizes="112px"
                          />
                        </div>

                        {/* ── Info & Details ── */}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <p className="text-sm font-semibold text-stone-800">
                              {item.name}
                            </p>

                            {/* ✨ Render Dinamis Spesifikasi Produk ✨ */}
                            <div className="mt-1.5 flex flex-col gap-0.5 text-[11px] text-stone-500">
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
                              {/* Opsional: Tampilkan tipe varian (misal warna) jika ada di struktur data kamu */}
                              {/* {item.color && <p>Warna: {item.color}</p>} */}
                            </div>

                            <p className="text-sm font-bold text-stone-800 mt-3">
                              {formatRupiah(item.price)}
                            </p>
                          </div>
                        </div>

                        {/* ── Quantity & Actions ── */}
                        <div className="flex flex-col items-end justify-between shrink-0">
                          <div className="flex flex-col items-end gap-2">
                            <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                              Qty
                            </p>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-6 h-6 rounded-sm border-stone-300"
                                onClick={() => updateQty(item.id, -1, token)}
                                disabled={item.quantity <= 1}>
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm w-8 text-center font-medium text-stone-800">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-6 h-6 rounded-sm border-stone-300"
                                onClick={() => updateQty(item.id, 1, token)}>
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <Button
                            variant="link"
                            onClick={() => removeItem(item.id, token)}
                            className="text-[11px] text-stone-500 p-0 h-auto hover:text-red-600 uppercase tracking-wider transition-colors">
                            Remove
                          </Button>
                        </div>
                      </div>

                      {i < cartItems.length - 1 && (
                        <Separator className="bg-stone-200" />
                      )}
                    </div>
                  ))}
                </div>

                {/* ── Subtotal & Checkout ── */}
                <div className="flex flex-col items-end mt-4 gap-4 bg-stone-100/50 p-6 rounded-sm border border-stone-200">
                  <div className="flex justify-between w-full max-w-sm items-center">
                    <p className="text-xs text-stone-500 uppercase tracking-widest">
                      Subtotal ({cartItems.reduce((a, b) => a + b.quantity, 0)}{" "}
                      items)
                    </p>
                    <p className="text-xl font-bold text-stone-900">
                      {formatRupiah(totalPrice)}
                    </p>
                  </div>
                  <p className="text-[10px] text-stone-400 w-full max-w-sm text-right">
                    Taxes and shipping calculated at checkout
                  </p>
                  <Button
                    asChild
                    className="w-full max-w-sm bg-[#463b34] hover:bg-stone-700 text-white text-xs font-bold tracking-widest uppercase rounded-sm py-6 mt-2">
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tracking" className="mt-0">
            <OrderTracking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
