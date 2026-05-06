"use client";

import { apiUrl } from "@/app/utils/ApiUrl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, useRouter } from "@/i18n/routing";
import { User, Users } from "lucide-react";
import { signIn } from "next-auth/react";

import { useState } from "react";
import { toast } from "sonner";

type AccountType = "individual" | "corporate";

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [isLoading, setIsLoading] = useState(false);

  const [individual, setIndividual] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    address: "",
  });

  const [corporate, setCorporate] = useState({
    picName: "",
    picNumbers: "",
    companyName: "",
    department: "",
    email: "",
    password: "",
    address: "",
  });

  const handleIndividualChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setIndividual((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCorporateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCorporate((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // === 1. HANDLE REGISTRASI MANUAL (KE API EXPRESS) ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Siapkan payload sesuai dengan DTO di backend
    const payload = {
      accountType: accountType === "individual" ? "INDIVIDUAL" : "CORPORATE",
      email: accountType === "individual" ? individual.email : corporate.email,
      password:
        accountType === "individual" ? individual.password : corporate.password,
      address:
        accountType === "individual" ? individual.address : corporate.address,

      // Jika individual
      ...(accountType === "individual" && {
        fullName: individual.fullName,
        phone: individual.phone,
      }),

      // Jika corporate
      ...(accountType === "corporate" && {
        picName: corporate.picName,
        picNumbers: corporate.picNumbers,
        companyName: corporate.companyName,
        department: corporate.department,
      }),
    };

    try {
      // Tembak API Express kamu
      const res = await fetch(
        `${apiUrl}/auth-web-client/register-user-web-client`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const json = await res.json();

      if (res.ok && json.success) {
        toast.success("Registrasi berhasil! Silakan login.");
        router.push("/login"); // Arahkan ke halaman login
      } else {
        toast.error(json.message || "Gagal melakukan registrasi");
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.error("Terjadi kesalahan pada sistem.");
    } finally {
      setIsLoading(false);
    }
  };

  // === 2. HANDLE LOGIN GOOGLE (VIA NEXTAUTH) ===
  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/",
      prompt: "select_account",
    });
  };

  const inputClass =
    "rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white text-sm";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {" "}
        {/* Diperkecil sedikit agar form tidak terlalu melebar */}
        <h1 className="text-4xl font-light text-stone-800 text-center mb-8">
          Create Account
        </h1>
        <div className="grid grid-cols-2 gap-0 border border-stone-200 rounded-sm mb-5 overflow-hidden">
          <button
            type="button"
            onClick={() => setAccountType("individual")}
            className={`flex items-center gap-3 px-6 py-5 transition-colors text-sm font-medium ${
              accountType === "individual"
                ? "bg-stone-100 text-stone-900"
                : "bg-white text-stone-400 hover:bg-stone-50"
            }`}>
            <User
              className={`w-6 h-6 ${accountType === "individual" ? "text-stone-800" : "text-stone-400"}`}
            />
            Individual Needs
          </button>

          <button
            type="button"
            onClick={() => setAccountType("corporate")}
            className={`flex items-center gap-3 px-6 py-5 transition-colors text-sm font-medium border-l border-stone-200 ${
              accountType === "corporate"
                ? "bg-stone-100 text-stone-900"
                : "bg-white text-stone-400 hover:bg-stone-50"
            }`}>
            <Users
              className={`w-6 h-6 ${accountType === "corporate" ? "text-stone-800" : "text-stone-400"}`}
            />
            Corporate Needs
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* ✨ TAMBAHAN: Field Email & Password diletakkan di atas */}
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            value={
              accountType === "individual" ? individual.email : corporate.email
            }
            onChange={
              accountType === "individual"
                ? handleIndividualChange
                : handleCorporateChange
            }
            required
            className={inputClass}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password (Min. 8 characters)"
            value={
              accountType === "individual"
                ? individual.password
                : corporate.password
            }
            onChange={
              accountType === "individual"
                ? handleIndividualChange
                : handleCorporateChange
            }
            required
            className={inputClass}
          />

          {accountType === "individual" ? (
            <>
              <Input
                name="fullName"
                placeholder="Full Name"
                value={individual.fullName}
                onChange={handleIndividualChange}
                required
                className={inputClass}
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Numbers"
                value={individual.phone}
                onChange={handleIndividualChange}
                required
                className={inputClass}
              />
              <Textarea
                name="address"
                placeholder="Address"
                value={individual.address}
                onChange={handleIndividualChange}
                rows={3}
                required
                className={`${inputClass} resize-none`}
              />
            </>
          ) : (
            <>
              <Input
                name="picName"
                placeholder="PIC Name"
                value={corporate.picName}
                onChange={handleCorporateChange}
                required
                className={inputClass}
              />
              <Input
                name="picNumbers"
                type="tel"
                placeholder="PIC Numbers"
                value={corporate.picNumbers}
                onChange={handleCorporateChange}
                required
                className={inputClass}
              />
              <Input
                name="companyName"
                placeholder="Company Name"
                value={corporate.companyName}
                onChange={handleCorporateChange}
                required
                className={inputClass}
              />
              <Input
                name="department"
                placeholder="Department"
                value={corporate.department}
                onChange={handleCorporateChange}
                className={inputClass}
              />
              <Textarea
                name="address"
                placeholder="Address"
                value={corporate.address}
                onChange={handleCorporateChange}
                rows={3}
                required
                className={`${inputClass} resize-none`}
              />
            </>
          )}

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#b5956a] hover:bg-[#a07d55] text-white text-sm font-medium rounded-sm py-6 mt-1 transition-colors">
            {isLoading ? "Memproses..." : "Sign Up"}
          </Button>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full border border-stone-300 rounded-sm py-6 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google Instead
          </Button>

          <p className="text-center text-[11px] text-stone-400 mt-1 leading-relaxed">
            By signing up, you agree to receive marketing emails. View our{" "}
            <Link
              href="/privacy"
              className="underline hover:text-stone-600 transition-colors">
              privacy policy
            </Link>{" "}
            and{" "}
            <Link
              href="/terms"
              className="underline hover:text-stone-600 transition-colors">
              terms of service
            </Link>{" "}
            for more info.
          </p>
        </form>
        <p className="text-center text-sm text-stone-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="underline text-stone-700 hover:text-stone-900 transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
