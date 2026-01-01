DealQuary UI/UX Implementation Plan for Claude Code

Backlog (Prioritized)
Epic 1: Output-First Layout Restructure
Priority: P0 | Effort: L | Risk: Medium | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want to see deal metrics immediately on page load so I don't have to hunt for the answerDeal Metrics panel is expanded by default and visually dominantAs an AE, I want inputs and outputs visually distinct so I instantly know what I control vs what the math tells meOutput panel has distinct background color (darker/elevated) from input panelsAs a Finance user, I want to see the math rollup chain so I can trust the calculationsInline rollup shows: "$700/mo × 12 = $8,400 ARR"

Epic 2: Deal Health Transparency
Priority: P0 | Effort: M | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want to see why a deal is "Strong" or "Weak" without clickingSTRENGTHS and CONCERNS are visible by default, not behind "Why?"As an AE, I want metrics color-coded so I can instantly interpret if they're good or badLTV:CAC <2 = red, 2-3 = yellow, >3 = green. Margin <50% = red, 50-70% = yellow, >70% = greenAs a Finance user, I want the break-even chart properly labeled so I can use it in reviewsChart has Y-axis label "Cumulative Profit ($)" and X-axis label "Month"

Epic 3: Fix Dropdown Interactions
Priority: P0 | Effort: S | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want dropdowns to open when I click them so I can change billing cadence and contract lengthClicking "Monthly" dropdown opens options list. Clicking "Fixed years" dropdown opens options list.

Epic 4: Input Validation & Feedback
Priority: P0 | Effort: M | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want to see an error message when I enter invalid data so I understand why my input was rejectedInline error appears below field: "Price must be greater than 0"As an AE, I want to know my changes are being saved so I don't lose work"Saved" indicator appears briefly after changes

Epic 5: Math Transparency & Audit Trail
Priority: P1 | Effort: M | Risk: Low | Dependencies: Epic 1
User StoryAcceptance CriteriaAs a Finance user, I want to hover over any metric and see its formula so I can audit the calculationTooltip on ARR shows: "ARR = MRR × 12 = $700 × 12 = $8,400"As a Finance user, I want to see effective price after discount so I can verify deal economicsProduct row shows: "$10 list → $7.00 after 30% discount"

Epic 6: Product Line Item Improvements
Priority: P1 | Effort: M | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want margin % visible inline, not hidden in advanced settingsMargin input is visible in the main product row, not behind chevronAs an AE, I want to see per-line ARR contribution so I understand how each product affects the totalEach product row shows: "ARR: $8,400" alongside MRRAs an AE, I want to configure the "Licenses" label to match my customer's terminologyLabel is configurable: "Seats", "Users", "Units", or custom

Epic 7: Section Naming & Organization
Priority: P1 | Effort: S | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want section names that describe their content so I know where to find things"Advanced Guardrails" renamed to "Deal Economics"As an AE, I want a cleaner visual hierarchy so sections don't compete for attentionOnly active/focused section has teal highlight. Others have neutral headers.

Epic 8: Deal Comparison & Scenarios
Priority: P2 | Effort: L | Risk: Medium | Dependencies: Epic 1
User StoryAcceptance CriteriaAs an AE, I want to compare two deal structures side-by-side so I can evaluate trade-offs"Compare Scenario" button creates a second column with independent inputsAs an AE, I want to duplicate a deal to test variations"Duplicate Deal" option in deal menu creates a copy

Epic 9: Export & Sharing
Priority: P2 | Effort: L | Risk: Medium | Dependencies: Epic 1, Epic 2
User StoryAcceptance CriteriaAs an AE, I want to export a PDF summary so I can share with Finance"Export PDF" generates a clean, branded summary with all metricsAs an AE, I want to screenshot the metrics panel cleanlyPrint styles hide input panels, show only outputs

Epic 10: Remove UI Clutter
Priority: P2 | Effort: S | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want a cleaner interface without redundant text"Click to collapse" text removed from all section headersAs an AE, I want consistent input stylingPrice field "$" prefix is inside the input, not floating outside

