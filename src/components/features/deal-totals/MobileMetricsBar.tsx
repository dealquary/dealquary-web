"use client";

import { useState } from "react";
import { useAppStore } from "@/state/store";
import { calcDealTotals } from "@/lib/calc";
import { money, num } from "@/lib/format";
import DealTotals from "./DealTotals";

export default function MobileMetricsBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const selectedDealId = useAppStore((s) => s.selectedDealId);
  const deal = useAppStore((s) => s.deals.find((d) => d.id === selectedDealId));

  if (!deal || deal.products.length === 0) return null;

  const totals = calcDealTotals(deal);

  return (
    <>
      {/* Sticky Bottom Bar - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/95 to-black/80 backdrop-blur-xl border-t border-white/20 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full px-4 py-3 min-h-[60px] flex items-center justify-between hover:bg-white/5 transition-colors active:bg-white/10"
        >
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">TCV</div>
              <div className="text-lg font-bold font-mono text-cyan-300">{money(totals.tcv)}</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <div className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Net Margin</div>
              <div className="text-lg font-bold font-mono text-green-300">
                {totals.blendedMarginPct == null ? "—" : `${num(totals.blendedMarginPct, 1)}%`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">View All</span>
            <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Full Metrics Drawer */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-[#070A12] border-t border-white/20 shadow-2xl overflow-y-auto animate-slideUp rounded-t-2xl">
            <div className="sticky top-0 z-10 bg-[#070A12]/95 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Deal Metrics</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <DealTotals />
            </div>
          </div>
        </>
      )}
    </>
  );
}
