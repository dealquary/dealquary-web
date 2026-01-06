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
              <p className="text-white/80 mb-3">
                We collect your email address for account access and any deal
                data you input into the calculator.
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  <strong className="text-white">Account Information:</strong> Email
                  address, name (if provided), and authentication credentials
                </li>
                <li>
                  <strong className="text-white">Deal Data:</strong> Financial
                  calculations, product configurations, and assumptions you enter
                </li>
                <li>
                  <strong className="text-white">Usage Data:</strong> Pages visited,
                  features used, and interaction patterns (with your consent)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. Third-Party Services
              </h2>
              <p className="text-white/80 mb-3">
                We use the following third-party services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  <strong className="text-white">Stripe:</strong> Payment processing.
                  We do not store your credit card information on our servers; it is
                  handled entirely by Stripe under their PCI DSS compliant
                  infrastructure.
                </li>
                <li>
                  <strong className="text-white">Analytics (Optional):</strong> With
                  your consent, we may use analytics services (such as Google
                  Analytics or similar tools) to understand how users interact with
                  our platform. You can opt out via the cookie consent banner.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. Data Usage & Security
              </h2>
              <p className="text-white/80 mb-3">
                We do not sell your data. We use industry-standard encryption to
                protect your information. As noted in our UI, we do not store
                customer PII (Personally Identifiable Information) from your
                specific contract documents.
              </p>
              <p className="text-white/80">
                Your deal data is stored securely and is only accessible to you and
                authorized personnel for support purposes (with your permission).
              </p>
            </section>

            <section id="cookies">
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. Cookie Policy
              </h2>
              <p className="text-white/80 mb-3">
                We use cookies to provide and improve our services. You can control
                cookie settings through our cookie consent banner.
              </p>

              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Essential Cookies (Required)
                  </h3>
                  <p className="text-white/70 text-sm mb-2">
                    These cookies are necessary for the website to function and
                    cannot be disabled.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-white/70 text-sm ml-4">
                    <li>Authentication and session management</li>
                    <li>Security and fraud prevention</li>
                    <li>Cookie consent preferences</li>
                    <li>Shopping cart and checkout functionality</li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Analytics Cookies (Optional)
                  </h3>
                  <p className="text-white/70 text-sm mb-2">
                    With your consent, we use analytics cookies to understand how
                    visitors interact with our website.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-white/70 text-sm ml-4">
                    <li>Page views and navigation patterns</li>
                    <li>Feature usage and interactions</li>
                    <li>Performance metrics and error tracking</li>
                    <li>Aggregated, anonymized usage statistics</li>
                  </ul>
                  <p className="text-white/70 text-sm mt-2">
                    <strong className="text-white">Services we may use:</strong> Google
                    Analytics, Mixpanel, or similar analytics platforms. You can opt
                    out at any time through the cookie settings.
                  </p>
                </div>

                <p className="text-white/70 text-sm mt-3">
                  <strong className="text-white">Cookie Duration:</strong> Essential
                  cookies persist for the duration of your session or up to 30 days
                  for authentication. Analytics cookies may persist for up to 2 years
                  or until you clear your browser data.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                5. Your Rights (GDPR - EU/UK Users)
              </h2>
              <p className="text-white/80 mb-3">
                If you are located in the European Union or United Kingdom, you have
                the following rights under GDPR:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  <strong className="text-white">Right to Access:</strong> Request a
                  copy of the personal data we hold about you
                </li>
                <li>
                  <strong className="text-white">Right to Rectification:</strong>{" "}
                  Request correction of inaccurate or incomplete data
                </li>
                <li>
                  <strong className="text-white">Right to Erasure:</strong> Request
                  deletion of your personal data (&ldquo;right to be forgotten&rdquo;)
                </li>
                <li>
                  <strong className="text-white">Right to Restriction:</strong>{" "}
                  Request limitation of processing of your data
                </li>
                <li>
                  <strong className="text-white">Right to Data Portability:</strong>{" "}
                  Receive your data in a structured, machine-readable format
                </li>
                <li>
                  <strong className="text-white">Right to Object:</strong> Object to
                  processing of your data for specific purposes
                </li>
                <li>
                  <strong className="text-white">Right to Withdraw Consent:</strong>{" "}
                  Withdraw consent for data processing at any time
                </li>
              </ul>
              <p className="text-white/80 mt-3">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:privacy@dealquary.com"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  privacy@dealquary.com
                </a>
                . We will respond within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                6. California Privacy Rights (CCPA)
              </h2>
              <p className="text-white/80 mb-3">
                If you are a California resident, you have the following rights under
                the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  <strong className="text-white">Right to Know:</strong> Request
                  information about the categories and specific pieces of personal
                  information we have collected about you
                </li>
                <li>
                  <strong className="text-white">Right to Delete:</strong> Request
                  deletion of your personal information (subject to certain
                  exceptions)
                </li>
                <li>
                  <strong className="text-white">Right to Opt-Out:</strong> Opt out of
                  the &ldquo;sale&rdquo; of your personal information (Note: We do not
                  sell your personal information)
                </li>
                <li>
                  <strong className="text-white">Right to Non-Discrimination:</strong>{" "}
                  Exercise your privacy rights without discriminatory treatment
                </li>
              </ul>
              <p className="text-white/80 mt-3">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:privacy@dealquary.com"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  privacy@dealquary.com
                </a>{" "}
                or call our toll-free number (if applicable). We will verify your
                identity and respond within 45 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                7. Data Retention
              </h2>
              <p className="text-white/80">
                We retain your personal data for as long as your account is active or
                as needed to provide services. If you request account deletion, we
                will delete your data within 30 days, except where retention is
                required by law (e.g., for tax, legal, or security purposes).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                8. International Data Transfers
              </h2>
              <p className="text-white/80">
                Your data may be transferred to and processed in countries other than
                your country of residence. We ensure appropriate safeguards are in
                place, such as Standard Contractual Clauses approved by the European
                Commission for EU data transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                9. Changes to This Policy
              </h2>
              <p className="text-white/80">
                We may update this Privacy Policy from time to time. We will notify
                you of significant changes by email or through a prominent notice on
                our website. Your continued use of DealQuary after changes become
                effective constitutes acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                10. Contact & Data Protection Officer
              </h2>
              <p className="text-white/80 mb-2">
                For questions about this Privacy Policy or to exercise your rights:
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
                  <strong className="text-white">General Support:</strong>{" "}
                  <a
                    href="mailto:support@dealquary.com"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    support@dealquary.com
                  </a>
                </p>
              </div>
              <p className="text-white/70 text-sm mt-3">
                If you are not satisfied with our response, you have the right to
                lodge a complaint with your local data protection authority.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
