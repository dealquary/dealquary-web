/**
 * Formula generators for metric tooltips
 * Epic 5: Math Transparency & Audit Trail
 */

import { money, num } from "./format";

/**
 * Get human-readable formula for MRR
 */
export function getMRRFormula(monthlyRevenue: number): string {
  return `MRR = Monthly Recurring Revenue = ${money(monthlyRevenue)}`;
}

/**
 * Get human-readable formula for ARR
 */
export function getARRFormula(mrr: number): string {
  const arr = mrr * 12;
  return `ARR = MRR × 12\n${money(mrr)} × 12 = ${money(arr)}`;
}

/**
 * Get human-readable formula for TCV
 */
export function getTCVFormula(monthlyRevenue: number, termMonths: number): string {
  const tcv = monthlyRevenue * termMonths;
  return `TCV = MRR × Term (months)\n${money(monthlyRevenue)} × ${termMonths} = ${money(tcv)}`;
}

/**
 * Get human-readable formula for Profit
 */
export function getProfitFormula(revenue: number, margin: number): string {
  const profit = revenue * margin;
  return `Profit = Revenue × Margin\n${money(revenue)} × ${num(margin * 100, 1)}% = ${money(profit)}`;
}

/**
 * Get human-readable formula for Margin %
 */
export function getMarginFormula(profit: number, revenue: number): string {
  if (revenue === 0) return "Margin = 0% (no revenue)";
  const margin = (profit / revenue) * 100;
  return `Margin % = (Profit / Revenue) × 100\n(${money(profit)} / ${money(revenue)}) × 100 = ${num(margin, 1)}%`;
}

/**
 * Get human-readable formula for LTV:CAC
 */
export function getLTVCACFormula(ltv: number, cac: number): string {
  if (cac === 0) return "LTV:CAC = ∞ (no CAC)";
  const ratio = ltv / cac;
  return `LTV:CAC = Lifetime Value / Customer Acquisition Cost\n${money(ltv)} / ${money(cac)} = ${num(ratio, 2)}`;
}

/**
 * Get human-readable formula for Payback Period
 */
export function getPaybackFormula(cac: number, monthlyProfit: number): string {
  if (monthlyProfit === 0) return "Payback = ∞ (no monthly profit)";
  const months = cac / monthlyProfit;
  return `Payback = CAC / Monthly Profit\n${money(cac)} / ${money(monthlyProfit)} = ${num(months, 1)} months`;
}

/**
 * Get effective price after discount
 */
export function getEffectivePriceDisplay(
  listPrice: number,
  discountMode: "PERCENT" | "DOLLARS",
  discountValue: number
): string | null {
  if (discountValue === 0) return null;

  let effectivePrice: number;
  let discountDisplay: string;

  if (discountMode === "PERCENT") {
    effectivePrice = listPrice * (1 - discountValue / 100);
    discountDisplay = `${num(discountValue, 0)}% discount`;
  } else {
    effectivePrice = listPrice - discountValue;
    discountDisplay = `${money(discountValue)} discount`;
  }

  return `${money(listPrice)} → ${money(effectivePrice)} after ${discountDisplay}`;
}
