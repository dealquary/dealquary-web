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
            <p className="text-sm text-white/60">No line items yet</p>
            <p className="text-xs text-white/40 mt-1">
              Click &quot;+ Add Product&quot; to start building your deal
            </p>
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
