"use client";

import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "px-3 py-2 md:py-2 min-h-[44px] md:min-h-0 rounded-xl text-sm font-medium border transition-all duration-200 " +
    "focus:outline-none focus:ring-2 focus:ring-white/10 flex items-center justify-center " +
    "active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none";

  const styles =
    variant === "primary"
      ? "bg-gradient-to-b from-fuchsia-500/25 to-pink-500/15 border-white/15 hover:border-pink-300/30 hover:shadow-[0_4px_20px_rgba(236,72,153,0.3)] hover:-translate-y-0.5 text-white"
      : variant === "danger"
      ? "bg-white/5 border-red-300/20 hover:border-red-300/40 hover:shadow-[0_4px_18px_rgba(248,113,113,0.25)] hover:-translate-y-0.5 text-red-200"
      : "bg-white/5 border-white/12 hover:border-white/20 hover:bg-white/7 hover:shadow-[0_4px_12px_rgba(255,255,255,0.1)] hover:-translate-y-0.5 text-white/90";

  return <button className={`${base} ${styles} ${className}`} {...props} />;
}