CLAUDE CODE: IMPLEMENTATION INSTRUCTIONS

Pre-Implementation: Repository Discovery
Before starting, scan the repository to understand the structure:
TASK 0: Repository Analysis
1. Run `find . -name "*.tsx" -o -name "*.ts" | head -50` to see file structure
2. Identify the main page component (likely `app/page.tsx` or `pages/index.tsx`)
3. Identify existing components in `components/` folder
4. Locate the deal metrics calculation logic (likely in `lib/` or `utils/` or co-located)
5. Identify the state management approach (React state, Zustand, Redux, etc.)
6. Check for existing UI primitives (Card, Button, Input components)
7. Report findings before proceeding

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


Epic 3: Fix Dropdown Interactions
A) What to Change (Exact)

Billing Cadence dropdown ("Monthly") must open on click and show options
Contract Length dropdown ("Fixed years") must open on click and show options
All dropdowns should close when clicking outside or pressing Escape

B) File/Component Plan
components/
├── ui/
│   └── Select.tsx              # Check existing or create: Custom select component
├── inputs/
│   └── DealShapeSection.tsx    # Modify: Wire up dropdown handlers properly
C) Step-by-Step Implementation Tasks
EPIC 3 TASKS:

1. Diagnose the dropdown issue:
   - Check if using native <select> or custom component
   - If custom, check onClick handler is attached
   - Check for CSS issues (z-index, pointer-events)
   - Check for event.preventDefault() or event.stopPropagation() blocking clicks

2. If using Radix/Headless UI Select:
   - Verify Trigger and Content are properly nested
   - Verify Portal is working (check z-index)
   - Add console.log to onClick to verify events fire

3. If using native <select>:
   - Verify no overlay is blocking pointer events
   - Check the select has proper height/width
   - Verify no disabled attribute

4. Fix implementation:
   - Ensure dropdown state toggles on click
   - Ensure options list renders with proper z-index (z-50 minimum)
   - Add keyboard support: Enter/Space to open, Escape to close
   - Add click-outside handler to close

5. Test each dropdown:
   - Billing Cadence: Monthly / Annual / Quarterly
   - Contract Length: Fixed years / Month-to-month / Custom
D) Acceptance Criteria (Testable)

 Clicking "Monthly" dropdown opens a list of options
 Clicking "Fixed years" dropdown opens a list of options
 Selecting an option updates the display and closes dropdown
 Pressing Escape closes open dropdown
 Clicking outside dropdown closes it
 Keyboard navigation works (Tab, Enter, Arrow keys)


Epic 4: Input Validation & Feedback
A) What to Change (Exact)

Add inline error messages below inputs when validation fails
Add "Saved" indicator that appears briefly after changes
Error states should have red border on input field
Error messages should be specific: "Price must be greater than 0", "Duration must be at least 1"

B) File/Component Plan
components/
├── ui/
│   ├── Input.tsx               # Modify: Add error state styling
│   └── SaveIndicator.tsx       # New: "Saved ✓" toast/indicator
├── inputs/
│   ├── ProductLineItem.tsx     # Add validation for price, licenses
│   └── DealShapeSection.tsx    # Add validation for duration
├── lib/
│   └── validation.ts           # New: Validation functions and messages
C) Step-by-Step Implementation Tasks
EPIC 4 TASKS:

1. Create validation.ts:
   export const validators = {
     price: (v: number) => v > 0 ? null : 'Price must be greater than 0',
     licenses: (v: number) => v >= 1 ? null : 'Must have at least 1 license',
     duration: (v: number) => v >= 1 ? null : 'Duration must be at least 1 year',
     margin: (v: number) => v >= 0 && v <= 1 ? null : 'Margin must be between 0 and 1',
     discount: (v: number) => v >= 0 && v <= 100 ? null : 'Discount must be 0-100%'
   };

