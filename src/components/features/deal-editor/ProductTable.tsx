"use client";

import { useAppStore } from "@/state/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import ProductRowCard from "@/components/deal/ProductRowCard";

export default function ProductTable({ dealId }: { dealId: string }) {
  const deal = useAppStore((s) => s.deals.find((d) => d.id === dealId));
  const addProduct = useAppStore((s) => s.addProduct);

  if (!deal) return null;

  return (
    <Card glow="none">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Products</h2>
            <p className="text-xs text-white/50 mt-0.5">
              {deal.products.length} {deal.products.length === 1 ? "line item" : "line items"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => addProduct(dealId, "RECURRING")} className="!text-sm">
              + Add Product
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
        {deal.products.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-pink-400/30">
              <svg
                className="w-8 h-8 text-pink-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Add your first product line
            </h3>
            <p className="text-sm text-white/60 mb-4">
              Start with pricing, margin, and term assumptions — metrics update instantly
            </p>
            <Button
              variant="primary"
              onClick={() => addProduct(dealId, "RECURRING")}
              className="!text-sm"
            >
              + Add Product
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {deal.products.map((p, index) => (
              <ProductRowCard
                key={p.id}
                product={p}
                deal={deal}
                dealId={dealId}
                index={index}
                isLast={index === deal.products.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
