export interface CurrencyConfig {
  code: string;
  symbol: string;
  locale: string;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  IDR: { code: "IDR", symbol: "Rp", locale: "id-ID" },
  USD: { code: "USD", symbol: "$", locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE" },
  SGD: { code: "SGD", symbol: "S$", locale: "en-SG" }
};

/**
 * Formats a number to full currency representation based on selected currency
 */
export function formatCurrency(val: number, currencyCode: string = "IDR"): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.IDR;
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  
  // No decimals for IDR. For others, 2 decimal places if they have cents, or 0 if it's a whole number.
  const fractionDigits = currencyCode === "IDR" ? 0 : (absVal % 1 === 0 ? 0 : 2);
  
  const formatted = new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(absVal);
  
  return `${isNegative ? "-" : ""}${config.symbol} ${formatted}`;
}

/**
 * Formats a number as a human-readable summary (e.g. 56,8 jt for IDR, or $56.8k for USD)
 */
export function formatCurrencySummary(val: number, currencyCode: string = "IDR"): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.IDR;
  const isNegative = val < 0;
  const absVal = Math.abs(val);
  
  if (currencyCode === "IDR") {
    if (absVal >= 1000000) {
      const millions = absVal / 1000000;
      const formatted = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
      return `${isNegative ? "-" : ""}Rp ${formatted.replace(".", ",")} jt`;
    }
    return `${isNegative ? "-" : ""}Rp ${new Intl.NumberFormat("id-ID").format(absVal)}`;
  } else {
    if (absVal >= 1000) {
      const thousands = absVal / 1000;
      const formatted = thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1);
      return `${isNegative ? "-" : ""}${config.symbol}${formatted}k`;
    }
    return `${isNegative ? "-" : ""}${config.symbol}${new Intl.NumberFormat(config.locale).format(absVal)}`;
  }
}

/**
 * Formats a raw number string as the user types (adds thousands separators)
 */
export function formatInputNumber(val: number | string, currencyCode: string = "IDR"): string {
  if (val === undefined || val === null) return "";
  const clean = String(val).replace(/[^0-9]/g, "");
  if (!clean) return "";
  
  const config = CURRENCIES[currencyCode] || CURRENCIES.IDR;
  return new Intl.NumberFormat(config.locale).format(Number(clean));
}

/**
 * Parses a formatted number string back to a raw number
 */
export function parseInputNumber(val: string): number {
  const clean = val.replace(/[^0-9]/g, "");
  return clean ? Number(clean) : 0;
}
