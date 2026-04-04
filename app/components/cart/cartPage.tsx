"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { OrderTracking } from "./orderTracking";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  dimensions?: string;
  weight?: string;
  color?: string;
  material?: string;
}

const INITIAL_CART: CartItem[] = [
  {
    id: 1,
    name: "Bamboo Pen",
    price: 5000,
    quantity: 1,
    image: "/images/products/demo-products.png",
    dimensions: "7.5 × 12 cm",
    weight: "5 kg",
    color: "Coklat",
    material: "Bamboo",
  },
  {
    id: 2,
    name: "Bamboo Pen",
    price: 5000,
    quantity: 1,
    image: "/images/products/demo-products.png",
    dimensions: "7.5 × 12 cm",
    weight: "5 kg",
    color: "Coklat",
    material: "Bamboo",
  },
];

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);

  const updateQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs defaultValue="cart">
          {/* Tab List */}
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

            {/* <TabsTrigger
              value="login"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-stone-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 text-sm text-stone-400 data-[state=active]:text-stone-900 data-[state=active]:font-semibold px-0">
              Login
            </TabsTrigger> */}
          </TabsList>

          {/* ── Cart Tab ── */}
          <TabsContent value="cart" className="mt-0">
            {cartItems.length === 0 ? (
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
                        {/* Image */}
                        <div className="relative w-28 h-28 shrink-0 bg-stone-100 rounded-sm overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                            sizes="112px"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <p className="text-sm font-semibold text-stone-800">
                              {item.name}
                            </p>
                            <div className="mt-1 flex flex-col gap-0.5">
                              {item.dimensions && (
                                <p className="text-sm text-stone-600">
                                  Dimensi: {item.dimensions}
                                </p>
                              )}
                              {item.weight && (
                                <p className="text-sm text-stone-600">
                                  Berat: {item.weight}
                                </p>
                              )}
                              {item.color && (
                                <p className="text-sm text-stone-600">
                                  Warna: {item.color}
                                </p>
                              )}
                              {item.material && (
                                <p className="text-sm text-stone-600">
                                  Bahan: {item.material}
                                </p>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-stone-800 mt-3">
                              {formatRupiah(item.price)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity & Remove */}
                        <div className="flex flex-col items-end justify-between shrink-0">
                          <div className="flex flex-col items-end gap-2">
                            <p className="text-xs text-stone-500 font-medium">
                              Quantity:
                            </p>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-6 h-6 rounded-sm border-stone-300"
                                onClick={() => updateQty(item.id, -1)}
                                disabled={item.quantity <= 1}>
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm w-6 text-center font-medium text-stone-800">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="w-6 h-6 rounded-sm border-stone-300"
                                onClick={() => updateQty(item.id, 1)}>
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          <Button
                            variant="link"
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-stone-600 p-0 h-auto hover:text-red-500 underline underline-offset-2">
                            Remove
                          </Button>
                        </div>
                      </div>

                      {i < cartItems.length - 1 && (
                        <Separator className="bg-stone-100" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-2">
                  <Link href="/checkout">
                    <Button className="bg-[#463b34] hover:bg-stone-700 text-white text-xs font-bold tracking-widest uppercase rounded-none px-16 py-6">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Order Tracking Tab ── */}
          <TabsContent value="tracking" className="mt-0">
            <OrderTracking />
          </TabsContent>

          {/* ── Login Tab ── */}
          {/* <TabsContent value="login" className="mt-0">
            <div className="flex flex-col items-center justify-center py-12 gap-4 max-w-sm mx-auto w-full">
              <h2 className="text-lg font-semibold text-stone-800 self-start">
                Login
              </h2>
              <Input
                type="email"
                placeholder="Email"
                className="rounded-sm border-stone-300 focus-visible:ring-stone-400"
              />
              <Input
                type="password"
                placeholder="Password"
                className="rounded-sm border-stone-300 focus-visible:ring-stone-400"
              />
              <Button className="w-full bg-stone-800 hover:bg-stone-700 rounded-sm">
                Login
              </Button>
            </div>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
