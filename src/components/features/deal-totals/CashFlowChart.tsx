"use client";

import { calcCumulativeCashFlow } from "@/lib/calc";
import type { Deal } from "@/lib/validators";

type CashFlowChartProps = {
  deal: Deal;
};

export function CashFlowChart({ deal }: CashFlowChartProps) {
  const points = calcCumulativeCashFlow(deal);

  if (points.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-500">
        No cash flow data available
      </div>
    );
  }

  // Chart dimensions
  const width = 100; // percentage-based for responsiveness
  const height = 200;
  const padding = { top: 20, right: 10, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find data ranges
  const maxMonth = points[points.length - 1].month;
  const allValues = points.map((p) => p.cumulativeProfit);
  const minValue = Math.min(0, ...allValues);
  const maxValue = Math.max(0, ...allValues);
  const valueRange = maxValue - minValue;

  // Find break-even point
  const breakEvenPoint = points.find((p) => p.breakEven);

  // Scale functions
  const scaleX = (month: number) => ((month - 1) / (maxMonth - 1)) * chartWidth;
  const scaleY = (value: number) => chartHeight - ((value - minValue) / valueRange) * chartHeight;

  // Generate path for the line
  const linePath = points
    .map((p, i) => {
      const x = scaleX(p.month);
      const y = scaleY(p.cumulativeProfit);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  // Zero line Y position
  const zeroY = scaleY(0);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ maxHeight: "200px" }}
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        <g opacity="0.1">
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
            const y = padding.top + chartHeight * fraction;
            return (
              <line
                key={fraction}
                x1={padding.left}
                y1={y}
                x2={padding.left + chartWidth}
                y2={y}
                stroke="currentColor"
                strokeWidth="0.5"
              />
            );
          })}
        </g>

        {/* Zero line (break-even) */}
        <line
          x1={padding.left}
          y1={padding.top + zeroY}
          x2={padding.left + chartWidth}
          y2={padding.top + zeroY}
          stroke="#6B7280"
          strokeWidth="1"
          strokeDasharray="3,3"
        />

        {/* Filled area below line */}
        <defs>
          <linearGradient id="cash-flow-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <path
          d={`${linePath} L ${padding.left + scaleX(maxMonth)} ${padding.top + chartHeight} L ${padding.left} ${padding.top + chartHeight} Z`}
          fill="url(#cash-flow-gradient)"
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#22C55E"
          strokeWidth="2"
          transform={`translate(${padding.left}, ${padding.top})`}
        />

        {/* Break-even marker */}
        {breakEvenPoint && (
          <g transform={`translate(${padding.left + scaleX(breakEvenPoint.month)}, ${padding.top + scaleY(breakEvenPoint.cumulativeProfit)})`}>
            <circle r="3" fill="#3B82F6" stroke="white" strokeWidth="1.5" />
            <text
              x="0"
              y="-10"
              fontSize="8"
              fill="#3B82F6"
              textAnchor="middle"
              fontWeight="600"
            >
              Break-even: Mo {breakEvenPoint.month}
            </text>
          </g>
        )}

        {/* Y-axis labels */}
        <text
          x={padding.left - 5}
          y={padding.top + scaleY(maxValue)}
          fontSize="8"
          fill="#6B7280"
          textAnchor="end"
          alignmentBaseline="middle"
        >
          {Math.round(maxValue / 1000)}K
        </text>
        <text
          x={padding.left - 5}
          y={padding.top + scaleY(0)}
          fontSize="8"
          fill="#6B7280"
          textAnchor="end"
          alignmentBaseline="middle"
        >
          $0
        </text>
        {minValue < 0 && (
          <text
            x={padding.left - 5}
            y={padding.top + scaleY(minValue)}
            fontSize="8"
            fill="#6B7280"
            textAnchor="end"
            alignmentBaseline="middle"
          >
            {Math.round(minValue / 1000)}K
          </text>
        )}

        {/* X-axis labels */}
        <text
          x={padding.left}
          y={height - 10}
          fontSize="8"
          fill="#6B7280"
          textAnchor="middle"
        >
          Mo 1
        </text>
        <text
          x={padding.left + chartWidth}
          y={height - 10}
          fontSize="8"
          fill="#6B7280"
          textAnchor="middle"
        >
          Mo {maxMonth}
        </text>

        {/* Y-axis label */}
        <text
          x={10}
          y={padding.top + chartHeight / 2}
          fontSize="9"
          fill="#6B7280"
          textAnchor="middle"
          transform={`rotate(-90, 10, ${padding.top + chartHeight / 2})`}
          fontWeight="600"
        >
          Cumulative Profit ($)
        </text>
      </svg>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-green-500" />
          <span className="text-white/60">Cumulative Profit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-gray-400 border-t-2 border-dashed border-gray-400" />
          <span className="text-white/60">Break-even</span>
        </div>
        {breakEvenPoint && (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-white/60">Month {breakEvenPoint.month}</span>
          </div>
        )}
      </div>
    </div>
  );
}
