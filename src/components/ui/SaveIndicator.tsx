"use client";

import { useEffect } from "react";

type SaveIndicatorProps = {
  visible: boolean;
  duration?: number; // milliseconds to show, default 2000
  onHide?: () => void;
};

/**
 * SaveIndicator - Shows "Saved ✓" message that auto-fades
 * Epic 4: Input Validation & Feedback
 *
 * Usage:
 * const [showSaved, setShowSaved] = useState(false);
 * // On save: setShowSaved(true)
 * <SaveIndicator visible={showSaved} onHide={() => setShowSaved(false)} />
 */
export function SaveIndicator({ visible, duration = 2000, onHide }: SaveIndicatorProps) {
  useEffect(() => {
    if (visible && onHide) {
      // Auto-hide after duration
      const hideTimer = setTimeout(() => {
        onHide();
      }, duration);

      return () => {
        clearTimeout(hideTimer);
      };
    }
  }, [visible, duration, onHide]);

  if (!visible) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        flex items-center gap-2 px-4 py-2
        bg-green-500/20 border border-green-400/30 rounded-lg
        text-green-300 text-sm font-medium
        shadow-lg backdrop-blur-sm
        transition-opacity duration-300
        opacity-100
        animate-slideInTop
      `}
      style={{
        animation: `slideInTop 0.3s ease-out, fadeOut ${duration}ms ${duration - 300}ms forwards`
      }}
    >
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <span>Saved</span>
    </div>
  );
}
