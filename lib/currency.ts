export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP" | "AED";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rateFromINR: number;
}

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: { code: "INR", symbol: "₹", label: "INR (₹)", rateFromINR: 1.0 },
  USD: { code: "USD", symbol: "$", label: "USD ($)", rateFromINR: 0.012 },
  EUR: { code: "EUR", symbol: "€", label: "EUR (€)", rateFromINR: 0.011 },
  GBP: { code: "GBP", symbol: "£", label: "GBP (£)", rateFromINR: 0.0094 },
  AED: { code: "AED", symbol: "AED ", label: "AED", rateFromINR: 0.044 },
};

/**
 * Converts a text string containing INR amounts (e.g., "₹6,200 — ₹13,000" or "₹3,100 per person")
 * into the selected target currency.
 */
export function convertCurrencyString(text: string | undefined, targetCode: CurrencyCode): string {
  if (!text) return "";
  if (targetCode === "INR") return text;

  const config = SUPPORTED_CURRENCIES[targetCode] || SUPPORTED_CURRENCIES.INR;
  const rate = config.rateFromINR;

  // Regex to match numbers with optional commas after ₹ or plain numbers
  return text.replace(/(?:₹\s*)?([\d,]+)/g, (match, p1) => {
    const rawNum = parseInt(p1.replace(/,/g, ""), 10);
    if (isNaN(rawNum)) return match;
    const converted = Math.round(rawNum * rate);
    return `${config.symbol}${converted.toLocaleString("en-US")}`;
  });
}
