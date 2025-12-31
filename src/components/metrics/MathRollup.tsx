"use client";

type MathStep = {
  label: string;
  value: string;
};

type MathRollupProps = {
  steps: MathStep[];
  className?: string;
};

/**
 * MathRollup - Shows calculation chain inline
 * Epic 1: Math transparency component
 *
 * Example: "$700/mo × 12 = $8,400 ARR"
 */
export function MathRollup({ steps, className = "" }: MathRollupProps) {
  if (steps.length === 0) return null;

  return (
    <div className={`text-xs text-white/40 font-mono ${className}`}>
      {steps.map((step, index) => (
        <span key={index}>
          {index > 0 && <span className="mx-1.5">×</span>}
          <span className="text-white/50">{step.value}</span>
          {step.label && (
            <span className="text-white/30 ml-0.5">
              {step.label}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}
