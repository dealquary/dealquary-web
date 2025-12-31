"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import ProductTable from "./ProductTable";
import DealShapeBar from "@/components/deal/DealShapeBar";
import { useAppStore } from "@/state/store";

export default function DealEditor() {
  const selectedDealId = useAppStore((s) => s.selectedDealId);
  const deal = useAppStore((s) => s.deals.find((d) => d.id === selectedDealId));
  const updateDeal = useAppStore((s) => s.updateDeal);

  // Local state for deal name to allow clearing without validation errors
  const [localName, setLocalName] = useState<string | null>(null);
  const [showDealShape, setShowDealShape] = useState(false);
  const [showAdvancedGuardrails, setShowAdvancedGuardrails] = useState(false);

  if (!deal || !selectedDealId) return null;

  // Use local name if editing, otherwise use store value
  const displayName = localName !== null ? localName : deal.name;

  return (
    <div className="space-y-4">
      {/* Deal Header */}
      <Card glow="none">
        <div className="p-4">
          <Input
            value={displayName}
            onChange={(e) => {
              setLocalName(e.target.value);
            }}
            onBlur={(e) => {
              const trimmed = e.target.value.trim();
              updateDeal(selectedDealId, { name: trimmed });
              setLocalName(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            className="text-xl font-bold border-0 px-2 !ring-0 !outline-none focus:!ring-0 focus:!border-0"
            placeholder="Deal Name"
          />
          <p className="text-xs text-white/50 mt-1 px-2">
            Model SaaS deal economics in real time — ARR, margin, payback, and risk
          </p>
        </div>
      </Card>

      {/* Deal Shape - Collapsible */}
      <Card glow="none">
        <div className="p-4">
          <button
            onClick={() => setShowDealShape(!showDealShape)}
            className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div>
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Deal Shape
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                {showDealShape ? "Click to collapse" : "Contract length, billing cadence"}
              </p>
            </div>
            <svg
              className={`w-5 h-5 text-white/60 transition-transform ${showDealShape ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showDealShape && (
            <div className="mt-4">
              <DealShapeBar
                deal={deal}
                onUpdate={(patch) => updateDeal(selectedDealId, patch)}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Products Table - Centerpiece */}
      <ProductTable dealId={selectedDealId} />

      {/* Advanced Guardrails - Collapsible */}
      <Card glow="none">
        <div className="p-4">
          <button
            onClick={() => setShowAdvancedGuardrails(!showAdvancedGuardrails)}
            className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors group"
          >
            <div>
              <h3 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                Advanced Guardrails
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                {showAdvancedGuardrails ? "Click to collapse" : "CAC, free months, ramp periods & more"}
              </p>
            </div>
            <svg
              className={`w-5 h-5 text-white/60 transition-transform ${showAdvancedGuardrails ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showAdvancedGuardrails && (
            <div className="mt-4 space-y-3">
              {/* 2x2 Grid of Toggle Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Panel 1: Customer Acquisition Cost */}
                <div className={`rounded-lg border transition-all ${deal.toggles.includeCAC ? 'bg-green-500/10 border-green-400/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-white">Customer Acquisition Cost</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deal.toggles.includeCAC}
                          onChange={(e) =>
                            updateDeal(selectedDealId, { toggles: { ...deal.toggles, includeCAC: e.target.checked } })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </div>
                    {deal.toggles.includeCAC ? (
                      <Input
                        type="number"
                        min="0"
                        value={deal.cac}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= 0) updateDeal(selectedDealId, { cac: val });
                        }}
                        className="font-mono !pr-3"
                        placeholder="e.g., 12500"
                      />
                    ) : (
                      <p className="text-xs text-white/50 italic">Track the cost to acquire this customer and calculate LTV:CAC ratio</p>
                    )}
                  </div>
                </div>

                {/* Panel 2: Free Months Up Front */}
                <div className={`rounded-lg border transition-all ${deal.toggles.includeFreeMonths ? 'bg-blue-500/10 border-blue-400/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-semibold text-white">Free Months Up Front</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deal.toggles.includeFreeMonths}
                          onChange={(e) =>
                            updateDeal(selectedDealId, { toggles: { ...deal.toggles, includeFreeMonths: e.target.checked } })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                    {deal.toggles.includeFreeMonths ? (
                      <Input
                        type="number"
                        min="0"
                        value={deal.freeMonthsUpFront}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= 0) updateDeal(selectedDealId, { freeMonthsUpFront: val });
                        }}
                        className="font-mono !pr-3"
                        placeholder="e.g., 2"
                      />
                    ) : (
                      <p className="text-xs text-white/50 italic">Offer complimentary months at the beginning of the contract</p>
                    )}
                  </div>
                </div>

                {/* Panel 3: Ramp/Onboarding Period */}
                <div className={`rounded-lg border transition-all ${deal.toggles.includeRamp ? 'bg-purple-500/10 border-purple-400/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="text-sm font-semibold text-white">Ramp/Onboarding Period</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deal.toggles.includeRamp}
                          onChange={(e) =>
                            updateDeal(selectedDealId, { toggles: { ...deal.toggles, includeRamp: e.target.checked } })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                    </div>
                    {deal.toggles.includeRamp ? (
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Months"
                          type="number"
                          min="0"
                          value={deal.rampMonths}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 0) updateDeal(selectedDealId, { rampMonths: val });
                          }}
                          className="font-mono !pr-3"
                          placeholder="e.g., 3"
                        />
                        <Input
                          label="Discount %"
                          type="number"
                          min="0"
                          max="100"
                          value={deal.rampDiscountPct}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= 0 && val <= 100) updateDeal(selectedDealId, { rampDiscountPct: val });
                          }}
                          className="font-mono !pr-3"
                          placeholder="e.g., 50"
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-white/50 italic">Apply discounted pricing during implementation or onboarding phase</p>
                    )}
                  </div>
                </div>

                {/* Panel 4: Year-over-Year Escalation */}
                <div className={`rounded-lg border transition-all ${deal.toggles.includeEscalation ? 'bg-orange-500/10 border-orange-400/30' : 'bg-white/5 border-white/10'}`}>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="text-sm font-semibold text-white">Year-over-Year Escalation</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deal.toggles.includeEscalation}
                          onChange={(e) =>
                            updateDeal(selectedDealId, { toggles: { ...deal.toggles, includeEscalation: e.target.checked } })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                    {deal.toggles.includeEscalation ? (
                      <Input
                        label="Annual %"
                        type="number"
                        min="0"
                        max="100"
                        value={deal.annualEscalatorPct}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= 0 && val <= 100) updateDeal(selectedDealId, { annualEscalatorPct: val });
                        }}
                        className="font-mono !pr-3"
                        placeholder="e.g., 5"
                      />
                    ) : (
                      <p className="text-xs text-white/50 italic">Automatically increase pricing each year of multi-year contracts</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Discount Floor (standalone, always visible) */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <Input
                  label="Discount Safety Net (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={deal.discountFloorPct}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val <= 100) updateDeal(selectedDealId, { discountFloorPct: val });
                  }}
                  className="font-mono !pr-3"
                  placeholder="e.g., 20"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
