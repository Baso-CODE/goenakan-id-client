"use client";

import { apiUrl } from "@/app/utils/ApiUrl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      // ✨ Mengarahkan fetch langsung ke ${apiUrl}/...
      const res = await fetch(`${apiUrl}/auth-web-client/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Gagal mengirim permintaan reset password.",
        );
      }

      setIsSubmitted(true);
      toast.success("Tautan reset password telah dikirim ke email Anda.");
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan pada sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white text-sm py-6";

  return (
    <div className="w-full max-w-100 mx-auto py-16 px-4">
      <div className="mb-6">
        <Link
          href="/login"
          className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Login
        </Link>
      </div>

      <h1 className="text-3xl font-light text-stone-800 text-center mb-2">
        Lupa Kata Sandi
      </h1>
      <p className="text-center text-sm text-stone-500 mb-8">
        Masukkan email akun Anda, kami akan mengirimkan tautan untuk mengatur
        ulang kata sandi.
      </p>

      {isSubmitted ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-sm text-center">
          <p className="text-green-800 text-sm font-medium">
            Email terkirim! Silakan periksa kotak masuk atau folder spam Anda.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Masukkan email Anda..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className={inputClass}
          />

          <Button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-[#b5956a] hover:bg-[#a07d55] text-white text-sm font-medium rounded-sm py-6 transition-colors disabled:opacity-50">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Kirim Tautan Reset
          </Button>
        </form>
      )}
    </div>
  );
}
