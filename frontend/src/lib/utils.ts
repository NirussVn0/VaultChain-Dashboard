import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges conditional class names with Tailwind-aware conflict resolution.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a compact currency string.
 *
 * @param value - Value to format.
 * @param currency - ISO currency code, defaults to USD.
 */
export function formatCurrency(value: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value < 1 ? 4 : 2,
    notation: value >= 100_000 ? "compact" : "standard",
  }).format(value);
}

/**
 * Formats a number as percentage with sign.
 *
 * @param value - Value to format (e.g. 0.12 -> 12%).
 * @param fractionDigits - Number of decimals to display.
 */
export function formatPercent(value: number, fractionDigits: number = 2): string {
  return `${value >= 0 ? "+" : ""}${(value * 100).toFixed(fractionDigits)}%`;
}

/**
 * Formats large numbers using compact notation (e.g. 1.2M).
 */
export function formatCompactNumber(value: number, fractionDigits: number = 1): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
