"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already consented (runs once on mount)
    const hasConsented = localStorage.getItem("cookie-consent");
    // Update state in next tick to avoid sync setState in effect
    const timer = setTimeout(() => {
      setShowBanner(!hasConsented);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slideInUp">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 border border-white/20 rounded-lg shadow-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Text */}
          <div className="flex-1">
            <p className="text-white text-sm leading-relaxed">
              We use essential cookies to keep you logged in and analyze site traffic.
              By continuing to use DealQuary, you agree to our use of cookies.{" "}
              <Link
                href="/privacy"
                className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
              >
                Learn more
              </Link>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <button
              onClick={acceptCookies}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
