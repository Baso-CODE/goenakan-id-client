"use client";

import { apiUrl } from "@/app/utils/ApiUrl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
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
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan pada sistem.";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    // Reset form saat modal ditutup agar ketika dibuka lagi kembali seperti semula
    if (!open) {
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 300); // Jeda sejenak menunggu animasi tutup selesai
    }
  };

  const inputClass =
    "rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white text-sm py-6";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* asChild memastikan properti klik diteruskan ke tombol yang ada di dalamnya */}
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-stone-800">
            Lupa Kata Sandi
          </DialogTitle>
          <DialogDescription className="text-stone-500">
            Masukkan email akun Anda, kami akan mengirimkan tautan untuk
            mengatur ulang kata sandi.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-sm text-center my-2">
            <p className="text-green-800 text-sm font-medium">
              Email terkirim! Silakan periksa kotak masuk atau folder spam Anda.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full">
              Tutup
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
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
      </DialogContent>
    </Dialog>
  );
}
