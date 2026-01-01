Epic 10: Remove UI Clutter
Priority: P2 | Effort: S | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want a cleaner interface without redundant text"Click to collapse" text removed from all section headersAs an AE, I want consistent input stylingPrice field "$" prefix is inside the input, not floating outside

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