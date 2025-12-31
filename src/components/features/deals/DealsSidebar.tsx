"use client";

import { useEffect } from "react";
import { useAppStore } from "@/state/store";
import { Button } from "@/components/ui/Button";
import DealListItem from "./DealListItem";

export default function DealsSidebar() {
  const hydrate = useAppStore((s) => s.hydrate);
  const hydrated = useAppStore((s) => s.hydrated);

  const deals = useAppStore((s) => s.deals);
  const selectedDealId = useAppStore((s) => s.selectedDealId);
  const createDeal = useAppStore((s) => s.createDeal);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  return (
    <div className="bg-[#050810] border border-white/[0.08] rounded-lg overflow-visible">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-white/[0.08] bg-black/20">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-white/80 uppercase tracking-wider">Deals</h2>
          <Button onClick={createDeal} className="!text-xs !py-1 !px-2 !min-h-0">
            New Deal
          </Button>
        </div>
      </div>

      {/* Deal List */}
      <div className="py-1">
        {deals.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <p className="text-xs text-white/50">No deals yet</p>
            <p className="text-xs text-white/30 mt-1">Create your first deal</p>
          </div>
        ) : (
          deals.map((deal) => (
            <DealListItem
              key={deal.id}
              deal={deal}
              isSelected={deal.id === selectedDealId}
            />
          ))
        )}
      </div>
    </div>
  );
}
