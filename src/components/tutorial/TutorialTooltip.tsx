"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTutorialStore } from "@/state/tutorialStore";
import { tutorialSteps } from "@/lib/tutorialSteps";

export function TutorialTooltip() {
  const { isEnabled, currentStep, nextStep, prevStep, completeTutorial, disableTutorial } = useTutorialStore();
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isVisible = isEnabled && !!step;

  const positionTooltip = useCallback((targetElement: HTMLElement) => {
    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200; // approximate
    const spacing = 16;

    let top = 0;
    let left = 0;

    switch (step.position) {
      case 'bottom':
        top = rect.bottom + spacing + window.scrollY;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2) + window.scrollX;
        break;
      case 'top':
        top = rect.top - tooltipHeight - spacing + window.scrollY;
        left = rect.left + (rect.width / 2) - (tooltipWidth / 2) + window.scrollX;
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2) + window.scrollY;
        left = rect.left - tooltipWidth - spacing + window.scrollX;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (tooltipHeight / 2) + window.scrollY;
        left = rect.right + spacing + window.scrollX;
        break;
    }

    setPosition({ top, left });

    // Add highlight effect to target
    targetElement.classList.add('tutorial-highlight');

    return () => {
      targetElement.classList.remove('tutorial-highlight');
    };
  }, [step]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    // Find the target element
    const targetElement = document.getElementById(step.targetId);

    if (!targetElement) {
      // If target doesn't exist yet, wait a bit and try again
      const timer = setTimeout(() => {
        const retryElement = document.getElementById(step.targetId);
        if (retryElement) {
          positionTooltip(retryElement);
        }
      }, 500);
      return () => clearTimeout(timer);
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    positionTooltip(targetElement);
  }, [isVisible, currentStep, step, positionTooltip]);

  const handleNext = () => {
    if (isLastStep) {
      completeTutorial();
    } else {
      nextStep();
    }
  };

  const handleSkip = () => {
    disableTutorial();
  };

  if (!isEnabled || !step || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/60 z-40 pointer-events-none" />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 w-80 bg-gradient-to-br from-purple-900/95 to-blue-900/95 backdrop-blur-lg border-2 border-purple-400/50 rounded-xl shadow-2xl shadow-purple-500/30 pointer-events-auto"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        {/* Arrow indicator based on position */}
        <div className={`absolute w-4 h-4 bg-purple-900 border-purple-400/50 rotate-45 ${
          step.position === 'bottom' ? '-top-2 left-1/2 -translate-x-1/2 border-t-2 border-l-2' :
          step.position === 'top' ? '-bottom-2 left-1/2 -translate-x-1/2 border-b-2 border-r-2' :
          step.position === 'left' ? '-right-2 top-1/2 -translate-y-1/2 border-t-2 border-r-2' :
          '-left-2 top-1/2 -translate-y-1/2 border-b-2 border-l-2'
        }`} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center border border-purple-400/50">
                <span className="text-sm font-bold text-purple-200">{currentStep + 1}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{step.title}</h3>
            </div>
            <button
              onClick={handleSkip}
              className="text-white/50 hover:text-white/80 transition-colors"
              aria-label="Close tutorial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-white/90 mb-4 leading-relaxed">
            {step.description}
          </p>

          {/* Progress indicator */}
          <div className="mb-4">
            <div className="flex gap-1">
              {tutorialSteps.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    idx === currentStep
                      ? 'bg-purple-400'
                      : idx < currentStep
                      ? 'bg-purple-600'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-white/60 mt-2">
              Step {currentStep + 1} of {tutorialSteps.length}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all"
              >
                Skip Tutorial
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg"
              >
                {isLastStep ? 'Finish' : 'Next →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for highlight effect */}
      <style jsx global>{`
        .tutorial-highlight {
          position: relative;
          z-index: 45 !important;
          box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3) !important;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}