2. Modify Input component:
   - Add props: error?: string
   - Add error styling: `border-red-500 focus:ring-red-500` when error exists
   - Render error message below input: `<p className="text-red-400 text-xs mt-1">{error}</p>`

3. Create SaveIndicator.tsx:
   - Small component that shows "Saved ✓" 
   - Appears for 2 seconds after changes, then fades
   - Position: top-right of main content area or near deal name
   - Styling: `text-green-400 text-sm animate-fade-out`

4. Update ProductLineItem.tsx:
   - Add local error state for each field
   - Validate on blur and on change
   - Pass error prop to Input components
   - Clear error when valid value entered

5. Update DealShapeSection.tsx:
   - Add validation for Duration field
   - Show error if duration < 1

6. Wire up SaveIndicator:
   - Trigger on any successful state update
   - Use setTimeout to hide after 2 seconds
D) Acceptance Criteria (Testable)

 Entering -50 in price field shows error "Price must be greater than 0"
 Entering 0 in duration field shows error "Duration must be at least 1 year"
 Error message appears below the input field, not in an alert
 Input field has red border when in error state
 "Saved" indicator appears after making a valid change
 "Saved" indicator disappears after 2 seconds
 Entering valid value clears the error immediately


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


Epic 6: Product Line Item Improvements
A) What to Change (Exact)

Move Margin % input from advanced settings to main product row
Add ARR column to each product row
Make "Licenses" label configurable (dropdown or text input)
Reorder product row: Name | Price | Margin | Licenses | MRR | ARR | Actions

B) File/Component Plan
components/
├── inputs/
│   ├── ProductLineItem.tsx     # Major refactor: Add margin inline, add ARR
│   └── ProductAdvanced.tsx     # Reduce: Move margin out, keep discount mode
C) Step-by-Step Implementation Tasks
EPIC 6 TASKS:

1. Refactor ProductLineItem.tsx layout:
   Current: [Name] [Price] [Licenses] [MRR | Profit]
   New:     [Name]
            [Price $] [Margin %] [Licenses] [MRR] [ARR] [x]
   
   - Use grid layout: `grid grid-cols-[1fr_100px_80px_100px_100px_100px_40px] gap-2`
   - Add column headers above first product: Price, Margin, Qty, MRR, ARR

2. Move Margin input to main row:
   - Add margin input field (numeric, 0-100 or 0-1 based on current impl)
   - Remove margin from ProductAdvanced section
   - Update validation for margin field

3. Add ARR display column:
   - Calculate: MRR × 12 (or based on contract length)
   - Display with $ formatting
   - Color-code based on threshold if desired

4. Make Licenses label configurable:
   - Add dropdown or popover on "Licenses" header
   - Options: Seats, Users, Units, Licenses, Custom
   - Store preference in local state or settings
   - Default to "Licenses"

5. Update ProductAdvanced.tsx:
   - Remove Margin % (now inline)
   - Keep: Profit Mode, Discount Mode, Discount %, Include in totals
   - Consider renaming section header to "Discount & Options"
D) Acceptance Criteria (Testable)

 Margin % input is visible in main product row without expanding
 Each product row shows ARR value
 Changing margin immediately updates profit and margin % metrics
 "Licenses" label can be changed to "Seats" via dropdown
 Product row layout is readable on 1200px viewport width
 Column headers are visible above the first product row


Epic 7: Section Naming & Organization
A) What to Change (Exact)

Rename "Advanced Guardrails" → "Deal Economics"
Remove teal highlight from inactive sections (only highlight active/focused)
Collapse "Deal Economics" by default (it's truly advanced)
Remove "Click to collapse" text from all sections (chevron is sufficient)

B) Step-by-Step Implementation Tasks
EPIC 7 TASKS:

1. Update section header component:
   - Find SectionHeader or equivalent component
   - Remove static "Click to collapse" text
   - Update styling: only active section gets `border-l-2 border-cyan-500`
   - Inactive sections: `border-l-2 border-transparent`

