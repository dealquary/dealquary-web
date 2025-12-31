"use client";

import { useState, useMemo } from "react";
import { useAppStore } from "@/state/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { calcRecurringProduct, calcOneTimeProduct } from "@/lib/calc";
import { money } from "@/lib/format";
import type { Product, Deal } from "@/lib/validators";

type ProductRowCardProps = {
  product: Product;
  deal: Deal;
  dealId: string;
  index: number;
  isLast: boolean;
};

export default function ProductRowCard({ product: p, deal, dealId, index, isLast }: ProductRowCardProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localName, setLocalName] = useState<string | null>(null);
  const [localPrice, setLocalPrice] = useState<string | null>(null);
  const [localLicenses, setLocalLicenses] = useState<string | null>(null);
  const [localMargin, setLocalMargin] = useState<string | null>(null);
  const [localProfitPerUnit, setLocalProfitPerUnit] = useState<string | null>(null);
  const [localOneTimeProfit, setLocalOneTimeProfit] = useState<string | null>(null);
  const [localDiscount, setLocalDiscount] = useState<string | null>(null);
  const updateProduct = useAppStore((s) => s.updateProduct);
  const removeProduct = useAppStore((s) => s.removeProduct);
  const duplicateProduct = useAppStore((s) => s.duplicateProduct);
  const addProduct = useAppStore((s) => s.addProduct);

  // Calculate line totals
  const lineTotals = useMemo(() => {
    if (p.type === "RECURRING") {
      return calcRecurringProduct(p, deal);
    } else {
      return calcOneTimeProduct(p);
    }
  }, [p, deal]);

  // Keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Cmd/Ctrl + D: Duplicate product
    if ((e.metaKey || e.ctrlKey) && e.key === "d") {
      e.preventDefault();
      duplicateProduct(dealId, p.id);
      return;
    }

    // Enter on last row: Add new product (same type)
    if (e.key === "Enter" && isLast) {
      e.preventDefault();
      addProduct(dealId, p.type);
      return;
    }
  };

  return (
    <div
      className="bg-white/[0.03] border border-white/[0.08] rounded-lg hover:bg-white/[0.05] transition-all"
      onKeyDown={handleKeyDown}
    >
      {/* Main Row - Responsive */}
      <div className="p-3">
        {/* Header Row: Number, Name, and Action Buttons */}
        <div className="flex items-center gap-2 mb-3">
          {/* Product Number */}
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-white text-xs font-semibold flex-shrink-0">
            {index + 1}
          </div>

          {/* Product Name */}
          <div className="flex-1 min-w-0">
            <Input
              value={localName !== null ? localName : p.name}
              onChange={(e) => {
                setLocalName(e.target.value);
              }}
              onBlur={(e) => {
                const trimmed = e.target.value.trim();
                updateProduct(dealId, p.id, { name: trimmed });
                setLocalName(null);
              }}
              placeholder={p.type === "RECURRING" ? "Product Name (e.g., SentinelOne Control)" : "Service Name (e.g., Onboarding & Setup)"}
              className="text-sm border-0 !px-2 !py-1 !bg-transparent !ring-0 hover:!bg-white/5 font-medium"
            />
          </div>

          {/* Advanced Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
            title="Advanced settings"
          >
            <svg
              className={`w-4 h-4 text-white/60 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Delete Button */}
          <Button
            variant="danger"
            onClick={() => removeProduct(dealId, p.id)}
            className="!px-2 !py-1 text-sm flex-shrink-0"
          >
            ×
          </Button>
        </div>

        {/* Fields Row - Responsive Grid */}
        <div className="grid grid-cols-2 md:flex md:items-center gap-2 md:gap-3">
          {/* Price */}
          <div className="flex-1">
            <label className="text-xs text-white/50 mb-1 block">Price</label>
            {p.type === "RECURRING" ? (
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-white/50 pointer-events-none">$</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={localPrice !== null ? localPrice : p.listPricePerUnitMonthly}
                  onChange={(e) => {
                    setLocalPrice(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    const finalVal = val >= 0 ? val : 0;
                    updateProduct(dealId, p.id, { listPricePerUnitMonthly: finalVal });
                    setLocalPrice(null);
                  }}
                  className="text-sm font-mono !pl-6 !pr-3 !py-1 text-right"
                  placeholder="49"
                />
              </div>
            ) : (
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-white/50 pointer-events-none">$</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={localPrice !== null ? localPrice : p.oneTimeListPrice}
                  onChange={(e) => {
                    setLocalPrice(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    const finalVal = val >= 0 ? val : 0;
                    updateProduct(dealId, p.id, { oneTimeListPrice: finalVal });
                    setLocalPrice(null);
                  }}
                  className="text-sm font-mono !pl-6 !pr-3 !py-1 text-right"
                  placeholder="5000"
                />
              </div>
            )}
          </div>

          {/* License Count (recurring only) */}
          {p.type === "RECURRING" && (
            <div className="flex-1">
              <label className="text-xs text-white/50 mb-1 block">Licenses</label>
              <Input
                type="number"
                min="1"
                value={localLicenses !== null ? localLicenses : p.licenses}
                onChange={(e) => {
                  setLocalLicenses(e.target.value);
                }}
                onBlur={(e) => {
                  const val = Number(e.target.value);
                  const finalVal = val >= 1 ? val : 1;
                  updateProduct(dealId, p.id, { licenses: finalVal });
                  setLocalLicenses(null);
                }}
                className="text-sm font-mono !pl-2 !pr-3 !py-1 text-right"
                placeholder="50"
              />
            </div>
          )}

          {/* Inline Metrics - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block text-xs text-white/50 font-mono flex-shrink-0 min-w-[180px] text-right">
            {money(lineTotals.monthlyRevenue)}/mo  |  Profit: {money(lineTotals.monthlyProfit)}
          </div>
        </div>

        {/* Mobile-only Metrics */}
        <div className="md:hidden mt-2 text-xs text-white/50 font-mono text-center">
          {money(lineTotals.monthlyRevenue)}/mo  |  Profit: {money(lineTotals.monthlyProfit)}
        </div>
      </div>

      {/* Advanced Section - Collapsed by Default */}
      {showAdvanced && (
        <div className="px-3 pb-3 pt-0 border-t border-white/10 mt-3">
          <div className="space-y-3 pt-3">
            {/* Profit Controls */}
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Profit Mode"
                value={p.profitMode}
                onChange={(e) => {
                  const value = e.target.value as "MARGIN_PCT" | "PROFIT_PER_UNIT";
                  updateProduct(dealId, p.id, { profitMode: value });
                }}
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
                  value={localMargin !== null ? localMargin : p.marginPct}
                  onChange={(e) => {
                    setLocalMargin(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    const finalVal = val >= 0 && val <= 1 ? val : 0;
                    updateProduct(dealId, p.id, { marginPct: finalVal });
                    setLocalMargin(null);
                  }}
                  className="font-mono !pr-3"
                />
              ) : p.type === "RECURRING" ? (
                <Input
                  label="Profit/License (mo)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={localProfitPerUnit !== null ? localProfitPerUnit : p.profitPerUnitMonthly}
                  onChange={(e) => {
                    setLocalProfitPerUnit(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    const finalVal = val >= 0 ? val : 0;
                    updateProduct(dealId, p.id, { profitPerUnitMonthly: finalVal });
                    setLocalProfitPerUnit(null);
                  }}
                  className="font-mono !pr-3"
                  placeholder="30"
                />
              ) : (
                <Input
                  label="One-time Profit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={localOneTimeProfit !== null ? localOneTimeProfit : p.oneTimeProfit}
                  onChange={(e) => {
                    setLocalOneTimeProfit(e.target.value);
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    const finalVal = val >= 0 ? val : 0;
                    updateProduct(dealId, p.id, { oneTimeProfit: finalVal });
                    setLocalOneTimeProfit(null);
                  }}
                  className="font-mono !pr-3"
                  placeholder="2500"
                />
              )}
            </div>

            {/* Customer Discount */}
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Discount Mode"
                value={p.customerDiscountMode}
                onChange={(e) => {
                  const value = e.target.value as "PERCENT" | "DOLLARS";
                  updateProduct(dealId, p.id, { customerDiscountMode: value });
                }}
              >
                <option value="PERCENT">Percent</option>
                <option value="DOLLARS">Dollars{p.type === "RECURRING" ? "/License" : ""}</option>
              </Select>
              <Input
                label={p.customerDiscountMode === "PERCENT" ? "Discount %" : `Discount ${p.type === "RECURRING" ? "/Lic" : "$"}`}
                type="number"
                min="0"
                value={localDiscount !== null ? localDiscount : p.customerDiscountValue}
                onChange={(e) => {
                  setLocalDiscount(e.target.value);
                }}
                onBlur={(e) => {
                  const val = Number(e.target.value);
                  const finalVal = val >= 0 ? val : 0;
                  updateProduct(dealId, p.id, { customerDiscountValue: finalVal });
                  setLocalDiscount(null);
                }}
                className="font-mono !pr-3"
              />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.includeInTotals}
                  onChange={(e) => updateProduct(dealId, p.id, { includeInTotals: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-white/20 bg-white/10 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-white/70">Include in totals</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
