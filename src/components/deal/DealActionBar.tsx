"use client";

import { useAppStore } from "@/state/store";
import { Button } from "@/components/ui/Button";
import type { Deal } from "@/lib/validators";

type DealActionBarProps = {
  dealId: string;
};

function isDealValid(deal: Deal | undefined): boolean {
  if (!deal) return false;

  // Must have at least one product
  if (deal.products.length === 0) return false;

  // Must have a custom name
  if (!deal.name.trim() || deal.name.match(/^(Deal \d+|Untitled Deal)$/)) return false;

  // Contract length must be present
  if (deal.contractLengthType === "MONTHS" && deal.contractMonths < 1) return false;
  if (deal.contractLengthType === "YEARS" && deal.contractYears < 1) return false;

  return true;
}

export default function DealActionBar({ dealId }: DealActionBarProps) {
  const deal = useAppStore((s) => s.deals.find((d) => d.id === dealId));
  const cloneDeal = useAppStore((s) => s.cloneDeal);
  const toggleComparedDeal = useAppStore((s) => s.toggleComparedDeal);
  const comparedDealIds = useAppStore((s) => s.comparedDealIds);

  const isValid = isDealValid(deal);
  const isCompared = comparedDealIds.includes(dealId);

  const handlePrimaryAction = () => {
    if (!isValid) return;

    // Add this deal to comparison
    if (!isCompared) {
      toggleComparedDeal(dealId);
    }

    // Switch to comparison view
    // This will be handled by parent component via router or view state
    const event = new CustomEvent('switchToComparison');
    window.dispatchEvent(event);
  };

  return (
    <div className="sticky bottom-0 z-40 backdrop-blur-xl bg-gradient-to-t from-black via-black/95 to-black/80 border-t border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Status indicator */}
          <div className="text-xs text-white/60">
            {!isValid && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                <span>Complete deal details to continue</span>
              </div>
            )}
            {isValid && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span>Deal ready</span>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Secondary actions */}
            <Button
              variant="secondary"
              onClick={() => cloneDeal(dealId)}
              className="!text-xs !py-2 !px-3"
            >
              Duplicate
            </Button>

            {/* Primary CTA */}
            <Button
              variant="primary"
              onClick={handlePrimaryAction}
              disabled={!isValid}
              className={`!py-2.5 !px-6 !text-sm font-semibold transition-all ${
                isValid
                  ? 'shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)]'
                  : ''
              }`}
            >
              {isCompared ? 'View Comparison →' : 'Save & Compare →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
