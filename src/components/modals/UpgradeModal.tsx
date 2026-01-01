"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string; // e.g., "PDF Export", "Excel Export", "Device Sync"
}

export function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  const router = useRouter();

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    onClose();
    router.push("/billing");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-scaleIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header gradient */}
        <div className="h-24 bg-gradient-to-br from-purple-600 via-cyan-600 to-blue-600 relative">
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 -mt-10 relative">
          {/* Pro Badge */}
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full text-white uppercase tracking-wider shadow-lg">
              Pro Feature
            </span>
          </div>

          {/* Title */}
          <h2
            id="upgrade-modal-title"
            className="text-2xl font-bold text-white text-center mb-3"
          >
            Upgrade to Pro
          </h2>

          {/* Description */}
          <p className="text-white/70 text-center mb-6 leading-relaxed">
            <span className="font-semibold text-cyan-300">{feature}</span> is available on the Pro plan.
            Upgrade to unlock advanced exports, device sync, and priority support.
          </p>

          {/* Features List */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-white/90">
                <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">PDF & Excel export for all deals</span>
              </li>
              <li className="flex items-start gap-3 text-white/90">
                <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Sync across all devices</span>
              </li>
              <li className="flex items-start gap-3 text-white/90">
                <svg className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">Priority customer support</span>
              </li>
            </ul>
          </div>

          {/* Price */}
          <div className="text-center mb-6">
            <span className="text-4xl font-bold text-white">$19</span>
            <span className="text-white/60 text-lg">/month</span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleUpgradeClick}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Upgrade to Pro
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-medium rounded-lg transition-all"
            >
              Maybe Later
            </button>
          </div>

          {/* Footer note */}
          <p className="text-xs text-white/40 text-center mt-4">
            Cancel anytime. No long-term commitment required.
          </p>
        </div>
      </div>
    </div>
  );
}
