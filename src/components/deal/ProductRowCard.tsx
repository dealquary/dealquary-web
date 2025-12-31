"use client";

import React, { useState, useMemo } from "react";
import { useAppStore } from "@/state/store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Select } from "@/components/ui/Select";
import { calcRecurringProduct, calcOneTimeProduct } from "@/lib/calc";
import { money } from "@/lib/format";
import { validators } from "@/lib/validation";
import { getEffectivePriceDisplay } from "@/lib/formulas";
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
  const [localDiscount, setLocalDiscount] = useState<string | null>(null);

  // EPIC 4: Validation error states
  const [priceError, setPriceError] = useState<string | null>(null);
  const [licensesError, setLicensesError] = useState<string | null>(null);
  const [marginError, setMarginError] = useState<string | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);

  // EPIC 10: Context menu for "Include in totals"
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

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

  // EPIC 10: Context menu handlers
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Close context menu when clicking outside
  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [contextMenu]);

  // EPIC 6: Dynamic grid template based on product type
  const gridCols = p.type === "RECURRING"
    ? "grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_1fr_auto]" // With Licenses column
    : "grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_auto]";     // Without Licenses column

  return (
    <div
      id={index === 0 ? "product-row-0" : undefined}
      className={`bg-white/[0.03] border rounded-lg hover:bg-white/[0.05] transition-all ${
        !p.includeInTotals ? "border-red-500/30 opacity-60" : "border-white/[0.08]"
      }`}
      onKeyDown={handleKeyDown}
      onContextMenu={handleContextMenu}
    >
      {/* EPIC 6: Main Row - Column-based Layout */}
      <div className="p-3">
        <div className={`grid ${gridCols} gap-2 items-center`}>
            {/* Product Number */}
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-white text-xs font-semibold flex-shrink-0">
              {index + 1}
            </div>

            {/* Product Name */}
            <div className="min-w-0">
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
                placeholder={p.type === "RECURRING" ? "Product Name" : "Service Name"}
                className="text-sm border-0 !px-2 !py-1 !bg-transparent !ring-0 hover:!bg-white/5 font-medium"
              />
            </div>

            {/* Price */}
            <div>
              {p.type === "RECURRING" ? (
                <CurrencyInput
                  min="0"
                  step="0.01"
                  value={localPrice !== null ? localPrice : p.listPricePerUnitMonthly}
                  onChange={(e) => {
                    setLocalPrice(e.target.value);
                    const val = Number(e.target.value);
                    const error = validators.price(val);
                    setPriceError(error);
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    const error = validators.price(val);
                    setPriceError(error);
                    if (!error) {
                      updateProduct(dealId, p.id, { listPricePerUnitMonthly: val });
                    }
                    setLocalPrice(null);
                  }}
                  error={priceError || undefined}
                  className="text-sm !pr-2 !py-1 text-right"
                  placeholder="49"
                />
              ) : (
                <CurrencyInput
                  min="0"
                  step="0.01"
                  value={localPrice !== null ? localPrice : p.oneTimeListPrice}
                  onChange={(e) => {
                    setLocalPrice(e.target.value);
                    const val = Number(e.target.value);
                    const error = validators.price(val);
                    setPriceError(error);
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    const error = validators.price(val);
                    setPriceError(error);
                    if (!error) {
                      updateProduct(dealId, p.id, { oneTimeListPrice: val });
                    }
                    setLocalPrice(null);
                  }}
                  error={priceError || undefined}
                  className="text-sm !pr-2 !py-1 text-right"
                  placeholder="5000"
                />
              )}
            </div>

            {/* EPIC 6: Margin % - Moved from Advanced */}
            <div>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={localMargin !== null ? localMargin : p.marginPct}
                onChange={(e) => {
                  setLocalMargin(e.target.value);
                  const val = Number(e.target.value);
                  const error = validators.margin(val);
                  setMarginError(error);
                }}
                onBlur={(e) => {
                  const val = Number(e.target.value);
                  const error = validators.margin(val);
                  setMarginError(error);
                  if (!error) {
                    updateProduct(dealId, p.id, { marginPct: val });
                  }
                  setLocalMargin(null);
                }}
                error={marginError || undefined}
                className="text-sm font-mono !px-2 !py-1 text-right"
                placeholder="0.70"
              />
            </div>

            {/* Licenses (recurring only) */}
            {p.type === "RECURRING" && (
              <div>
                <Input
                  type="number"
                  min="1"
                  value={localLicenses !== null ? localLicenses : p.licenses}
                  onChange={(e) => {
                    setLocalLicenses(e.target.value);
                    const val = Number(e.target.value);
                    const error = validators.licenses(val);
                    setLicensesError(error);
                  }}
                  onBlur={(e) => {
                    const val = Number(e.target.value);
                    const error = validators.licenses(val);
                    setLicensesError(error);
                    if (!error) {
                      updateProduct(dealId, p.id, { licenses: Math.floor(val) });
                    }
                    setLocalLicenses(null);
                  }}
                  error={licensesError || undefined}
                  className="text-sm font-mono !px-2 !py-1 text-right"
                  placeholder="50"
                />
              </div>
            )}

            {/* EPIC 6: MRR Column */}
            <div className="text-sm font-mono text-white/70 text-right">
              {money(lineTotals.monthlyRevenue)}
            </div>

            {/* EPIC 6: ARR Column */}
            <div className="text-sm font-mono text-cyan-300 text-right font-semibold">
              {p.type === "RECURRING" ? money(lineTotals.annualizedRevenue) : "—"}
            </div>

            {/* Actions: Advanced Toggle + Delete */}
            <div className="flex items-center gap-1">
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
              <Button
                variant="danger"
                onClick={() => removeProduct(dealId, p.id)}
                className="!px-2 !py-1 text-sm flex-shrink-0"
              >
                ×
              </Button>
            </div>
          </div>

          {/* EPIC 5: Effective price after discount */}
          {p.customerDiscountValue > 0 && (
            <div className="mt-2 text-xs text-white/40 font-mono col-span-full">
              {p.type === "RECURRING"
                ? getEffectivePriceDisplay(p.listPricePerUnitMonthly, p.customerDiscountMode, p.customerDiscountValue)
                : getEffectivePriceDisplay(p.oneTimeListPrice, p.customerDiscountMode, p.customerDiscountValue)}
            </div>
          )}
        </div>

      {/* EPIC 6: Advanced Section - Simplified (margin moved to main row) */}
      {showAdvanced && (
        <div className="px-3 pb-3 pt-0 border-t border-white/10">
          <div className="space-y-3 pt-3">
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
                  const val = Number(e.target.value);
                  const error = p.customerDiscountMode === "PERCENT"
                    ? validators.discountPercent(val)
                    : validators.discountDollars(val);
                  setDiscountError(error);
                }}
                onBlur={(e) => {
                  const val = Number(e.target.value);
                  const error = p.customerDiscountMode === "PERCENT"
                    ? validators.discountPercent(val)
                    : validators.discountDollars(val);
                  setDiscountError(error);
                  if (!error) {
                    updateProduct(dealId, p.id, { customerDiscountValue: val });
                  }
                  setLocalDiscount(null);
                }}
                error={discountError || undefined}
                className="font-mono !pr-3"
              />
            </div>

          </div>
        </div>
      )}

      {/* EPIC 10: Context Menu */}
      {contextMenu && (
        <div
          className="fixed z-50 bg-slate-800 border border-white/20 rounded-lg shadow-xl overflow-hidden min-w-[180px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => {
              updateProduct(dealId, p.id, { includeInTotals: !p.includeInTotals });
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            {p.includeInTotals ? (
              <>
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <span>Exclude from totals</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Include in totals</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
