"use client";

import { useState } from "react";
import DealsSidebar from "@/components/features/deals/DealsSidebar";
import DealEditor from "@/components/features/deal-editor/DealEditor";
import DealTotals from "@/components/features/deal-totals/DealTotals";
import { useAppStore } from "@/state/store";
import { Card } from "@/components/ui/Card";
import AppBackground from "@/components/AppBackground";
import { Drawer } from "@/components/ui/Drawer";
import { UserMenu } from "@/components/UserMenu";
import { useSession } from "next-auth/react";
import { Tutorial } from "@/components/tutorial/Tutorial";


export default function Page() {
  const [isDealsDrawerOpen, setIsDealsDrawerOpen] = useState(false);
  const selectedDealId = useAppStore((s) => s.selectedDealId);
  const { data: session, status } = useSession();

  const isPro = session?.user?.isPro || false;
  const isAuthenticated = status === "authenticated";

  return (
    <AppBackground>
      {/* Minimal Header - Always visible */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-[2400px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Left: Deal Selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDealsDrawerOpen(true)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Switch deals"
              >
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">
                  DealQuary
                </h1>
              </div>
            </div>

            {/* Right: Plan Badge + User Menu */}
            <div className="flex items-center gap-3">
              {/* Plan Badge */}
              {status !== "loading" && (
                <div className="hidden sm:block">
                  {isPro ? (
                    <span className="px-2.5 py-1 text-xs font-semibold bg-gradient-to-r from-amber-400/20 to-yellow-400/20 border border-amber-400/30 rounded-full text-amber-300">
                      PRO
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-semibold bg-white/10 border border-white/20 rounded-full text-white/70">
                      FREE
                    </span>
                  )}
                </div>
              )}
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Trading Terminal Layout */}
      <main className="max-w-[2400px] mx-auto px-4 py-4">
        {!selectedDealId ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Rail: Deal List - Hidden on mobile */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <DealsSidebar />
              </div>
            </div>

            {/* Center: Empty State */}
            <div className="col-span-1 lg:col-span-9">
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
            {/* LEFT 60%: Inputs Column */}
            <div className="lg:col-span-7 space-y-4">
              <DealEditor />
            </div>

            {/* RIGHT 40%: Outcomes Panel (Sticky) */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-20 space-y-4">
                <DealTotals />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Drawer for Deals List */}
      <Drawer
        isOpen={isDealsDrawerOpen}
        onClose={() => setIsDealsDrawerOpen(false)}
        title="Deals"
        side="left"
      >
        <DealsSidebar />
      </Drawer>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-sm mt-12">
        <div className="max-w-[2400px] mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              DealQuary does not store customer PII or contract documents. Calculations are private to your account.
            </p>
            {!isPro && isAuthenticated && (
              <p className="text-xs text-white/50">
                <span className="text-cyan-300 font-semibold">Pro unlocks:</span> exports, saved deals, advanced metrics
              </p>
            )}
          </div>
        </div>
      </footer>

      {/* Tutorial */}
      <Tutorial />
    </AppBackground>
  );
}
