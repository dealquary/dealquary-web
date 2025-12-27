"use client";

import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { Deal } from "@/lib/validators";

type DealShapeBarProps = {
  deal: Deal;
  onUpdate: (patch: Partial<Deal>) => void;
};

export default function DealShapeBar({ deal, onUpdate }: DealShapeBarProps) {
  // Generate live summary
  const billingLabel = deal.billingCadence === "MONTHLY" ? "Monthly" : "Annual";
  const termLabel =
    deal.contractLengthType === "MONTH_TO_MONTH"
      ? "M2M"
      : deal.contractLengthType === "MONTHS"
      ? `${deal.contractMonths}mo`
      : `${deal.contractYears}yr`;
  const summary = `${billingLabel} • ${termLabel}`;

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-3">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Left: Title */}
        <div className="md:min-w-[140px]">
          <h3 className="text-sm font-semibold text-white/90">Deal Shape</h3>
          <p className="text-xs text-white/50 mt-0.5">Billing + term assumptions</p>
        </div>

        {/* Center: Fields */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Select
            label="Billing cadence"
            value={deal.billingCadence}
            onChange={(e) => {
              const value = e.target.value as "MONTHLY" | "ANNUAL_PREPAY";
              onUpdate({ billingCadence: value });
            }}
          >
            <option value="MONTHLY">Monthly</option>
            <option value="ANNUAL_PREPAY">Annual (prepay)</option>
          </Select>

          <Select
            label="Contract length"
            value={deal.contractLengthType}
            onChange={(e) => {
              const value = e.target.value as "MONTH_TO_MONTH" | "MONTHS" | "YEARS";
              onUpdate({ contractLengthType: value });
            }}
          >
            <option value="MONTH_TO_MONTH">Month-to-month</option>
            <option value="MONTHS">Fixed months</option>
            <option value="YEARS">Fixed years</option>
          </Select>

          {deal.contractLengthType === "MONTHS" ? (
            <Input
              label="Duration"
              type="number"
              min="1"
              value={deal.contractMonths}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1) onUpdate({ contractMonths: val });
              }}
              className="!pr-3"
            />
          ) : deal.contractLengthType === "YEARS" ? (
            <Input
              label="Duration"
              type="number"
              min="1"
              value={deal.contractYears}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1) onUpdate({ contractYears: val });
              }}
              className="!pr-3"
            />
          ) : (
            <div className="flex items-end pb-2">
              <p className="text-sm text-white/50 italic">No duration needed</p>
            </div>
          )}
        </div>

        {/* Right: Summary Chip */}
        <div className="md:min-w-[120px] flex justify-end">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 border border-cyan-400/20 rounded-full">
            <svg className="w-3.5 h-3.5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-cyan-300">{summary}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
