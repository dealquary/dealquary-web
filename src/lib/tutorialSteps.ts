export type TutorialStep = {
  id: string;
  title: string;
  description: string;
  targetId: string; // DOM element ID to attach tooltip to
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'input' | 'none'; // What action moves to next step
};

export const tutorialSteps: TutorialStep[] = [
  {
    id: 'deal-name',
    title: 'Step 1: Name Your Deal',
    description: 'Give your deal a name to help you identify it later. This could be a customer name, project name, or anything meaningful to you.',
    targetId: 'deal-name-input',
    position: 'bottom',
    action: 'input'
  },
  {
    id: 'deal-shape',
    title: 'Step 2: Set Deal Terms',
    description: 'Configure contract length and billing cadence. Is this billed monthly or annually? How long is the contract?',
    targetId: 'deal-shape-section',
    position: 'bottom',
    action: 'click'
  },
  {
    id: 'products',
    title: 'Step 3: Add Products',
    description: 'Click here to add your first product or service to this deal. You can add multiple line items.',
    targetId: 'products-section',
    position: 'bottom',
    action: 'click'
  },
  {
    id: 'product-details',
    title: 'Step 4: Configure Product Details',
    description: 'Set the product name, price per license, and number of licenses. Your metrics will update automatically.',
    targetId: 'product-row-0',
    position: 'right',
    action: 'input'
  },
  {
    id: 'deal-metrics',
    title: 'Step 5: View Deal Metrics',
    description: 'See your deal metrics here! MRR, ARR, TCV, margins, and more calculate in real-time as you build your deal.',
    targetId: 'deal-metrics-section',
    position: 'left',
    action: 'click'
  },
  {
    id: 'advanced-options',
    title: 'Step 6: Explore Advanced Options',
    description: 'Need to add CAC, free months, ramp periods, or year-over-year escalation? Check out the advanced guardrails section below.',
    targetId: 'advanced-guardrails-section',
    position: 'top',
    action: 'none'
  }
];
