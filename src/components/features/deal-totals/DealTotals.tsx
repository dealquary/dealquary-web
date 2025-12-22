"use client";

import { useAppStore } from "@/state/store";
import { Card } from "@/components/ui/Card";
import { CashFlowChart } from "./CashFlowChart";
import { calcDealTotals } from "@/lib/calc";
import { money, num } from "@/lib/format";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type MetricCardProps = {
  label: string;
  value: string;
  subtext?: string;
  variant?: "default" | "highlight";
  compact?: boolean;
};

function MetricCard({ label, value, subtext, variant = "default", compact = false }: MetricCardProps) {
  return (
    <div
      className={`
        ${compact ? "p-2" : "p-3"} rounded-lg border
        ${variant === "highlight"
          ? "bg-blue-500/10 border-blue-400/30"
          : "bg-white/5 border-white/10"
        }
      `}
    >
      <div className={`${compact ? "text-[10px]" : "text-xs"} font-medium text-white/70 mb-1`}>{label}</div>
      <div className={`${compact ? "text-base" : "text-lg"} font-bold ${variant === "highlight" ? "text-blue-300" : "text-white"}`}>
        {value}
      </div>
      {subtext && <div className="text-xs text-white/60 mt-0.5">{subtext}</div>}
    </div>
  );
}

export default function DealTotals() {
  const selectedDealId = useAppStore((s) => s.selectedDealId);
  const deal = useAppStore((s) => s.deals.find((d) => d.id === selectedDealId));
  const { data: session, status } = useSession();
  const router = useRouter();

  if (!deal) return null;

  const totals = calcDealTotals(deal);
  const isPro = session?.user?.isPro || false;
  const isAuthenticated = status === "authenticated";

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
    <div className="space-y-3">
      {/* Deal Header */}
      <Card glow="cyan">
        <div className="p-3 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Deal Metrics</h2>
              <p className="text-xs text-white/60 mt-0.5">{deal.name}</p>
            </div>
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

        <div className="p-3 space-y-3">
          {/* GROUP 1: Core Revenue (The Basics) */}
          <div>
            <div className="text-xs font-semibold text-cyan-300 mb-2 uppercase tracking-wide">Core Revenue</div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <MetricCard label="MRR" value={money(totals.effectiveMRR)} compact />
                <MetricCard label="ARR" value={money(totals.annualizedRevenue)} compact />
              </div>
              {totals.termMonths > 1 && (
                <MetricCard
                  label={`TCV (${totals.termMonths} months)`}
                  value={money(totals.tcv)}
                  variant="highlight"
                  compact
                />
              )}
            </div>
          </div>

          {/* GROUP 2: Profitability (The Mid-Tier) */}
          <div className="pt-2 border-t border-white/10">
            <div className="text-xs font-semibold text-green-300 mb-2 uppercase tracking-wide">Profitability</div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <MetricCard label="Monthly Profit" value={money(totals.monthlyProfit)} compact />
                <MetricCard label="Annual Profit" value={money(totals.termProfit / (totals.termMonths / 12))} compact />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <MetricCard
                  label="Net Margin %"
                  value={totals.blendedMarginPct == null ? "—" : `${num(totals.blendedMarginPct, 1)}%`}
                  compact
                />
                <MetricCard
                  label={`Total Contract Profit (${totals.termMonths} mo)`}
                  value={money(totals.termProfit)}
                  variant="highlight"
                  compact
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
                  <MetricCard label="Software" value={money(totals.softwareRevenue)} compact />
                  <MetricCard label="Services" value={money(totals.servicesRevenue)} compact />
                </div>
              </div>
            )}

            {/* CAC Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <MetricCard
                label="LTV:CAC"
                value={totals.ltvToCac == null ? "—" : num(totals.ltvToCac, 2)}
                compact
              />
              <MetricCard
                label="Payback (mo)"
                value={totals.paybackMonths == null ? "—" : num(totals.paybackMonths, 1)}
                compact
              />
            </div>

            {/* Cash Flow Chart */}
            {deal.toggles.includeCAC && totals.cac > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10">
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
                Avg discount {num(totals.avgDiscountDepthPct, 1)}% exceeds floor
              </span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
