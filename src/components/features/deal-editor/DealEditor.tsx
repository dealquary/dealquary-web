"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import ProductTable from "./ProductTable";
import { useAppStore } from "@/state/store";

export default function DealEditor() {
  const [showAdvancedTerms, setShowAdvancedTerms] = useState(false);
  const selectedDealId = useAppStore((s) => s.selectedDealId);
  const deal = useAppStore((s) => s.deals.find((d) => d.id === selectedDealId));
  const updateDeal = useAppStore((s) => s.updateDeal);

  if (!deal || !selectedDealId) return null;

  return (
    <div className="space-y-3">
      {/* Deal Name Header */}
      <Card glow="none">
        <div className="p-3">
          <Input
            value={deal.name}
            onChange={(e) => {
              const newName = e.target.value;
              if (newName.trim().length > 0) {
                updateDeal(selectedDealId, { name: newName });
              }
            }}
            className="text-lg font-bold border-0 !px-0 !ring-0 !outline-none focus:!ring-0 focus:!border-0"
            placeholder="Deal name..."
          />
        </div>
      </Card>

      {/* Product Table - At the TOP */}
      <ProductTable dealId={selectedDealId} />

      {/* Deal Settings - Contract Details */}
      <Card glow="none">
        <div className="p-3 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Contract Details</h2>
        </div>

        <div className="p-3 space-y-3">
          {/* Billing & Contract */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select
              label="Billing cadence"
              value={deal.billingCadence}
              onChange={(e) => updateDeal(selectedDealId, { billingCadence: e.target.value as any })}
            >
              <option value="MONTHLY">Monthly</option>
              <option value="ANNUAL_PREPAY">Annual (prepay)</option>
            </Select>

            <Select
              label="Contract length"
              value={deal.contractLengthType}
              onChange={(e) => updateDeal(selectedDealId, { contractLengthType: e.target.value as any })}
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
                  if (val >= 1) updateDeal(selectedDealId, { contractMonths: val });
                }}
              />
            ) : deal.contractLengthType === "YEARS" ? (
              <Input
                label="Duration"
                type="number"
                min="1"
                value={deal.contractYears}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 1) updateDeal(selectedDealId, { contractYears: val });
                }}
              />
            ) : (
              <div className="flex items-end pb-2">
                <p className="text-sm text-white/60 italic">Month-to-month = 1 month</p>
              </div>
            )}
          </div>

          {/* Advanced Deal Terms Toggle */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => setShowAdvancedTerms(!showAdvancedTerms)}
              className="text-xs text-cyan-300 hover:text-cyan-200 font-medium flex items-center gap-1"
            >
              {showAdvancedTerms ? "Hide" : "Show"} Advanced Deal Terms
              <svg
                className={`w-3 h-3 transition-transform ${showAdvancedTerms ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showAdvancedTerms && (
              <div className="mt-3 space-y-3">
                {/* Free Months */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deal.toggles.includeFreeMonths}
                        onChange={(e) =>
                          updateDeal(selectedDealId, { toggles: { ...deal.toggles, includeFreeMonths: e.target.checked } })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-white/20 bg-white/10 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-white">Include free months up front</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    value={deal.freeMonthsUpFront}
                    disabled={!deal.toggles.includeFreeMonths}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0) updateDeal(selectedDealId, { freeMonthsUpFront: val });
                    }}
                  />
                </div>

                {/* CAC */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deal.toggles.includeCAC}
                        onChange={(e) =>
                          updateDeal(selectedDealId, { toggles: { ...deal.toggles, includeCAC: e.target.checked } })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-white/20 bg-white/10 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-white">Include Customer Acquisition Cost (CAC)</span>
                    </label>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    value={deal.cac}
                    disabled={!deal.toggles.includeCAC}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0) updateDeal(selectedDealId, { cac: val });
                    }}
                  />
                </div>

                {/* Discount Floor */}
                <div>
                  <Input
                    label="Discount floor warning (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={deal.discountFloorPct}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0 && val <= 100) updateDeal(selectedDealId, { discountFloorPct: val });
                    }}
                  />
                </div>

                {/* Ramp Period */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deal.toggles.includeRamp}
                        onChange={(e) =>
                          updateDeal(selectedDealId, { toggles: { ...deal.toggles, includeRamp: e.target.checked } })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-white/20 bg-white/10 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-white">Include ramp/onboarding period</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Ramp months"
                      type="number"
                      min="0"
                      value={deal.rampMonths}
                      disabled={!deal.toggles.includeRamp}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 0) updateDeal(selectedDealId, { rampMonths: val });
                      }}
                    />
                    <Input
                      label="Ramp discount (%)"
                      type="number"
                      min="0"
                      max="100"
                      value={deal.rampDiscountPct}
                      disabled={!deal.toggles.includeRamp}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 0 && val <= 100) updateDeal(selectedDealId, { rampDiscountPct: val });
                      }}
                    />
                  </div>
                </div>

                {/* Annual Escalation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deal.toggles.includeEscalation}
                        onChange={(e) =>
                          updateDeal(selectedDealId, { toggles: { ...deal.toggles, includeEscalation: e.target.checked } })
                        }
                        className="w-4 h-4 text-blue-600 rounded border-white/20 bg-white/10 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-white">Include year-over-year escalation</span>
                    </label>
                  </div>
                  <Input
                    label="Annual escalator (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={deal.annualEscalatorPct}
                    disabled={!deal.toggles.includeEscalation}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0 && val <= 100) updateDeal(selectedDealId, { annualEscalatorPct: val });
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
