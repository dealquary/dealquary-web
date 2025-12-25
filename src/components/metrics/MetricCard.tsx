"use client";

import { useEffect, useRef, useState } from "react";
import { formatDelta } from "@/lib/formatters";

export type MetricStatus = "success" | "warning" | "danger" | "neutral";

type MetricCardProps = {
  label: string;
  value: string;
  rawValue?: number; // For delta tracking
  subtext?: string;
  variant?: "default" | "highlight";
  compact?: boolean;
  colorType?: "revenue" | "profit" | "neutral";
  status?: MetricStatus;
  statusLabel?: string;
};

export default function MetricCard({
  label,
  value,
  rawValue,
  subtext,
  variant = "default",
  compact = false,
  colorType = "neutral",
  status,
  statusLabel,
}: MetricCardProps) {
  const previousValue = useRef<number | null>(null);
  const [delta, setDelta] = useState<{ text: string; isPositive: boolean } | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (rawValue !== undefined && previousValue.current !== null && rawValue !== previousValue.current) {
      // Calculate and show delta
      const deltaInfo = formatDelta(rawValue, previousValue.current);
      if (deltaInfo) {
        setDelta(deltaInfo);
        setIsPulsing(true);

        // Fade out delta after 1.5s
        const timer = setTimeout(() => {
          setDelta(null);
        }, 1500);

        // Stop pulsing after animation
        const pulseTimer = setTimeout(() => {
          setIsPulsing(false);
        }, 600);

        return () => {
          clearTimeout(timer);
          clearTimeout(pulseTimer);
        };
      }
    }

    if (rawValue !== undefined) {
      previousValue.current = rawValue;
    }
  }, [rawValue]);

  // Determine text color based on metric type
  const getTextColor = () => {
    if (colorType === "revenue") return "text-blue-300";
    if (colorType === "profit") return "text-green-300";
    if (variant === "highlight") return "text-blue-300";
    return "text-white";
  };

  // Get status border/badge styling
  const getStatusStyles = () => {
    if (!status || status === "neutral") return "";

    switch (status) {
      case "success":
        return "ring-1 ring-green-400/30";
      case "warning":
        return "ring-1 ring-yellow-400/30";
      case "danger":
        return "ring-1 ring-red-400/30";
      default:
        return "";
    }
  };

  const getStatusBadgeColor = () => {
    switch (status) {
      case "success":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      case "warning":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "danger":
        return "bg-red-500/20 text-red-300 border-red-400/30";
      default:
        return "";
    }
  };

  return (
    <div
      className={`
        ${compact ? "p-2" : "p-3"} rounded-lg border transition-all
        ${variant === "highlight" ? "bg-blue-500/10 border-blue-400/30" : "bg-white/5 border-white/10"}
        ${getStatusStyles()}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`${compact ? "text-[10px]" : "text-xs"} font-medium text-white/70 mb-1`}>
          {label}
        </div>
        {status && status !== "neutral" && statusLabel && (
          <div
            className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${getStatusBadgeColor()}`}
          >
            {statusLabel}
          </div>
        )}
      </div>

      <div className="relative">
        <div
          className={`
            ${compact ? "text-base" : "text-lg"} font-bold font-mono ${getTextColor()}
            ${isPulsing ? "animate-pulse" : ""}
          `}
        >
          {value}
        </div>

        {/* Delta indicator */}
        {delta && (
          <div
            className={`
              absolute -top-1 left-full ml-2 text-[10px] font-mono font-semibold
              ${delta.isPositive ? "text-green-400" : "text-red-400"}
              animate-fadeIn
            `}
          >
            {delta.text}
          </div>
        )}
      </div>

      {subtext && <div className="text-xs text-white/60 mt-0.5">{subtext}</div>}
    </div>
  );
}
