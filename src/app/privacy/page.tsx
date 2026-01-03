import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - DealQuary",
  description: "Privacy Policy for DealQuary",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-white/60">Last Updated: January 2, 2026</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-cyan max-w-none">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                1. Information We Collect
              </h2>
              <p className="text-white/80">
                We collect your email address for account access and any deal
                data you input into the calculator.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. Third-Party Services
              </h2>
              <p className="text-white/80">
                We use Stripe to process payments. We do not store your credit
                card information on our servers; it is handled entirely by
                Stripe.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. Data Usage & Security
              </h2>
              <p className="text-white/80">
                We do not sell your data. We use industry-standard encryption to
                protect your information. As noted in our UI, we do not store
                customer PII (Personally Identifiable Information) from your
                specific contract documents.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. Cookies
              </h2>
              <p className="text-white/80">
                We use essential cookies to keep you logged in and to analyze
                site traffic via standard analytics tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                5. Contact
              </h2>
              <p className="text-white/80">
                For questions, contact:{" "}
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
