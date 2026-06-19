"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { StatusChip } from "@/components/ui/StatusChip";
import { useQuote } from "@/context/QuoteContext";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function QuotePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { quotes, currentQuote, setCurrentQuote } = useQuote();
  const { settings } = useSettings();

  useEffect(() => {
    if (!currentQuote || currentQuote.id !== id) {
      const found = quotes.find((q) => q.id === id);
      if (found) setCurrentQuote(found);
    }
  }, [id, quotes, currentQuote, setCurrentQuote]);

  if (!currentQuote) {
    return (
      <AppShell title="Quote Preview">
        <div className="p-margin-desktop text-center">Loading quote...</div>
      </AppShell>
    );
  }

  const { businessProfile, brandColors, quoteDefaults } = settings;

  return (
    <AppShell title="Quote Preview" footer={<Footer />}>
      <header className="bg-surface w-full top-0 sticky border-b border-surface-subtle z-30 no-print">
        <div className="flex justify-between items-center h-16 px-8 max-w-container-max-width mx-auto">
          <div className="font-headline-md text-headline-md font-bold text-growth-green">QuoteSnap</div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.print()}
              className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-surface-container-low transition-colors rounded-lg text-on-surface-variant"
            >
              <MaterialIcon name="print" size={20} />
              <span className="font-button-text text-button-text">Download PDF</span>
            </button>
            <div className="h-8 w-px bg-outline-variant mx-2 hidden md:block"></div>
            <span className="font-label-mono text-label-mono bg-surface-container px-3 py-1 rounded-full text-on-surface-variant">
              {currentQuote.quoteNumber}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Quote Document */}
          <div className="lg:col-span-8 bg-surface-container-lowest border border-surface-subtle rounded-xl overflow-hidden quote-sheet bg-white">
            {/* Brand Header */}
            <div className="p-8 md:p-12 border-b border-surface-subtle bg-white">
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div>
                  <h1 className="font-headline-lg text-headline-lg mb-2" style={{ color: brandColors.primary }}>
                    Proposal for Landscape Works
                  </h1>
                  <p className="font-body-md text-on-surface-variant max-w-md">
                    Prepared for {currentQuote.clientName || "the client"}. Professional landscaping works.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-headline-sm text-headline-sm text-on-surface">
                    {businessProfile.businessName}
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    {businessProfile.address.split(",").map((line, i) => (
                      <span key={i}>
                        {line.trim()}
                        <br />
                      </span>
                    ))}
                    ABN: {businessProfile.abn}
                  </div>
                </div>
              </div>
            </div>

            {/* Client & Dates */}
            <div className="px-8 md:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-surface-subtle">
              <div>
                <span className="font-label-mono text-label-mono text-on-surface-variant block mb-1">CLIENT</span>
                <span className="font-body-md font-semibold">{currentQuote.clientName || "—"}</span>
              </div>
              <div>
                <span className="font-label-mono text-label-mono text-on-surface-variant block mb-1">DATE ISSUED</span>
                <span className="font-body-md font-semibold">{formatDate(currentQuote.dateIssued)}</span>
              </div>
              <div>
                <span className="font-label-mono text-label-mono text-on-surface-variant block mb-1">EXPIRY</span>
                <span className="font-body-md font-semibold">{formatDate(currentQuote.expiryDate)}</span>
              </div>
              <div>
                <span className="font-label-mono text-label-mono text-on-surface-variant block mb-1">STATUS</span>
                <StatusChip status={currentQuote.status} />
              </div>
            </div>

            {/* Line Items Table */}
            <div className="px-8 md:px-12 py-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="py-4 font-label-mono text-label-mono text-on-surface-variant">DESCRIPTION</th>
                      <th className="py-4 font-label-mono text-label-mono text-on-surface-variant text-right">QTY</th>
                      <th className="py-4 font-label-mono text-label-mono text-on-surface-variant text-right">
                        UNIT PRICE
                      </th>
                      <th className="py-4 font-label-mono text-label-mono text-on-surface-variant text-right">
                        AMOUNT
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-subtle">
                    {currentQuote.lineItems.map((item) => (
                      <tr key={item.id} className="group hover:bg-surface-container-low transition-colors">
                        <td className="py-6 pr-4">
                          <div className="font-body-md font-semibold text-on-surface">{item.description}</div>
                          <div className="font-body-sm text-on-surface-variant mt-1">
                            {item.category} • {item.unit}
                          </div>
                        </td>
                        <td className="py-6 text-right font-body-md">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-6 text-right font-body-md">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-6 text-right font-body-md font-semibold">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Footer */}
            <div className="px-8 md:px-12 py-12 border-t border-surface-subtle bg-white">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="max-w-sm">
                  <h3 className="font-headline-sm text-headline-sm mb-4">Terms of Service</h3>
                  <ul className="space-y-2 text-on-surface-variant font-body-sm">
                    <li className="flex gap-2">
                      <MaterialIcon name="check_circle" className="text-growth-green" size={18} />
                      {quoteDefaults.paymentTerms}
                    </li>
                    <li className="flex gap-2">
                      <MaterialIcon name="check_circle" className="text-growth-green" size={18} />
                      {quoteDefaults.termsOfService}
                    </li>
                  </ul>
                </div>
                <div className="w-full md:w-64 space-y-3">
                  <div className="flex justify-between font-body-md text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>{formatCurrency(currentQuote.subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-on-surface-variant">
                    <span>GST ({currentQuote.taxRate}%)</span>
                    <span>{formatCurrency(currentQuote.taxAmount)}</span>
                  </div>
                  <div className="h-px bg-outline-variant my-2"></div>
                  <div
                    className="flex justify-between font-headline-md text-headline-md"
                    style={{ color: brandColors.primary }}
                  >
                    <span>Total</span>
                    <span>{formatCurrency(currentQuote.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-4 sticky top-24 space-y-6 no-print" role="complementary">
            <div className="bg-surface-container border border-surface-subtle p-8 rounded-xl">
              <h2 className="font-headline-sm text-headline-sm mb-4">Document Preview</h2>
              <p className="font-body-sm text-on-surface-variant mb-6">
                This is how your client will see the proposal. You can download the PDF or print it for your records.
              </p>
              <button
                onClick={() => window.print()}
                className="w-full h-14 bg-growth-green text-white font-button-text text-button-text rounded-lg hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <MaterialIcon name="print" size={20} />
                Print / Download PDF
              </button>
              <div className="mt-6 pt-6 border-t border-outline-variant flex flex-col gap-3">
                <p className="text-label-mono text-on-surface-variant uppercase tracking-wider">Document Settings</p>
                <div className="flex items-center justify-between py-2">
                  <span className="text-body-sm">Show Images</span>
                  <div className="w-10 h-6 bg-growth-green rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-body-sm">Include Terms</span>
                  <div className="w-10 h-6 bg-growth-green rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push(`/quote/${currentQuote.id}/review`)}
              className="w-full h-12 border border-outline-variant rounded-lg font-button-text hover:bg-surface-container transition-colors"
            >
              Back to Review
            </button>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
