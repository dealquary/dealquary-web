"use client";

import { useState } from "react";
import { useAppStore } from "@/state/store";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import type { Product } from "@/lib/validators";

type ProductRowProps = {
  product: Product;
  dealId: string;
  index: number;
};

function ProductRow({ product: p, dealId, index }: ProductRowProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDiscounts, setShowDiscounts] = useState(false);
  const updateProduct = useAppStore((s) => s.updateProduct);
  const removeProduct = useAppStore((s) => s.removeProduct);

  return (
    <div className="border-b border-white/10 last:border-0">
      {/* SIMPLE VIEW: Just the essentials */}
      <div className="p-3 hover:bg-white/5 transition-colors">
        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Product Number */}
          <div className="col-span-1">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white text-xs font-semibold">
              {index + 1}
            </div>
          </div>

          {/* Product Name */}
          <div className="col-span-4">
            <Input
              value={p.name}
              onChange={(e) => {
                const newName = e.target.value;
                if (newName.trim().length > 0) {
                  updateProduct(dealId, p.id, { name: newName });
                }
              }}
              placeholder="Product name"
              className="text-sm"
            />
          </div>

          {/* Price */}
          <div className="col-span-3">
            {p.type === "RECURRING" ? (
              <Input
                label="Price/License"
                type="number"
                min="0"
                value={p.listPricePerUnitMonthly}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0) updateProduct(dealId, p.id, { listPricePerUnitMonthly: val });
                }}
                className="text-sm"
              />
            ) : (
              <Input
                label="One-time Price"
                type="number"
                min="0"
                value={p.oneTimeListPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 0) updateProduct(dealId, p.id, { oneTimeListPrice: val });
                }}
                className="text-sm"
              />
            )}
          </div>

          {/* Licenses (only for recurring) */}
          <div className="col-span-2">
            {p.type === "RECURRING" ? (
              <Input
                label="Licenses"
                type="number"
                min="1"
                value={p.licenses}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 1) updateProduct(dealId, p.id, { licenses: val });
                }}
                className="text-sm"
              />
            ) : (
              <div className="text-xs text-white/40 text-center">N/A</div>
            )}
          </div>

          {/* Actions */}
          <div className="col-span-2 flex items-center justify-end gap-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-cyan-300 hover:text-cyan-200 font-medium flex items-center gap-1"
            >
              {showAdvanced ? "Hide" : "Profit Margins & Discounts"}
              <svg
                className={`w-3 h-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <Button
              variant="danger"
              onClick={() => removeProduct(dealId, p.id)}
              className="!px-2 !py-1 text-xs"
            >
              ×
            </Button>
          </div>
        </div>
      </div>

      {/* ADVANCED VIEW: Complex settings */}
      {showAdvanced && (
        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="space-y-4">
            {/* Type & Include in Totals */}
            <div className="flex items-center gap-4">
              <Badge variant={p.type === "RECURRING" ? "primary" : "warning"} size="sm">
                {p.type === "RECURRING" ? "Recurring" : "One-time"}
              </Badge>
              <label className="flex items-center gap-2 cursor-pointer ml-auto">
                <input
                  type="checkbox"
                  checked={p.includeInTotals}
                  onChange={(e) => updateProduct(dealId, p.id, { includeInTotals: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-white/20 bg-white/10 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-white/70">Include in totals</span>
              </label>
            </div>

            {/* Profit Mode */}
            <div>
              <h4 className="text-xs font-semibold text-white/70 mb-2 uppercase tracking-wide">Profit Modeling</h4>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Profit Mode"
                  value={p.profitMode}
                  onChange={(e) => updateProduct(dealId, p.id, { profitMode: e.target.value as any })}
                >
                  <option value="MARGIN_PCT">Margin %</option>
                  <option value="PROFIT_PER_UNIT">{p.type === "RECURRING" ? "Profit/License" : "Fixed Profit"}</option>
                </Select>
                {p.profitMode === "MARGIN_PCT" ? (
                  <Input
                    label="Margin % (0-1)"
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={p.marginPct}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0 && val <= 1) updateProduct(dealId, p.id, { marginPct: val });
                    }}
                  />
                ) : p.type === "RECURRING" ? (
                  <Input
                    label="Profit/License (mo)"
                    type="number"
                    min="0"
                    value={p.profitPerUnitMonthly}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0) updateProduct(dealId, p.id, { profitPerUnitMonthly: val });
                    }}
                  />
                ) : (
                  <Input
                    label="One-time Profit"
                    type="number"
                    min="0"
                    value={p.oneTimeProfit}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 0) updateProduct(dealId, p.id, { oneTimeProfit: val });
                    }}
                  />
                )}
              </div>
            </div>

            {/* Discounts & Commissions Toggle Button */}
            <div>
              <button
                onClick={() => setShowDiscounts(!showDiscounts)}
                className="text-xs text-cyan-300 hover:text-cyan-200 font-medium flex items-center gap-1"
              >
                {showDiscounts ? "Hide" : "Show"} Discounts & Commissions
                <svg
                  className={`w-3 h-3 transition-transform ${showDiscounts ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDiscounts && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Customer Discount */}
                  <div className="p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-blue-300">Customer Discount</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Select
                        label="Mode"
                        value={p.customerDiscountMode}
                        onChange={(e) => updateProduct(dealId, p.id, { customerDiscountMode: e.target.value as any })}
                      >
                        <option value="PERCENT">Percent</option>
                        <option value="DOLLARS">Dollars</option>
                      </Select>
                      <Input
                        label={p.customerDiscountMode === "PERCENT" ? "%" : "$"}
                        type="number"
                        min="0"
                        max={p.customerDiscountMode === "PERCENT" ? "100" : undefined}
                        value={p.customerDiscountValue}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const max = p.customerDiscountMode === "PERCENT" ? 100 : Infinity;
                          if (val >= 0 && val <= max) updateProduct(dealId, p.id, { customerDiscountValue: val });
                        }}
                      />
                    </div>
                  </div>

                  {/* Partner Commission */}
                  <div className="p-3 bg-orange-500/10 border border-orange-400/30 rounded-lg">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-orange-300">Partner/Channel Commission</span>
                    </div>
                    <Input
                      label="Commission %"
                      type="number"
                      min="0"
                      max="100"
                      value={p.partnerCommissionPct}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 0 && val <= 100) updateProduct(dealId, p.id, { partnerCommissionPct: val });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductTable({ dealId }: { dealId: string }) {
  const deal = useAppStore((s) => s.deals.find((d) => d.id === dealId));
  const addProduct = useAppStore((s) => s.addProduct);

  if (!deal) return null;

  return (
    <Card glow="none">
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Products</h2>
            <p className="text-xs text-white/60 mt-0.5">
              {deal.products.length} {deal.products.length === 1 ? "product" : "products"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => addProduct(dealId, "RECURRING")}>
              + Recurring
            </Button>
            <Button variant="secondary" onClick={() => addProduct(dealId, "ONE_TIME")}>
              + One-time
            </Button>
          </div>
        </div>
      </div>

      <div>
        {deal.products.length === 0 ? (
          <div className="text-center py-8 px-6">
            <p className="text-sm text-white/60">No products added yet.</p>
            <p className="text-xs text-white/40 mt-1">
              Click the buttons above to add products
            </p>
          </div>
        ) : (
          <div>
            {deal.products.map((p, index) => (
              <ProductRow key={p.id} product={p} dealId={dealId} index={index} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
