"use client";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string };

export function Select({ label, className = "", children, ...props }: Props) {
  return (
    <label className="block space-y-1">
      {label ? <span className="text-xs text-white/70">{label}</span> : null}
      <select
        className={[
          "w-full px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm text-white",
          "backdrop-blur-xl",
          "focus:outline-none focus:ring-2 focus:ring-cyan-400/20 focus:border-cyan-300/30",
          "hover:border-white/15",
          className
        ].join(" ")}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
