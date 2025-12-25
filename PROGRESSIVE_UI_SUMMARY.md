# Progressive Disclosure UI - Implementation Summary

## Overview
Refactored the deal editor to implement a "Step-by-Step Discovery" flow that progressively reveals UI elements based on user actions and deal state.

## Implementation Stages

### Stage 1: The Hook (Deal Naming)
**Trigger**: Deal created with default name (e.g., "Deal 1")
**UI Changes**:
- Card glows with cyan border
- Shows "Step 1: Name Your Deal" prompt
- Auto-focuses the name input field
- Rest of UI hidden

**Detection Logic**:
```typescript
const hasCustomName = !deal.name.match(/^(Deal \d+|Untitled Deal)$/);
if (!hasCustomName) return 1;
```

### Stage 2: Identity (Add Products)
**Trigger**: Deal has a custom name
**UI Changes**:
- Product section slides in with animation
- Shows "Step 2: Add Products" banner
- Product table glows with cyan border
- Contract details still hidden

**Transition**: When user enters a custom deal name

### Stage 3: The Core (Enter Pricing)
**Trigger**: Deal has products but no prices entered
**UI Changes**:
- Shows "Step 3: Enter Pricing" banner
- Product table remains highlighted
- Encourages user to enter first product price
- Metrics sidebar remains hidden

**Detection Logic**:
```typescript
const hasProductWithPrice = deal.products.some((p) => {
  if (p.type === "RECURRING") return p.listPricePerUnitMonthly > 0;
  else return p.oneTimeListPrice > 0;
});
```

### Stage 4: The Reveal (Metrics Unlocked)
**Trigger**: At least one product has a price > 0
**UI Changes**:
- ✅ **Metrics sidebar slides in from right** with "Metrics Unlocked!" banner
- Contract Details section appears with "Unlocked" badge
- Product table glow removed (no longer highlighted)
- Live metrics update reactively as user changes values

**Key Feature**: Grid layout expands from `lg:grid-cols-8` to `lg:grid-cols-12` to accommodate sidebar

### Stage 5: Advanced Modeling (Accordion Features)
**Always Available**: Once Stage 4 is reached
**UI Changes**:
- Collapsible accordions for advanced features
- **Profit Modeling (CAC)** accordion:
  - Customer Acquisition Cost tracking
  - LTV:CAC ratio calculations
- **Advanced Deal Terms** accordion:
  - Free months up front
  - Ramp/onboarding periods
  - Year-over-year escalation
  - Discount floor warnings

## Technical Implementation

### State Management
- Uses `useMemo` to calculate current stage
- Reactive updates trigger stage changes automatically
- Stage calculation happens in `DealEditor.tsx:getDealStage()`

### Conditional Rendering
```typescript
// Example from DealEditor.tsx
{stage >= 2 && (
  <div className="animate-slideIn">
    <ProductTable dealId={selectedDealId} stage={stage} />
  </div>
)}

{stage >= 4 && (
  <div className="animate-slideIn">
    <ContractDetails />
  </div>
)}
```

### Metrics Sidebar Logic (page.tsx)
```typescript
function shouldShowMetrics(deal: Deal | undefined): boolean {
  if (!deal || deal.products.length === 0) return false;

  return deal.products.some((p) => {
    if (p.type === "RECURRING") return p.listPricePerUnitMonthly > 0;
    else return p.oneTimeListPrice > 0;
  });
}
```

### CSS Animations (globals.css)
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.4s ease-out forwards;
}
```

## Files Modified

1. **`src/components/features/deal-editor/DealEditor.tsx`**
   - Added `getDealStage()` helper function
   - Implemented stage-based conditional rendering
   - Created collapsible accordions for advanced features
   - Added stage-aware UI hints and badges

2. **`src/components/features/deal-editor/ProductTable.tsx`**
   - Added `stage` prop
   - Conditional glow effect based on stage

3. **`src/app/page.tsx`**
   - Added `shouldShowMetrics()` helper
   - Conditional sidebar rendering
   - Dynamic grid layout (expands when sidebar shows)
   - "Metrics Unlocked!" announcement banner

4. **`src/app/globals.css`**
   - Added `slideIn` keyframe animation
   - Added `slideInRight` keyframe animation
   - Added animation utility classes

## User Experience Flow

### New User Journey:
1. Click "+ New Deal" → Deal created with default name
2. See "Step 1: Name Your Deal" prompt
3. Enter deal name → Product section appears
4. See "Step 2: Add Products" prompt
5. Click "+Recurring" or "+One-time" → Product row appears
6. See "Step 3: Enter Pricing" prompt
7. Enter price (e.g., $50/license) → **Metrics sidebar slides in!**
8. See "Metrics Unlocked!" banner + live MRR/ARR/TCV metrics
9. Contract Details appear with "Unlocked" badge
10. Expand "Profit Modeling" or "Advanced Deal Terms" as needed

## Benefits

✅ **Reduced Cognitive Load**: Users see only what they need at each step
✅ **Clear Guidance**: Step prompts guide users through the workflow
✅ **Progressive Enhancement**: Advanced features available but not overwhelming
✅ **Reactive Updates**: Metrics update live as inputs change
✅ **Visual Feedback**: Animations and badges confirm progress
✅ **Flexible**: Users can still jump ahead if they know what they want

## Testing the Flow

1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Click "+ New Deal"
4. Observe Stage 1: Name input focused, nothing else visible
5. Type "Acme Corp Deal" and press Enter
6. Observe Stage 2: Products section slides in
7. Click "+ Recurring"
8. Observe Stage 3: Product row appears, pricing prompt shown
9. Enter price > 0 (e.g., 50)
10. Observe Stage 4: Sidebar slides in with metrics, contract details appear
11. Expand "Profit Modeling (CAC)" to see advanced cost tracking
12. Expand "Advanced Deal Terms" to see escalation, ramp, free months

## Notes

- Stages are calculated reactively based on deal state, not user actions
- Sidebar uses `useMemo` for performance optimization
- Animations are CSS-based for smooth 60fps performance
- All conditional logic is centralized in helper functions
- Stage detection is deterministic and consistent