2. Rename Advanced Guardrails:
   - Find all references to "Advanced Guardrails"
   - Replace with "Deal Economics"
   - Update any accessibility labels

3. Update collapse defaults:
   - Deal Shape: expanded by default
   - Products: expanded by default
   - Deal Economics: collapsed by default
   - Deal Metrics: expanded by default

4. Add focus tracking:
   - Track which section was last interacted with
   - Apply highlight styling to that section
   - Remove highlight from other sections
D) Acceptance Criteria (Testable)

 Section reads "Deal Economics" not "Advanced Guardrails"
 "Click to collapse" text is not visible anywhere
 Only the section being edited has teal left border
 Deal Economics is collapsed on initial page load
 Clicking a section header expands it and highlights it


Epic 10: Remove UI Clutter
A) What to Change (Exact)

Remove "Click to collapse" text from all section headers
Fix Price field "$" to be inside the input, not floating outside
Remove duplicate "+ Add Product" buttons (keep only one prominent one)

B) Step-by-Step Implementation Tasks
EPIC 10 TASKS:

1. Fix Price input prefix:
   - Modify Input component or create PriceInput variant
   - Use input group pattern: `<div className="relative"><span className="absolute left-3">$</span><input className="pl-7" /></div>`
   - Remove external $ badge element

2. Remove duplicate Add Product buttons:
   - In empty state: show large CTA in center
   - When products exist: show only "+ Add Product" in section header
   - Remove redundant button from empty state when products exist

3. Audit all section headers:
   - Remove any "Click to collapse" or "Click to expand" text
   - Ensure chevron icon is the only collapse indicator
   - Add aria-expanded for accessibility

Acceptance Criteria Summary
Critical (Must Pass)

 Deal Metrics panel visible on page load without interaction
 All dropdowns (Billing Cadence, Contract Length) open on click
 Input validation shows inline error messages
 No JavaScript console errors
 npm run build passes
 npm run lint passes

High Priority

 Math rollup visible: "$X/mo × 12 = $Y ARR"
 Deal Health shows STRENGTHS/CONCERNS without clicking "Why?"
 LTV:CAC has color coding based on thresholds
 Chart has labeled axes
 Margin input is inline, not hidden
 Formulas visible on metric hover

Polish

 "Click to collapse" removed
 "$" is inside price input
 Only one "Add Product" button when products exist
 Section naming is clear ("Deal Economics")


Implementation Order Checklist
Phase 1: Critical Fixes (Do First)

 Epic 3: Fix dropdown interactions (unblocks core usability)
 Epic 1: Output-first layout (most impactful visual change)
 Epic 4: Input validation (trust/reliability)

Phase 2: Trust & Transparency

 Epic 2: Deal Health transparency (always-visible reasoning)
 Epic 5: Math transparency (formula tooltips)

Phase 3: Workflow Improvements

 Epic 6: Product line item improvements (inline margin, ARR column)
 Epic 7: Section naming & organization

Phase 4: Polish (Last)

 Epic 10: Remove UI clutter
 Epic 8: Deal comparison (if time permits)
 Epic 9: Export & sharing (if time permits)


Definition of Done
For each Epic to be considered complete:
Functionality

 All acceptance criteria pass
 Feature works as described in all user stories
 No regressions in existing calculator outputs

Code Quality

 npm run lint passes with no new warnings
 npm run build completes successfully
 No TypeScript errors
 New components follow existing naming conventions

Responsive Behavior

 Layout works at 320px viewport (mobile)
 Layout works at 768px viewport (tablet)
 Layout works at 1280px viewport (desktop)
 No horizontal scroll at any width
 Sticky elements don't overlap on small screens

Accessibility

 All inputs have associated labels
 Focus states are visible on all interactive elements
 Color is not the only indicator of state (icons/text accompany colors)
 aria-expanded on collapsible sections
 Tooltips accessible via keyboard focus

Testing

 Manual testing of happy path
 Manual testing of error states
 Verify calculations still produce same results as before
