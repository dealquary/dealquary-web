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
  duplicateProduct: (dealId: string, productId: string) => void;
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
        name: "Untitled Deal",
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
          comparedDealIds: s.comparedDealIds,
          deals: [...s.deals, newDeal]
        });
        saveWorkspace(next);
        return {
          ...s,
          ...next
        };
      });
    } catch (error) {
      console.error("Failed to create deal:", error);
    }
  },

  selectDeal: (dealId) => {
    set((s) => {
      const next = WorkspaceSchema.parse({
        version: s.version,
        selectedDealId: dealId,
        comparedDealIds: s.comparedDealIds,
        deals: s.deals
      });
      saveWorkspace(next);
      return {
        ...s,
        ...next
      };
    });
  },

  cloneDeal: (dealId) => {
    try {
      const d = get().deals.find((x) => x.id === dealId);
      if (!d) return;

      // Generate smart clone name
      const existingNames = get().deals.map((deal) => deal.name);
      let cloneName = `${d.name} (Copy)`;
      let copyNumber = 2;

      // If base copy name exists, try numbered copies
      while (existingNames.includes(cloneName)) {
        cloneName = `${d.name} (Copy ${copyNumber})`;
        copyNumber++;
      }

      const cloned: Deal = DealSchema.parse({
        ...d,
        id: uid("deal"),
        name: cloneName,
        products: d.products.map((p) => ({ ...p, id: uid("prod") }))
      });

      set((s) => {
        const next = WorkspaceSchema.parse({
          version: s.version,
          selectedDealId: cloned.id,
          comparedDealIds: s.comparedDealIds,
          deals: [...s.deals, cloned]
        });
        saveWorkspace(next);
        return {
          ...s,
          ...next
        };
      });
    } catch (error) {
      console.error("Failed to clone deal:", error);
    }
  },

  deleteDeal: (dealId) => {
    set((s) => {
      const deals = s.deals.filter((d) => d.id !== dealId);
      const selectedDealId = s.selectedDealId === dealId ? (deals[0]?.id ?? null) : s.selectedDealId;
      const next = WorkspaceSchema.parse({
        version: s.version,
        selectedDealId,
        comparedDealIds: s.comparedDealIds,
        deals
      });
      saveWorkspace(next);
      return {
        ...s,
        ...next
      };
    });
  },

  updateDeal: (dealId, patch) => {
    set((s) => {
      try {
        const deals = s.deals.map((d) => (d.id === dealId ? DealSchema.parse({ ...d, ...patch }) : d));
        const next = WorkspaceSchema.parse({
          version: s.version,
          selectedDealId: s.selectedDealId,
          comparedDealIds: s.comparedDealIds,
          deals
        });
        saveWorkspace(next);
        return {
          ...s,
          ...next
        };
      } catch (error) {
        console.error("Failed to update deal:", error);
        return s;
      }
    });
  },

  addProduct: (dealId, type) => {
    try {
      const base: Partial<Product> =
        type === "RECURRING"
          ? { type, licenses: 100, listPricePerUnitMonthly: 10, name: "New recurring product" }
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
        const next = WorkspaceSchema.parse({
          version: s.version,
          selectedDealId: s.selectedDealId,
          comparedDealIds: s.comparedDealIds,
          deals
        });
        saveWorkspace(next);
        return {
          ...s,
          ...next
        };
      });
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  },

  duplicateProduct: (dealId, productId) => {
    try {
      const deal = get().deals.find((d) => d.id === dealId);
      if (!deal) return;

      const product = deal.products.find((p) => p.id === productId);
      if (!product) return;

      const duplicated: Product = ProductSchema.parse({
        ...product,
        id: uid("prod"),
        name: `${product.name} (Copy)`
      });

      set((s) => {
        const deals = s.deals.map((d) => {
          if (d.id !== dealId) return d;
          const productIndex = d.products.findIndex((p) => p.id === productId);
          const products = [
            ...d.products.slice(0, productIndex + 1),
            duplicated,
            ...d.products.slice(productIndex + 1)
          ];
          return DealSchema.parse({ ...d, products });
        });

        const next = WorkspaceSchema.parse({
          version: s.version,
          selectedDealId: s.selectedDealId,
          comparedDealIds: s.comparedDealIds,
          deals
        });
        saveWorkspace(next);
        return {
          ...s,
          ...next
        };
      });
    } catch (error) {
      console.error("Failed to duplicate product:", error);
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

        const next = WorkspaceSchema.parse({
          version: s.version,
          selectedDealId: s.selectedDealId,
          comparedDealIds: s.comparedDealIds,
          deals
        });
        saveWorkspace(next);
        return {
          ...s,
          ...next
        };
      } catch (error) {
        console.error("Failed to update product:", error);
        return s;
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

      const next = WorkspaceSchema.parse({
        version: s.version,
        selectedDealId: s.selectedDealId,
        comparedDealIds: s.comparedDealIds,
        deals
      });
      saveWorkspace(next);
      return {
        ...s,
        ...next
      };
    });
  },

  toggleComparedDeal: (dealId) => {
    set((s) => {
      const comparedDealIds = s.comparedDealIds.includes(dealId)
        ? s.comparedDealIds.filter((id) => id !== dealId)
        : [...s.comparedDealIds, dealId];
      const next = WorkspaceSchema.parse({
        version: s.version,
        selectedDealId: s.selectedDealId,
        comparedDealIds,
        deals: s.deals
      });
      saveWorkspace(next);
      return {
        ...s,
        ...next
      };
    });
  },

  clearComparedDeals: () => {
    set((s) => {
      const next = WorkspaceSchema.parse({
        version: s.version,
        selectedDealId: s.selectedDealId,
        comparedDealIds: [],
        deals: s.deals
      });
      saveWorkspace(next);
      return {
        ...s,
        ...next
      };
    });
  }
}));
