"use client";

import { useCartStore } from "@/app/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/routing";
import { Loader2, Minus, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { OrderTracking } from "./orderTracking";

function formatRupiah(amount: number) {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

interface CustomizationZone {
  image: string;
  fileName: string;
  label: string;
}

function getCustomizationDetails(customization: any): CustomizationZone[] | null {
  if (!customization) return null;
  try {
    const data = typeof customization === "string" ? JSON.parse(customization) : customization;
    if (data && data.zones) {
      return Object.values(data.zones) as CustomizationZone[];
    }
  } catch (e) {
    console.error("Failed to parse customization", e);
  }
  return null;
}

export default function CartPage() {
  const t = useTranslations("Cart");
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
  const totalItems = cartItems.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 pt-4">
      <div className="container">
        <Tabs defaultValue="cart">
          <TabsList className="bg-transparent border-b border-stone-200 rounded-none w-full justify-start h-auto p-0 mb-8 gap-0">
            <TabsTrigger
              value="cart"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-stone-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 mr-6 text-sm text-stone-400 data-[state=active]:text-stone-900 data-[state=active]:font-semibold px-0">
              {t("tabs.myCart")}
              {cartItems.length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-800 text-white text-[10px] font-bold">
                  {cartItems.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="tracking"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-stone-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none pb-3 mr-6 text-sm text-stone-400 data-[state=active]:text-stone-900 data-[state=active]:font-semibold px-0">
              {t("tabs.orderTracking")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cart" className="mt-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
                <p className="text-stone-400 text-sm italic tracking-widest">
                  {t("status.loading")}
                </p>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                <p className="text-stone-400 text-sm">{t("status.empty")}</p>
                <Button variant="link" asChild className="text-stone-600 p-0">
                  <Link href="/products">{t("status.continueShopping")}</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-base font-semibold text-stone-700 uppercase tracking-widest pb-3 border-b border-stone-200">
                  {t("table.product")}
                </p>

                <div className="flex flex-col">
                  {cartItems.map((item, i) => (
                    <div key={item.id}>
                      <div className="flex gap-5 py-6">
                        <div className="relative w-28 h-28 shrink-0 bg-stone-100 rounded-sm overflow-hidden border border-stone-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover p-1"
                            sizes="112px"
                          />
                        </div>

                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div>
                            <p className="text-sm font-semibold text-stone-800">
                              {item.name}
                            </p>

                            <div className="mt-1.5 flex flex-col gap-0.5 text-[11px] text-stone-500">
                              {item.materialType && (
                                <p>
                                  <span className="font-medium text-stone-600">
                                    {t("table.material")}:
                                  </span>{" "}
                                  {item.materialType}
                                </p>
                              )}
                              {item.dimensions && (
                                <p>
                                  <span className="font-medium text-stone-600">
                                    {t("table.dimensions")}:
                                  </span>{" "}
                                  {item.dimensions}
                                </p>
                              )}
                              {item.weight && (
                                <p>
                                  <span className="font-medium text-stone-600">
                                    {t("table.weight")}:
                                  </span>{" "}
                                  {item.weight}
                                </p>
                              )}
                            </div>

                            <p className="text-sm font-bold text-stone-800 mt-3">
                              {formatRupiah(item.price)}
                            </p>

                            {getCustomizationDetails(item.customization) && (
                              <div className="mt-3 p-2.5 bg-stone-100 rounded-sm border border-stone-200 self-start max-w-sm">
                                <p className="text-[9px] font-bold text-stone-600 uppercase tracking-widest mb-1.5">
                                  Logo Kustom:
                                </p>
                                <div className="flex flex-col gap-1.5">
                                  {getCustomizationDetails(item.customization)!.map((zone, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-[10px] text-stone-600">
                                      <div className="relative w-6 h-6 bg-white border border-stone-300 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                                        <img src={zone.image} alt={zone.label} className="w-full h-full object-contain" />
                                      </div>
                                      <div className="min-w-0">
                                        <span className="font-semibold text-stone-800 block leading-tight">{zone.label}</span>
                                        <span className="text-stone-400 text-[9px] truncate block max-w-[150px]">{zone.fileName}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between shrink-0">
                          <div className="flex flex-col items-end gap-2">
                            <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                              {t("table.qty")}
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
                            {t("table.remove")}
                          </Button>
                        </div>
                      </div>

                      {i < cartItems.length - 1 && (
                        <Separator className="bg-stone-200" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-end mt-4 gap-4 bg-stone-100/50 p-6 rounded-sm border border-stone-200">
                  <div className="flex justify-between w-full max-w-sm items-center">
                    <p className="text-xs text-stone-500 uppercase tracking-widest">
                      {t("summary.subtotal", { count: totalItems })}
                    </p>
                    <p className="text-xl font-bold text-stone-900">
                      {formatRupiah(totalPrice)}
                    </p>
                  </div>
                  <p className="text-[10px] text-stone-400 w-full max-w-sm text-right">
                    {t("summary.taxNote")}
                  </p>
                  <Button
                    asChild
                    className="w-full max-w-sm bg-[#463b34] hover:bg-stone-700 text-white text-xs font-bold tracking-widest uppercase rounded-sm py-6 mt-2">
                    <Link href="/checkout">{t("summary.checkout")}</Link>
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
