"use client";

import { apiUrl } from "@/app/utils/ApiUrl";
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

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ExtendedSession {
  user: {
    accessToken: string;
    // Add other user properties if needed
  };
}

interface Address {
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

type DialogMode = "add" | "edit" | null;

const EMPTY_FORM = {
  label: "",
  recipient: "",
  phone: "",
  country: "Indonesia",
  province: "",
  city: "",
  district: "",
  postalCode: "",
  fullAddress: "",
};

export function AddressManager() {
  const { data: session, status } = useSession();

  // Pastikan mengambil token dengan benar
  const token = (session as ExtendedSession)?.user?.accessToken;
  console.log("ini adalah token", token);

  const [addresses, setAddresses] = useState<Address[]>([]);

  const [loading, setLoading] = useState(true);

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  // === FETCH API: GET ALL ADDRESSES ===
  const fetchAddresses = async () => {
    if (status === "loading") return;
    if (!token) {
      console.warn("Token tidak ditemukan, pastikan sudah login.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setAddresses(json.data);
      }
    } catch (error) {
      console.error("Failed to fetch addresses", error);
      toast.error("Gagal memuat alamat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  // === HANDLERS ===
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
      recipient: address.recipient,
      phone: address.phone,
      country: address.country || "",
      province: address.province || "",
      city: address.city || "",
      district: address.district || "",
      postalCode: address.postalCode || "",
      fullAddress: address.fullAddress,
    });
    setEditingId(address.id);
    setDialogMode("edit");
  };

  // === FETCH API: CREATE & UPDATE ===
  const handleSave = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      const url =
        dialogMode === "add"
          ? `${apiUrl}/addresses`
          : `${apiUrl}/addresses/${editingId}`;

      const method = dialogMode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (json.success) {
        toast.success(json.message);
        fetchAddresses(); // Refresh list alamat dari database
        setDialogMode(null);
      } else {
        toast.error(json.message || "Gagal menyimpan alamat");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsSaving(false);
    }
  };

  // === FETCH API: SET DEFAULT ===
  const handleSetDefault = async (id: string) => {
    if (!token) return;
    try {
      // Optimistic Update (UI langsung berubah biar terasa cepat)
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id })),
      );

      // Background request
      await fetch(`${apiUrl}/addresses/${id}/set-default`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error setting default:", error);
      fetchAddresses(); // Revert ke aslinya jika gagal
    }
  };

  // === FETCH API: DELETE ===
  const handleDelete = async (id: string) => {
    if (!token) return;
    const confirmDelete = window.confirm("Yakin ingin menghapus alamat ini?");
    if (!confirmDelete) return;

    try {
      // Optimistic Update
      setAddresses((prev) => prev.filter((a) => a.id !== id));

      await fetch(`${apiUrl}/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ambil ulang dari server barangkali ada default yang berubah
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      fetchAddresses(); // Revert
    }
  };

  const inputClass =
    "rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white text-sm";

  if (loading) {
    return <div className="text-sm text-stone-500">Memuat alamat...</div>;
  }

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

                  {/* ✨ 3. Tampilan disesuaikan dengan field baru */}
                  <div className="text-sm text-stone-600 leading-relaxed">
                    <p className="font-semibold text-stone-800">
                      {address.recipient} — {address.phone}
                    </p>
                    <p>{address.fullAddress}</p>
                    <p>
                      {address.district ? `${address.district}, ` : ""}
                      {address.city}
                    </p>
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
                    className="text-xs text-stone-500 hover:text-stone-800 h-auto p-0 font-semibold tracking-wide uppercase cursor-pointer">
                    Edit
                  </Button>
                  {!address.isDefault && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => handleSetDefault(address.id)}
                        className="text-[11px] text-stone-400 hover:text-stone-600 h-auto p-0 cursor-pointer">
                        Set as default
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(address.id)}
                        className="text-[11px] text-red-400 hover:text-red-600 h-auto p-0 cursor-pointer">
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
            className="border border-stone-200 rounded-sm bg-white px-5 py-5 text-center text-xs font-semibold text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors tracking-widest uppercase cursor-pointer">
            + Add New Address
          </button>
        </div>
      </div>

      {/* ── Dialog: Add / Edit ── */}
      <Dialog
        open={dialogMode !== null}
        onOpenChange={() => setDialogMode(null)}>
        <DialogContent className="sm:max-w-xl rounded-sm max-h-[90vh] overflow-y-auto">
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
                placeholder="e.g. Home, Office"
                value={form.label}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Recipient & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">Recipient Name</Label>
                <Input
                  name="recipient"
                  placeholder="John Doe"
                  value={form.recipient}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">Phone Number</Label>
                <Input
                  name="phone"
                  placeholder="08123456789"
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Full Address */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-stone-500">Full Address</Label>
              <textarea
                name="fullAddress"
                rows={3}
                placeholder="Jl. Sudirman No. 12, RT 01/RW 02..."
                value={form.fullAddress}
                onChange={handleChange}
                className={`p-3 border resize-none ${inputClass}`}
              />
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">
                  District / Kecamatan
                </Label>
                <Input
                  name="district"
                  placeholder="Kec. Gondomanan"
                  value={form.district}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">
                  City / Kabupaten
                </Label>
                <Input
                  name="city"
                  placeholder="Yogyakarta"
                  value={form.city}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">Province</Label>
                <Input
                  name="province"
                  placeholder="DIY"
                  value={form.province}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">Postal Code</Label>
                <Input
                  name="postalCode"
                  placeholder="55122"
                  value={form.postalCode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
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
              disabled={
                !form.label ||
                !form.recipient ||
                !form.phone ||
                !form.fullAddress ||
                isSaving
              }
              className="flex-1 bg-[#3d342b] hover:bg-[#2a2420] text-white rounded-sm text-sm">
              {isSaving
                ? "Saving..."
                : dialogMode === "add"
                  ? "Save Address"
                  : "Update Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
