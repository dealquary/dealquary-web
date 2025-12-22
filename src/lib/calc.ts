import type { Deal, Product, DiscountMode, ProfitMode } from "@/lib/validators";

export type ProductTotals = {
  monthlyRevenue: number;
  annualizedRevenue: number;
  termRevenue: number;

  monthlyProfit: number;
  termProfit: number;

  effectiveUnitPriceMonthly: number; // for recurring
  effectiveOneTimePrice: number; // for one-time

  listUnitPriceMonthly: number;
  listOneTimePrice: number;

  discountPerUnitMonthly: number; // recurring
  discountOneTime: number; // one-time

  isService: boolean; // professional services flag
};

export type DealTotals = {
  termMonths: number;
  billableMonths: number;
  revenueGeneratingMonths: number; // excludes ramp if at 100% discount

  monthlyRevenue: number;
  annualizedRevenue: number;
  termRevenue: number;
  tcv: number; // Total Contract Value

  monthlyProfit: number;
  termProfit: number;

  // Services vs Software breakdown
  softwareRevenue: number;
  servicesRevenue: number;
  softwareProfit: number;
  servicesProfit: number;
  blendedMarginPct: number | null; // (total profit / TCV)

  effectiveMRR: number; // TCV / term months (levels the field for ramps/escalators)

  cac: number;
  contractedLTV: number; // termProfit
  ltvToCac: number | null;
  paybackMonths: number | null;

  // Discount analysis
  avgDiscountDepthPct: number; // average % discount across products
  exceedsDiscountFloor: boolean; // warning flag
};

