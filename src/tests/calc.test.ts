import { describe, it, expect } from "vitest";
import { calcDealTotals, getTermMonths, getBillableMonths } from "@/lib/calc";
import type { Deal } from "@/lib/validators";

function baseDeal(discountPct: number = 0): Deal {
  return {
    id: "d1",
    name: "Deal 1",
    billingCadence: "MONTHLY",
    contractLengthType: "YEARS",
    contractMonths: 12,
    contractYears: 1,
    freeMonthsUpFront: 0,
    cac: 1200,
    discountFloorPct: 30,
    rampMonths: 0,
    rampDiscountPct: 0,
    annualEscalatorPct: 0,
    toggles: {
      includeFreeMonths: true,
      includeCAC: true,
      includeRamp: false,
      includeEscalation: false
    },
    products: [
      {
        id: "p1",
        name: "Seats",
        type: "RECURRING",
        includeInTotals: true,
        licenses: 10,
        listPricePerUnitMonthly: 100,
        oneTimeListPrice: 0,
        profitMode: "MARGIN_PCT",
        marginPct: 0.8,
        profitPerUnitMonthly: 0,
        oneTimeProfit: 0,
        customerDiscountMode: "PERCENT",
        customerDiscountValue: discountPct,
        partnerCommissionPct: 0,
        isService: false
      }
    ]
  };
}

describe("term math", () => {
  it("computes term months for years", () => {
    const d = baseDeal();
    d.contractYears = 2;
    expect(getTermMonths(d)).toBe(24);
  });

  it("applies free months", () => {
    const d = baseDeal();
    d.freeMonthsUpFront = 2;
    expect(getBillableMonths(d)).toBe(10);
  });
});

describe("deal totals", () => {
  it("calculates totals with no discount", () => {
    const d = baseDeal(0);
    const t = calcDealTotals(d);
    // MRR = 10 * 100 = 1000
    expect(t.monthlyRevenue).toBe(1000);
    // monthly profit = 0.8 * 1000 = 800
    expect(t.monthlyProfit).toBe(800);
    // termRevenue 12 months
    expect(t.termRevenue).toBe(12000);
    // termProfit 12 months
    expect(t.termProfit).toBe(9600);
    // payback = 1200 / 800 = 1.5
    expect(t.paybackMonths).toBeCloseTo(1.5);
  });

  it("applies 20% discount", () => {
    const d = baseDeal(20);
    const t = calcDealTotals(d);
    // effective = 80 per seat => MRR = 800
    expect(t.monthlyRevenue).toBe(800);
    // profit = 0.8 * 800 = 640
    expect(t.monthlyProfit).toBe(640);
  });

  it("free months reduce term totals", () => {
    const d = baseDeal(0);
    d.freeMonthsUpFront = 3;
    const t = calcDealTotals(d);
    // billable months = 9
    expect(t.termRevenue).toBe(9000);
    expect(t.termProfit).toBe(7200);
  });
});
