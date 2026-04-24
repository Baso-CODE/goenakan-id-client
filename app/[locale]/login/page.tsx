"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // === 1. HANDLE LOGIN MANUAL (CREDENTIALS) ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error);
      } else if (res?.ok) {
        toast.success("Login berhasil! Selamat datang kembali.");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat login.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // === 2. HANDLE LOGIN GOOGLE ===
  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/",
      prompt: "select_account",
    });
  };

  const inputClass =
    "rounded-sm border-stone-300 focus-visible:ring-stone-400 bg-white text-sm py-6";

  return (
    <div className="w-full max-w-100">
      <h1 className="text-4xl font-light text-stone-800 text-center mb-2">
        Welcome Back
      </h1>
      <p className="text-center text-sm text-stone-500 mb-8">
        Please enter your details to sign in.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          className={inputClass}
        />

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className={inputClass}
          />
          <div className="flex justify-end mt-1">
            <Link
              href="/forgot-password"
              className="text-[11px] font-medium text-stone-500 hover:text-stone-800 transition-colors">
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={isLoading || !formData.email || !formData.password}
          className="w-full bg-[#b5956a] hover:bg-[#a07d55] text-white text-sm font-medium rounded-sm py-6 mt-2 transition-colors">
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-stone-200"></div>
          <span className="text-xs text-stone-400 uppercase tracking-widest font-medium">
            Or
          </span>
          <div className="flex-1 h-px bg-stone-200"></div>
        </div>

        {/* Google Sign In Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
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
          Sign in with Google
        </Button>
      </form>
      {/* Register link */}
      <p className="text-center text-sm text-stone-500 mt-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="underline text-stone-700 hover:text-stone-900 transition-colors font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
}

// Dibungkus Suspense karena kita menggunakan useSearchParams()
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
      <Suspense
        fallback={<div className="text-stone-500 text-sm">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
