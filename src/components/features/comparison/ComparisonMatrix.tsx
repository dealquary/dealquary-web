"use client";

import { useAppStore } from "@/state/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { calcDealTotals } from "@/lib/calc";
import { money, num } from "@/lib/format";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Helper to find the index of the best (highest) value in an array of numeric strings
function findBestValueIndex(values: string[]): number {
  const nums = values.map((v) => {
    const cleaned = v.replace(/[$,%,—]/g, "").trim();
    return cleaned === "" ? -Infinity : parseFloat(cleaned);
  });
  const max = Math.max(...nums);
  return nums.findIndex((n) => n === max);
}

export default function ComparisonMatrix() {
  const deals = useAppStore((s) => s.deals);
  const comparedDealIds = useAppStore((s) => s.comparedDealIds);
  const toggleComparedDeal = useAppStore((s) => s.toggleComparedDeal);
  const clearComparedDeals = useAppStore((s) => s.clearComparedDeals);
  const { data: session, status } = useSession();
  const router = useRouter();

  const comparedDeals = deals.filter((d) => comparedDealIds.includes(d.id));
  const isPro = session?.user?.isPro || false;
  const isAuthenticated = status === "authenticated";
  const isTwoWayComparison = comparedDeals.length === 2;

  const handlePrint = () => {
    if (!isAuthenticated) {
      signIn("google");
      return;
    }
    if (!isPro) {
      router.push("/billing");
      return;
    }
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Deal Selection - Compact */}
      <Card glow="purple">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-white">
              Select Deals ({comparedDealIds.length} selected)
            </h2>
            {comparedDealIds.length > 0 && (
              <Button variant="secondary" onClick={clearComparedDeals} className="!text-xs !py-1 !px-2">
                Clear All
              </Button>
            )}
          </div>

          {deals.length === 0 ? (
            <p className="text-xs text-white/40 text-center py-2">No deals available</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {deals.map((deal) => {
                const isSelected = comparedDealIds.includes(deal.id);
                return (
                  <label
                    key={deal.id}
                    className={`
                      inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer
                      ${isSelected
                        ? "border-purple-400/50 bg-purple-500/10"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleComparedDeal(deal.id)}
                      className="w-3.5 h-3.5 text-purple-600 rounded border-white/20 bg-white/10 focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-xs font-medium text-white">{deal.name}</span>
                    <Badge size="sm" variant="default">
                      {deal.products.length}
                    </Badge>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Comparison Table */}
      {comparedDeals.length > 0 && (
        <Card glow="cyan">
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Deal Comparison</h2>
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
                <button
                  onClick={handlePrint}
                  className="print:hidden flex items-center gap-1 px-2 py-1 text-xs font-medium text-white/70 hover:text-white border border-white/20 rounded-md hover:bg-white/10 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  {!isAuthenticated ? "Sign in to Export" : !isPro ? "Upgrade to Export" : "PDF"}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="text-sm w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-3 font-semibold text-white/70 text-xs uppercase tracking-wide whitespace-nowrap">
                    Metric
                  </th>
                  {comparedDeals.map((deal) => (
                    <th
                      key={deal.id}
                      className="text-right p-3 font-semibold text-white text-sm whitespace-nowrap"
                    >
                      {deal.name}
                    </th>
                  ))}
                  {isTwoWayComparison && (
                    <th className="text-right p-3 font-semibold text-purple-300 text-sm whitespace-nowrap">
                      Difference
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {/* Core Revenue */}
                <tr className="bg-cyan-500/5">
                  <td colSpan={comparedDeals.length + 1 + (isTwoWayComparison ? 1 : 0)} className="p-2 text-xs font-semibold text-cyan-300 uppercase tracking-wide">
                    Core Revenue
                  </td>
                </tr>
                <MetricRow
                  label="MRR"
                  values={comparedDeals.map((d) => money(calcDealTotals(d).effectiveMRR))}
                  isTwoWayComparison={isTwoWayComparison}
                  rowIndex={0}
                />
                <MetricRow
                  label="ARR"
                  values={comparedDeals.map((d) => money(calcDealTotals(d).annualizedRevenue))}
                  isTwoWayComparison={isTwoWayComparison}
                  rowIndex={1}
                />
                <MetricRow
                  label="TCV (Total Contract Value)"
                  values={comparedDeals.map((d) => {
                    const t = calcDealTotals(d);
                    return money(t.tcv);
                  })}
                  highlight
                  isTwoWayComparison={isTwoWayComparison}
                  rowIndex={2}
                />

                {/* Profitability */}
                <tr className="bg-green-500/5 border-t border-white/10">
                  <td colSpan={comparedDeals.length + 1 + (isTwoWayComparison ? 1 : 0)} className="p-2 text-xs font-semibold text-green-300 uppercase tracking-wide">
                    Profitability
                  </td>
                </tr>
                <MetricRow
                  label="Monthly Profit"
                  values={comparedDeals.map((d) => money(calcDealTotals(d).monthlyProfit))}
                  isTwoWayComparison={isTwoWayComparison}
                  rowIndex={3}
                />
                <MetricRow
                  label="Annual Profit"
                  values={comparedDeals.map((d) => {
                    const t = calcDealTotals(d);
                    return money(t.termProfit / (t.termMonths / 12));
                  })}
                  isTwoWayComparison={isTwoWayComparison}
                  rowIndex={4}
                />
                <MetricRow
                  label="Net Margin %"
                  values={comparedDeals.map((d) => {
                    const t = calcDealTotals(d);
                    return t.blendedMarginPct == null ? "—" : `${num(t.blendedMarginPct, 1)}%`;
                  })}
                  isTwoWayComparison={isTwoWayComparison}
                  rowIndex={5}
                />
                <MetricRow
                  label="Total Contract Profit"
                  values={comparedDeals.map((d) => {
                    const t = calcDealTotals(d);
                    return money(t.termProfit);
                  })}
                  highlight
                  isTwoWayComparison={isTwoWayComparison}
                  rowIndex={6}
                />

                {/* Advanced Metrics */}
                <tr className="bg-purple-500/5 border-t border-white/10">
                  <td colSpan={comparedDeals.length + 1 + (isTwoWayComparison ? 1 : 0)} className="p-2 text-xs font-semibold text-purple-300 uppercase tracking-wide">
                    Advanced Metrics
                  </td>
                </tr>
                <MetricRow
                  label="Software Revenue"
                  values={comparedDeals.map((d) => money(calcDealTotals(d).softwareRevenue))}
                  isTwoWayComparison={isTwoWayComparison}
                  rowIndex={7}
                />
                <MetricRow
                  label="Services Revenue"
                  values={comparedDeals.map((d) => money(calcDealTotals(d).servicesRevenue))}
                  isTwoWayComparison={isTwoWayComparison}
                  rowIndex={8}
                />
                <MetricRow
                  label="LTV:CAC"
                  values={comparedDeals.map((d) => {
                    const t = calcDealTotals(d);
                    return t.ltvToCac == null ? "—" : num(t.ltvToCac, 2);
                  })}
                  isTwoWayComparison={isTwoWayComparison}
                  rowIndex={9}
                />
                <MetricRow
                  label="Payback (mo)"
                  values={comparedDeals.map((d) => {
                    const t = calcDealTotals(d);
                    return t.paybackMonths == null ? "—" : num(t.paybackMonths, 1);
                  })}
                  isTwoWayComparison={isTwoWayComparison}
                  rowIndex={10}
                />
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden p-3 space-y-3">
            {comparedDeals.map((deal) => {
              const totals = calcDealTotals(deal);
              return (
                <div key={deal.id} className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                  {/* Deal Name Header */}
                  <div className="pb-2 border-b border-white/10">
                    <h3 className="text-base font-bold text-white">{deal.name}</h3>
                    <p className="text-xs text-white/60 mt-0.5">
                      {deal.products.length} {deal.products.length === 1 ? "product" : "products"}
                    </p>
                  </div>

                  {/* Core Revenue */}
                  <div>
                    <div className="text-xs font-semibold text-cyan-300 mb-2 uppercase tracking-wide">Core Revenue</div>
                    <div className="space-y-1.5">
                      <MobileMetricRow label="MRR" value={money(totals.effectiveMRR)} />
                      <MobileMetricRow label="ARR" value={money(totals.annualizedRevenue)} />
                      <MobileMetricRow label="TCV" value={money(totals.tcv)} highlight />
                    </div>
                  </div>

                  {/* Profitability */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-xs font-semibold text-green-300 mb-2 uppercase tracking-wide">Profitability</div>
                    <div className="space-y-1.5">
                      <MobileMetricRow label="Monthly Profit" value={money(totals.monthlyProfit)} />
                      <MobileMetricRow label="Annual Profit" value={money(totals.termProfit / (totals.termMonths / 12))} />
                      <MobileMetricRow
                        label="Net Margin %"
                        value={totals.blendedMarginPct == null ? "—" : `${num(totals.blendedMarginPct, 1)}%`}
                      />
                      <MobileMetricRow label="Total Contract Profit" value={money(totals.termProfit)} highlight />
                    </div>
                  </div>

                  {/* Advanced Metrics */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="text-xs font-semibold text-purple-300 mb-2 uppercase tracking-wide">Advanced Metrics</div>
                    <div className="space-y-1.5">
                      <MobileMetricRow label="Software Revenue" value={money(totals.softwareRevenue)} />
                      <MobileMetricRow label="Services Revenue" value={money(totals.servicesRevenue)} />
                      <MobileMetricRow label="LTV:CAC" value={totals.ltvToCac == null ? "—" : num(totals.ltvToCac, 2)} />
                      <MobileMetricRow label="Payback (mo)" value={totals.paybackMonths == null ? "—" : num(totals.paybackMonths, 1)} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Empty State */}
      {comparedDeals.length === 0 && deals.length > 0 && (
        <Card glow="none">
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-400/30">
              <svg
                className="w-8 h-8 text-purple-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Select deals to compare
            </h3>
            <p className="text-sm text-white/60">
              Check the boxes above to add deals to the comparison matrix
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

type MetricRowProps = {
  label: string;
  values: string[];
  highlight?: boolean;
  isTwoWayComparison?: boolean;
  rowIndex?: number;
};

function MetricRow({ label, values, highlight = false, isTwoWayComparison = false, rowIndex = 0 }: MetricRowProps) {
  const bestIndex = findBestValueIndex(values);

  // Calculate difference for 2-way comparison
  let difference = "";
  if (isTwoWayComparison && values.length === 2) {
    const val1 = parseFloat(values[0].replace(/[$,%,—]/g, "").trim());
    const val2 = parseFloat(values[1].replace(/[$,%,—]/g, "").trim());
    if (!isNaN(val1) && !isNaN(val2)) {
      const diff = val2 - val1;
      const isPercent = values[0].includes('%');
      if (isPercent) {
        difference = `${diff > 0 ? '+' : ''}${num(diff, 1)}%`;
      } else {
        difference = `${diff > 0 ? '+' : ''}${money(diff)}`;
      }
    }
  }

  // Zebra striping - alternate between transparent and subtle background
  const zebraClass = rowIndex % 2 === 0 ? "" : "bg-white/[0.02]";

  return (
    <tr className={`border-b border-white/5 ${zebraClass} ${highlight ? "bg-white/5" : ""}`}>
      <td className="p-3 text-white/70 text-xs font-medium whitespace-nowrap">{label}</td>
      {values.map((value, index) => {
        const isBest = index === bestIndex;
        return (
          <td
            key={index}
            className={`
              p-3 text-right font-semibold font-mono whitespace-nowrap
              ${highlight ? "text-white" : "text-white/90"}
              ${isBest ? "border-l-4 border-green-400 bg-green-500/10" : ""}
            `}
          >
            {value}
          </td>
        );
      })}
      {isTwoWayComparison && (
        <td className="p-3 text-right font-semibold font-mono whitespace-nowrap text-purple-300">
          {difference}
        </td>
      )}
    </tr>
  );
}

type MobileMetricRowProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

function MobileMetricRow({ label, value, highlight = false }: MobileMetricRowProps) {
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-lg ${highlight ? "bg-white/10" : "bg-white/5"}`}>
      <span className="text-xs text-white/70 font-medium">{label}</span>
      <span className={`text-sm font-bold font-mono ${highlight ? "text-white" : "text-white/90"}`}>{value}</span>
    </div>
  );
}
