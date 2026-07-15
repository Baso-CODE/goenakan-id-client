"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const t = useTranslations("Login");

  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const rateLimitKey = "login_rate_limit";
    const stored = localStorage.getItem(rateLimitKey);

    if (stored) {
      const { retryAfter } = JSON.parse(stored);
      const now = Date.now();
      const timeRemaining = retryAfter - now;

      if (timeRemaining > 0) {
        setIsRateLimited(true);
        setRemainingTime(Math.ceil(timeRemaining / 1000));
      } else {
        localStorage.removeItem(rateLimitKey);
      }
    }
  }, []);

  useEffect(() => {
    if (!isRateLimited || remainingTime <= 0) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setIsRateLimited(false);
          localStorage.removeItem("login_rate_limit");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRateLimited, remainingTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getErrorMessage = (error: string): string => {
    if (!error) return t("messages.errorDefault");

    // Rate limit error
    if (
      error.includes("Terlalu banyak") ||
      error.includes("Too many") ||
      error.includes("429")
    ) {
      return t("messages.tooManyAttempts");
    }

    // Invalid credentials
    if (
      error.includes("Email atau password") ||
      error.includes("Invalid") ||
      error.includes("salah")
    ) {
      return t("messages.invalidCredentials");
    }

    // Server error
    if (error.includes("Server") || error.includes("500")) {
      return t("messages.serverError");
    }

    // Network error
    if (error.includes("Network") || error.includes("fetch")) {
      return t("messages.networkError");
    }

    return error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ❌ Block jika sedang rate limited
    if (isRateLimited) {
      toast.error(t("messages.tooManyAttempts"));
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        const errorMessage = getErrorMessage(res.error);
        toast.error(errorMessage);

        if (
          res.error.includes("Terlalu banyak") ||
          res.error.includes("Too many")
        ) {
          const retryAfter = Date.now() + 15 * 60 * 1000; // 15 menit
          localStorage.setItem(
            "login_rate_limit",
            JSON.stringify({ timestamp: Date.now(), retryAfter }),
          );
          setIsRateLimited(true);
          setRemainingTime(15 * 60);
        }
      } else if (res?.ok) {
        toast.success(t("messages.success"));
        localStorage.removeItem("login_rate_limit");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      const errorMessage = getErrorMessage(
        error instanceof Error ? error.message : "",
      );
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    if (isRateLimited) {
      toast.error(t("messages.tooManyAttempts"));
      return;
    }

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
        {t("title")}
      </h1>
      <p className="text-center text-sm text-stone-500 mb-8">{t("subtitle")}</p>

      {isRateLimited && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-sm">
          <p className="text-red-700 text-sm font-medium">
            {t("messages.tooManyAttempts")}
          </p>
          <p className="text-red-600 text-xs mt-1">
            Retry in: <span className="font-bold">{remainingTime}s</span>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email Field */}
        <Input
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading || isRateLimited}
          className={inputClass}
          autoComplete="email"
        />

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <Input
            name="password"
            type="password"
            placeholder={t("passwordPlaceholder")}
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading || isRateLimited}
            className={inputClass}
            autoComplete="current-password"
          />
          <div className="flex justify-end mt-1">
            <Link
              href="/forgot-password"
              className="text-[11px] font-medium text-stone-500 hover:text-stone-800 transition-colors">
              {t("forgotPassword")}
            </Link>
          </div>
        </div>

        {/* Sign In Button */}
        <Button
          type="submit"
          disabled={
            isLoading || isRateLimited || !formData.email || !formData.password
          }
          className="w-full bg-[#b5956a] hover:bg-[#a07d55] text-white text-sm font-medium rounded-sm py-6 mt-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={isRateLimited ? t("messages.tooManyAttempts") : ""}>
          {isLoading ? t("signingInText") : t("signInButton")}
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-stone-200"></div>
          <span className="text-xs text-stone-400 uppercase tracking-widest font-medium">
            {t("orText")}
          </span>
          <div className="flex-1 h-px bg-stone-200"></div>
        </div>

        {/* Google Sign In Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isRateLimited}
          className="w-full border border-stone-300 rounded-sm py-6 text-sm text-stone-700 hover:bg-stone-50 flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
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
          {t("googleSignIn")}
        </Button>
      </form>

      <p className="text-center text-sm text-stone-500 mt-8">
        {t("noAccountText")}{" "}
        <Link
          href="/register"
          className="underline text-stone-700 hover:text-stone-900 transition-colors font-medium">
          {t("createAccountLink")}
        </Link>
      </p>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense
      fallback={<div className="text-stone-500 text-sm">Loading...</div>}>
      <LoginFormInner />
    </Suspense>
  );
}
