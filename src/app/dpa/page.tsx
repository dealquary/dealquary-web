import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Processing Agreement - DealQuary",
  description: "Data Processing Agreement for DealQuary enterprise customers",
};

export default function DPAPage() {
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
            Data Processing Agreement (DPA)
          </h1>
          <p className="text-white/60">Last Updated: January 2, 2026</p>
          <p className="text-white/70 text-sm mt-2">
            For GDPR and data protection compliance
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-cyan max-w-none">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
            {/* Introduction */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
              <p className="text-white/90 text-sm">
                <strong className="text-white">Important:</strong> This Data
                Processing Agreement supplements our{" "}
                <Link
                  href="/terms"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  Privacy Policy
                </Link>
                . It applies when you use DealQuary to process personal data
                subject to GDPR or similar data protection laws. By using our
                services, you accept this DPA.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                1. Definitions
              </h2>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  <strong className="text-white">
                    &ldquo;Controller&rdquo;
                  </strong>{" "}
                  means you, the customer, who determines the purposes and means
                  of processing personal data.
                </li>
                <li>
                  <strong className="text-white">
                    &ldquo;Processor&rdquo;
                  </strong>{" "}
                  means DealQuary, which processes personal data on behalf of
                  the Controller.
                </li>
                <li>
                  <strong className="text-white">
                    &ldquo;Personal Data&rdquo;
                  </strong>{" "}
                  means any information relating to an identified or
                  identifiable natural person that you input into DealQuary.
                </li>
                <li>
                  <strong className="text-white">
                    &ldquo;Data Subject&rdquo;
                  </strong>{" "}
                  means the individual to whom Personal Data relates.
                </li>
                <li>
                  <strong className="text-white">&ldquo;GDPR&rdquo;</strong>{" "}
                  means Regulation (EU) 2016/679 (General Data Protection
                  Regulation).
                </li>
                <li>
                  <strong className="text-white">
                    &ldquo;Sub-processor&rdquo;
                  </strong>{" "}
                  means any third party engaged by DealQuary to process Personal
                  Data.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                2. Scope and Purpose of Processing
              </h2>
              <p className="text-white/80 mb-3">
                <strong className="text-white">Nature of Processing:</strong>{" "}
                DealQuary processes Personal Data solely to provide the deal
                modeling and financial calculation services as described in our
                Terms of Service.
              </p>
              <p className="text-white/80 mb-3">
                <strong className="text-white">Types of Personal Data:</strong>{" "}
                The types of Personal Data processed may include:
              </p>
              <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                <li>User account information (name, email address)</li>
                <li>
                  Deal participant names or identifiers (if you choose to input
                  them)
                </li>
                <li>Any other data you voluntarily input into the platform</li>
              </ul>
              <p className="text-white/80 mt-3">
                <strong className="text-white">Categories of Data Subjects:</strong>{" "}
                Your employees, contractors, and any individuals whose
                information you input into DealQuary.
              </p>
              <p className="text-white/80 mt-3">
                <strong className="text-white">Duration:</strong> For the term
                of your subscription and up to 30 days thereafter (or as
                required by law).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                3. Controller and Processor Obligations
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Your Obligations (as Controller)
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-white/70 text-sm ml-4">
                    <li>
                      Ensure you have a lawful basis for processing Personal
                      Data
                    </li>
                    <li>
                      Provide necessary privacy notices to Data Subjects
                    </li>
                    <li>
                      Only process Personal Data in accordance with applicable
                      laws
                    </li>
                    <li>
                      Obtain necessary consents or permissions from Data Subjects
                    </li>
                    <li>
                      Respond to Data Subject rights requests (with our
                      assistance as needed)
                    </li>
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Our Obligations (as Processor)
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-white/70 text-sm ml-4">
                    <li>
                      Process Personal Data only on your documented instructions
                    </li>
                    <li>
                      Ensure persons authorized to process Personal Data are
                      bound by confidentiality
                    </li>
                    <li>
                      Implement appropriate technical and organizational security
                      measures
                    </li>
                    <li>
                      Assist you in responding to Data Subject rights requests
                    </li>
                    <li>
                      Notify you of any Personal Data breaches without undue
                      delay
                    </li>
                    <li>
                      Delete or return Personal Data upon termination (at your
                      choice)
                    </li>
                    <li>
                      Make available information necessary to demonstrate
                      compliance
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                4. Sub-processors
              </h2>
              <p className="text-white/80 mb-3">
                You authorize DealQuary to engage the following categories of
                Sub-processors to assist in providing the services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  <strong className="text-white">
                    Cloud hosting providers
                  </strong>{" "}
                  (e.g., AWS, Vercel, or similar infrastructure providers)
                </li>
                <li>
                  <strong className="text-white">Payment processors</strong>{" "}
                  (Stripe)
                </li>
                <li>
                  <strong className="text-white">
                    Authentication services
                  </strong>{" "}
                  (NextAuth or similar)
                </li>
                <li>
                  <strong className="text-white">Analytics providers</strong>{" "}
                  (only if you have consented via cookie banner)
                </li>
              </ul>
              <p className="text-white/80 mt-3">
                We maintain a list of current Sub-processors and will notify you
                of any changes. You may object to new Sub-processors within 30
                days of notification. If we cannot accommodate your objection,
                you may terminate your subscription without penalty.
              </p>
              <p className="text-white/80 mt-3">
                For the current list of Sub-processors, see our{" "}
                <Link
                  href="/subprocessors"
                  className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
                >
                  Sub-processors page
                </Link>
                , or contact{" "}
                <a
                  href="mailto:privacy@dealquary.com"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  privacy@dealquary.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                5. Data Security Measures
              </h2>
              <p className="text-white/80 mb-3">
                DealQuary implements appropriate technical and organizational
                measures to ensure a level of security appropriate to the risk,
                including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  <strong className="text-white">Encryption:</strong> Data
                  encrypted in transit (TLS/HTTPS) and at rest
                </li>
                <li>
                  <strong className="text-white">Access Controls:</strong>{" "}
                  Role-based access controls and authentication requirements
                </li>
                <li>
                  <strong className="text-white">
                    Infrastructure Security:
                  </strong>{" "}
                  Use of industry-standard cloud hosting with SOC 2 compliance
                </li>
                <li>
                  <strong className="text-white">Monitoring:</strong> Regular
                  security monitoring and vulnerability assessments
                </li>
                <li>
                  <strong className="text-white">Backup & Recovery:</strong>{" "}
                  Regular backups and disaster recovery procedures
                </li>
                <li>
                  <strong className="text-white">Confidentiality:</strong> All
                  personnel with access to Personal Data are bound by
                  confidentiality obligations
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                6. Data Subject Rights
              </h2>
              <p className="text-white/80 mb-3">
                We will assist you in fulfilling your obligations to respond to
                Data Subject requests to exercise their rights under GDPR,
                including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-white/80 ml-4">
                <li>Right of access</li>
                <li>Right to rectification</li>
                <li>Right to erasure (&ldquo;right to be forgotten&rdquo;)</li>
                <li>Right to restriction of processing</li>
                <li>Right to data portability</li>
                <li>Right to object</li>
              </ul>
              <p className="text-white/80 mt-3">
                Contact{" "}
                <a
                  href="mailto:privacy@dealquary.com"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  privacy@dealquary.com
                </a>{" "}
                for assistance with Data Subject requests. We will respond
                within a reasonable timeframe to enable you to meet your legal
                obligations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                7. Data Breach Notification
              </h2>
              <p className="text-white/80 mb-3">
                In the event of a Personal Data breach, DealQuary will:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  Notify you without undue delay after becoming aware of the
                  breach (within 72 hours where feasible)
                </li>
                <li>
                  Provide reasonable information about the breach, including the
                  nature of the breach, categories and approximate number of
                  affected Data Subjects, and likely consequences
                </li>
                <li>
                  Describe measures taken or proposed to address the breach and
                  mitigate potential adverse effects
                </li>
                <li>
                  Cooperate with you to investigate and remediate the breach
                </li>
              </ul>
              <p className="text-white/80 mt-3">
                <strong className="text-white">Note:</strong> As Controller, you
                remain responsible for notifying supervisory authorities and
                affected Data Subjects as required by applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                8. International Data Transfers
              </h2>
              <p className="text-white/80 mb-3">
                Your Personal Data may be transferred to and processed in
                countries outside the European Economic Area (EEA). When we
                transfer Personal Data outside the EEA, we ensure appropriate
                safeguards are in place, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  <strong className="text-white">
                    Standard Contractual Clauses (SCCs):
                  </strong>{" "}
                  We use the European Commission-approved Standard Contractual
                  Clauses for data transfers to third countries
                </li>
                <li>
                  <strong className="text-white">
                    Adequacy Decisions:
                  </strong>{" "}
                  Where possible, we transfer data to countries recognized by
                  the European Commission as providing adequate protection
                </li>
                <li>
                  <strong className="text-white">
                    Sub-processor Compliance:
                  </strong>{" "}
                  We require all Sub-processors to implement equivalent
                  safeguards for international transfers
                </li>
              </ul>
              <p className="text-white/80 mt-3">
                For a copy of the Standard Contractual Clauses or more
                information about our data transfer mechanisms, contact{" "}
                <a
                  href="mailto:privacy@dealquary.com"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  privacy@dealquary.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                9. Audit Rights
              </h2>
              <p className="text-white/80 mb-3">
                Upon your written request and subject to reasonable notice,
                DealQuary will:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  Make available information necessary to demonstrate compliance
                  with this DPA and GDPR obligations
                </li>
                <li>
                  Allow for and contribute to audits or inspections conducted by
                  you or an independent auditor mandated by you (subject to
                  confidentiality obligations)
                </li>
              </ul>
              <p className="text-white/80 mt-3">
                <strong className="text-white">Audit Conditions:</strong> Audits
                must be conducted during business hours, with at least 30
                days&apos; advance notice, and no more than once per year unless
                required by a supervisory authority. You will bear all costs
                associated with audits, and auditors must sign appropriate
                confidentiality agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                10. Termination and Data Return/Deletion
              </h2>
              <p className="text-white/80 mb-3">
                Upon termination of your subscription or at your written
                request, DealQuary will:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                <li>
                  At your choice, either return all Personal Data to you in a
                  machine-readable format or securely delete all Personal Data
                </li>
                <li>
                  Delete existing copies of Personal Data unless EU or Member
                  State law requires continued storage
                </li>
                <li>
                  Require Sub-processors to delete or return Personal Data as
                  applicable
                </li>
              </ul>
              <p className="text-white/80 mt-3">
                <strong className="text-white">Timeline:</strong> Data
                return/deletion will occur within 30 days of termination or your
                request, whichever is earlier.
              </p>
              <p className="text-white/80 mt-3">
                To request data return or deletion, contact{" "}
                <a
                  href="mailto:privacy@dealquary.com"
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  privacy@dealquary.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                11. Liability and Indemnification
              </h2>
              <p className="text-white/80">
                Each party&apos;s liability arising out of or related to this
                DPA shall be subject to the limitations of liability set forth in
                our Terms of Service. Nothing in this DPA limits either
                party&apos;s liability for breaches of confidentiality
                obligations, violations of data protection laws, or matters for
                which liability cannot be limited under applicable law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-3">
                12. Order of Precedence
              </h2>
              <p className="text-white/80">
                In the event of any conflict or inconsistency between this DPA
                and our Terms of Service or Privacy Policy, the provisions of
                this DPA shall prevail with respect to data processing matters.
              </p>
            </section>

            <section className="pt-6 border-t border-white/10">
              <h2 className="text-xl font-semibold text-white mb-3">
                Contact Information
              </h2>
              <p className="text-white/80 mb-2">
                For questions about this Data Processing Agreement or to exercise
                rights under this DPA:
              </p>
              <div className="bg-white/5 rounded-lg p-4 text-white/80">
                <p className="mb-2">
                  <strong className="text-white">Data Protection Contact:</strong>
                </p>
                <p className="mb-1">
                  <strong className="text-white">Email:</strong>{" "}
                  <a
                    href="mailto:privacy@dealquary.com"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    privacy@dealquary.com
                  </a>
                </p>
                <p className="mb-1">
                  <strong className="text-white">Legal:</strong>{" "}
                  <a
                    href="mailto:legal@dealquary.com"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    legal@dealquary.com
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
            </section>

            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 mt-6">
              <p className="text-white/90 text-sm">
                <strong className="text-white">Legal Review Recommended:</strong>{" "}
                This DPA is a standard template. If you require customized terms
                for enterprise deployments, please contact{" "}
                <a
                  href="mailto:legal@dealquary.com"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  legal@dealquary.com
                </a>{" "}
                to discuss a custom Data Processing Agreement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
