# Deal Workbench - SaaS Trading Terminal

## Project Overview

A single-page trading terminal for SaaS deals. Think Bloomberg terminal for software contracts.

## Core Philosophy

- **One screen = one truth** - No wizards, no modals, no "Next" buttons
- **Inputs left, outcomes right** - Always live, always updating
- **Keyboard-first** - Model a deal without touching the mouse
- **Financial precision** - MRR ↔ ARR ↔ TCV ↔ Revenue by Year must reconcile
- **Customer-safe separation** - Internal economics never accidentally leak

## Tech Stack

- React 18+ with TypeScript
- Tailwind CSS for styling
- Zustand for state management (lightweight, perfect for real-time updates)
- No backend initially - all calculations client-side

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── DealWorkbench.tsx      # Main container
│   │   ├── DealHeader.tsx         # Top sticky header
│   │   ├── InputColumn.tsx        # Left 60%
│   │   └── OutcomesPanel.tsx      # Right 40%, sticky
│   ├── inputs/
│   │   ├── ProductsTable.tsx      # Primary input - line items
│   │   ├── LineItemRow.tsx        # Individual row
│   │   ├── DealShapeEditor.tsx    # Ramp/expansion config
│   │   └── AssumptionsPanel.tsx   # Collapsible defaults
│   ├── outcomes/
│   │   ├── FinancialSummary.tsx   # Big numbers (MRR, ARR, TCV)
│   │   ├── RevenueTable.tsx       # Year-by-year breakdown
│   │   └── MiniCharts.tsx         # Run-rate, billings, margin curves
│   ├── comparison/
│   │   ├── ComparisonTray.tsx     # A/B/C scenarios
│   │   └── DeltaHighlights.tsx    # Green/red differences
│   └── export/
│       └── ExportDrawer.tsx       # Customer-safe vs Internal
├── hooks/
│   ├── useKeyboardShortcuts.ts    # Global keyboard handling
│   ├── useDealCalculations.ts     # Real-time math engine
│   └── useClipboardPaste.ts       # Spreadsheet paste parsing
├── stores/
│   ├── dealStore.ts               # Main deal state
│   └── uiStore.ts                 # UI preferences
├── utils/
│   ├── calculations.ts            # MRR, ARR, TCV, margin formulas
│   ├── validation.ts              # Inline validation rules
│   └── formatters.ts              # Currency, percentage formatting
└── types/
    └── deal.ts                    # TypeScript interfaces
```

## Data Model

```typescript
interface Deal {
  id: string;
  dealName: string;
  customerName?: string;
  startDate: Date;
  termMonths: number;          // default: 36
  billingTerms: 'advance' | 'arrears';
  currency: string;
  owner?: string;
  updatedAt: Date;
}

interface LineItem {
  id: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  billingFrequency: 'monthly' | 'quarterly' | 'annual' | 'one-time';
  discountPercent?: number;
  costBasis?: number;          // % or $/unit for margin calc
  startMonth: number;          // default: 1
  endMonth: number;            // default: termMonths
}

interface ShapeSchedule {
  appliesTo: 'all-recurring' | string;  // line item id
  scheduleType: 'qty_add' | 'qty_multiplier' | 'price_uplift';
  timeGrain: 'month' | 'quarter' | 'year';
  valuesByPeriod: Record<number, number>;
}

interface Scenario {
  id: string;
  name: string;                // A, B, C
  lineItems: LineItem[];
  shapeSchedules: ShapeSchedule[];
  assumptionOverrides: Partial<Assumptions>;
  isBaseline: boolean;
}

interface Assumptions {
  grossMarginPercent: number;  // org default
  implementationCost?: number; // one-time internal
  salesComp?: number;
  collectionsDSO?: number;
  churnProbability?: number;
}

// Computed (never stored)
interface ComputedMetrics {
  mrr: number;
  arr: number;
  tcv: number;
  grossMarginDollars: number;
  grossMarginPercent: number;
  paybackMonths?: number;
  revenueByYear: { year: number; billings: number; recognized: number; gm: number }[];
  mrrOverTime: { month: number; mrr: number }[];
}
```

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Add new row | `Enter` (in last row) |
| Duplicate row | `Cmd/Ctrl + D` |
| Delete empty row | `Backspace` |
| Navigate cells | `Tab` / `Shift+Tab` |
| Cycle scenarios | `Shift+Tab` (in comparison mode) |
| Switch A/B focus | `Alt+Arrow` |
| Undo | `Cmd/Ctrl + Z` |
| Copy internal summary | `Cmd/Ctrl + Shift + C` |

## Validation Rules (Inline, No Popups)

- **Red outline**: Invalid input (non-numeric, negative qty, end < start)
- **Yellow badge**: Unusual but allowed (e.g., 85% discount)
- **Auto-normalize**: Billing frequency aligned to start/end boundaries
- **Reconciliation warnings**: Surface in outcomes panel, never silent

## Implementation Notes

- All calculations happen on every keystroke - use `useMemo` wisely
- Products table is the centerpiece - optimize for fast data entry
- Outcomes panel must be sticky and always visible
- Support paste from Excel/Google Sheets (tab-separated)
- Customer-safe export must NEVER include: margin, costs, payback, internal notes

## Testing Priorities

1. Calculation accuracy (MRR/ARR/TCV reconciliation)
2. Keyboard navigation flow
3. Clipboard paste parsing
4. Export content separation (customer-safe vs internal)


# ... everything above stays as-is ...

---

## Current Sprint: UI/UX Improvements

### Documentation
- Follow implementation list: `docs/IMPLEMENTATION_PLAN.md`
- After completing a task, UPDATE `docs/PROGRESS.md`
- After Completelting a task check claude codes memory, if over 65&, then write a summary of where it's at and then restart memory.
- When completing an task, append a dated entry to the Log section in docs/PROGRESS.md

### Implementation Order
1. task 1
2. task 2
3. task 3
4. task 4
5. task 5
6. task 6
7. task 7

### Workflow
1. Before starting, run repository discovery (see IMPLEMENTATION_PLAN.md)
3. Work ONE Task at a time
4. After completing each Task:
   - Verify all acceptance criteria in the plan
   - Run `npm run lint` and `npm run build`
   - Update `docs/PROGRESS.md`

### Quality Gates
- `npm run lint` passes (no new warnings)
- `npm run build` completes
- No TypeScript errors
- Calculations still produce same results (no regressions)