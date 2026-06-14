"use client";

import Link from "next/link";

export default function DataProcessingAgreement() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-20">
        <h1 className="font-serif text-3xl md:text-4xl mb-8">Data Processing Agreement</h1>
        <p className="text-sm text-text-muted mb-8">Last updated: 5 June 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-text-secondary">
          <section>
            <h2 className="font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>This Data Processing Agreement ("DPA") forms part of the QuoteSnap Terms of Service. It describes how QuoteSnap Software ("we", "us", "Processor") processes personal data on behalf of our users ("you", "Controller") when you use our services.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">2. Definitions</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Personal Data:</strong> Any information relating to an identified or identifiable natural person, including client names, site addresses, and contact details you enter into QuoteSnap.</li>
              <li><strong>Processing:</strong> Any operation performed on Personal Data, including collection, storage, use, disclosure, or deletion.</li>
              <li><strong>Subprocessor:</strong> A third party engaged by us to process Personal Data on our behalf.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">3. Role of the Parties</h2>
            <p>You are the Controller of Personal Data you input into QuoteSnap. We act as a Processor, processing Personal Data only on your instructions and for the purpose of providing the quote drafting service.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">4. Our Obligations as Processor</h2>
            <p>We will:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Process Personal Data only for the purpose of providing the QuoteSnap service.</li>
              <li>Not use Personal Data for our own purposes or sell it to third parties.</li>
              <li>Implement appropriate technical and organisational measures to protect Personal Data.</li>
              <li>Not retain Personal Data longer than necessary for service provision.</li>
              <li>Assist you in responding to data subject requests under the Privacy Act 1988.</li>
              <li>Notify you promptly of any suspected data breach affecting your Personal Data.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">5. Subprocessors</h2>
            <p>We use the following Subprocessors to provide our service:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Moonshot AI (Kimi):</strong> Processes voice transcripts and job details to generate quotes. Based in Singapore. See their Terms: <a href="https://platform.kimi.ai/docs/agreement/tos" target="_blank" rel="noopener noreferrer" className="underline text-primary">platform.kimi.ai/docs/agreement/tos</a></li>
              <li><strong>Stripe:</strong> Processes payment information. Based in the United States. See their Privacy Policy: <a href="https://stripe.com/au/privacy" target="_blank" rel="noopener noreferrer" className="underline text-primary">stripe.com/au/privacy</a></li>
            </ul>
            <p className="mt-2">We remain liable for the acts and omissions of our Subprocessors.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">6. Data Transfers</h2>
            <p>Personal Data you submit may be transferred to Singapore (Moonshot AI) and the United States (Stripe) for processing. By using QuoteSnap, you consent to these transfers. We rely on standard contractual clauses and the Subprocessors' own data protection commitments to ensure adequate protection.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">7. Data Retention and Deletion</h2>
            <p>We do not retain voice transcripts or quote content on our servers after processing. Your quote history is stored in your browser's localStorage and persists until you clear it. Usage metadata (IP address, timestamp) is retained for up to 90 days for quota enforcement and security purposes. Account data is deleted upon account closure. If you request deletion of your account data, contact us at <a href="mailto:vtradesof@gmail.com" className="underline text-primary">vtradesof@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">8. Security Measures</h2>
            <p>We implement the following security measures:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>HTTPS/TLS encryption for all data in transit.</li>
              <li>Rate limiting to prevent abuse.</li>
              <li>Input sanitization to prevent injection attacks.</li>
              <li>Hashed passwords (never stored in plain text).</li>
              <li>No central storage of quote content or voice transcripts.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">9. Audit Rights</h2>
            <p className="mt-2">You may request information about our data processing practices by emailing <a href="mailto:vtradesof@gmail.com" className="underline text-primary">vtradesof@gmail.com</a>. We will respond within 30 days.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">10. Changes to This DPA</h2>
            <p>We may update this DPA to reflect changes in our Subprocessors or legal requirements. Changes will be posted here with an updated date. Continued use after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">11. Contact</h2>
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
