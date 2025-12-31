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
        ${compact ? "p-2" : "p-3"} rounded-lg border transition-all duration-200
        ${variant === "highlight" ? "bg-blue-500/10 border-blue-400/30 hover:bg-blue-500/15" : "bg-white/5 border-white/10 hover:border-white/15"}
        ${getStatusStyles()}
        ${isPulsing ? "animate-highlightFlash" : ""}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`${compact ? "text-[10px]" : "text-xs"} font-medium text-white/70 mb-1`}>
          {label}
        </div>
        {status && status !== "neutral" && statusLabel && (
          <div
            className={`text-[9px] px-1.5 py-0.5 rounded-full border font-semibold ${getStatusBadgeColor()} animate-scaleIn`}
          >
            {statusLabel}
          </div>
        )}
      </div>

      <div className="relative">
        <div
          className={`
            ${compact ? "text-base" : "text-lg"} font-bold font-mono ${getTextColor()}
            transition-all duration-300
          `}
        >
          {value}
        </div>

        {/* Delta indicator */}
        {delta && (
          <div
            className={`
              absolute -top-1 left-full ml-2 text-[10px] font-mono font-semibold flex items-center gap-1
              ${delta.isPositive ? "text-green-400" : "text-red-400"}
              animate-slideInRight
            `}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              {delta.isPositive ? (
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              )}
            </svg>
            {delta.text}
          </div>
        )}
      </div>

      {subtext && <div className="text-xs text-white/60 mt-0.5">{subtext}</div>}
    </div>
  );
}
