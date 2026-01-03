import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - DealQuary",
  description: "Terms of Service for DealQuary",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm mb-4 inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to DealQuary
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            Terms of Service
          </h1>
          <p className="text-white/60">Last Updated: January 2, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-cyan max-w-none">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
            <p className="text-white/80">
              Welcome to DealQuary. By using our website and services, you agree
              to the following terms.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                1. Description of Service
              </h2>
              <p className="text-white/80">
                DealQuary provides a deal modeling calculator for SaaS
                economics. Our services are provided &ldquo;AS IS.&rdquo;
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. Accounts and Billing
              </h2>
              <ul className="list-disc list-inside space-y-2 text-white/80">
                <li>
                  <strong className="text-white">Payments:</strong> We use Stripe
                  for payment processing. By subscribing, you agree to Stripe&apos;s
                  terms.
                </li>
                <li>
                  <strong className="text-white">Subscriptions:</strong> Fees are
                  non-refundable unless required by law. You can cancel at any
                  time via your account settings.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. Use of Calculations
              </h2>
              <p className="text-white/80">
                The metrics provided (including ARR, MRR, LTV:CAC, and Payback)
                are estimates for informational purposes only. DealQuary does not
                provide financial, legal, or investment advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. Limitation of Liability
              </h2>
              <p className="text-white/80 font-semibold">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEALQUARY SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES,
                INCLUDING LOSS OF PROFITS OR REVENUE, ARISING FROM YOUR USE OF
                THE APP OR RELIANCE ON ITS CALCULATIONS. OUR TOTAL LIABILITY FOR
                ANY CLAIM SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO US IN THE
                LAST 12 MONTHS.
              </p>
            </section>

            <section className="pt-6 border-t border-white/10">
              <p className="text-white/60 text-sm">
                For questions about these terms, contact:{" "}
                <a
                  href="mailto:support@dealquary.com"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  support@dealquary.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
