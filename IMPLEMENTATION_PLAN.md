# Implementation Plan - Deal Workbench

Use this file to guide Claude Code through building the project incrementally.

---

## Phase 1: Foundation & Layout

**Goal**: Basic structure with working navigation

### Prompt for Claude Code:

```
Set up a new React + TypeScript + Vite project with Tailwind CSS.
Create the main layout:
1. DealWorkbench.tsx - Full-screen container, two-column layout
2. DealHeader.tsx - Sticky top bar with deal name input, term selector, start date
3. Left column (60%) placeholder for inputs
4. Right column (40%) sticky placeholder for outcomes

Use Tailwind for styling. Make the right column sticky so it stays visible while scrolling.
```

### Acceptance:
- [ ] Basic layout renders
- [ ] Right panel stays fixed while left scrolls
- [ ] Deal header inputs are functional

---

## Phase 2: Products Table (Core Feature)

**Goal**: Fully functional line items table with keyboard support

### Prompt for Claude Code:

```
Read CLAUDE.md for context. Now build the ProductsTable component:

Columns: Product (text), Price/Unit (number), Qty (number), Billing Frequency (dropdown: monthly/quarterly/annual/one-time), Discount % (optional number), Start Month (default 1), End Month (default 36)

Requirements:
1. Enter key in last row adds new row
2. Cmd/Ctrl+D duplicates current row
3. Backspace deletes row if empty
4. Tab navigates between cells
5. Support paste from clipboard (tab-separated values from spreadsheet)

Use Zustand for state management. Store line items in a deal store.
```

### Acceptance:
- [ ] Can add/edit/delete line items
- [ ] Keyboard shortcuts work (Enter, Cmd+D, Backspace)
- [ ] Can paste from Excel/Sheets
- [ ] Tab navigation works

---

## Phase 3: Real-Time Calculations

**Goal**: Outcomes panel with live-updating metrics

### Prompt for Claude Code:

```
Build the calculations engine and outcomes panel:

1. Create utils/calculations.ts with functions:
   - calculateMRR(lineItems, termMonth) - Monthly recurring at given month
   - calculateARR(lineItems) - MRR * 12 at end of term
   - calculateTCV(lineItems, termMonths) - Total invoiced over term
   - calculateRevenueByYear(lineItems, termMonths) - Array of {year, billings, gm}

2. Create OutcomesPanel.tsx showing:
   - MRR (large number)
   - ARR (large number)
   - TCV (large number)
   - Revenue by year table

Calculations must update instantly on every keystroke in the products table.
Handle one-time vs recurring items correctly.
```

### Acceptance:
- [ ] MRR/ARR/TCV calculate correctly
- [ ] Updates happen instantly (no lag)
- [ ] One-time items excluded from MRR/ARR
- [ ] Numbers format with currency

---

## Phase 4: Deal Shape Editor

**Goal**: Configure ramps and expansions

### Prompt for Claude Code:

```
Build the DealShapeEditor component that sits below the products table:

1. Compact UI showing a grid by Year (1, 2, 3...)
2. For each year, user can enter:
   - Quantity addition (e.g., +50 seats in Year 2)
   - OR Quantity multiplier (e.g., 1.5x in Year 2)
   - OR Price uplift (e.g., +10% in Year 2)

3. "Apply to" dropdown: All recurring lines OR specific line item
4. Small sparkline visualization showing the shape

Update calculations to incorporate the shape schedule.
```

### Acceptance:
- [ ] Can configure year-over-year changes
- [ ] Changes reflect in outcomes immediately
- [ ] Sparkline shows the deal shape
- [ ] Works with "apply to" selector

---

## Phase 5: Scenario Comparison

**Goal**: A/B comparison with delta highlights

### Prompt for Claude Code:

```
Add scenario comparison functionality:

1. "Add Comparison" button creates Scenario B (clones current state)
2. Comparison tray at bottom shows both scenarios side-by-side
3. Delta column shows differences: ARR Δ, TCV Δ, GM$ Δ
4. Color coding: green for improvement, red for worse
5. "Lock assumptions" toggle prevents accidental changes

Keyboard: Shift+Tab cycles between scenarios, Alt+Arrow switches focus.
```

### Acceptance:
- [ ] Can create and edit multiple scenarios
- [ ] Deltas calculate and highlight correctly
- [ ] Keyboard navigation works
- [ ] Lock toggle prevents edits

---

## Phase 6: Assumptions & Margin

**Goal**: Configurable assumptions with override indicators

### Prompt for Claude Code:

```
Build the AssumptionsPanel (collapsed by default):

1. Fields:
   - Gross Margin % (default: 70%)
   - Implementation Cost (optional one-time)
   - Sales Comp % (optional)

2. Override indicator: Show a small dot next to any field that differs from org default
3. "Reset to default" button per section
4. Update margin calculations in outcomes to use these values

Add GM$ and Payback Period to the outcomes panel.
```

### Acceptance:
- [ ] Assumptions panel expands/collapses
- [ ] Overrides show visual indicator
- [ ] GM$ calculates from cost basis
- [ ] Payback period shows when implementation cost set

---

## Phase 7: Export Functionality

**Goal**: Customer-safe and internal export separation

### Prompt for Claude Code:

```
Build the ExportDrawer (slides in from right):

1. Two tabs: "Customer-Safe" and "Internal"

Customer-Safe export includes:
- Deal name, customer, dates
- Line items (product, qty, price, total)
- Total amounts
- EXCLUDES: margin, costs, payback, internal notes

Internal export includes:
- Everything above PLUS
- GM$, GM%, payback
- Assumptions
- Scenario comparison deltas

2. Actions:
   - "Copy to clipboard" - formatted text for Slack
   - "Download PDF" - (can be placeholder for now)
   - "Generate share link" - (can be placeholder)
```

### Acceptance:
- [ ] Two distinct export views
- [ ] Customer-safe truly hides sensitive data
- [ ] Copy to clipboard works
- [ ] Drawer UX is smooth

---

## Phase 8: Polish & Validation

**Goal**: Production-ready feel

### Prompt for Claude Code:

```
Add inline validation and polish:

1. Validation states:
   - Red outline: invalid (negative, non-numeric, end < start)
   - Yellow badge: unusual (discount > 50%)

2. Add mini-charts to outcomes:
   - MRR over time (line chart)
   - Billings by year (bar chart)
   
3. Currency formatting throughout
4. Smooth transitions for panel expand/collapse
5. Loading states for calculations (probably not needed, but handle edge cases)

No modal popups for errors - everything inline.
```

### Acceptance:
- [ ] Validation shows inline
- [ ] Charts render correctly
- [ ] Feels polished and fast
- [ ] No runtime errors

---

## Quick Reference: Key Commands for Claude Code

### Starting Fresh
```
Create a new React + TypeScript + Vite project called "deal-workbench" with Tailwind CSS and Zustand installed.
```

### Continuing Work
```
Read CLAUDE.md and docs/SPEC.md, then continue with Phase [N] from docs/IMPLEMENTATION_PLAN.md
```

### Debugging
```
The [component] isn't working correctly. [Describe issue]. Check the implementation against the spec in docs/SPEC.md.
```

### Adding Features
```
Based on the spec in docs/SPEC.md, add [feature]. Make sure it integrates with existing components.
```
