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