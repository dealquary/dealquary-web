Epic 8: Deal Comparison & Scenarios
Priority: P2 | Effort: L | Risk: Medium | Dependencies: Epic 1
User StoryAcceptance CriteriaAs an AE, I want to compare two deal structures side-by-side so I can evaluate trade-offs"Compare Scenario" button creates a second column with independent inputsAs an AE, I want to duplicate a deal to test variations"Duplicate Deal" option in deal menu creates a copy

Epic 8: Deal Comparison & Scenarios
Priority: P2 | Effort: L | Risk: Medium | Dependencies: Epic 1
A) What to Change (Exact)

Add "Compare Scenario" button in the Deal Metrics panel header
Clicking "Compare Scenario" creates a second column with independent inputs
Both scenarios share the same deal name but have independent:

Product line items (price, licenses, margin, discount)
Deal shape settings (billing cadence, contract length, duration)
Advanced guardrails (CAC, free months, ramp, escalation)


Metrics panel shows side-by-side comparison:

Scenario A | Scenario B
Delta column showing difference (green if B is better, red if worse)


Add "Duplicate Deal" option in the hamburger menu / deal sidebar
Add ability to name scenarios ("Current Proposal" vs "3-Year Option")

B) File/Component Plan
components/
├── layout/
│   ├── DealLayout.tsx              # Modify: Support 1 or 2 scenario columns
│   └── ScenarioColumn.tsx          # New: Wrapper for a single scenario's inputs
├── metrics/
│   ├── DealMetricsPanel.tsx        # Modify: Support comparison mode
│   ├── ComparisonMetricRow.tsx     # New: Shows Scenario A | B | Delta
│   └── ScenarioHeader.tsx          # New: Scenario name + actions
├── inputs/
│   └── ScenarioInputs.tsx          # New: All inputs for one scenario
├── hooks/
│   └── useScenarios.ts             # New: State management for scenarios
├── lib/
│   └── scenarioComparison.ts       # New: Calculate deltas between scenarios
C) Step-by-Step Implementation Tasks
EPIC 8 TASKS:

1. Create useScenarios.ts hook:
   interface Scenario {
     id: string;
     name: string;
     dealShape: DealShapeState;
     products: ProductState[];
     guardrails: GuardrailsState;
     metrics: CalculatedMetrics; // computed
   }
   
   interface ScenariosState {
     scenarios: Scenario[];
     activeScenarioId: string;
     comparisonMode: boolean;
   }
   
   export function useScenarios() {
     // Initialize with single scenario
     // Provide: addScenario, removeScenario, duplicateScenario
     // Provide: updateScenario(id, partial)
     // Provide: toggleComparisonMode
     // Auto-calculate metrics when inputs change
   }

2. Create ScenarioColumn.tsx:
   - Props: { scenario: Scenario, onUpdate: (partial) => void, isActive: boolean }
   - Contains all input sections: DealShape, Products, Guardrails
   - Visual indicator for active scenario (border highlight)
   - Scenario name editable at top
   - "Remove Scenario" button (only if > 1 scenario)

3. Create scenarioComparison.ts:
   interface ComparisonResult {
     metric: string;
     scenarioA: number;
     scenarioB: number;
     delta: number;
     deltaPercent: number;
     winner: 'A' | 'B' | 'tie';
   }
   
   export function compareScenarios(a: Scenario, b: Scenario): ComparisonResult[]
   
   // For each metric, determine which is "better":
   // - ARR: higher is better
   // - Margin: higher is better
   // - LTV:CAC: higher is better
   // - Payback: lower is better
   // - TCV: higher is better

4. Create ComparisonMetricRow.tsx:
   - Props: { label, valueA, valueB, delta, deltaPercent, winner }
   - Layout: [Label] [Value A] [Value B] [Delta]
   - Delta styling:
     - Green + arrow up if improvement
     - Red + arrow down if worse
     - Gray if no change
   - Format delta as: "+$1,200 (+15%)" or "-2.3 mo (-20%)"

5. Modify DealMetricsPanel.tsx for comparison mode:
   - If comparisonMode = false: show single column (current behavior)
   - If comparisonMode = true: show ComparisonMetricRow for each metric
   - Add column headers: "Scenario A" | "Scenario B" | "Δ Delta"
   - Chart comparison: overlay both scenarios on same chart with different colors

6. Modify DealLayout.tsx:
   - If 1 scenario: current layout (inputs left, metrics right)
   - If 2 scenarios: 
     - Left: Scenario A inputs (50%)
     - Center: Scenario B inputs (50%)
     - Right: Comparison metrics (sticky sidebar)
   - Or alternative: tabs for scenario inputs, always show comparison metrics

7. Add "Compare Scenario" button:
   - Location: DealMetricsPanel header, next to "Upgrade to Export"
   - Styling: secondary button, `+ Compare Scenario`
   - onClick: useScenarios().addScenario() which duplicates current scenario

8. Add "Duplicate Deal" to deal menu:
   - In the sidebar deal list, add context menu or button
   - "Duplicate" creates new deal with copied data
   - New deal named: "{Original Name} (Copy)"

9. Make scenario names editable:
   - ScenarioHeader shows editable name field
   - Default names: "Scenario A", "Scenario B"
   - Click to edit, blur to save
   - Names appear in comparison column headers

10. Add keyboard shortcuts:
    - Cmd/Ctrl + D: Duplicate current scenario
    - Escape: Exit comparison mode (if in it)
D) Acceptance Criteria (Testable)

 "Compare Scenario" button is visible in Deal Metrics panel
 Clicking "Compare Scenario" creates a second scenario with duplicated data
 Each scenario has independent inputs (changing A doesn't affect B)
 Comparison view shows both scenario values side by side
 Delta column shows difference with correct sign (+ or -)
 Delta is color-coded: green for improvement, red for degradation
 Scenario names are editable
 Can remove a scenario to exit comparison mode
 "Duplicate Deal" option exists in deal sidebar menu
 Duplicated deal appears in deal list with "(Copy)" suffix
 Layout remains usable at 1280px viewport in comparison mode
 Chart shows both scenarios overlaid with legend

E) Guardrails

Scenario state should be independent - no shared references
Calculations must run independently for each scenario
Preserve single-scenario mode as default
Don't break existing deal save/load functionality
Comparison mode state should not persist to database (local UI state only)
Keep memory usage reasonable - don't recalculate all scenarios on every keystroke (debounce)