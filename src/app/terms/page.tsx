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
              Welcome to DealQuary. By accessing or using our website and services,
              you agree to be bound by these Terms of Service. If you do not agree
              to these terms, please do not use our services.
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                1. Description of Service
              </h2>
              <p className="text-white/80">
                DealQuary provides a deal modeling calculator and financial analysis
                tools for SaaS economics. Our services are provided &ldquo;AS IS&rdquo;
                and &ldquo;AS AVAILABLE&rdquo; without warranties of any kind, either
                express or implied.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. Accounts and Billing
              </h2>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  <strong className="text-white">Account Creation:</strong> You must
                  provide accurate and complete information when creating an account.
                  You are responsible for maintaining the confidentiality of your
                  account credentials.
                </li>
                <li>
                  <strong className="text-white">Payments:</strong> We use Stripe
                  for payment processing. By subscribing, you agree to Stripe&apos;s
                  terms and authorize us to charge your payment method.
                </li>
                <li>
                  <strong className="text-white">Subscriptions:</strong> Fees are
                  non-refundable unless required by law. Subscriptions automatically
                  renew unless canceled. You can cancel at any time via your account
                  settings, and cancellation will take effect at the end of your
                  current billing period.
                </li>
                <li>
                  <strong className="text-white">Price Changes:</strong> We reserve
                  the right to modify our pricing with 30 days&apos; notice. Changes
                  will apply to subsequent billing periods.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. Use of Calculations and Disclaimer
              </h2>
              <p className="text-white/80 mb-3">
                The metrics provided (including ARR, MRR, LTV:CAC, Payback, and other
                financial calculations) are estimates for informational purposes only.
                DealQuary does not provide financial, legal, tax, or investment advice.
              </p>
              <p className="text-white/80">
                You should consult with qualified professionals before making any
                business or financial decisions based on our calculations. We do not
                guarantee the accuracy, completeness, or suitability of any
                calculations for your specific use case.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. Acceptable Use Policy
              </h2>
              <p className="text-white/80 mb-3">
                You agree not to use DealQuary to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights of others</li>
                <li>
                  Transmit malicious code, viruses, or harmful software
                </li>
                <li>
                  Attempt to gain unauthorized access to our systems or other users&apos;
                  accounts
                </li>
                <li>
                  Scrape, crawl, or use automated tools to extract data without
                  permission
                </li>
                <li>
                  Reverse engineer or attempt to derive source code from our services
                </li>
                <li>
                  Use the service for any illegal, fraudulent, or abusive purposes
                </li>
                <li>
                  Resell or redistribute our services without authorization
                </li>
              </ul>
              <p className="text-white/80 mt-3">
                Violation of this policy may result in immediate account termination.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                5. Intellectual Property Rights
              </h2>
              <p className="text-white/80 mb-3">
                <strong className="text-white">Our IP:</strong> DealQuary, including
                all software, design, text, graphics, and other content, is owned by
                us or our licensors and protected by copyright, trademark, and other
                intellectual property laws.
              </p>
              <p className="text-white/80 mb-3">
                <strong className="text-white">Your Content:</strong> You retain
                ownership of all deal data, calculations, and content you create using
                our services (&ldquo;Your Content&rdquo;). By using our services, you
                grant us a limited license to host, store, and process Your Content
                solely to provide and improve our services.
              </p>
              <p className="text-white/80">
                <strong className="text-white">Calculations & Reports:</strong> You
                may use, share, and export the calculations and reports you generate
                for your business purposes. However, you may not claim ownership of
                the underlying DealQuary software, algorithms, or methodologies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                6. Account Termination
              </h2>
              <p className="text-white/80 mb-3">
                <strong className="text-white">By You:</strong> You may terminate your
                account at any time through your account settings. Upon termination,
                your access to paid features will continue until the end of your
                current billing period.
              </p>
              <p className="text-white/80 mb-3">
                <strong className="text-white">By Us:</strong> We reserve the right to
                suspend or terminate your account if you violate these Terms, engage
                in fraudulent activity, or for any other reason at our sole discretion.
                We will provide notice when reasonably possible, except in cases of
                suspected fraud or illegal activity.
              </p>
              <p className="text-white/80">
                <strong className="text-white">Effect of Termination:</strong> Upon
                termination, your right to use our services immediately ceases. You
                may request a copy of your data within 30 days of termination, after
                which we may delete your account and data in accordance with our
                Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                7. Limitation of Liability
              </h2>
              <p className="text-white/80 font-semibold mb-3">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, DEALQUARY SHALL NOT BE
                LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, REVENUE, DATA, OR
                BUSINESS OPPORTUNITIES, ARISING FROM YOUR USE OF THE SERVICE OR
                RELIANCE ON ITS CALCULATIONS, EVEN IF WE HAVE BEEN ADVISED OF THE
                POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p className="text-white/80">
                OUR TOTAL LIABILITY FOR ANY CLAIM RELATED TO THESE TERMS OR THE
                SERVICES SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO US IN THE 12
                MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS GREATER.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                8. Indemnification
              </h2>
              <p className="text-white/80">
                You agree to indemnify, defend, and hold harmless DealQuary and its
                officers, directors, employees, and agents from any claims, liabilities,
                damages, losses, and expenses (including reasonable attorneys&apos; fees)
                arising out of your use of the services, violation of these Terms, or
                infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                9. Dispute Resolution and Arbitration
              </h2>
              <p className="text-white/80 mb-3">
                <strong className="text-white">Informal Resolution:</strong> If you
                have a dispute with DealQuary, please contact us at{" "}
                <a
                  href="mailto:support@dealquary.com"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  support@dealquary.com
                </a>{" "}
                first to attempt an informal resolution.
              </p>
              <p className="text-white/80 mb-3">
                <strong className="text-white">Binding Arbitration:</strong> If we
                cannot resolve the dispute informally within 60 days, any claims
                arising out of these Terms or the services shall be resolved through
                binding arbitration in accordance with the rules of the American
                Arbitration Association (AAA), except as otherwise provided herein.
                The arbitration shall be conducted in California, and judgment on the
                award may be entered in any court of competent jurisdiction.
              </p>
              <p className="text-white/80 mb-3">
                <strong className="text-white">Class Action Waiver:</strong> YOU AND
                DEALQUARY AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN
                YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER
                IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING. Unless both you
                and DealQuary agree otherwise, the arbitrator may not consolidate more
                than one person&apos;s claims and may not preside over any form of
                representative or class proceeding.
              </p>
              <p className="text-white/80 text-sm">
                <em>
                  Note: Some jurisdictions do not allow certain limitations on
                  arbitration or class actions. If you reside in such a jurisdiction,
                  these provisions may not apply to you, and disputes may be resolved
                  in court.
                </em>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                10. Governing Law and Jurisdiction
              </h2>
              <p className="text-white/80">
                These Terms shall be governed by and construed in accordance with the
                laws of the State of California, United States, without regard to
                its conflict of law provisions. For any disputes not subject to
                arbitration, you agree to submit to the exclusive jurisdiction of the
                state and federal courts located in California.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                11. Changes to Terms
              </h2>
              <p className="text-white/80">
                We reserve the right to modify these Terms at any time. We will notify
                you of material changes by email or through a prominent notice on our
                website at least 30 days before the changes take effect. Your continued
                use of DealQuary after changes become effective constitutes acceptance
                of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                12. Severability and Entire Agreement
              </h2>
              <p className="text-white/80 mb-3">
                If any provision of these Terms is found to be unenforceable or invalid,
                that provision will be limited or eliminated to the minimum extent
                necessary, and the remaining provisions will remain in full force and
                effect.
              </p>
              <p className="text-white/80">
                These Terms, together with our Privacy Policy and any other legal
                notices published by us, constitute the entire agreement between you
                and DealQuary concerning the services and supersede all prior agreements
                and understandings.
              </p>
            </section>

            <section className="pt-6 border-t border-white/10">
              <h2 className="text-xl font-semibold text-white mb-3">
                Contact Information
              </h2>
              <p className="text-white/80 mb-2">
                For questions about these Terms of Service:
              </p>
              <div className="bg-white/5 rounded-lg p-4 text-white/80">
                <p className="mb-1">
                  <strong className="text-white">Email:</strong>{" "}
                  <a
                    href="mailto:legal@dealquary.com"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    legal@dealquary.com
                  </a>
                </p>
                <p>
                  <strong className="text-white">Support:</strong>{" "}
                  <a
                    href="mailto:support@dealquary.com"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    support@dealquary.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
