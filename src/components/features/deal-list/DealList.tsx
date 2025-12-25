"use client";

import { useEffect } from "react";
import { useAppStore } from "@/state/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function DealList() {
  const hydrate = useAppStore((s) => s.hydrate);
  const hydrated = useAppStore((s) => s.hydrated);

  const deals = useAppStore((s) => s.deals);
  const selectedDealId = useAppStore((s) => s.selectedDealId);

  const createDeal = useAppStore((s) => s.createDeal);
  const selectDeal = useAppStore((s) => s.selectDeal);
  const cloneDeal = useAppStore((s) => s.cloneDeal);
  const deleteDeal = useAppStore((s) => s.deleteDeal);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  return (
    <Card glow="cyan">
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Deals</h2>
          <Button onClick={createDeal} className="!text-xs !py-1 !px-2">
            + New
          </Button>
        </div>
      </div>

      <div className="p-2 space-y-2">
        {deals.filter(d => d.name.trim().length > 0).length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-sm text-white/60">No deals yet.</p>
            <p className="text-xs text-white/40 mt-1">Create one to get started</p>
          </div>
        ) : (
          deals.filter(d => d.name.trim().length > 0).map((d) => {
            const active = d.id === selectedDealId;
            return (
              <div
                key={d.id}
                className={`
                  p-3 rounded-lg border-2 transition-all duration-200
                  ${active
                    ? "border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }
                `}
              >
                <button
                  className="w-full text-left mb-2"
                  onClick={() => selectDeal(d.id)}
                >
                  <div className="font-semibold text-white text-sm mb-1">
                    {d.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge size="sm" variant="default">
                      {d.products.length} {d.products.length === 1 ? "product" : "products"}
                    </Badge>
                    <span className="text-xs text-white/60">
                      {d.contractLengthType === "MONTH_TO_MONTH"
                        ? "Month-to-month"
                        : d.contractLengthType === "MONTHS"
                        ? `${d.contractMonths} months`
                        : `${d.contractYears} years`}
                    </span>
                  </div>
                </button>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => cloneDeal(d.id)}
                    className="flex-1 !text-xs !py-1"
                  >
                    Clone
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => deleteDeal(d.id)}
                    className="flex-1 !text-xs !py-1"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
