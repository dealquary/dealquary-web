"use client";

import { useState } from "react";
import { useAppStore } from "@/state/store";
import { Card } from "@/components/ui/Card";
import { CashFlowChart } from "./CashFlowChart";
import { calcDealTotals } from "@/lib/calc";
import { money, num } from "@/lib/format";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import MetricCard, { type MetricStatus } from "@/components/metrics/MetricCard";
import { evaluateDealHealth } from "@/lib/dealHealth";
import { ExportDrawer } from "@/components/features/export/ExportDrawer";
import { getMetricStatus } from "@/lib/metricThresholds";
import { getARRFormula, getTCVFormula, getProfitFormula, getLTVCACFormula, getPaybackFormula, getMarginFormula } from "@/lib/formulas";
import ComparisonMetricRow from "@/components/metrics/ComparisonMetricRow";
import { compareScenarios } from "@/lib/scenarioComparison";

// Helper to determine margin status
function getMarginStatus(marginPct: number | null): { status: MetricStatus; label: string } | null {
  if (marginPct === null) return null;

  if (marginPct >= 55) {
    return { status: "success", label: "Strong" };
  } else if (marginPct >= 40) {
    return { status: "warning", label: "OK" };
  } else {
    return { status: "danger", label: "Low" };
  }
}

export default function DealTotals() {
  const selectedDealId = useAppStore((s) => s.selectedDealId);
  const deal = useAppStore((s) => s.deals.find((d) => d.id === selectedDealId));
  const comparedDealIds = useAppStore((s) => s.comparedDealIds);
  const deals = useAppStore((s) => s.deals);
  const toggleComparedDeal = useAppStore((s) => s.toggleComparedDeal);
  const cloneDeal = useAppStore((s) => s.cloneDeal);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isExportDrawerOpen, setIsExportDrawerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); // EPIC 1: Expanded by default

  if (!deal) return null;

  const totals = calcDealTotals(deal);
  const isPro = session?.user?.isPro || false;
  const isAuthenticated = status === "authenticated";

  // EPIC 8: Comparison mode
  const isComparisonMode = comparedDealIds.length > 0;
  const comparedDeal = isComparisonMode ? deals.find((d) => comparedDealIds[0] === d.id) : null;
  const comparedTotals = comparedDeal ? calcDealTotals(comparedDeal) : null;

  // EPIC 2: Calculate metric statuses using thresholds
  const marginStatus = getMarginStatus(totals.blendedMarginPct);

  // Convert threshold statuses to MetricCard statuses
  const ltvCacThreshold = totals.ltvToCac ? getMetricStatus("ltvCac", totals.ltvToCac) : null;
  const ltvCacStatus: MetricStatus | undefined = ltvCacThreshold === "good" ? "success" : ltvCacThreshold === "warning" ? "warning" : ltvCacThreshold === "bad" ? "danger" : undefined;

  const paybackThreshold = totals.paybackMonths ? getMetricStatus("payback", totals.paybackMonths) : null;
  const paybackStatus: MetricStatus | undefined = paybackThreshold === "good" ? "success" : paybackThreshold === "warning" ? "warning" : paybackThreshold === "bad" ? "danger" : undefined;

  // Calculate deal health
  const health = evaluateDealHealth(deal);

  const handleExport = () => {
    if (!isAuthenticated) {
      signIn("google");
      return;
    }
    if (!isPro) {
      router.push("/billing");
      return;
    }
    setIsExportDrawerOpen(true);
  };

  return (
    <div className="space-y-3">
      {/* Deal Header - EPIC 1: Distinct visual treatment */}
      <Card glow="cyan" className="bg-slate-900/50 border-l-2 border-cyan-500">
        <div className="p-3" id="deal-metrics-section">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all duration-200 group active:scale-[0.98]"
          >
            <div>
              <h2 className="text-base font-semibold text-white group-hover:text-cyan-300 transition-colors">Deal Metrics</h2>
              <p className="text-xs text-white/60 mt-0.5">
                {deal.name || "Untitled Deal"} • {deal.products.length} {deal.products.length === 1 ? "product" : "products"}
              </p>
            </div>
            <svg
              className={`w-5 h-5 text-white/60 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight: isExpanded ? "1500px" : "0",
              opacity: isExpanded ? 1 : 0,
            }}
          >
            <div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-xs text-white/50">{deal.name || "Untitled Deal"}</div>
                <div className="flex items-center gap-2">
                  {isPro && (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Pro
                    </span>
                  )}
                  {/* EPIC 8: Compare Scenario button */}
                  {!isComparisonMode ? (
                    <button
                      onClick={() => {
                        cloneDeal(deal.id);
                        // The cloned deal will be selected, so we'll compare the original
                        setTimeout(() => toggleComparedDeal(deal.id), 100);
                      }}
                      className="print:hidden flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-300 hover:text-purple-200 border border-purple-400/30 bg-purple-500/10 rounded-md hover:bg-purple-500/20 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                      Compare Scenario
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleComparedDeal(comparedDeal!.id)}
                      className="print:hidden flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-300 hover:text-red-200 border border-red-400/30 bg-red-500/10 rounded-md hover:bg-red-500/20 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Exit Comparison
                    </button>
                  )}
                  <button
                    onClick={handleExport}
                    className="print:hidden flex items-center gap-1 px-2 py-1 text-xs font-medium text-cyan-300 hover:text-cyan-200 border border-cyan-400/30 bg-cyan-500/10 rounded-md hover:bg-cyan-500/20 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {!isAuthenticated ? "Sign in to Export" : !isPro ? "Upgrade to Export" : "Export"}
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {/* EPIC 2: Deal Health Badge - Always visible, no toggle */}
                <div className="relative">
                  <div
              className={`
                w-full p-3 rounded-lg border
                ${health.status === "strong" ? "bg-green-500/10 border-green-400/30" : ""}
                ${health.status === "ok" ? "bg-yellow-500/10 border-yellow-400/30" : ""}
                ${health.status === "risky" ? "bg-red-500/10 border-red-400/30" : ""}
              `}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`
                  w-3 h-3 rounded-full
                  ${health.status === "strong" ? "bg-green-400" : ""}
                  ${health.status === "ok" ? "bg-yellow-400" : ""}
                  ${health.status === "risky" ? "bg-red-400 animate-pulse" : ""}
                `} />
                <span className="text-sm font-semibold text-white">
                  Deal Health: <span className={`text-lg ${
                    health.status === "strong" ? "text-green-300" : ""
                  }${health.status === "ok" ? "text-yellow-300" : ""}${health.status === "risky" ? "text-red-300" : ""}`}>
                    {health.status === "strong" ? "Strong" : health.status === "ok" ? "OK" : "Risky"}
                  </span>
                </span>
              </div>

              {/* Always visible breakdown */}
              <div className="space-y-2">
                {health.positives.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold text-green-300 mb-1 uppercase tracking-wide">Strengths</div>
                    <ul className="space-y-1">
                      {health.positives.map((reason, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-white/70">
                          <svg className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {health.concerns.length > 0 && (
                  <div className={health.positives.length > 0 ? "pt-2 border-t border-white/10" : ""}>
                    <div className="text-[10px] font-semibold text-yellow-300 mb-1 uppercase tracking-wide">Concerns</div>
                    <ul className="space-y-1">
                      {health.concerns.map((reason, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-white/70">
                          <svg className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* EPIC 8: Comparison Mode Header */}
          {isComparisonMode && comparedTotals && (
            <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-3">
              <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-3 text-[10px] font-semibold text-white/50 uppercase tracking-wide mb-2">
                <div>Metric</div>
                <div className="text-right">{deal.name}</div>
                <div className="text-right">{comparedDeal?.name}</div>
                <div className="text-right">Δ Delta</div>
              </div>
              <div className="space-y-1">
                {compareScenarios(totals, comparedTotals, deal.name, comparedDeal?.name || "Scenario B").map((metric) => (
                  <ComparisonMetricRow key={metric.key} metric={metric} nameA={deal.name} nameB={comparedDeal?.name || "Scenario B"} />
                ))}
              </div>
            </div>
          )}

          {/* GROUP 1: Core Revenue (The Basics) - EPIC 5: Add formulas */}
          <div>
            <div className="text-xs font-semibold text-cyan-300 mb-2 uppercase tracking-wide">Core Revenue</div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <MetricCard
                  label="MRR"
                  value={money(totals.effectiveMRR)}
                  rawValue={totals.effectiveMRR}
                  compact
                  colorType="revenue"
                  formula={`MRR = Monthly Recurring Revenue\n${money(totals.effectiveMRR)}/month`}
                />
                <MetricCard
                  label="ARR"
                  value={money(totals.annualizedRevenue)}
                  rawValue={totals.annualizedRevenue}
                  compact
                  colorType="revenue"
                  formula={getARRFormula(totals.effectiveMRR)}
                />
              </div>
              {totals.termMonths > 1 && (
                <MetricCard
                  label={`TCV (${totals.termMonths} months)`}
                  value={money(totals.tcv)}
                  rawValue={totals.tcv}
                  variant="highlight"
                  compact
                  colorType="revenue"
                  formula={getTCVFormula(totals.effectiveMRR, totals.termMonths)}
                />
              )}
            </div>
          </div>

          {/* GROUP 2: Profitability (The Mid-Tier) - EPIC 5: Add formulas */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-xs font-semibold text-green-300 mb-2 uppercase tracking-wide">Profitability</div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <MetricCard
                  label="Monthly Profit"
                  value={money(totals.monthlyProfit)}
                  rawValue={totals.monthlyProfit}
                  compact
                  colorType="profit"
                  formula={totals.blendedMarginPct ? getProfitFormula(totals.monthlyRevenue, totals.blendedMarginPct / 100) : undefined}
                />
                <MetricCard
                  label="Annual Profit"
                  value={money(totals.termProfit / (totals.termMonths / 12))}
                  rawValue={totals.termProfit / (totals.termMonths / 12)}
                  compact
                  colorType="profit"
                  formula={`Annual Profit = Total Profit / Years\n${money(totals.termProfit)} / ${num(totals.termMonths / 12, 1)} = ${money(totals.termProfit / (totals.termMonths / 12))}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MetricCard
                  label="Net Margin %"
                  value={totals.blendedMarginPct == null ? "—" : `${num(totals.blendedMarginPct, 1)}%`}
                  rawValue={totals.blendedMarginPct ?? undefined}
                  compact
                  colorType="profit"
                  status={marginStatus?.status}
                  statusLabel={marginStatus?.label}
                  formula={totals.blendedMarginPct ? getMarginFormula(totals.termProfit, totals.tcv) : undefined}
                />
                <MetricCard
                  label={`Total Contract Profit (${totals.termMonths} mo)`}
                  value={money(totals.termProfit)}
                  rawValue={totals.termProfit}
                  variant="highlight"
                  compact
                  colorType="profit"
                  formula={`Total Profit = Monthly Profit × Term\n${money(totals.monthlyProfit)} × ${totals.termMonths} = ${money(totals.termProfit)}`}
                />
              </div>
            </div>
          </div>

          {/* GROUP 3: Advanced Metrics (The Bottom) */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-xs font-semibold text-purple-300 mb-2 uppercase tracking-wide">Advanced Metrics</div>

            {/* Revenue Mix */}
            {(totals.softwareRevenue > 0 || totals.servicesRevenue > 0) && (
              <div className="mb-2">
                <div className="text-xs text-white/60 mb-1">Revenue Mix</div>
                <div className="grid grid-cols-2 gap-2">
                  <MetricCard label="Software" value={money(totals.softwareRevenue)} rawValue={totals.softwareRevenue} compact colorType="revenue" />
                  <MetricCard label="Services" value={money(totals.servicesRevenue)} rawValue={totals.servicesRevenue} compact colorType="revenue" />
                </div>
              </div>
            )}

            {/* CAC Metrics - EPIC 2: Color-coded thresholds, EPIC 5: Add formulas */}
            <div className="grid grid-cols-2 gap-2">
              <MetricCard
                label="LTV:CAC"
                value={totals.ltvToCac == null ? "—" : num(totals.ltvToCac, 2)}
                rawValue={totals.ltvToCac ?? undefined}
                compact
                status={ltvCacStatus}
                statusLabel={ltvCacThreshold === "good" ? "Strong" : ltvCacThreshold === "warning" ? "OK" : ltvCacThreshold === "bad" ? "Low" : undefined}
                formula={totals.ltvToCac ? getLTVCACFormula(totals.contractedLTV, totals.cac) : undefined}
              />
              <MetricCard
                label="Payback (mo)"
                value={totals.paybackMonths == null ? "—" : num(totals.paybackMonths, 1)}
                rawValue={totals.paybackMonths ?? undefined}
                compact
                status={paybackStatus}
                statusLabel={paybackThreshold === "good" ? "Fast" : paybackThreshold === "warning" ? "OK" : paybackThreshold === "bad" ? "Slow" : undefined}
                formula={totals.paybackMonths ? getPaybackFormula(totals.cac, totals.monthlyProfit) : undefined}
              />
            </div>

            {/* Cash Flow Chart */}
            {deal.toggles.includeCAC && totals.cac > 0 && (
              <div className="mt-3 pt-3 border-white/10">
                <div className="text-xs font-semibold text-white/70 mb-2">Cash Flow to Break-Even</div>
                <CashFlowChart deal={deal} />
              </div>
            )}
          </div>

                {/* Discount Warning */}
                {totals.exceedsDiscountFloor && (
                  <div className="p-2 bg-yellow-500/10 border border-yellow-400/30 rounded-lg flex items-center gap-2">
                    <svg className="w-4 h-4 text-yellow-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="text-xs font-medium text-yellow-200">
                      Avg discount <span className="font-mono">{num(totals.avgDiscountDepthPct, 1)}%</span> exceeds floor
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Drawer */}
      <ExportDrawer
        isOpen={isExportDrawerOpen}
        onClose={() => setIsExportDrawerOpen(false)}
      />
    </div>
  );
}
