"use client";

import { submitContactMessage } from "@/app/api/contactMessages/submitContactMessage.api";
import { getCategoryList } from "@/app/api/products/getCategoryProductList.api";
import { CategoryPublic } from "@/app/types/categoryProduct.type";
import { ContactPayload } from "@/app/types/contactMessage.type";
import { Link } from "@/i18n/routing";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "6282387902238";

export function ContactForm() {
  const [form, setForm] = useState<ContactPayload>({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  // Menyimpan Nama Kategori yang dipilih (agar mudah dikirim ke WA/DB)
  const [productCategoryName, setProductCategoryName] = useState("");
  const [itemCategoryName, setItemCategoryName] = useState("");

  const [categories, setCategories] = useState<CategoryPublic[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✨ Fetch SEMUA kategori beserta item-nya dalam sekali tarik
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategoryList();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    loadCategories();
  }, []);

  // ✨ Logika Pintar: Ambil item categories berdasarkan product category yang sedang aktif
  const activeItemCategories =
    categories.find((cat) => cat.name === productCategoryName)
      ?.itemCategories || [];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading("Sedang mengirim pesan...");

    const selectedInterest = `${productCategoryName} - ${itemCategoryName}`;
    const payload = { ...form, interest: selectedInterest };

    try {
      const isSuccess = await submitContactMessage(payload);

      if (!isSuccess) {
        toast.error("Gagal mengirim pesan ke sistem. Silakan coba lagi.", {
          id: toastId,
        });
        return;
      }

      toast.success("Pesan berhasil terkirim ke sistem!", { id: toastId });

      const text = [
        `Halo, saya ingin menghubungi Anda.`,
        ``,
        `*Nama:* ${form.name}`,
        `*Email:* ${form.email}`,
        `*No. HP/WhatsApp:* ${form.phone}`,
        `*Kategori Produk:* ${productCategoryName || "-"}`,
        `*Kategori Item:* ${itemCategoryName || "-"}`,
        ``,
        `*Pesan:*`,
        form.message,
      ].join("\n");

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");

      // Reset Form
      setForm({
        name: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
      });
      setProductCategoryName("");
      setItemCategoryName("");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan koneksi server.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border border-[#1E1E1E] rounded-sm px-4 py-3.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <section className="min-h-screen bg-[#e1dad6] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-5xl text-stone-800 mb-4 font-light">
            Contact us
          </h1>
          <p className="text-stone-500 text-base leading-relaxed">
            Every project starts with a clear conversation. Reach out to discuss
            your ideas,
            <br className="hidden sm:block" /> and let us help shape them into a
            well-crafted custom product.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={inputClass}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-300 text-xs">
                *
              </span>
            </div>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={inputClass}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-300 text-xs">
                *
              </span>
            </div>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="Phone/Whatsapp Number"
                value={form.phone}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={inputClass}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-300 text-xs">
                *
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative">
              <select
                value={productCategoryName}
                onChange={(e) => {
                  setProductCategoryName(e.target.value);
                  setItemCategoryName("");
                }}
                disabled={isSubmitting}
                className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="" disabled>
                  Select Product Category
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            <div className="relative">
              <select
                value={itemCategoryName}
                onChange={(e) => setItemCategoryName(e.target.value)}
                disabled={isSubmitting || !productCategoryName}
                className={`${inputClass} appearance-none cursor-pointer disabled:bg-stone-200`}>
                <option value="" disabled>
                  Select Item Category
                </option>
                {/* Looping hanya dari array anak (activeItemCategories) */}
                {activeItemCategories.map((child) => (
                  <option key={child.id} value={child.name}>
                    {child.name}
                  </option>
                ))}
              </select>
              <svg
                className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <textarea
              name="message"
              placeholder="How can we help?"
              value={form.message}
              onChange={handleChange}
              rows={8}
              required
              disabled={isSubmitting}
              className={`${inputClass} resize-none`}
            />
            <span className="absolute right-2.5 top-3 text-stone-300 text-xs">
              *
            </span>
          </div>

          <div className="flex justify-center mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-stone-800 text-white text-sm px-10 py-3 rounded-sm hover:bg-stone-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? "Sending..." : "Send your message"}
            </button>
          </div>

          <p className="text-center text-[11px] text-stone-400 mt-1 leading-relaxed">
            By clicking, you agree to our{" "}
            <Link
              href="/terms"
              className="underline hover:text-stone-600 transition-colors">
              Terms & Conditions
            </Link>
            ,{" "}
            <Link
              href="/privacy"
              className="underline hover:text-stone-600 transition-colors">
              Privacy and Data Protection Policy
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
