"use client";

import { useSession, signIn } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AppBackground from "@/components/AppBackground";

export default function BillingPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpgrade = async () => {
    if (!session) {
      signIn("google");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const isPro = session?.user?.isPro || false;

  return (
    <AppBackground>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                onClick={() => router.push("/")}
                className="!px-3 !py-1.5 text-sm"
              >
                ← Back to App
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Billing & Subscription
                </h1>
                <p className="text-xs text-white/60">
                  Manage your Pro subscription
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Upgrade to Pro</h2>
            <p className="text-lg text-white/70">
              Unlock PDF export and access your deals from any device
            </p>
          </div>

        {isPro ? (
          <Card glow="cyan" className="bg-white/10">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-400/30">
                <svg
                  className="w-8 h-8 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">You&apos;re already Pro!</h2>
              <p className="text-white/70 mb-6">
                You have access to all Pro features including PDF export.
              </p>
              <Button variant="secondary" onClick={() => router.push("/")}>
                Back to Dashboard
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <Card glow="none" className="bg-white/8">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Free</h3>
                <div className="text-3xl font-bold text-white mb-4">$0</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-white/70">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Create unlimited deals</span>
                  </li>
                  <li className="flex items-start gap-2 text-white/70">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Compare deals side-by-side</span>
                  </li>
                  <li className="flex items-start gap-2 text-white/70">
                    <svg
                      className="w-5 h-5 text-green-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Advanced metrics & analytics</span>
                  </li>
                  <li className="flex items-start gap-2 text-white/40">
                    <svg className="w-5 h-5 text-white/20 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>PDF export</span>
                  </li>
                  <li className="flex items-start gap-2 text-white/40">
                    <svg className="w-5 h-5 text-white/20 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Sync across devices</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Pro Plan */}
            <Card glow="cyan" className="bg-white/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">Pro</h3>
                  <span className="px-2 py-1 text-xs font-semibold bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-400/30">
                    RECOMMENDED
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">$19</div>
                <div className="text-white/60 text-sm mb-4">per month</div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2 text-white/90">
                    <svg
                      className="w-5 h-5 text-cyan-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Everything in Free</span>
                  </li>
                  <li className="flex items-start gap-2 text-white/90">
                    <svg
                      className="w-5 h-5 text-cyan-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-semibold">PDF export for all deals</span>
                  </li>
                  <li className="flex items-start gap-2 text-white/90">
                    <svg
                      className="w-5 h-5 text-cyan-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="font-semibold">Sync across all devices</span>
                  </li>
                  <li className="flex items-start gap-2 text-white/90">
                    <svg
                      className="w-5 h-5 text-cyan-400 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button
                  variant="primary"
                  onClick={handleUpgrade}
                  disabled={loading}
                  className="w-full !py-3"
                >
                  {loading ? "Loading..." : status === "unauthenticated" ? "Sign in to Upgrade" : "Upgrade to Pro"}
                </Button>
                {error && (
                  <div className="mt-3 p-2 bg-red-500/10 border border-red-400/30 rounded text-xs text-red-300">
                    {error}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
        </div>
      </div>
    </AppBackground>
  );
}
