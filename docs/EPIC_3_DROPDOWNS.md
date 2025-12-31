Epic 3: Fix Dropdown Interactions
Priority: P0 | Effort: S | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want dropdowns to open when I click them so I can change billing cadence and contract lengthClicking "Monthly" dropdown opens options list. Clicking "Fixed years" dropdown opens options list.

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