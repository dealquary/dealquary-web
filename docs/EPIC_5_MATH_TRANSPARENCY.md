Epic 5: Math Transparency & Audit Trail
Priority: P1 | Effort: M | Risk: Low | Dependencies: Epic 1
User StoryAcceptance CriteriaAs a Finance user, I want to hover over any metric and see its formula so I can audit the calculationTooltip on ARR shows: "ARR = MRR × 12 = $700 × 12 = $8,400"As a Finance user, I want to see effective price after discount so I can verify deal economicsProduct row shows: "$10 list → $7.00 after 30% discount"

Epic 5: Math Transparency & Audit Trail
A) What to Change (Exact)

Every metric value should show its formula on hover
Product rows should show effective price after discount
Tooltips should show full calculation chain

B) File/Component Plan
components/
├── ui/
│   └── Tooltip.tsx             # Create or use existing tooltip component
├── metrics/
│   └── MetricCard.tsx          # Add formula tooltip
├── inputs/
│   └── ProductLineItem.tsx     # Add effective price display
├── lib/
│   └── formulas.ts             # New: Formula strings for each metric
C) Step-by-Step Implementation Tasks
EPIC 5 TASKS:

1. Create formulas.ts:
   export function getARRFormula(mrr: number): string {
     return `ARR = MRR × 12 = $${mrr.toFixed(2)} × 12 = $${(mrr * 12).toFixed(2)}`;
   }
   
   export function getTCVFormula(arr: number, months: number): string {
     return `TCV = ARR × (months/12) = $${arr.toFixed(2)} × ${months}/12 = $${(arr * months / 12).toFixed(2)}`;
   }
   
   // Add formulas for: MRR, Profit, Margin, LTV:CAC, Payback

2. Create or update Tooltip.tsx:
   - Use Radix Tooltip or native title attribute
   - Styling: dark background, white text, max-width 300px
   - Show on hover with 200ms delay
   - Position: top or bottom based on available space

3. Update MetricCard.tsx:
   - Add formula prop
   - Wrap value in Tooltip with formula as content
   - Add subtle visual indicator that tooltip exists (? icon or dotted underline)

4. Update ProductLineItem.tsx:
   - Calculate effective price: listPrice * (1 - discount/100)
   - Display below list price: "$10.00 list → $7.00 after 30% discount"
   - Style as muted text: `text-xs text-slate-400`
   - Only show when discount > 0

5. Update DealMetricsPanel.tsx:
   - Pass formula strings to each MetricCard
   - Formulas should use actual calculated values, not placeholders
D) Acceptance Criteria (Testable)

 Hovering over ARR shows tooltip: "ARR = MRR × 12 = $700 × 12 = $8,400"
 Hovering over LTV:CAC shows formula with actual values
 Hovering over Payback shows formula with actual values
 Product row with 30% discount shows "$10.00 → $7.00 after 30% discount"
 Tooltip appears within 200ms of hover
 Tooltip does not obstruct other content when visible

