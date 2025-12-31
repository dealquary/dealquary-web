/**
 * Metric Thresholds for Deal Health
 * Epic 2: Deal Health Transparency
 */

export type MetricStatus = "good" | "warning" | "bad";

export const thresholds = {
  ltvCac: { bad: 2, warning: 3 },         // <2 red, 2-3 yellow, >3 green
  margin: { bad: 0.5, warning: 0.7 },     // <50% red, 50-70% yellow, >70% green
  payback: { good: 6, warning: 12 }       // <6 green, 6-12 yellow, >12 red (inverted)
};

/**
 * Get metric status based on value and thresholds
 */
export function getMetricStatus(metric: "ltvCac" | "margin" | "payback", value: number): MetricStatus {
  if (metric === "ltvCac") {
    if (value < thresholds.ltvCac.bad) return "bad";
    if (value < thresholds.ltvCac.warning) return "warning";
    return "good";
  }

  if (metric === "margin") {
    if (value < thresholds.margin.bad) return "bad";
    if (value < thresholds.margin.warning) return "warning";
    return "good";
  }

  if (metric === "payback") {
    // Payback is inverted: lower is better
    if (value < thresholds.payback.good) return "good";
    if (value < thresholds.payback.warning) return "warning";
    return "bad";
  }

  return "good";
}

/**
 * Get color classes for a metric status
 */
export function getStatusColor(status: MetricStatus): {
  text: string;
  bg: string;
  border: string;
} {
  switch (status) {
    case "good":
      return {
        text: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-400/30"
      };
    case "warning":
      return {
        text: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-400/30"
      };
    case "bad":
      return {
        text: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-400/30"
      };
  }
}
