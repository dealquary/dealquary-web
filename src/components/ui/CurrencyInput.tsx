"use client";

import React, { useState } from "react";

type CurrencyInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  error?: string;
  success?: boolean;
  currencySymbol?: string;
};

export function CurrencyInput({
  label,
  className = "",
  error,
  success,
  currencySymbol = "$",
  value,
  onChange,
  ...props
}: CurrencyInputProps) {
  const [shake, setShake] = useState(false);

  // Auto-select all text on focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
    props.onFocus?.(e);
  };

  // Strip currency symbols and format
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Remove any currency symbols, commas, or non-numeric characters except decimal point and minus
    const cleaned = rawValue.replace(/[^0-9.-]/g, '');
    // Create new event with cleaned value
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: cleaned }
    };
    onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
  };

  // Trigger shake animation when error appears
  React.useEffect(() => {
    if (error) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <label className="block space-y-1">
      {label ? (
        <span className="text-xs text-white/70">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </span>
      ) : null}
      <div className="relative">
        {/* Currency symbol - clearly separated on the left */}
        <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-8 bg-white/5 border-r border-white/10 rounded-l-xl pointer-events-none">
          <span className="text-sm font-medium text-white/60">{currencySymbol}</span>
        </div>

        <input
          type="number"
          value={value}
          onChange={handleChange}
          className={[
            "w-full pl-10 pr-3 py-2 min-h-[44px] md:min-h-0 rounded-xl border-2 bg-white/5 text-sm text-white",
            "placeholder:text-white/30 backdrop-blur-xl font-mono",
            "transition-all duration-200",
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            error
              ? "border-red-500/50 focus:border-red-500/70 focus:ring-2 focus:ring-red-400/30 focus:shadow-[0_0_12px_rgba(239,68,68,0.3)]"
              : success
              ? "border-green-500/50 focus:border-green-500/70 focus:ring-2 focus:ring-green-400/30 focus:shadow-[0_0_12px_rgba(16,185,129,0.3)]"
              : "border-white/10 focus:ring-2 focus:ring-cyan-400/30 focus:border-cyan-300/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.3)] focus:bg-white/8",
            props.disabled ? "opacity-50 cursor-not-allowed" : "hover:border-white/20 hover:bg-white/7",
            shake ? "animate-shake" : "",
            className
          ].join(" ")}
          {...props}
          onFocus={handleFocus}
        />
        {success && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-green-400 animate-scaleIn" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1 animate-slideInTop">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </label>
  );
}
