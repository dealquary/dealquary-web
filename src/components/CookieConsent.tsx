"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  timestamp: string;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState<boolean | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
  } as CookiePreferences);

  useEffect(() => {
    // Check if user has already consented (runs once on mount)
    const savedPreferences = localStorage.getItem("cookie-preferences");
    // Update state in next tick to avoid sync setState in effect
    const timer = setTimeout(() => {
      setShowBanner(!savedPreferences);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    const prefsWithTimestamp = {
      ...prefs,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("cookie-preferences", JSON.stringify(prefsWithTimestamp));
    setShowBanner(false);

    // If analytics are enabled, initialize analytics here
    if (prefs.analytics) {
      // TODO: Initialize analytics (Google Analytics, Mixpanel, etc.)
      console.log("Analytics enabled");
    }
  };

  const acceptAll = () => {
    savePreferences({
      essential: true,
      analytics: true,
      timestamp: new Date().toISOString(),
    });
  };

  const acceptEssentialOnly = () => {
    savePreferences({
      essential: true,
      analytics: false,
      timestamp: new Date().toISOString(),
    });
  };

  const saveCustomPreferences = () => {
    savePreferences(preferences);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slideInUp">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 border border-white/20 rounded-lg shadow-2xl p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-white text-lg font-semibold mb-2">
              Cookie Settings
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              We use cookies to provide essential functionality and, with your
              consent, to analyze site usage. You can accept all cookies or choose
              only essential ones.{" "}
              <Link
                href="/privacy#cookies"
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
              >
                Learn more about our cookies
              </Link>
            </p>
          </div>

          {/* Cookie Categories (Expandable) */}
          {showDetails && (
            <div className="mb-4 space-y-3 bg-white/5 rounded-lg p-4">
              {/* Essential Cookies */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="essential"
                  checked={true}
                  disabled
                  className="mt-1 w-4 h-4 rounded border-white/30 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 disabled:opacity-50"
                />
                <div className="flex-1">
                  <label htmlFor="essential" className="text-white text-sm font-medium block mb-1">
                    Essential Cookies <span className="text-white/50">(Required)</span>
                  </label>
                  <p className="text-white/60 text-xs">
                    Necessary for authentication, session management, and core functionality.
                    These cannot be disabled.
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="analytics"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded border-white/30 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                />
                <div className="flex-1">
                  <label htmlFor="analytics" className="text-white text-sm font-medium block mb-1">
                    Analytics Cookies <span className="text-white/50">(Optional)</span>
                  </label>
                  <p className="text-white/60 text-xs">
                    Help us understand how you use the site so we can improve your experience.
                    We may use services like Google Analytics or similar tools.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 text-white/80 hover:text-white text-sm transition-colors underline"
            >
              {showDetails ? "Hide Details" : "Customize"}
            </button>
            <div className="flex-1" />
            <button
              onClick={acceptEssentialOnly}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors border border-white/20"
            >
              Essential Only
            </button>
            {showDetails ? (
              <button
                onClick={saveCustomPreferences}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg"
              >
                Save Preferences
              </button>
            ) : (
              <button
                onClick={acceptAll}
                className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg"
              >
                Accept All
              </button>
            )}
          </div>

          {/* Footer Links */}
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-xs text-white/50">
            <Link
              href="/privacy"
              className="hover:text-cyan-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-cyan-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
