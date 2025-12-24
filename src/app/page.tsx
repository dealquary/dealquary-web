"use client";

import { useState } from "react";
import DealList from "@/components/features/deal-list/DealList";
import DealEditor from "@/components/features/deal-editor/DealEditor";
import DealTotals from "@/components/features/deal-totals/DealTotals";
import ComparisonMatrix from "@/components/features/comparison/ComparisonMatrix";
import { useAppStore } from "@/state/store";
import { Card } from "@/components/ui/Card";
import AppBackground from "@/components/AppBackground";


export default function Page() {
  const [viewMode, setViewMode] = useState<"deal" | "comparison">("deal");
  const selectedDealId = useAppStore((s) => s.selectedDealId);

  return (
    <AppBackground>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                  DealQuary
              </h1>
              <p className="text-xs text-white/60">
                Model and compare deal scenarios
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Mode Tabs */}
              <div className="flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-lg">
                <button
                  onClick={() => setViewMode("deal")}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-md transition-all
                    ${viewMode === "deal"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                      : "text-white/60 hover:text-white/80 hover:bg-white/5"
                    }
                  `}
                >
                  Deal Editor
                </button>
                <button
                  onClick={() => setViewMode("comparison")}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-md transition-all
                    ${viewMode === "comparison"
                      ? "bg-purple-500/20 text-purple-300 border border-purple-400/30"
                      : "text-white/60 hover:text-white/80 hover:bg-white/5"
                    }
                  `}
                >
                  Compare Deals
                </button>
              </div>

              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-400/30 rounded-lg backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                <span className="text-xs font-medium text-green-300">Local Mode</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Split-Pane Layout */}
      <main className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {viewMode === "comparison" ? (
          <ComparisonMatrix />
        ) : !selectedDealId ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Rail: Deal List */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <DealList />
              </div>
            </div>

            {/* Center: Empty State */}
            <div className="lg:col-span-9">
              <Card glow="pink">
                <div className="text-center py-24 px-6">
                  <div className="max-w-sm mx-auto">
                    <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-400/30">
                      <svg
                        className="w-10 h-10 text-pink-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No deal selected
                    </h3>
                    <p className="text-sm text-white/60">
                      Create a new deal or select an existing one from the sidebar to get started
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Rail: Deal List (Narrow) */}
            <div className="lg:col-span-2">
              <div className="lg:sticky lg:top-24">
                <DealList />
              </div>
            </div>

            {/* Center Workspace: Deal Configuration (Wide) */}
            <div className="lg:col-span-6">
              <DealEditor />
            </div>

            {/* Right Sidebar: Totals (Fixed, Sticky) */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <DealTotals />
              </div>
            </div>
          </div>
        )}
      </main>
    </AppBackground>
  );
}
