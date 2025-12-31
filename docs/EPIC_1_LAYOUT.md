Epic 1: Output-First Layout Restructure
Priority: P0 | Effort: L | Risk: Medium | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want to see deal metrics immediately on page load so I don't have to hunt for the answerDeal Metrics panel is expanded by default and visually dominantAs an AE, I want inputs and outputs visually distinct so I instantly know what I control vs what the math tells meOutput panel has distinct background color (darker/elevated) from input panelsAs a Finance user, I want to see the math rollup chain so I can trust the calculationsInline rollup shows: "$700/mo × 12 = $8,400 ARR"

Epic 1: Output-First Layout Restructure
A) What to Change (Exact)

Deal Metrics panel should be expanded by default (not collapsed)
Deal Metrics panel should have a distinct visual treatment:

Background: bg-slate-900 (darker than input panels which should be bg-slate-800)
Add subtle left border: border-l-2 border-cyan-500
Make it sticky: sticky top-4


Deal Metrics panel should be on the right side and take up ~40% width on desktop
Input panels (Deal Shape, Products, Advanced Guardrails) should be on left side at ~60% width
Add math rollup preview below each product line item showing the calculation chain

B) File/Component Plan
Create or modify these components:
components/
├── layout/
│   └── DealLayout.tsx          # New: Two-column layout wrapper
├── metrics/
│   ├── DealMetricsPanel.tsx    # Modify: Make expanded default, add distinct styling
│   ├── MetricCard.tsx          # New: Reusable metric display with tooltip
│   └── MathRollup.tsx          # New: Shows calculation chain
├── inputs/
│   ├── DealShapeSection.tsx    # Existing: Minor styling updates
│   ├── ProductsSection.tsx     # Existing: Add inline margin, rollup
│   └── ProductLineItem.tsx     # Existing: Add MathRollup, ARR column
C) Step-by-Step Implementation Tasks
EPIC 1 TASKS:

1. Create DealLayout.tsx wrapper component:
   - Two-column grid: `grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6`
   - Left column: children (input sections)
   - Right column: DealMetricsPanel (sticky)

2. Modify DealMetricsPanel.tsx:
   - Remove collapsed default state, set `isExpanded: true` as initial
   - Add styling: `bg-slate-900 border-l-2 border-cyan-500 rounded-lg`
   - Add `sticky top-4` for scroll behavior
   - Ensure panel height is `max-h-[calc(100vh-2rem)] overflow-y-auto`

3. Create MetricCard.tsx component:
   - Props: { label, value, formula?, status?: 'good' | 'warning' | 'bad' }
   - Display value with color based on status
   - Show formula in tooltip on hover

4. Create MathRollup.tsx component:
   - Props: { steps: Array<{label: string, value: string}> }
   - Renders: "$700/mo × 12 = $8,400 ARR"
   - Styling: `text-xs text-slate-400 font-mono`

5. Update main page layout:
   - Wrap content in DealLayout
   - Move DealMetricsPanel to right slot
   - Input sections remain in left slot

6. Update ProductLineItem.tsx:
   - Add MathRollup below the price/licenses row
   - Add "ARR: $X" display inline
D) Acceptance Criteria (Testable)

 Deal Metrics panel is visible without clicking on page load
 Deal Metrics panel has darker background than input panels
 Deal Metrics panel stays fixed while scrolling input panels
 Math rollup shows below each product: "$X/mo × Y months = $Z"
 Layout is responsive: stacks on mobile, side-by-side on desktop (lg breakpoint)
 No horizontal scroll on any viewport width

E) Guardrails

Do NOT modify calculation functions in lib/ or utils/
Preserve all existing metric values and formatting
Keep existing collapse/expand functionality (just change default state)
Test that all currency values display with 2 decimal places