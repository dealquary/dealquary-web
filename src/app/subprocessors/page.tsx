import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sub-processors - DealQuary",
  description: "List of third-party sub-processors used by DealQuary",
};

export default function SubprocessorsPage() {
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
            Sub-processors
          </h1>
          <p className="text-white/60">Last Updated: January 6, 2026</p>
          <p className="text-white/70 text-sm mt-2">
            Third-party services that process data on behalf of DealQuary
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-cyan max-w-none">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
            <section>
              <p className="text-white/80 mb-6">
                As part of providing our services, DealQuary engages certain
                third-party sub-processors to process data on our behalf. This page
                lists all current sub-processors, in compliance with our{" "}
                <Link
                  href="/dpa"
                  className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                >
                  Data Processing Agreement
                </Link>
                .
              </p>

              <p className="text-white/80 mb-6">
                We will notify customers of any changes to this list at least 30
                days in advance. If you object to a new sub-processor, you may
                terminate your subscription without penalty.
              </p>
            </section>

            {/* Infrastructure & Hosting */}
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                Infrastructure & Hosting
              </h2>

              <div className="space-y-4">
                {/* Vercel */}
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Vercel Inc.</h3>
                      <p className="text-white/60 text-sm">Application Hosting & Edge Network</p>
                    </div>
                    <a
                      href="https://vercel.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                      vercel.com ↗
                    </a>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Location:</span>
                      <span className="text-white/80">United States (Global CDN)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Purpose:</span>
                      <span className="text-white/80">
                        Hosts the DealQuary web application, handles request routing,
                        and provides global content delivery
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Data Processed:</span>
                      <span className="text-white/80">
                        Application data, user sessions, metadata
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Certifications:</span>
                      <span className="text-white/80">SOC 2 Type II, GDPR compliant</span>
                    </div>
                  </div>
                </div>

                {/* Neon */}
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Neon</h3>
                      <p className="text-white/60 text-sm">Serverless PostgreSQL Database</p>
                    </div>
                    <a
                      href="https://neon.tech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                      neon.tech ↗
                    </a>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Location:</span>
                      <span className="text-white/80">United States (AWS US West)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Purpose:</span>
                      <span className="text-white/80">
                        Stores user accounts, deal data, subscriptions, and application state
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Data Processed:</span>
                      <span className="text-white/80">
                        User profiles, deal models, financial calculations, subscription records
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Certifications:</span>
                      <span className="text-white/80">
                        SOC 2 Type II, GDPR compliant, encryption at rest and in transit
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Processing */}
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Payment Processing
              </h2>

              <div className="space-y-4">
                {/* Stripe */}
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Stripe, Inc.</h3>
                      <p className="text-white/60 text-sm">Payment Processing & Subscriptions</p>
                    </div>
                    <a
                      href="https://stripe.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                      stripe.com ↗
                    </a>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Location:</span>
                      <span className="text-white/80">United States (Global)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Purpose:</span>
                      <span className="text-white/80">
                        Processes payments, manages subscriptions, handles billing
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Data Processed:</span>
                      <span className="text-white/80">
                        Payment information, billing details, subscription status
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Certifications:</span>
                      <span className="text-white/80">
                        PCI DSS Level 1, SOC 2 Type II, GDPR compliant
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Note:</span>
                      <span className="text-white/80">
                        DealQuary does not store credit card numbers; all payment data is
                        securely handled by Stripe
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Authentication */}
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Authentication & Identity
              </h2>

              <div className="space-y-4">
                {/* Google OAuth */}
                <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Google LLC</h3>
                      <p className="text-white/60 text-sm">OAuth Authentication Provider</p>
                    </div>
                    <a
                      href="https://google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                    >
                      google.com ↗
                    </a>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Location:</span>
                      <span className="text-white/80">United States (Global)</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Purpose:</span>
                      <span className="text-white/80">
                        Authenticates users via Google Sign-In (OAuth 2.0)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Data Processed:</span>
                      <span className="text-white/80">
                        Email address, name, profile picture (with user consent)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-white/50 min-w-[120px]">Certifications:</span>
                      <span className="text-white/80">
                        ISO 27001, SOC 2/3, GDPR compliant
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Analytics (Optional) */}
            <section className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Analytics (Optional - Requires Consent)
              </h2>

              <div className="bg-white/5 rounded-lg p-5 border border-white/10">
                <div className="mb-3">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Analytics Services
                  </h3>
                  <p className="text-white/70 text-sm">
                    <strong className="text-white">Not Currently Active</strong> — We
                    may use analytics services in the future to understand user behavior
                    and improve our product. These will only be activated with your
                    explicit consent via our cookie banner.
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <span className="text-white/50 min-w-[120px]">Potential Services:</span>
                    <span className="text-white/80">
                      Google Analytics, Mixpanel, PostHog, or similar
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-white/50 min-w-[120px]">Consent Required:</span>
                    <span className="text-white/80">
                      Yes — Users can opt in/out via cookie preferences
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-white/50 min-w-[120px]">Data Processed:</span>
                    <span className="text-white/80">
                      Anonymized usage data, page views, feature interactions
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Changes & Notifications */}
            <section className="mt-8 pt-6 border-t border-white/10">
              <h2 className="text-xl font-semibold text-white mb-3">
                Updates to This List
              </h2>
              <p className="text-white/80 mb-3">
                We will notify you at least 30 days in advance before adding a new
                sub-processor. Notifications will be sent to your registered email
                address.
              </p>
              <p className="text-white/80 mb-3">
                If you object to a new sub-processor, you may:
              </p>
              <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                <li>Contact us at privacy@dealquary.com to discuss alternatives</li>
                <li>
                  Terminate your subscription without penalty within 30 days of
                  notification
                </li>
              </ul>
            </section>

            <section className="pt-6 border-t border-white/10">
              <h2 className="text-xl font-semibold text-white mb-3">
                Contact Information
              </h2>
              <p className="text-white/80 mb-2">
                For questions about our sub-processors or data processing practices:
              </p>
              <div className="bg-white/5 rounded-lg p-4 text-white/80">
                <p className="mb-1">
                  <strong className="text-white">Email:</strong>{" "}
                  <a
                    href="mailto:privacy@dealquary.com"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    privacy@dealquary.com
                  </a>
                </p>
                <p>
                  <strong className="text-white">Related Documents:</strong>{" "}
                  <Link
                    href="/dpa"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Data Processing Agreement
                  </Link>
                  {" | "}
                  <Link
                    href="/privacy"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
