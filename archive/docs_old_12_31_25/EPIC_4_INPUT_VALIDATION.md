Epic 4: Input Validation & Feedback
Priority: P0 | Effort: M | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want to see an error message when I enter invalid data so I understand why my input was rejectedInline error appears below field: "Price must be greater than 0"As an AE, I want to know my changes are being saved so I don't lose work"Saved" indicator appears briefly after changes

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