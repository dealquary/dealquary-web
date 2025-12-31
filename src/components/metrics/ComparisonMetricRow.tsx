"use client";

import { formatDelta, type ComparisonMetric } from "@/lib/scenarioComparison";
import { money, num } from "@/lib/format";

type ComparisonMetricRowProps = {
  metric: ComparisonMetric;
  nameA: string;
  nameB: string;
};

export default function ComparisonMetricRow({ metric, nameA, nameB }: ComparisonMetricRowProps) {
  const isMonetary = metric.key.includes("Revenue") || metric.key.includes("Profit") || metric.key.includes("TCV") || metric.key.includes("MRR") || metric.key.includes("Margin") && metric.key.includes("Dollars");
  const isPercentage = metric.key.includes("Percent") || metric.key === "netMarginPercent";
  const isRatio = metric.key === "ltvCacRatio";
  const isMonths = metric.key === "paybackMonths";

  const formatValue = (value: number) => {
    if (isMonetary) return money(value);
    if (isPercentage) return `${(value * 100).toFixed(1)}%`;
    if (isRatio) return num(value, 2);
    if (isMonths) return `${value.toFixed(1)} mo`;
    return num(value, 0);
  };

  const deltaDisplay = formatDelta(metric.delta, metric.deltaPercent, isMonetary, isPercentage);

  // Determine delta color
  const deltaColor = metric.winner === "tie"
    ? "text-white/50"
    : metric.winner === "B"
    ? "text-green-400"
    : "text-red-400";

  const deltaIcon = metric.winner === "tie"
    ? null
    : metric.winner === "B"
    ? "↑"
    : "↓";

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-3 items-center py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
      {/* Label */}
      <div className="text-sm font-medium text-white/70">{metric.label}</div>

      {/* Value A */}
      <div className="text-sm font-mono text-white/80 text-right">
        {formatValue(metric.valueA)}
      </div>

      {/* Value B */}
      <div className="text-sm font-mono text-white/80 text-right">
        {formatValue(metric.valueB)}
      </div>

      {/* Delta */}
      <div className={`text-sm font-mono font-semibold text-right flex items-center justify-end gap-1 ${deltaColor}`}>
        {deltaIcon && <span className="text-base">{deltaIcon}</span>}
        <span>{deltaDisplay}</span>
      </div>
    </div>
  );
}
