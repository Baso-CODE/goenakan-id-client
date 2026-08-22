/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { apiUrl } from "@/app/utils/ApiUrl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ==========================================
// KONFIGURASI API WILAYAH
// ==========================================
const WILAYAH_BASE_PATH = "/wilayah";
const GLOBAL_API_URL = "https://countriesnow.space/api/v0.1";

const countriesList = [
  { name: "Indonesia", code: "ID", flag: "🇮🇩" },
  { name: "Malaysia", code: "MY", flag: "🇲🇾" },
  { name: "Singapore", code: "SG", flag: "🇸🇬" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
];

interface ExtendedSession {
  user: {
    accessToken: string;
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
  subDistrict: string;
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
  subDistrict: "",
  postalCode: "",
  fullAddress: "",
};

// ==========================================
// KOMPONEN COMBOBOX WILAYAH (INTERNAL)
// ==========================================
function RegionCombobox({
  label,
  value,
  list,
  placeholder,
  disabled,
  loading,
  onChange,
}: {
  label: string;
  value: string;
  list: any[];
  placeholder: string;
  disabled: boolean;
  loading?: boolean;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-stone-500">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || loading}
            className={cn(
              "w-full justify-between h-10 font-normal rounded-sm border-stone-300 text-sm",
              !value && "text-stone-400 bg-white",
            )}>
            <span className="truncate">
              {loading ? "Loading..." : value || placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start">
          <Command>
            <CommandInput
              placeholder={`Cari ${label.toLowerCase()}...`}
              className="text-sm"
            />
            <CommandList>
              {loading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Loading data...
                </div>
              ) : (
                <CommandEmpty>Tidak ditemukan</CommandEmpty>
              )}
              <CommandGroup>
                {Array.isArray(list) &&
                  list.map((item, idx) => (
                    <CommandItem
                      key={item.code || idx}
                      value={item.name}
                      onSelect={() => {
                        onChange(item.name);
                        setOpen(false);
                      }}>
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === item.name ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT: ADDRESS MANAGER
// ==========================================
export function AddressManager() {
  const t = useTranslations("Address");
  const { data: session, status } = useSession();
  const token = (session as ExtendedSession)?.user?.accessToken;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  // States untuk Fetching Wilayah
  const [loadingRegion, setLoadingRegion] = useState(false);
  const [openCountry, setOpenCountry] = useState(false);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [subDistricts, setSubDistricts] = useState<any[]>([]);
  const [globalStates, setGlobalStates] = useState<any[]>([]);
  const [globalCities, setGlobalCities] = useState<any[]>([]);

  const isIndonesia = form.country === "Indonesia";

  // === FETCH ALAMAT DARI DATABASE ===
  const fetchAddresses = async () => {
    if (status === "loading" || !token) return;
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/addresses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setAddresses(json.data);
    } catch (error) {
      toast.error("Gagal memuat alamat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  // === LOGIKA API WILAYAH (MENGGUNAKAN FETCH + API URL MURNI) ===

  // 1. Fetch Provinsi
  useEffect(() => {
    if (!isIndonesia) return;
    const fetchProv = async () => {
      setLoadingRegion(true);
      try {
        const res = await fetch(`${apiUrl}${WILAYAH_BASE_PATH}/provinces`);
        const data = await res.json();
        if (Array.isArray(data.data)) setProvinces(data.data);
      } catch (err) {
        console.error("Error fetch provinces:", err);
      } finally {
        setLoadingRegion(false);
      }
    };
    fetchProv();
  }, [isIndonesia]);

  // 2. Fetch Kota/Kabupaten
  useEffect(() => {
    if (!isIndonesia || !form.province) return;
    const prov = provinces.find((p: any) => p.name === form.province);
    if (!prov) return;

    const fetchCitiesData = async () => {
      setLoadingRegion(true);
      try {
        const res = await fetch(
          `${apiUrl}${WILAYAH_BASE_PATH}/regencies/${prov.code}`,
        );
        const data = await res.json();
        if (Array.isArray(data.data)) setCities(data.data);
      } catch (err) {
        console.error("Error fetch cities:", err);
      } finally {
        setLoadingRegion(false);
      }
    };
    fetchCitiesData();
  }, [form.province, isIndonesia, provinces]);

  // 3. Fetch Kecamatan
  useEffect(() => {
    if (!isIndonesia || !form.city) return;
    const c = cities.find((p: any) => p.name === form.city);
    if (!c) return;

    const fetchDistrictsData = async () => {
      setLoadingRegion(true);
      try {
        const res = await fetch(
          `${apiUrl}${WILAYAH_BASE_PATH}/districts/${c.code}`,
        );
        const data = await res.json();
        if (Array.isArray(data.data)) setDistricts(data.data);
      } catch (err) {
        console.error("Error fetch districts:", err);
      } finally {
        setLoadingRegion(false);
      }
    };
    fetchDistrictsData();
  }, [form.city, isIndonesia, cities]);

  // 4. Fetch Kelurahan
  useEffect(() => {
    if (!isIndonesia || !form.district) return;
    const dist = districts.find((p: any) => p.name === form.district);
    if (!dist) return;

    const fetchSubDistrictsData = async () => {
      setLoadingRegion(true);
      try {
        const res = await fetch(
          `${apiUrl}${WILAYAH_BASE_PATH}/villages/${dist.code}`,
        );
        const data = await res.json();
        if (Array.isArray(data.data)) setSubDistricts(data.data);
      } catch (err) {
        console.error("Error fetch subdistricts:", err);
      } finally {
        setLoadingRegion(false);
      }
    };
    fetchSubDistrictsData();
  }, [form.district, isIndonesia, districts]);

  // Fetch Global States
  useEffect(() => {
    if (isIndonesia || !form.country) return;
    const fetchGlobalStates = async () => {
      setLoadingRegion(true);
      try {
        const res = await fetch(`${GLOBAL_API_URL}/countries/states`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: form.country }),
        });
        const json = await res.json();
        if (json.data && json.data.states) {
          setGlobalStates(json.data.states.map((s: any) => ({ name: s.name })));
        } else {
          setGlobalStates([]);
        }
      } catch (err) {
        setGlobalStates([]);
      } finally {
        setLoadingRegion(false);
      }
    };
    fetchGlobalStates();
  }, [form.country, isIndonesia]);

  // Fetch Global Cities
  useEffect(() => {
    if (isIndonesia || !form.country || !form.province) return;
    const fetchGlobalCities = async () => {
      setLoadingRegion(true);
      try {
        const res = await fetch(`${GLOBAL_API_URL}/countries/state/cities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            country: form.country,
            state: form.province,
          }),
        });
        const json = await res.json();
        if (json.data) {
          setGlobalCities(json.data.map((c: string) => ({ name: c })));
        } else {
          setGlobalCities([]);
        }
      } catch (err) {
        setGlobalCities([]);
      } finally {
        setLoadingRegion(false);
      }
    };
    fetchGlobalCities();
  }, [form.country, form.province, isIndonesia]);

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
      country: address.country || "Indonesia",
      province: address.province || "",
      city: address.city || "",
      district: address.district || "",
      subDistrict: address.subDistrict || "",
      postalCode: address.postalCode || "",
      fullAddress: address.fullAddress,
    });
    setEditingId(address.id);
    setDialogMode("edit");
  };

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
        fetchAddresses();
        setDialogMode(null);
      } else {
        toast.error(json.message || "Gagal menyimpan alamat");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    if (!token) return;
    try {
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id })),
      );
      await fetch(`${apiUrl}/addresses/${id}/set-default`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      fetchAddresses();
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    const confirmDelete = window.confirm("Yakin ingin menghapus alamat ini?");
    if (!confirmDelete) return;

    try {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      await fetch(`${apiUrl}/addresses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
    } catch (error) {
      fetchAddresses();
    }
  };

  const inputClass =
    "rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white text-sm h-10";

  if (loading) {
    return <div className="text-sm text-stone-500">{t("loading")}</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-bold tracking-widest text-stone-700 uppercase">
          {t("savedAddresses")}
        </h2>

        {/* Address Cards */}
        <div className="flex flex-col gap-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="border border-stone-200 rounded-sm bg-stone-50 px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {address.isDefault && (
                      <Badge className="bg-[#b5956a] text-white text-[10px] px-2 py-0.5 rounded-sm font-semibold tracking-wide">
                        {t("defaultBadge")}
                      </Badge>
                    )}
                    <span className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                      {address.label}
                    </span>
                  </div>
                  <div className="text-sm text-stone-600 leading-relaxed">
                    <p className="font-semibold text-stone-800">
                      {address.recipient} — {address.phone}
                    </p>
                    <p>{address.fullAddress}</p>
                    <p>
                      {address.subDistrict ? `${address.subDistrict}, ` : ""}
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
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    onClick={() => openEdit(address)}
                    className="text-xs text-stone-500 hover:text-stone-800 h-auto p-0 font-semibold tracking-wide uppercase cursor-pointer">
                    {t("actions.edit")}
                  </Button>
                  {!address.isDefault && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => handleSetDefault(address.id)}
                        className="text-[11px] text-stone-400 hover:text-stone-600 h-auto p-0 cursor-pointer">
                        {t("actions.setDefault")}
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(address.id)}
                        className="text-[11px] text-red-400 hover:text-red-600 h-auto p-0 cursor-pointer">
                        {t("actions.remove")}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={openAdd}
            className="border border-stone-200 rounded-sm bg-white px-5 py-5 text-center text-xs font-semibold text-stone-400 hover:text-stone-600 hover:bg-stone-50 transition-colors tracking-widest uppercase cursor-pointer">
            + {t("actions.addNew")}
          </button>
        </div>
      </div>

      <Dialog
        open={dialogMode !== null}
        onOpenChange={() => setDialogMode(null)}>
        <DialogContent className="sm:max-w-2xl rounded-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-stone-800">
              {dialogMode === "add"
                ? t("dialog.addTitle")
                : t("dialog.editTitle")}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            {/* Row 1: Label */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-stone-500">
                {t("dialog.label")}
              </Label>
              <Input
                name="label"
                placeholder={t("dialog.placeholders.label")}
                value={form.label}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            {/* Row 2: Recipient & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">
                  {t("dialog.recipient")}
                </Label>
                <Input
                  name="recipient"
                  placeholder={t("dialog.placeholders.recipient")}
                  value={form.recipient}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">
                  {t("dialog.phone")}
                </Label>
                <Input
                  name="phone"
                  placeholder={t("dialog.placeholders.phone")}
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 3: Full Address */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-stone-500">
                {t("dialog.fullAddress")}
              </Label>
              <textarea
                name="fullAddress"
                rows={3}
                placeholder={t("dialog.placeholders.fullAddress")}
                value={form.fullAddress}
                onChange={handleChange}
                className={`p-3 border resize-none ${inputClass}`}
              />
            </div>

            {/* Row 4: LOGIKA WILAYAH API */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
              {/* COUNTRY */}
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">Negara</Label>
                <Popover open={openCountry} onOpenChange={setOpenCountry}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between h-10 font-normal rounded-sm border-stone-300 text-sm",
                        !form.country && "text-stone-400 bg-white",
                      )}>
                      {form.country ? (
                        <span className="flex items-center gap-2 truncate">
                          <span>
                            {
                              countriesList.find((c) => c.name === form.country)
                                ?.flag
                            }
                          </span>
                          {form.country}
                        </span>
                      ) : (
                        "Pilih Negara"
                      )}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start">
                    <Command>
                      <CommandInput
                        placeholder="Cari negara..."
                        className="text-sm"
                      />
                      <CommandList>
                        <CommandEmpty>Negara tidak ditemukan.</CommandEmpty>
                        <CommandGroup>
                          {countriesList.map((c) => (
                            <CommandItem
                              key={c.code}
                              value={c.name}
                              onSelect={() => {
                                setForm((prev) => ({
                                  ...prev,
                                  country: c.name,
                                  province: "",
                                  city: "",
                                  district: "",
                                  subDistrict: "",
                                  postalCode: "",
                                }));
                                setOpenCountry(false);
                              }}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  form.country === c.name
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              <span>
                                {c.flag} {c.name}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* PROVINCE / STATE */}
              {isIndonesia || globalStates.length > 0 ? (
                <RegionCombobox
                  label={t("dialog.province")}
                  placeholder="Pilih Provinsi"
                  list={isIndonesia ? provinces : globalStates}
                  value={form.province}
                  disabled={!form.country}
                  loading={loadingRegion}
                  onChange={(val) =>
                    setForm((prev) => ({
                      ...prev,
                      province: val,
                      city: "",
                      district: "",
                      subDistrict: "",
                    }))
                  }
                />
              ) : (
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-stone-500">
                    {t("dialog.province")}
                  </Label>
                  <Input
                    placeholder="Masukkan Provinsi"
                    value={form.province}
                    onChange={handleChange}
                    name="province"
                    disabled={!form.country}
                    className={inputClass}
                  />
                </div>
              )}

              {/* CITY */}
              {isIndonesia || globalCities.length > 0 ? (
                <RegionCombobox
                  label={t("dialog.city")}
                  placeholder="Pilih Kota"
                  list={isIndonesia ? cities : globalCities}
                  value={form.city}
                  disabled={!form.province}
                  loading={loadingRegion}
                  onChange={(val) =>
                    setForm((prev) => ({
                      ...prev,
                      city: val,
                      district: "",
                      subDistrict: "",
                    }))
                  }
                />
              ) : (
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-stone-500">
                    {t("dialog.city")}
                  </Label>
                  <Input
                    placeholder="Masukkan Kota"
                    value={form.city}
                    onChange={handleChange}
                    name="city"
                    disabled={!form.province}
                    className={inputClass}
                  />
                </div>
              )}

              {/* DISTRICT */}
              {isIndonesia ? (
                <RegionCombobox
                  label={t("dialog.district")}
                  placeholder="Pilih Kecamatan"
                  list={districts}
                  value={form.district}
                  disabled={!form.city}
                  loading={loadingRegion}
                  onChange={(val) =>
                    setForm((prev) => ({
                      ...prev,
                      district: val,
                      subDistrict: "",
                    }))
                  }
                />
              ) : (
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-stone-500">
                    {t("dialog.district")}
                  </Label>
                  <Input
                    placeholder="Masukkan Kecamatan"
                    value={form.district}
                    onChange={handleChange}
                    name="district"
                    disabled={!form.city}
                    className={inputClass}
                  />
                </div>
              )}

              {/* SUBDISTRICT (KELURAHAN) */}
              {isIndonesia ? (
                <RegionCombobox
                  label="Kelurahan"
                  placeholder="Pilih Kelurahan"
                  list={subDistricts}
                  value={form.subDistrict}
                  disabled={!form.district}
                  loading={loadingRegion}
                  onChange={(val) =>
                    setForm((prev) => ({ ...prev, subDistrict: val }))
                  }
                />
              ) : (
                <div className="flex flex-col gap-1">
                  <Label className="text-xs text-stone-500">
                    Kelurahan (Opsional)
                  </Label>
                  <Input
                    placeholder="Masukkan Kelurahan"
                    value={form.subDistrict}
                    onChange={handleChange}
                    name="subDistrict"
                    disabled={!form.city}
                    className={inputClass}
                  />
                </div>
              )}

              {/* POSTAL CODE */}
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-stone-500">
                  {t("dialog.postalCode")}
                </Label>
                <Input
                  name="postalCode"
                  placeholder={t("dialog.placeholders.postalCode")}
                  value={form.postalCode}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2 mt-2">
            <Button
              variant="outline"
              onClick={() => setDialogMode(null)}
              className="flex-1 rounded-sm border-stone-300 text-stone-600 text-sm h-10">
              {t("dialog.buttons.cancel")}
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
              className="flex-1 bg-[#3d342b] hover:bg-[#2a2420] text-white rounded-sm text-sm h-10">
              {isSaving
                ? t("dialog.buttons.saving")
                : dialogMode === "add"
                  ? t("dialog.buttons.saveNew")
                  : t("dialog.buttons.update")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
