import type { DealTotals } from "@/lib/calc";

export type MetricDirection = "higher" | "lower";

export interface ComparisonMetric {
  key: string;
  label: string;
  valueA: number;
  valueB: number;
  delta: number;
  deltaPercent: number;
  winner: "A" | "B" | "tie";
  direction: MetricDirection; // "higher" means higher is better
}

const METRIC_DEFINITIONS: Record<string, { label: string; direction: MetricDirection }> = {
  annualizedRevenue: { label: "ARR", direction: "higher" },
  totalContractValue: { label: "TCV", direction: "higher" },
  effectiveMRR: { label: "MRR", direction: "higher" },
  netMarginDollars: { label: "Net Margin $", direction: "higher" },
  netMarginPercent: { label: "Net Margin %", direction: "higher" },
  ltvCacRatio: { label: "LTV:CAC", direction: "higher" },
  paybackMonths: { label: "Payback Period", direction: "lower" }, // Lower is better!
  totalProfit: { label: "Total Profit", direction: "higher" },
};

/**
 * Compare two deal scenarios and calculate deltas for all metrics
 */
export function compareScenarios(
  totalsA: DealTotals,
  totalsB: DealTotals,
  nameA: string = "Scenario A",
  nameB: string = "Scenario B"
): ComparisonMetric[] {
  const comparisons: ComparisonMetric[] = [];

  for (const [key, definition] of Object.entries(METRIC_DEFINITIONS)) {
    const valueA = totalsA[key as keyof DealTotals] as number ?? 0;
    const valueB = totalsB[key as keyof DealTotals] as number ?? 0;
    const delta = valueB - valueA;
    const deltaPercent = valueA !== 0 ? (delta / Math.abs(valueA)) * 100 : 0;

    // Determine winner based on direction
    let winner: "A" | "B" | "tie";
    if (Math.abs(delta) < 0.01) {
      winner = "tie";
    } else if (definition.direction === "higher") {
      winner = valueB > valueA ? "B" : "A";
    } else {
      winner = valueB < valueA ? "B" : "A"; // Lower is better
    }

    comparisons.push({
      key,
      label: definition.label,
      valueA,
      valueB,
      delta,
      deltaPercent,
      winner,
      direction: definition.direction,
    });
  }

  return comparisons;
}

/**
 * Format delta for display
 */
export function formatDelta(
  delta: number,
  deltaPercent: number,
  isMonetary: boolean = true,
  isPercentage: boolean = false
): string {
  const sign = delta >= 0 ? "+" : "";

  if (isPercentage) {
    return `${sign}${delta.toFixed(1)}% (${sign}${deltaPercent.toFixed(0)}%)`;
  }

  if (isMonetary) {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(delta));

    return `${sign}${formatted} (${sign}${deltaPercent.toFixed(0)}%)`;
  }

  // Numeric with decimals
  return `${sign}${delta.toFixed(2)} (${sign}${deltaPercent.toFixed(0)}%)`;
}
