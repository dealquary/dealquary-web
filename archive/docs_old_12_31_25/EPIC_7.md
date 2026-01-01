Epic 7: Section Naming & Organization
Priority: P1 | Effort: S | Risk: Low | Dependencies: None
User StoryAcceptance CriteriaAs an AE, I want section names that describe their content so I know where to find things"Advanced Guardrails" renamed to "Deal Economics"As an AE, I want a cleaner visual hierarchy so sections don't compete for attentionOnly active/focused section has teal highlight. Others have neutral headers.

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