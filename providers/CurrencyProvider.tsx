"use client";

import {
  getCurrencyEstimateAPI,
  type CurrencyEstimate,
} from "@/app/api/currency/getCurrencyEstimate.api";

import { getUserCountryFromCookie } from "@/lib/getUserCountryFromCookie";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const CURRENCY_COOKIE = "USER_CURRENCY";

interface CurrencyContextValue {
  country: string;
  preference: string;
  currency: string;
  detectedCurrency: string;
  rate: number | null;
  isLoading: boolean;
  setPreference: (currency: string) => void;
  estimatePrice: (amountIdr: number) => number | null;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

// ==========================================
// READ SAVED CURRENCY PREFERENCE
// ==========================================
function readCurrencyPreference(): string {
  if (typeof document === "undefined") {
    return "AUTO";
  }

  const cookie = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${CURRENCY_COOKIE}=`));

  if (!cookie) return "AUTO";

  const value = cookie
    .slice(CURRENCY_COOKIE.length + 1)
    .trim()
    .toUpperCase();

  return value === "AUTO" || /^[A-Z]{3}$/.test(value) ? value : "AUTO";
}

// ==========================================
// SAVE CURRENCY PREFERENCE
// ==========================================
function saveCurrencyPreference(preference: string): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie =
    `${CURRENCY_COOKIE}=${preference}` +
    "; Path=/" +
    "; Max-Age=2592000" +
    "; SameSite=Lax" +
    secure;
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [country, setCountry] = useState("ID");

  const [preference, setPreferenceState] = useState("AUTO");

  const [initialized, setInitialized] = useState(false);

  const [estimate, setEstimate] = useState<{
    key: string;
    data: CurrencyEstimate;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // ==========================================
  // 1. DETECT EXISTING VISITOR COUNTRY
  // ==========================================
  useEffect(() => {
    const rawCountry = getUserCountryFromCookie().trim().toUpperCase();

    const detectedCountry = /^[A-Z]{2}$/.test(rawCountry) ? rawCountry : "ID";

    setCountry(detectedCountry);

    setPreferenceState(readCurrencyPreference());

    setInitialized(true);
  }, []);

  const requestKey = `${country}:${preference}`;

  // ==========================================
  // 2. FETCH ESTIMATION RATE
  // ==========================================
  useEffect(() => {
    if (!initialized) return;

    const controller = new AbortController();

    let active = true;

    const timeout = setTimeout(() => {
      controller.abort();
    }, 15000);

    const fetchEstimate = async () => {
      setIsLoading(true);
      setEstimate(null);

      try {
        const result = await getCurrencyEstimateAPI(
          country,
          preference === "AUTO" ? undefined : preference,
          controller.signal,
        );

        if (active) {
          setEstimate({
            key: requestKey,
            data: result,
          });
        }
      } catch (error) {
        if (active) {
          setEstimate(null);

          console.error("[Currency Estimation]", error);
        }
      } finally {
        clearTimeout(timeout);

        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchEstimate();

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [initialized, country, preference, requestKey]);

  // ==========================================
  // 3. RESOLVE CURRENT CURRENCY
  // ==========================================
  const currentEstimate = estimate?.key === requestKey ? estimate.data : null;

  const currency = currentEstimate?.targetCurrency || "IDR";

  const detectedCurrency = currentEstimate?.detectedCurrency || "IDR";

  const rate = currentEstimate?.rate ?? null;

  // ==========================================
  // 4. MANUAL OVERRIDE
  // ==========================================
  const setPreference = (next: string) => {
    const normalized = next.trim().toUpperCase();

    if (normalized !== "AUTO" && !/^[A-Z]{3}$/.test(normalized)) {
      return;
    }

    saveCurrencyPreference(normalized);
    setPreferenceState(normalized);
  };

  // ==========================================
  // 5. ESTIMATE FROM OFFICIAL IDR PRICE
  // ==========================================
  const estimatePrice = (amountIdr: number): number | null => {
    if (!currentEstimate || !Number.isFinite(amountIdr) || amountIdr < 0) {
      return null;
    }

    const converted = amountIdr * currentEstimate.rate;

    return Number.isFinite(converted) ? converted : null;
  };

  return (
    <CurrencyContext.Provider
      value={{
        country,
        preference,
        currency,
        detectedCurrency,
        rate,
        isLoading,
        setPreference,
        estimatePrice,
      }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }

  return context;
}
