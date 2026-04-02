"use client";

import { useState } from "react";

const WHATSAPP_NUMBER = "6282387902238";

const INTEREST_OPTIONS = [
  "Custom Tumbler",
  "Custom Pen",
  "Custom Tote Bag",
  "Custom Notebook",
  "Merchandise Perusahaan",
  "Souvenir Event",
  "Lainnya",
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = [
      `Halo, saya ingin menghubungi Anda.`,
      ``,
      `*Nama:* ${form.name}`,
      `*Email:* ${form.email}`,
      `*No. HP/WhatsApp:* ${form.phone}`,
      `*Tertarik dengan:* ${form.interest || "-"}`,
      ``,
      `*Pesan:*`,
      form.message,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const inputClass =
    "w-full bg-transparent border border-[#1E1E1E] rounded-sm px-4 py-3.5 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-stone-500 transition-colors";

  return (
    <section className="min-h-screen bg-[#e1dad6] flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl  text-stone-800 mb-4 font-light">
            Contact us
          </h1>
          <p className="text-stone-500 text-base leading-relaxed">
            Every project starts with a clear conversation. Reach out to discuss
            your ideas,
            <br className="hidden sm:block" /> and let us help shape them into a
            well-crafted custom product.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Row 1: Name & Email */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
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
                className={inputClass}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-300 text-xs">
                *
              </span>
            </div>
          </div>

          {/* Row 2: Phone & Interest */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="tel"
                name="phone"
                placeholder="Phone/Whatsapp Number"
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-300 text-xs">
                *
              </span>
            </div>
            <div className="relative">
              <select
                name="interest"
                value={form.interest}
                onChange={handleChange}
                className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="" disabled>
                  Interested in
                </option>
                {INTEREST_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {/* Chevron icon */}
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

          {/* Message */}
          <div className="relative">
            <textarea
              name="message"
              placeholder="How can we help?"
              value={form.message}
              onChange={handleChange}
              rows={8}
              className={`${inputClass} resize-none`}
            />
            <span className="absolute right-2.5 top-3 text-stone-300 text-xs">
              *
            </span>
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-2">
            <button
              type="submit"
              className="bg-stone-800 text-white text-sm px-10 py-3 rounded-sm hover:bg-stone-700 active:scale-[0.98] transition-all">
              Send your message
            </button>
          </div>

          {/* Legal note */}
          <p className="text-center text-[11px] text-stone-400 mt-1 leading-relaxed">
            By clicking, you agree to our{" "}
            <a
              href="/terms"
              className="underline hover:text-stone-600 transition-colors">
              Terms & Conditions
            </a>
            ,{" "}
            <a
              href="/privacy"
              className="underline hover:text-stone-600 transition-colors">
              Privacy and Data Protection Policy
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
