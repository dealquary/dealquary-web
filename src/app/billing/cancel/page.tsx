"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export default function BillingCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full">
        <Card glow="none">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Upgrade Cancelled</h2>
            <p className="text-white/70 mb-6">
              No worries! You can upgrade to Pro at any time to unlock PDF exports and device sync.
            </p>
            <div className="flex flex-col gap-3">
              <Button variant="primary" onClick={() => router.push("/")} className="w-full">
                Back to Dashboard
              </Button>
              <Button variant="secondary" onClick={() => router.push("/billing")} className="w-full">
                View Pricing
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
