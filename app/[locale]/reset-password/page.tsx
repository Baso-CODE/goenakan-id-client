"use client";

import { apiUrl } from "@/app/utils/ApiUrl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token reset password tidak ditemukan.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Kata sandi minimal harus 6 karakter.");
      return;
    }

    setIsLoading(true);
    try {
      // ✨ Mengarahkan fetch langsung ke ${apiUrl}/auth-web-client/reset-password
      const res = await fetch(`${apiUrl}/auth-web-client/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal memperbarui kata sandi.");
      }

      toast.success("Kata sandi berhasil diperbarui! Silakan login.");
      router.push("/login");
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
      <h1 className="text-3xl font-light text-stone-800 text-center mb-2">
        Atur Ulang Kata Sandi
      </h1>
      <p className="text-center text-sm text-stone-500 mb-8">
        Masukkan kata sandi baru untuk akun Anda.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="password"
          placeholder="Kata sandi baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          disabled={isLoading}
          className={inputClass}
        />
        <Input
          type="password"
          placeholder="Konfirmasi kata sandi baru"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isLoading}
          className={inputClass}
        />

        <Button
          type="submit"
          disabled={isLoading || !newPassword || !confirmPassword}
          className="w-full bg-[#b5956a] hover:bg-[#a07d55] text-white text-sm font-medium rounded-sm py-6 transition-colors disabled:opacity-50">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Simpan Kata Sandi Baru
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="text-stone-500 text-sm text-center py-16">
          Loading...
        </div>
      }>
      <ResetPasswordForm />
    </Suspense>
  );
}
