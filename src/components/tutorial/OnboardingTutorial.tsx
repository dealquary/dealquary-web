"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/state/store";

const TUTORIAL_STEPS = [
  {
    step: 1,
    title: "Configure Deal Shape",
    description: "We've created your first deal! Start by editing the deal name at the top, then configure billing cadence, contract length, and duration below.",
    instruction: "Edit the deal name above to continue",
    waitFor: "dealName" as const,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "Add Products",
    description: "Now click '+ Add Product' in the Products section. Enter product name, price, margin %, and licenses.",
    instruction: "Add at least one product to continue",
    waitFor: "products" as const,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    step: 3,
    title: "Fine-Tune Economics",
    description: "Great! Your deal metrics are calculating in real-time on the right. Now you can optionally fine-tune economics like CAC, free months, or ramp periods.",
    instruction: "Click 'Next' when ready to finish",
    waitFor: "manual" as const,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    step: 4,
    title: "You're All Set!",
    description: "You can now analyze deal health, profitability, and advanced metrics. Use the Export button to share as PDF, Excel, or copy a summary for Slack/email.",
    instruction: "Click 'Finish' to start using DealQuary",
    waitFor: "manual" as const,
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export function OnboardingTutorial() {
  const [showTutorial, setShowTutorial] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const initialDealNameRef = useRef<string | null>(null);

  // Access app state to detect when steps are completed
  const deals = useAppStore((s) => s.deals);
  const selectedDealId = useAppStore((s) => s.selectedDealId);
  const createDeal = useAppStore((s) => s.createDeal);
  const selectedDeal = deals.find(d => d.id === selectedDealId);
  const dealName = selectedDeal?.name || "";
  const productsCount = selectedDeal?.products?.length || 0;

  useEffect(() => {
    // Check if user has seen the tutorial
    const hasSeenTutorial = localStorage.getItem("dealquary-tutorial-completed");
    const timer = setTimeout(() => {
      setShowTutorial(!hasSeenTutorial);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Auto-create first deal if tutorial is active and no deals exist
  useEffect(() => {
    if (showTutorial && deals.length === 0) {
      createDeal();
    }
  }, [showTutorial, deals.length, createDeal]);

  // Capture the initial deal name when deal is first available
  useEffect(() => {
    if (showTutorial && selectedDeal && initialDealNameRef.current == null) {
      initialDealNameRef.current = selectedDeal.name;
    }
  }, [showTutorial, selectedDeal]);

  // Auto-advance based on user actions
  useEffect(() => {
    if (!showTutorial) return;

    const step = TUTORIAL_STEPS[currentStep];

    // Check if current step's condition is met
    if (step.waitFor === "dealName" && dealName.trim().length > 0 && dealName !== initialDealNameRef.current) {
      // User changed the deal name, advance to step 2 after brief delay
      const timer = setTimeout(() => {
        setCurrentStep(1);
      }, 800);
      return () => clearTimeout(timer);
    }

    if (step.waitFor === "products" && productsCount > 0) {
      // User added a product, advance to step 3 after brief delay
      const timer = setTimeout(() => {
        setCurrentStep(2);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showTutorial, currentStep, dealName, productsCount]);

  const handleSkip = () => {
    localStorage.setItem("dealquary-tutorial-completed", "true");
    setShowTutorial(false);
  };

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - mark as completed
      localStorage.setItem("dealquary-tutorial-completed", "true");
      setShowTutorial(false);
    }
  };

  if (!showTutorial) return null;

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <>
      {/* Backdrop - subtle, non-blocking so users can interact with UI */}
      <div className="fixed inset-0 bg-black/20 z-40 animate-fadeIn pointer-events-none" />

      {/* Tutorial Modal - positioned bottom-right, non-blocking */}
      <div className="fixed inset-0 z-50 flex items-end justify-end p-6 pointer-events-none">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-cyan-500/30 rounded-2xl shadow-2xl max-w-md w-full animate-slideInUp pointer-events-auto">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  {step.icon}
                </div>
                <div>
                  <div className="text-xs text-white/50 font-medium">
                    Step {step.step} of {TUTORIAL_STEPS.length}
                  </div>
                  <h2 className="text-xl font-bold text-white">{step.title}</h2>
                </div>
              </div>
              <button
                onClick={handleSkip}
                className="text-white/40 hover:text-white/60 transition-colors"
                aria-label="Close tutorial"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex gap-1">
              {TUTORIAL_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    index <= currentStep
                      ? "bg-cyan-500"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-white/80 text-base leading-relaxed mb-4">
              {step.description}
            </p>

            {/* Current Instruction */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-cyan-300 text-sm font-medium">
                  {step.instruction}
                </p>
              </div>
            </div>

            {/* Visual Hints for Each Step */}
            <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
              {step.step === 1 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Deal name at the top</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Billing cadence (Monthly/Annual)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Contract length & duration</span>
                  </div>
                </div>
              )}
              {step.step === 2 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Product name & unit price</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Margin % and licenses (seats)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>MRR/ARR auto-calculate</span>
                  </div>
                </div>
              )}
              {step.step === 3 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>CAC & free months</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Ramp/onboarding periods</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>YoY escalation & discount limits</span>
                  </div>
                </div>
              )}
              {step.step === 4 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Deal Health & Core Revenue</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>LTV:CAC & Payback period</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Export to PDF/Excel or copy summary</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-white/50 hover:text-white/80 text-sm font-medium transition-colors"
            >
              Skip tutorial
            </button>

            <div className="flex items-center gap-3">
              {/* Only show Next/Finish for manual steps */}
              {step.waitFor === "manual" && (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  className="!py-2 !px-6"
                >
                  {currentStep === TUTORIAL_STEPS.length - 1 ? "Finish" : "Next"}
                </Button>
              )}
              {/* For auto-advance steps, show waiting indicator */}
              {step.waitFor !== "manual" && (
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  Waiting for you to complete this step...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
