"use client";

import { create } from "zustand";
import type { Deal, Product, Workspace } from "@/lib/validators";
import { DealSchema, ProductSchema, WorkspaceSchema } from "@/lib/validators";
import { loadWorkspace, saveWorkspace } from "@/lib/storage";
import { uid } from "@/lib/uid";

type AppState = Workspace & {
  hydrated: boolean;

  hydrate: () => void;

  createDeal: () => void;
  selectDeal: (dealId: string) => void;
  cloneDeal: (dealId: string) => void;
  deleteDeal: (dealId: string) => void;
  updateDeal: (dealId: string, patch: Partial<Deal>) => void;

  addProduct: (dealId: string, type: Product["type"]) => void;
  updateProduct: (dealId: string, productId: string, patch: Partial<Product>) => void;
  removeProduct: (dealId: string, productId: string) => void;

  // Comparison
  toggleComparedDeal: (dealId: string) => void;
  clearComparedDeals: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  version: 1,
  selectedDealId: null,
  comparedDealIds: [],
  deals: [],
  hydrated: false,

  hydrate: () => {
    const ws = loadWorkspace();
    set({ ...ws, hydrated: true });
  },

  createDeal: () => {
    try {
      const newDeal: Deal = DealSchema.parse({
        id: uid("deal"),
        name: `Deal ${get().deals.length + 1}`,
        billingCadence: "MONTHLY",
        contractLengthType: "YEARS",
        contractYears: 1,
        freeMonthsUpFront: 0,
        cac: 0,
        toggles: { includeFreeMonths: true, includeCAC: true },
        products: []
      });

      set((s) => {
        const next: Workspace = WorkspaceSchema.parse({
          version: s.version,
          selectedDealId: newDeal.id,
          deals: [...s.deals, newDeal]
        });
        saveWorkspace(next);
        return next as any;
      });
    } catch (error) {
      console.error("Failed to create deal:", error);
    }
  },

  selectDeal: (dealId) => {
    set((s) => {
      const next = WorkspaceSchema.parse({ ...s, selectedDealId: dealId });
      saveWorkspace(next);
      return next as any;
    });
  },

  cloneDeal: (dealId) => {
    try {
      const d = get().deals.find((x) => x.id === dealId);
      if (!d) return;
      const cloned: Deal = DealSchema.parse({
        ...d,
        id: uid("deal"),
        name: `${d.name} (Copy)`,
        products: d.products.map((p) => ({ ...p, id: uid("prod") }))
      });

      set((s) => {
        const next = WorkspaceSchema.parse({
          ...s,
          selectedDealId: cloned.id,
          deals: [...s.deals, cloned]
        });
        saveWorkspace(next);
        return next as any;
      });
    } catch (error) {
      console.error("Failed to clone deal:", error);
    }
  },

  deleteDeal: (dealId) => {
    set((s) => {
      const deals = s.deals.filter((d) => d.id !== dealId);
      const selectedDealId = s.selectedDealId === dealId ? (deals[0]?.id ?? null) : s.selectedDealId;
      const next = WorkspaceSchema.parse({ ...s, deals, selectedDealId });
      saveWorkspace(next);
      return next as any;
    });
  },

  updateDeal: (dealId, patch) => {
    set((s) => {
      try {
        const deals = s.deals.map((d) => (d.id === dealId ? DealSchema.parse({ ...d, ...patch }) : d));
        const next = WorkspaceSchema.parse({ ...s, deals });
        saveWorkspace(next);
        return next as any;
      } catch (error) {
        console.error("Failed to update deal:", error);
        return s as any;
      }
    });
  },

  addProduct: (dealId, type) => {
    try {
      const base: Partial<Product> =
        type === "RECURRING"
          ? { type, licenses: 1, listPricePerUnitMonthly: 100, name: "New recurring product" }
          : { type, oneTimeListPrice: 5000, name: "New one-time product" };

      const newProduct: Product = ProductSchema.parse({
        id: uid("prod"),
        includeInTotals: true,
        profitMode: "MARGIN_PCT",
        marginPct: 0.8,
        customerDiscountMode: "PERCENT",
        customerDiscountValue: 0,
        partnerCommissionPct: 0,
        isService: false,
        licenses: 0,
        listPricePerUnitMonthly: 0,
        oneTimeListPrice: 0,
        profitPerUnitMonthly: 0,
        oneTimeProfit: 0,
        ...base
      });

      set((s) => {
        const deals = s.deals.map((d) => (d.id === dealId ? { ...d, products: [...d.products, newProduct] } : d));
        const next = WorkspaceSchema.parse({ ...s, deals });
        saveWorkspace(next);
        return next as any;
      });
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  },

  updateProduct: (dealId, productId, patch) => {
    set((s) => {
      try {
        const deals = s.deals.map((d) => {
          if (d.id !== dealId) return d;
          const products = d.products.map((p) => (p.id === productId ? ProductSchema.parse({ ...p, ...patch }) : p));
          return DealSchema.parse({ ...d, products });
        });

        const next = WorkspaceSchema.parse({ ...s, deals });
        saveWorkspace(next);
        return next as any;
      } catch (error) {
        console.error("Failed to update product:", error);
        return s as any;
      }
    });
  },

  removeProduct: (dealId, productId) => {
    set((s) => {
      const deals = s.deals.map((d) => {
        if (d.id !== dealId) return d;
        const products = d.products.filter((p) => p.id !== productId);
        return DealSchema.parse({ ...d, products });
      });

      const next = WorkspaceSchema.parse({ ...s, deals });
      saveWorkspace(next);
      return next as any;
    });
  },

  toggleComparedDeal: (dealId) => {
    set((s) => {
      const comparedDealIds = s.comparedDealIds.includes(dealId)
        ? s.comparedDealIds.filter((id) => id !== dealId)
        : [...s.comparedDealIds, dealId];
      const next = WorkspaceSchema.parse({ ...s, comparedDealIds });
      saveWorkspace(next);
      return next as any;
    });
  },

  clearComparedDeals: () => {
    set((s) => {
      const next = WorkspaceSchema.parse({ ...s, comparedDealIds: [] });
      saveWorkspace(next);
      return next as any;
    });
  }
}));
