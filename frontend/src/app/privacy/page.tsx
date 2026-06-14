"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-20">
        <h1 className="font-serif text-3xl md:text-4xl mb-8">Privacy Policy</h1>
        <p className="text-sm text-text-muted mb-8">Last updated: 5 June 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-text-secondary">
          <section>
            <h2 className="font-semibold text-foreground mb-3">1. Who We Are</h2>
            <p>QuoteSnap is operated by QuoteSnap Software, based in Adelaide, South Australia. We provide AI-powered quote drafting software for Australian landscaping businesses.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">2. What We Collect</h2>
            <p className="mb-2">We collect the following information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Voice memos and transcripts:</strong> Audio recordings and text transcriptions you provide to generate quotes.</li>
              <li><strong>Job details:</strong> Client names, site addresses, job specifications, and ABN numbers you enter.</li>
              <li><strong>Quote data:</strong> Generated quotes, line items, pricing, and related business information.</li>
              <li><strong>Account data:</strong> Email, hashed password, subscription status, and usage quota.</li>
              <li><strong>Payment information:</strong> Processed by Stripe — we do not store credit card details.</li>
              <li><strong>Usage data:</strong> Anonymous analytics via Simple Analytics (no cookies, no personal tracking).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To generate professional quotes and invoices using AI (Moonshot API).</li>
              <li>To store your quote history in your browser (localStorage) for your convenience.</li>
              <li>To process subscription payments via Stripe.</li>
              <li>To improve our service through anonymous usage analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">4. AI Processing & Third Parties</h2>
            <p className="mb-2">Voice transcripts and job details are sent to Moonshot AI (Kimi) for quote generation. By using QuoteSnap, you consent to this processing. We do not sell your data to third parties.</p>
            <p className="mb-2"><strong>Important:</strong> Moonshot AI may use content submitted through their API to provide, maintain, develop, and improve their services. This includes potential use for model training. If you require restrictions on the use of your content for training or improving Moonshot AI models, you must contact Moonshot AI directly to discuss enterprise arrangements. See Moonshot's Terms of Service: <a href="https://platform.kimi.ai/docs/agreement/tos" target="_blank" rel="noopener noreferrer" className="underline text-primary">platform.kimi.ai/docs/agreement/tos</a>.</p>
            <p>Moonshot's privacy policy applies to their processing: <a href="https://platform.kimi.ai/docs/agreement/userprivacy" target="_blank" rel="noopener noreferrer" className="underline text-primary">platform.kimi.ai/docs/agreement/userprivacy</a>.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">5. Data Storage & Security</h2>
            <p>Quote data is stored locally in your browser (localStorage) unless you choose to export it. We do not retain voice transcripts or quote content on our servers after processing is complete. However, we do store minimal usage metadata (timestamp, IP address) on our servers for quota enforcement and abuse prevention. We implement rate limiting, input sanitization, and security headers to protect against abuse.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">6. Data Retention</h2>
            <p>We do not retain voice transcripts or quote content on our servers after processing is complete. Your quote history is stored only in your browser's localStorage and persists until you clear it. Usage metadata (IP address, timestamp) is retained for up to 90 days for quota enforcement and security purposes. Account data (email, subscription status) is retained while your account is active and deleted upon account closure.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">7. Your Rights (Australian Privacy Principles)</h2>
            <p className="mb-2">Under the Privacy Act 1988, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your data (clear browser localStorage or contact us).</li>
              <li>Complain about a breach of your privacy.</li>
            </ul>
            <p className="mt-2">To exercise these rights, email <a href="mailto:vtradesof@gmail.com" className="underline text-primary">vtradesof@gmail.com</a>.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">8. Cookies</h2>
            <p>We use minimal cookies. Stripe payment processing requires essential cookies for fraud prevention. Simple Analytics operates without cookies. We do not use tracking cookies for advertising.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">9. Children's Privacy</h2>
            <p>QuoteSnap is intended for business use by adults. If you are under 18, you must have guardian consent to use this service and enter into subscription agreements. We do not knowingly collect personal information from children under 14. If you believe a child under 14 has provided us with personal information, contact us immediately.</p>
          </section>

          <section>
            <h2 className="font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
            <p>We may update this policy. Changes will be posted here with an updated date. Continued use after changes constitutes acceptance.</p>
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
