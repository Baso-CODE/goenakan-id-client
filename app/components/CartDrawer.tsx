"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

const cartItems = [
  {
    id: 1,
    name: "Custom Steel Tumbler",
    price: 19900,
    quantity: 1,
    image: "/images/products/tumbler.jpg",
  },
];

export default function CartDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <ShoppingBag className="h-5 w-5 text-gray-800" />
          {/* Badge Jumlah Item */}
          {cartItems.length > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] text-white">
              {cartItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-md flex flex-col bg-white">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className=" text-2xl uppercase tracking-widest text-gray-900">
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {/* List Item */}
        <div className="grow overflow-y-auto py-6">
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  {/* Foto Produk */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden bg-gray-100 relative">
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 italic">
                      PHOTO
                    </div>
                  </div>

                  {/* Detail Produk */}
                  <div className="flex flex-col grow justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Rp {item.price.toLocaleString()}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Pengatur Jumlah */}
                      <div className="flex items-center border border-gray-200">
                        <button className="p-1.5 hover:bg-gray-50 text-gray-600 transition-colors">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-4 text-xs font-medium">
                          {item.quantity}
                        </span>
                        <button className="p-1.5 hover:bg-gray-50 text-gray-600 transition-colors">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag className="h-12 w-12 text-gray-200 mb-4" />
              <p className="text-gray-400  italic">Your cart is empty</p>
            </div>
          )}
        </div>

        {/* Total & Checkout */}
        <SheetFooter className="border-t pt-6">
          <div className="w-full space-y-4">
            <div className="flex justify-between text-base font-bold text-gray-900 uppercase tracking-tight">
              <span>Subtotal</span>
              <span>Rp 19,900</span>
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">
              Taxes and shipping calculated at checkout
            </p>
            <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-none py-7 uppercase tracking-[0.2em] font-bold transition-all">
              Checkout Now
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
