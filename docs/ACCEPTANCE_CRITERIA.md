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