/**
 * Currency + number helpers tuned for Bangladesh (BDT).
 */

export const BDT_LOCALE = "en-BD";

export function formatBDT(value: number, opts?: { compact?: boolean }): string {
  if (opts?.compact && Math.abs(value) >= 100000) {
    // Bangla / South-Asian style: lakh / crore.
    if (Math.abs(value) >= 10_000_000) {
      return `৳ ${(value / 10_000_000).toFixed(2)} Cr`;
    }
    return `৳ ${(value / 100_000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat(BDT_LOCALE, {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(BDT_LOCALE).format(value);
}

export function formatPct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}
