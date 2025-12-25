import type { Deal } from "./validators";
import { calcDealTotals } from "./calc";

export type DealHealthStatus = "strong" | "ok" | "risky";

export type DealHealthResult = {
  status: DealHealthStatus;
  score: number; // 0-100
  reasons: string[];
  positives: string[];
  concerns: string[];
};

/**
 * Evaluates overall deal health based on multiple factors:
 * - Profit margin (strong >= 55%, risky < 40%)
 * - Discount floor violations
 * - Contract length (strong >= 12 months)
 * - Revenue mix (downgrade if one-time > 30% of TCV)
 */
export function evaluateDealHealth(deal: Deal): DealHealthResult {
  const totals = calcDealTotals(deal);
  const positives: string[] = [];
  const concerns: string[] = [];
  let score = 50; // Start neutral

  // 1. Evaluate Margin (weight: 40 points)
  if (totals.blendedMarginPct !== null) {
    if (totals.blendedMarginPct >= 55) {
      score += 40;
      positives.push(`Strong ${totals.blendedMarginPct.toFixed(1)}% margin`);
    } else if (totals.blendedMarginPct >= 40) {
      score += 20;
      positives.push(`Acceptable ${totals.blendedMarginPct.toFixed(1)}% margin`);
    } else {
      score -= 20;
      concerns.push(`Low ${totals.blendedMarginPct.toFixed(1)}% margin (target 40%+)`);
    }
  }

  // 2. Evaluate Discount Floor Violations (weight: -20 points)
  if (totals.exceedsDiscountFloor) {
    score -= 20;
    concerns.push(`Discount ${totals.avgDiscountDepthPct.toFixed(1)}% exceeds safety net`);
  } else if (totals.avgDiscountDepthPct > 0) {
    positives.push(`Discount within safety limits`);
  }

  // 3. Evaluate Contract Length (weight: 20 points)
  if (totals.termMonths >= 12) {
    score += 20;
    positives.push(`Strong ${totals.termMonths}-month commitment`);
  } else if (totals.termMonths >= 6) {
    score += 10;
    positives.push(`Moderate ${totals.termMonths}-month term`);
  } else {
    score -= 10;
    concerns.push(`Short ${totals.termMonths}-month term`);
  }

  // 4. Evaluate Revenue Mix (weight: 20 points)
  const oneTimeRevenue = deal.products
    .filter((p) => p.type === "ONE_TIME")
    .reduce((sum, p) => {
      const price = p.oneTimeListPrice;
      const discount =
        p.customerDiscountMode === "PERCENT"
          ? price * (p.customerDiscountValue / 100)
          : p.customerDiscountValue;
      return sum + (price - discount);
    }, 0);

  if (totals.tcv > 0) {
    const oneTimePct = (oneTimeRevenue / totals.tcv) * 100;
    if (oneTimePct > 30) {
      score -= 20;
      concerns.push(`High one-time revenue (${oneTimePct.toFixed(0)}% of TCV)`);
    } else if (oneTimePct > 0) {
      positives.push(`Balanced revenue mix`);
    } else {
      score += 10;
      positives.push(`100% recurring revenue`);
    }
  }

  // Determine final status
  let status: DealHealthStatus;
  if (score >= 70) {
    status = "strong";
  } else if (score >= 40) {
    status = "ok";
  } else {
    status = "risky";
  }

  const reasons = [...positives, ...concerns];

  return {
    status,
    score: Math.max(0, Math.min(100, score)), // Clamp to 0-100
    reasons,
    positives,
    concerns,
  };
}
