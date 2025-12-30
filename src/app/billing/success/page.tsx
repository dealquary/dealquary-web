"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import AppBackground from "@/components/AppBackground";

export default function BillingSuccessPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [manualRefreshCount, setManualRefreshCount] = useState(0);

  useEffect(() => {
    // Refresh session to get updated Pro status
    // Add multiple refresh attempts with delays to ensure webhook has processed
    const refreshSession = async () => {
      // Wait a moment for webhook to process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Refresh session multiple times to ensure we get updated data
      for (let i = 0; i < 3; i++) {
        await update();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setIsRefreshing(false);
    };

    refreshSession();
  }, [update]);

  const handleManualRefresh = async () => {
    setManualRefreshCount(prev => prev + 1);
    await update();
  };

  const isPro = session?.user?.isPro || false;

  return (
    <AppBackground>
      <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <Card glow="cyan">
          <div className="p-8 text-center">
            {isRefreshing ? (
              <>
                <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Processing your upgrade...</h2>
                <p className="text-white/70">Please wait a moment while we activate your Pro features.</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-400"
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
                {isPro ? (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome to Pro!</h2>
                    <p className="text-white/70 mb-6">
                      Your subscription is now active. You can now export PDFs and sync your deals across all devices.
                    </p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-400/30 rounded-full mb-6">
                      <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-semibold text-cyan-300">Pro Member</span>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button variant="primary" onClick={() => router.push("/")} className="w-full">
                        Go to Dashboard
                      </Button>
                      <Button variant="secondary" onClick={() => router.push("/billing")} className="w-full">
                        View Billing
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                    <p className="text-white/70 mb-4">
                      Your payment was processed successfully. Activating Pro features...
                    </p>
                    <div className="p-4 bg-yellow-500/10 border border-yellow-400/30 rounded-lg mb-6">
                      <p className="text-sm text-yellow-200 mb-3">
                        <strong>Pro status not showing yet?</strong>
                      </p>
                      <p className="text-xs text-white/60 mb-4">
                        In local development, make sure Stripe webhooks are forwarded:
                        <code className="block mt-2 p-2 bg-black/40 rounded text-cyan-300 font-mono text-xs">
                          stripe listen --forward-to localhost:3000/api/stripe/webhook
                        </code>
                      </p>
                      <Button
                        variant="secondary"
                        onClick={handleManualRefresh}
                        className="w-full text-xs"
                      >
                        {manualRefreshCount > 0
                          ? `Check Status Again (${manualRefreshCount})`
                          : "Check Status Now"}
                      </Button>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button variant="primary" onClick={() => router.push("/")} className="w-full">
                        Go to Dashboard
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
    </AppBackground>
  );
}
