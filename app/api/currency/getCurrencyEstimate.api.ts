import { apiUrl } from "@/app/utils/ApiUrl";

export interface CurrencyEstimate {
  country: string;
  detectedCurrency: string;
  baseCurrency: "IDR";
  targetCurrency: string;
  transactionCurrency: "IDR";
  rate: number;
  updatedAt: string | null;
  source: string;
  isEstimate: true;
}

export async function getCurrencyEstimateAPI(
  country: string,
  currency?: string,
  signal?: AbortSignal,
): Promise<CurrencyEstimate> {
  if (!apiUrl) {
    throw new Error("API URL is not configured");
  }

  const params = new URLSearchParams({
    country,
  });

  if (currency) {
    params.set("currency", currency);
  }

  const response = await fetch(
    `${apiUrl.replace(/\/+$/, "")}/currencies/public/estimate-rate?${params.toString()}`,
    {
      method: "GET",
      signal,
    },
  );

  if (!response.ok) {
    throw new Error(`Currency estimation HTTP ${response.status}`);
  }

  const result = await response.json();
  const data = result.data;

  if (
    result.success !== true ||
    data?.country !== country ||
    data?.baseCurrency !== "IDR" ||
    data?.transactionCurrency !== "IDR" ||
    data?.isEstimate !== true ||
    typeof data?.detectedCurrency !== "string" ||
    typeof data?.targetCurrency !== "string" ||
    !/^[A-Z]{3}$/.test(data.targetCurrency) ||
    typeof data?.rate !== "number" ||
    !Number.isFinite(data.rate) ||
    data.rate <= 0 ||
    (currency && data.targetCurrency !== currency)
  ) {
    throw new Error("Invalid currency estimation response");
  }

  return data as CurrencyEstimate;
}
