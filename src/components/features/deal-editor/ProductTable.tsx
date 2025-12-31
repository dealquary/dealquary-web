"use client";

import { useState } from "react";
import { useAppStore } from "@/state/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import ProductRowCard from "@/components/deal/ProductRowCard";

export default function ProductTable({ dealId }: { dealId: string }) {
  const deal = useAppStore((s) => s.deals.find((d) => d.id === dealId));
  const addProduct = useAppStore((s) => s.addProduct);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!deal) return null;

  return (
    <Card glow="none">
      <div className="p-4" id="products-section">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-all duration-200 group active:scale-[0.98]"
        >
          <div>
            <h2 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
              Products
            </h2>
            <p className="text-xs text-white/60 mt-0.5">
              {isExpanded ? "Click to collapse" : `${deal.products.length} ${deal.products.length === 1 ? "line item" : "line items"}`}
            </p>
          </div>
          <svg
            className={`w-5 h-5 text-white/60 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isExpanded ? "2000px" : "0",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-end mb-4">
              <Button variant="primary" onClick={() => addProduct(dealId, "RECURRING")} className="!text-sm">
                + Add Product
              </Button>
            </div>

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
        </div>
      </div>
    </Card>
  );
}
