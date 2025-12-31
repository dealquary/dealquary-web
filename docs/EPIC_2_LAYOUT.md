Epic 2: Deal Health Transparency
Priority: P0 | Effort: M | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want to see why a deal is "Strong" or "Weak" without clickingSTRENGTHS and CONCERNS are visible by default, not behind "Why?"As an AE, I want metrics color-coded so I can instantly interpret if they're good or badLTV:CAC <2 = red, 2-3 = yellow, >3 = green. Margin <50% = red, 50-70% = yellow, >70% = greenAs a Finance user, I want the break-even chart properly labeled so I can use it in reviewsChart has Y-axis label "Cumulative Profit ($)" and X-axis label "Month"


Epic 2: Deal Health Transparency
A) What to Change (Exact)

Remove "Why?" toggle - STRENGTHS and CONCERNS should be always visible
Move Deal Health section to top of metrics panel with larger typography
Add color thresholds to all numeric metrics:

LTV:CAC: <2 red, 2-3 yellow, >3 green
Net Margin %: <50% red, 50-70% yellow, >70% green
Payback (mo): >12 red, 6-12 yellow, <6 green


Add axis labels to the Cash Flow chart:

Y-axis: "Cumulative Profit ($)"
X-axis: "Month"


Add benchmark line to chart showing target (e.g., "Target: Break-even by Month 6")

B) File/Component Plan
components/
├── metrics/
│   ├── DealHealthBadge.tsx     # Modify: Remove toggle, always show breakdown
│   ├── MetricCard.tsx          # Add: status prop with color logic
│   └── CashFlowChart.tsx       # Modify: Add axis labels, benchmark line
├── lib/
│   └── metricThresholds.ts     # New: Centralized threshold definitions
C) Step-by-Step Implementation Tasks
EPIC 2 TASKS:

1. Create metricThresholds.ts:
   export const thresholds = {
     ltvCac: { bad: 2, warning: 3 },      // <2 red, 2-3 yellow, >3 green
     margin: { bad: 0.5, warning: 0.7 },  // <50% red, 50-70% yellow, >70% green
     payback: { good: 6, warning: 12 }    // <6 green, 6-12 yellow, >12 red
   };
   
   export function getMetricStatus(metric: string, value: number): 'good' | 'warning' | 'bad'

2. Modify DealHealthBadge.tsx:
   - Remove useState for isExpanded
   - Remove "Why?" button
   - Always render STRENGTHS and CONCERNS sections
   - Move Deal Health to be first item in metrics panel
   - Increase Deal Health badge size: `text-lg font-semibold`

3. Update MetricCard.tsx:
   - Import getMetricStatus from metricThresholds
   - Add color classes based on status:
     - good: `text-green-400`
     - warning: `text-yellow-400`
     - bad: `text-red-400`
   - Add subtle background tint for emphasis

4. Modify CashFlowChart.tsx:
   - Add Y-axis label: position absolute left, rotated -90deg
   - Add X-axis label: position below chart, centered
   - Add horizontal dashed line at y=0 labeled "Break-even"
   - Add vertical dashed line at target month if specified
   - Ensure chart is readable at minimum 300px width
D) Acceptance Criteria (Testable)

 STRENGTHS and CONCERNS visible without clicking anything
 Deal Health badge is the first element in metrics panel
 LTV:CAC of 1.34 displays in red
 LTV:CAC of 2.5 displays in yellow
 LTV:CAC of 4.0 displays in green
 Net Margin of 80% displays in green
 Chart has visible Y-axis label "Cumulative Profit ($)"
 Chart has visible X-axis label "Month"
 Break-even line is visible and labeled on chart