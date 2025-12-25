"use client";

import React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string };

export function Input({ label, className = "", ...props }: Props) {
  return (
    <label className="block space-y-1">
      {label ? <span className="text-xs text-white/70">{label}</span> : null}
      <input
        className={[
          "w-full px-3 py-2 min-h-[44px] md:min-h-0 rounded-xl border border-white/10 bg-white/5 text-sm text-white",
          "placeholder:text-white/30 backdrop-blur-xl",
          "focus:outline-none focus:ring-2 focus:ring-pink-400/20 focus:border-pink-300/30",
          props.disabled ? "opacity-50 cursor-not-allowed" : "hover:border-white/15",
          className
        ].join(" ")}
        {...props}
      />
    </label>
  );
}
