"use client";

import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export function Input({ label, className = "", ...props }: Props) {
  // Auto-select all text on focus for number inputs (common UX pattern)
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (props.type === "number") {
      e.target.select();
    }
    // Call user-provided onFocus if exists
    props.onFocus?.(e);
  };

  return (
    <label className="block space-y-1">
      {label ? <span className="text-xs text-white/70">{label}</span> : null}
      <input
        className={[
          "w-full px-3 py-2 min-h-[44px] md:min-h-0 rounded-xl border-2 border-white/10 bg-white/5 text-sm text-white",
          "placeholder:text-white/30 backdrop-blur-xl",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.3)] focus:bg-white/8",
          props.disabled ? "opacity-50 cursor-not-allowed" : "hover:border-white/20 hover:bg-white/7",
          className
        ].join(" ")}
        {...props}
        onFocus={handleFocus}
      />
    </label>
  );
}
