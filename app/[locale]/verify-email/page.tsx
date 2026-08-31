"use client";

import { apiUrl } from "@/app/utils/ApiUrl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Status untuk mengatur tampilan UI (loading, sukses, atau error)
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Sedang memverifikasi email Anda...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token verifikasi tidak ditemukan di URL.");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${apiUrl}/auth-web-client/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(
            "Email Anda berhasil diverifikasi! Silakan login untuk melanjutkan.",
          );
        } else {
          setStatus("error");
          setMessage(
            data.message ||
              "Gagal memverifikasi email. Token mungkin sudah kedaluwarsa.",
          );
        }
      } catch (error) {
        setStatus("error");
        setMessage("Terjadi kesalahan sistem saat memverifikasi email.");
      }
    };

    // Jalankan fungsi verifikasi hanya sekali saat komponen dimuat
    verifyToken();
  }, [token]);

  return (
    <div className="w-full max-w-md mx-auto py-24 px-4 text-center flex flex-col items-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 text-[#b5956a] animate-spin mb-6" />
          <h1 className="text-2xl font-light text-stone-800 mb-2">
            Memproses...
          </h1>
          <p className="text-stone-500">{message}</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-6" />
          <h1 className="text-2xl font-light text-stone-800 mb-2">
            Verifikasi Berhasil!
          </h1>
          <p className="text-stone-500 mb-8">{message}</p>
          <Link href="/login" className="w-full">
            <Button className="w-full bg-[#b5956a] hover:bg-[#a07d55] text-white">
              Pergi ke Halaman Login
            </Button>
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-16 h-16 text-red-500 mb-6" />
          <h1 className="text-2xl font-light text-stone-800 mb-2">
            Verifikasi Gagal
          </h1>
          <p className="text-stone-500 mb-8">{message}</p>
          <Link href="/login" className="w-full">
            <Button
              variant="outline"
              className="w-full border-stone-300 text-stone-700">
              Kembali ke Halaman Login
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-24 text-stone-500">Loading...</div>
      }>
      <VerifyEmailContent />
    </Suspense>
  );
}
