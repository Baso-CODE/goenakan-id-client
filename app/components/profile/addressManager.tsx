"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface Address {
  id: string;
  label: string;
  line1: string;
  line2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

type DialogMode = "add" | "edit" | null;

const INITIAL_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Home Address",
    line1: "Jl. Raya Malioboro No. 123",
    line2: "",
    city: "Gedong Tengen, Kota Yogyakarta",
    province: "Daerah Istimewa Yogyakarta",
    postalCode: "55271",
    country: "Indonesia",
    isDefault: true,
  },
];

const EMPTY_FORM: Omit<Address, "id" | "isDefault"> = {
  label: "",
  line1: "",
  line2: "",
  city: "",
  province: "",
  postalCode: "",
  country: "Indonesia",
};

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setDialogMode("add");
  };

  const openEdit = (address: Address) => {
    setForm({
      label: address.label,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      province: address.province,
      postalCode: address.postalCode,
      country: address.country,
    });
    setEditingId(address.id);
    setDialogMode("edit");
  };

  const handleSave = () => {
    if (dialogMode === "add") {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        ...form,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [...prev, newAddress]);
    } else if (dialogMode === "edit" && editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...form } : a)),
      );
    }
    setDialogMode(null);
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  const inputClass =
    "rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white text-sm";

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-bold tracking-widest text-stone-700 uppercase">
          Saved Addresses
        </h2>

        {/* Address Cards */}
        <div className="flex flex-col gap-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-stone-200 rounded-sm bg-stone-50 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                {/* Left: Label & Address */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {address.isDefault && (
                      <Badge className="bg-[#b5956a] text-white text-[10px] px-2 py-0.5 rounded-sm font-semibold tracking-wide">
                        DEFAULT
                      </Badge>
                    )}
                    <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                      {address.label}
                    </span>
                  </div>
                  <div className="text-sm text-stone-600 leading-relaxed">
                    <p>{address.line1}</p>
                    {address.line2 && <p>{address.line2}</p>}
                    <p>{address.city}</p>
                    <p>
                      {address.province}
                      {address.postalCode ? `, ${address.postalCode}` : ""}
                    </p>
                    <p>{address.country}</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    onClick={() => openEdit(address)}
                    className="text-xs text-stone-500 hover:text-stone-800 h-auto p-0 font-semibold tracking-wide uppercase">
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => handleSetDefault(address.id)}
                        className="text-[11px] text-stone-400 hover:text-stone-600 h-auto p-0">
                        Set as default
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(address.id)}
                        className="text-[11px] text-red-400 hover:text-red-600 h-auto p-0">
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Address */}
          <button
            onClick={openAdd}
            className="border border-stone-200 rounded-sm bg-white px-5 py-5 text-center text-xs font-semibold text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors tracking-widest uppercase">
            + Add New Address
          </button>
        </div>
      </div>

      {/* ── Dialog: Add / Edit ── */}
      <Dialog
        open={dialogMode !== null}
        onOpenChange={() => setDialogMode(null)}>
        <DialogContent className="sm:max-w-md rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-stone-800">
              {dialogMode === "add" ? "Add New Address" : "Edit Address"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-2">
            {/* Label */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-stone-500">Address Label</Label>
              <Input
                name="label"
                placeholder="e.g. Home Address, Office"
                value={form.label}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Line 1 */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-stone-500">Street Address</Label>
              <Input
                name="line1"
                placeholder="Jl. Raya No. 123"
                value={form.line1}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Line 2 */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-stone-500">
                Apartment, suite, etc. (optional)
              </Label>
              <Input
                name="line2"
                placeholder="Apartment, suite, etc."
                value={form.line2}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* City & Postal */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">City</Label>
                <Input
                  name="city"
                  placeholder="Kota Yogyakarta"
                  value={form.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">Postal Code</Label>
                <Input
                  name="postalCode"
                  placeholder="55271"
                  value={form.postalCode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Province */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-stone-500">Province</Label>
              <Input
                name="province"
                placeholder="Daerah Istimewa Yogyakarta"
                value={form.province}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Country */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-stone-500">Country</Label>
              <Input
                name="country"
                placeholder="Indonesia"
                value={form.country}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setDialogMode(null)}
              className="flex-1 rounded-sm border-stone-300 text-stone-600 text-sm">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.label || !form.line1 || !form.city}
              className="flex-1 bg-[#3d342b] hover:bg-[#2a2420] text-white rounded-sm text-sm">
              {dialogMode === "add" ? "Save Address" : "Update Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
