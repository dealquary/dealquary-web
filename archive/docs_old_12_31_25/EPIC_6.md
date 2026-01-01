Epic 6: Product Line Item Improvements
Priority: P1 | Effort: M | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want margin % visible inline, not hidden in advanced settingsMargin input is visible in the main product row, not behind chevronAs an AE, I want to see per-line ARR contribution so I understand how each product affects the totalEach product row shows: "ARR: $8,400" alongside MRRAs an AE, I want to configure the "Licenses" label to match my customer's terminologyLabel is configurable: "Seats", "Users", "Units", or custom

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