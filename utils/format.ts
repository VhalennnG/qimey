export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  IDR: { code: "IDR", symbol: "Rp", locale: "id-ID" },
  USD: { code: "USD", symbol: "$", locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE" },
  SGD: { code: "SGD", symbol: "S$", locale: "en-SG" },
};

/**
 * Dynamically resolves currency configuration based on user input
 */
export function getCurrencyConfig(currency: string = ""): CurrencyConfig {
  if (!currency) {
    return { code: "", symbol: "", locale: "id-ID" };
  }

  const normalized = currency.trim().toUpperCase();

  // Predefined currency codes/symbols
  if (normalized === "IDR" || normalized === "RP" || normalized === "RUPIAH") {
    return { code: "IDR", symbol: "Rp", locale: "id-ID" };
  }
  if (normalized === "USD" || normalized === "$") {
    return { code: "USD", symbol: "$", locale: "en-US" };
  }
  if (normalized === "EUR" || normalized === "€") {
    return { code: "EUR", symbol: "€", locale: "de-DE" };
  }
  if (normalized === "SGD" || normalized === "S$") {
    return { code: "SGD", symbol: "S$", locale: "en-SG" };
  }
  if (normalized === "GBP" || normalized === "£") {
    return { code: "GBP", symbol: "£", locale: "en-GB" };
  }
  if (normalized === "JPY" || normalized === "YEN" || normalized === "¥") {
    return { code: "JPY", symbol: "¥", locale: "ja-JP" };
  }
  if (normalized === "AUD" || normalized === "A$") {
    return { code: "AUD", symbol: "A$", locale: "en-AU" };
  }
  if (normalized === "CAD" || normalized === "C$") {
    return { code: "CAD", symbol: "C$", locale: "en-CA" };
  }
  if (normalized === "CNY" || normalized === "RMB") {
    return { code: "CNY", symbol: "¥", locale: "zh-CN" };
  }
  if (normalized === "KRW" || normalized === "₩") {
    return { code: "KRW", symbol: "₩", locale: "ko-KR" };
  }

  // Fallback: use exactly what the user typed as the symbol
  const isIdrFeel =
    normalized.includes("RP") ||
    normalized.includes("IDR") ||
    normalized.includes("RUPIAH");
  return {
    code: currency,
    symbol: currency,
    locale: isIdrFeel ? "id-ID" : "en-US",
  };
}

/**
 * Formats a number to full currency representation based on selected currency
 */
export function formatCurrency(val: number, currency: string = ""): string {
  const config = getCurrencyConfig(currency);
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const isIdrStyle = config.locale === "id-ID";
  const fractionDigits = isIdrStyle ? 0 : absVal % 1 === 0 ? 0 : 2;

  const formatted = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(absVal);

  const prefix = config.symbol ? `${config.symbol} ` : "";
  return `${isNegative ? "-" : ""}${prefix}${formatted}`;
}

/**
 * Formats a number as a human-readable summary (e.g. 56,8 jt for IDR, or $56.8k for USD)
 */
export function formatCurrencySummary(
  val: number,
  currency: string = "",
): string {
  const config = getCurrencyConfig(currency);
  const isNegative = val < 0;
  const absVal = Math.abs(val);

  const isIdrStyle = config.locale === "id-ID";
  const prefix = config.symbol ? `${config.symbol} ` : "";
  const prefixNoSpace = config.symbol || "";

  if (isIdrStyle) {
    if (absVal >= 1000000) {
      const millions = absVal / 1000000;
      const formatted =
        millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
      return `${isNegative ? "-" : ""}${prefix}${formatted.replace(".", ",")} jt`;
    }
    return `${isNegative ? "-" : ""}${prefix}${new Intl.NumberFormat("id-ID").format(absVal)}`;
  } else {
    if (absVal >= 1000) {
      const thousands = absVal / 1000;
      const formatted =
        thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1);
      return `${isNegative ? "-" : ""}${prefixNoSpace}${formatted}k`;
    }
    return `${isNegative ? "-" : ""}${prefixNoSpace}${new Intl.NumberFormat(config.locale).format(absVal)}`;
  }
}

/**
 * Formats a raw number string as the user types (adds thousands separators)
 */
export function formatInputNumber(
  val: number | string,
  currency: string = "",
): string {
  if (val === undefined || val === null) return "";
  const clean = String(val).replace(/[^0-9]/g, "");
  if (!clean) return "";

  const config = getCurrencyConfig(currency);
  return new Intl.NumberFormat(config.locale).format(Number(clean));
}

/**
 * Parses a formatted number string back to a raw number
 */
export function parseInputNumber(val: string): number {
  const clean = val.replace(/[^0-9]/g, "");
  return clean ? Number(clean) : 0;
}
