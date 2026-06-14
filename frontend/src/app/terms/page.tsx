"use client";

import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-20">
        <h1 className="font-serif text-3xl md:text-4xl mb-8">Terms of Service</h1>
        <p className="text-sm text-text-muted mb-8">Last updated: 5 June 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-text-secondary">
          <section>
            <h2 className="font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using QuoteSnap, you agree to these Terms of Service. If you do not agree, do not use the service. You must be at least 18 years old, or have consent from a parent or guardian, to subscribe to QuoteSnap.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">2. What QuoteSnap Is</h2>
            <p>QuoteSnap is a software tool that helps Australian landscaping businesses draft quotes from voice memos. We are not a licensed estimator, accountant, or professional advisor. We do not have a professional-client relationship with you.</p>
            <p className="mt-2">The service generates draft quotes only. You are responsible for reviewing, editing, and approving every quote before it is sent to your client. QuoteSnap does not send quotes to your clients — you do.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">3. Subscription & Billing</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>QuoteSnap offers a 7-day free trial for new users.</li>
              <li>After the trial, subscription fees are billed monthly in AUD.</li>
              <li>Current pricing: Pro $25.99 AUD/month, Elite $49.99 AUD/month.</li>
              <li>You may cancel anytime. No refunds for partial months.</li>
              <li>Price changes will be notified 14 days in advance.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">4. User Responsibilities</h2>
            <p>By using QuoteSnap, you confirm that:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You are a qualified tradesperson or business owner, or authorised to act on their behalf.</li>
              <li>You will review every AI-generated draft for accuracy before sending it to a client.</li>
              <li>You understand that AI can make errors in pricing, quantities, materials, scope, and calculations.</li>
              <li>You will not rely on QuoteSnap output as the final, binding version of any quote.</li>
              <li>You must obtain client consent before sending follow-up messages.</li>
              <li>You must not use QuoteSnap for illegal activities or to generate fraudulent quotes.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>You will not submit personal information of children under 14 to the service.</li>
              <li>You will not use the service to process protected health information (HIPAA).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">5. Data & Privacy</h2>
            <p>Quote data is stored locally in your browser. Voice transcripts are processed by Moonshot AI. See our <Link href="/privacy" className="underline text-primary">Privacy Policy</Link> for details on data handling, including Moonshot's potential use of content for model training.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">6. Intellectual Property</h2>
            <p>QuoteSnap and its code, design, and branding are owned by QuoteSnap Software. You retain ownership of your quote content. We do not claim rights over quotes you generate for your clients.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">7. No Warranty</h2>
            <p>QuoteSnap is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or suitable for your specific business needs. AI-generated drafts may contain errors and must be verified by you.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by Australian law, QuoteSnap is not liable for:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Errors or inaccuracies in AI-generated drafts.</li>
              <li>Financial losses, lost profits, or missed opportunities resulting from draft errors.</li>
              <li>Disputes between you and your clients.</li>
              <li>Service interruptions, data loss, or security incidents beyond our reasonable control.</li>
            </ul>
            <p className="mt-2">Where liability cannot be excluded by law, our total liability to you is limited to the amount you paid us in the 12 months preceding the claim (or AUD $312, whichever is lower). This cap does not apply to claims arising from our gross negligence, willful misconduct, or breaches of the Australian Consumer Law that cannot be excluded. We are not liable for indirect, consequential, or punitive damages.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">9. Indemnity</h2>
            <p>You agree to indemnify and hold harmless QuoteSnap Software, its operators, and affiliates from any claim, loss, or damage arising from:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your use of AI-generated drafts, including any quote sent to a client.</li>
              <li>Any dispute between you and your client.</li>
              <li>Your breach of these terms or any applicable law.</li>
              <li>Your content (voice transcripts, job details) infringing the rights of any third party.</li>
              <li>Your use of the Services in violation of Moonshot AI's Terms of Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">10. Third-Party Services</h2>
            <p>QuoteSnap uses Moonshot AI (Kimi) for quote generation and Stripe for payment processing. Your use of these services is subject to their respective terms:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Moonshot AI Terms of Service: <a href="https://platform.kimi.ai/docs/agreement/tos" target="_blank" rel="noopener noreferrer" className="underline text-primary">platform.kimi.ai/docs/agreement/tos</a></li>
              <li>Moonshot AI Privacy Policy: <a href="https://platform.kimi.ai/docs/agreement/userprivacy" target="_blank" rel="noopener noreferrer" className="underline text-primary">platform.kimi.ai/docs/agreement/userprivacy</a></li>
              <li>Stripe Services Agreement: <a href="https://stripe.com/au/legal" target="_blank" rel="noopener noreferrer" className="underline text-primary">stripe.com/au/legal</a></li>
            </ul>
            <p className="mt-2">Moonshot AI's Terms govern the processing of your voice transcripts and job details. Moonshot AI is a Singapore-based company. Disputes with Moonshot AI are subject to Singapore law and SIAC arbitration.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">11. Termination</h2>
            <p>We may suspend or terminate your account for violations of these terms. You may cancel your subscription at any time via Stripe or by contacting support.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">12. Governing Law</h2>
            <p>These terms are governed by the laws of South Australia, Australia. Any disputes will be resolved in the courts of South Australia.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">13. Changes to Terms</h2>
            <p>We may update these terms. Changes will be posted here with an updated date. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">14. Contact</h2>
            <p>Email: <a href="mailto:vtradesof@gmail.com" className="underline text-primary">vtradesof@gmail.com</a></p>
            {/* TODO: Change to support@quotesnap.com.au once domain is purchased */}
            <p>Location: Adelaide, South Australia</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/" className="text-sm text-primary underline">← Back to home</Link>
        </div>
      </div>
    </main>
  );
}