function clampNonNeg(n: number): number {
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

export function getTermMonths(deal: Deal): number {
  if (deal.contractLengthType === "MONTH_TO_MONTH") return 1;
  if (deal.contractLengthType === "MONTHS") return Math.max(1, Math.floor(deal.contractMonths));
  return Math.max(1, Math.floor(deal.contractYears) * 12);
}

export function getBillableMonths(deal: Deal): number {
  const termMonths = getTermMonths(deal);
  if (!deal.toggles.includeFreeMonths) return termMonths;
  const free = clampNonNeg(Math.floor(deal.freeMonthsUpFront));
  return Math.max(0, termMonths - free);
}

export function getRevenueGeneratingMonths(deal: Deal): number {
  const billable = getBillableMonths(deal);
  if (!deal.toggles.includeRamp) return billable;

  // If ramp discount is 100%, those months generate no revenue
  const rampMonths = clampNonNeg(Math.floor(deal.rampMonths));
  const rampDiscountPct = clampNonNeg(deal.rampDiscountPct);

  if (rampDiscountPct >= 100) {
    return Math.max(0, billable - rampMonths);
  }

  // If partial ramp discount, all billable months generate some revenue
  return billable;
}

export function discountAmountFromMode(list: number, mode: DiscountMode, value: number): number {
  const v = clampNonNeg(value);
  if (mode === "PERCENT") return clampNonNeg(list * (v / 100));
  return v;
}

export function calcDiscountDepthPct(list: number, effective: number): number {
  if (list === 0) return 0;
  return ((list - effective) / list) * 100;
}

// Calculate revenue with year-over-year escalation
export function calcEscalatedRevenue(baseMonthlyRevenue: number, termMonths: number, annualEscalatorPct: number): number {
  if (annualEscalatorPct === 0 || termMonths <= 12) {
    // No escalation or single year
    return baseMonthlyRevenue * termMonths;
  }

  const escalator = 1 + (annualEscalatorPct / 100);
  let total = 0;
  let currentMonthlyRevenue = baseMonthlyRevenue;

  for (let month = 1; month <= termMonths; month++) {
    total += currentMonthlyRevenue;

    // Apply escalator at the start of each year
    if (month % 12 === 0) {
      currentMonthlyRevenue *= escalator;
    }
  }

  return total;
}

// Calculate revenue during ramp period
export function calcRampAdjustedRevenue(
  baseMonthlyRevenue: number,
  billableMonths: number,
  rampMonths: number,
  rampDiscountPct: number
): { total: number; rampRevenue: number; standardRevenue: number } {
  const effectiveRampMonths = Math.min(rampMonths, billableMonths);
  const standardMonths = billableMonths - effectiveRampMonths;

  const rampMultiplier = 1 - (rampDiscountPct / 100);
  const rampRevenue = baseMonthlyRevenue * effectiveRampMonths * rampMultiplier;
  const standardRevenue = baseMonthlyRevenue * standardMonths;

  return {
    total: rampRevenue + standardRevenue,
    rampRevenue,
    standardRevenue
  };
}

export function calcRecurringProduct(
  product: Product,
  deal: Deal
): ProductTotals {
  const qty = clampNonNeg(product.licenses);
  const list = clampNonNeg(product.listPricePerUnitMonthly);

  const mode = product.customerDiscountMode;
  const val = product.customerDiscountValue;

  const discPerUnit = Math.min(discountAmountFromMode(list, mode, val), list);
  const effective = clampNonNeg(list - discPerUnit);

  const baseMonthlyRevenue = effective * qty;
  const annualizedRevenue = baseMonthlyRevenue * 12;

  const monthlyProfit = calcProfitMonthly(
    product.profitMode,
    baseMonthlyRevenue,
    qty,
    product.marginPct,
    product.profitPerUnitMonthly,
    "RECURRING"
  );

  // Note: termRevenue and termProfit calculated at deal level with escalation/ramp
  return {
    monthlyRevenue: baseMonthlyRevenue,
    annualizedRevenue,
    termRevenue: 0, // calculated at deal level

    monthlyProfit,
    termProfit: 0, // calculated at deal level

    effectiveUnitPriceMonthly: effective,
    effectiveOneTimePrice: 0,

    listUnitPriceMonthly: list,
    listOneTimePrice: 0,

    discountPerUnitMonthly: discPerUnit,
    discountOneTime: 0,

    isService: product.isService
  };
}

export function calcOneTimeProduct(product: Product): ProductTotals {
  const list = clampNonNeg(product.oneTimeListPrice);

  const mode = product.customerDiscountMode;
  const val = product.customerDiscountValue;

  const disc = Math.min(discountAmountFromMode(list, mode, val), list);
  const effective = clampNonNeg(list - disc);

  const monthlyRevenue = 0;
  const annualizedRevenue = 0;

  const monthlyProfit = 0;
  const oneTimeProfit = calcProfitOneTime(product.profitMode, effective, product.marginPct, product.oneTimeProfit);

  return {
    monthlyRevenue,
    annualizedRevenue,
    termRevenue: effective,

    monthlyProfit,
    termProfit: oneTimeProfit,

    effectiveUnitPriceMonthly: 0,
    effectiveOneTimePrice: effective,

    listUnitPriceMonthly: 0,
    listOneTimePrice: list,

    discountPerUnitMonthly: 0,
    discountOneTime: disc,

    isService: product.isService
  };
}

function calcProfitMonthly(
  profitMode: ProfitMode,
  monthlyRevenue: number,
  qty: number,
  marginPct: number,
  profitPerUnitMonthly: number,
  type: "RECURRING" | "ONE_TIME"
): number {
  if (type !== "RECURRING") return 0;
  if (profitMode === "MARGIN_PCT") return clampNonNeg(monthlyRevenue * clamp01(marginPct));
  return clampNonNeg(clampNonNeg(profitPerUnitMonthly) * clampNonNeg(qty));
}

function calcProfitOneTime(
  profitMode: ProfitMode,
  effectiveOneTimeRevenue: number,
  marginPct: number,
  oneTimeProfit: number
): number {
  if (profitMode === "MARGIN_PCT") return clampNonNeg(effectiveOneTimeRevenue * clamp01(marginPct));
  return clampNonNeg(oneTimeProfit);
}

export function calcDealTotals(deal: Deal): DealTotals {
  const termMonths = getTermMonths(deal);
  const billableMonths = getBillableMonths(deal);
  const revenueGeneratingMonths = getRevenueGeneratingMonths(deal);

  let monthlyRevenue = 0;
  let annualizedRevenue = 0;
  let termRevenue = 0;

  let monthlyProfit = 0;
  let termProfit = 0;

  let softwareRevenue = 0;
  let servicesRevenue = 0;
  let softwareProfit = 0;
  let servicesProfit = 0;

  let totalListRevenue = 0;
  let totalDiscountedRevenue = 0;

  for (const p of deal.products) {
    if (!p.includeInTotals) continue;

    if (p.type === "RECURRING") {
      const pt = calcRecurringProduct(p, deal);
      monthlyRevenue += pt.monthlyRevenue;
      annualizedRevenue += pt.annualizedRevenue;
      monthlyProfit += pt.monthlyProfit;

      // Apply escalation if enabled
      let productTermRevenue: number;
      if (deal.toggles.includeEscalation) {
        productTermRevenue = calcEscalatedRevenue(
          pt.monthlyRevenue,
          billableMonths,
          deal.annualEscalatorPct
        );
      } else {
        productTermRevenue = pt.monthlyRevenue * billableMonths;
      }

      // Apply ramp if enabled
      if (deal.toggles.includeRamp && deal.rampMonths > 0) {
        const rampAdjusted = calcRampAdjustedRevenue(
          pt.monthlyRevenue,
          billableMonths,
          deal.rampMonths,
          deal.rampDiscountPct
        );
        productTermRevenue = rampAdjusted.total;
      }

      termRevenue += productTermRevenue;

      // Profit scales with revenue
      const profitRatio = pt.monthlyRevenue > 0 ? pt.monthlyProfit / pt.monthlyRevenue : 0;
      const productTermProfit = productTermRevenue * profitRatio;
      termProfit += productTermProfit;

      // Track software vs services
      if (pt.isService) {
        servicesRevenue += productTermRevenue;
        servicesProfit += productTermProfit;
      } else {
        softwareRevenue += productTermRevenue;
        softwareProfit += productTermProfit;
      }

      // Discount depth tracking
      totalListRevenue += pt.listUnitPriceMonthly * p.licenses * billableMonths;
      totalDiscountedRevenue += productTermRevenue;

    } else {
      const pt = calcOneTimeProduct(p);
      termRevenue += pt.termRevenue;
      termProfit += pt.termProfit;

      if (pt.isService) {
        servicesRevenue += pt.termRevenue;
        servicesProfit += pt.termProfit;
      } else {
        softwareRevenue += pt.termRevenue;
        softwareProfit += pt.termProfit;
      }

      totalListRevenue += pt.listOneTimePrice;
      totalDiscountedRevenue += pt.termRevenue;
    }
  }

  const tcv = termRevenue;
  const blendedMarginPct = tcv > 0 ? (termProfit / tcv) * 100 : null;
  const effectiveMRR = termMonths > 0 ? tcv / termMonths : 0;

  const avgDiscountDepthPct = totalListRevenue > 0
    ? ((totalListRevenue - totalDiscountedRevenue) / totalListRevenue) * 100
    : 0;

  const exceedsDiscountFloor = avgDiscountDepthPct > deal.discountFloorPct;

  const cac = deal.toggles.includeCAC ? clampNonNeg(deal.cac) : 0;
  const contractedLTV = termProfit;

  const ltvToCac = cac > 0 ? contractedLTV / cac : null;
  const paybackMonths = cac > 0 && monthlyProfit > 0 ? cac / monthlyProfit : null;

  return {
    termMonths,
    billableMonths,
    revenueGeneratingMonths,

    monthlyRevenue,
    annualizedRevenue,
    termRevenue,
    tcv,

    monthlyProfit,
    termProfit,

    softwareRevenue,
    servicesRevenue,
    softwareProfit,
    servicesProfit,
    blendedMarginPct,

    effectiveMRR,

    cac,
    contractedLTV,
    ltvToCac,
    paybackMonths,

    avgDiscountDepthPct,
    exceedsDiscountFloor
  };
}

// Calculate month-by-month cash flow for charting
export type CashFlowPoint = {
  month: number;
  revenue: number;
  profit: number;
  cumulativeProfit: number;
  breakEven: boolean;
};

export function calcCumulativeCashFlow(deal: Deal): CashFlowPoint[] {
  const termMonths = getTermMonths(deal);
  const totals = calcDealTotals(deal);
  const cac = totals.cac;

  const points: CashFlowPoint[] = [];
  let cumulativeProfit = -cac; // Start with CAC investment

  const avgMonthlyProfit = termMonths > 0 ? totals.termProfit / termMonths : 0;

  for (let month = 1; month <= termMonths; month++) {
    const monthProfit = avgMonthlyProfit; // Simplified: even distribution
    cumulativeProfit += monthProfit;

    points.push({
      month,
      revenue: totals.monthlyRevenue,
      profit: monthProfit,
      cumulativeProfit,
      breakEven: cumulativeProfit >= 0
    });
  }

  return points;
}
