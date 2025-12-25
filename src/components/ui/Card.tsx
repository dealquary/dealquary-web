import React from "react";

type Props = {
  children: React.ReactNode;
  glow?: "pink" | "cyan" | "purple" | "none";
  className?: string;
};

export function Card({ children, glow = "none", className = "" }: Props) {
  const glowClass =
    glow === "pink"
      ? "before:shadow-[0_0_0_1px_rgba(236,72,153,0.35),0_0_40px_rgba(236,72,153,0.18)]"
      : glow === "cyan"
      ? "before:shadow-[0_0_0_1px_rgba(34,211,238,0.32),0_0_40px_rgba(34,211,238,0.16)]"
      : glow === "purple"
      ? "before:shadow-[0_0_0_1px_rgba(168,85,247,0.32),0_0_40px_rgba(168,85,247,0.16)]"
      : "";

  return (
    <div
      className={[
        "relative rounded-2xl",
        "bg-white/5 border border-white/10",
        "backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
        "before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none",
        glowClass,
        className
      ].join(" ")}
    >
      {children}
    </div>
  );
}
