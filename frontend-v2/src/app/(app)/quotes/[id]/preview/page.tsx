"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";
import { useQuote } from "@/context/QuoteContext";
import { useSettings } from "@/context/SettingsContext";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function QuotePreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { quotes, currentQuote, setCurrentQuote } = useQuote();
  const { settings } = useSettings();
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (!currentQuote || currentQuote.id !== id) {
      const found = quotes.find((q) => q.id === id);
      if (found) setCurrentQuote(found);
    }
  }, [id, quotes, currentQuote, setCurrentQuote]);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const handleShare = async () => {
    if (!currentQuote) return;
    try {
      await navigator.share({
        title: `Quote ${currentQuote.quoteNumber}`,
        text: `Quote for ${currentQuote.clientName || "client"} — ${formatCurrency(currentQuote.total)}`,
        url: window.location.href,
      });
    } catch {
      // user cancelled or share failed
    }
  };

  if (!currentQuote) {
    const found = quotes.find((q) => q.id === id);
    if (!found) {
      return (
        <AppShell title="Quote Preview">
          <div className="p-margin-desktop max-w-container-max-width mx-auto flex flex-col items-center justify-center min-h-[50vh]">
            <EmptyState
              icon="error"
              title="Quote not found"
              description="The quote you're looking for doesn't exist or has been removed."
              action={{ label: "Back to Dashboard", onClick: () => router.push("/dashboard") }}
            />
          </div>
        </AppShell>
      );
    }
    return (
      <AppShell title="Quote Preview">
        <div className="p-margin-desktop max-w-container-max-width mx-auto flex flex-col items-center justify-center min-h-[50vh]">
          <LoadingShimmer text="Loading quote..." />
        </div>
      </AppShell>
    );
  }

  const { businessProfile, brandColors, quoteDefaults } = settings;

  return (
    <AppShell title="Quote Preview" footer={<Footer />}>
      {/* Top Bar — no-print */}
      <header className="bg-surface w-full top-0 sticky border-b border-surface-subtle z-30 no-print">
        <div className="flex justify-between items-center h-16 px-margin-mobile md:px-8 max-w-container-max-width mx-auto">
          <div className="font-headline-md text-headline-md font-bold text-growth-green">QuoteSnap</div>
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 md:px-4 py-2 hover:bg-surface-container-low transition-colors rounded-lg text-on-surface-variant active:scale-95"
              title="Print / Download PDF"
            >
              <MaterialIcon name="print" size={20} />
              <span className="hidden md:inline font-button-text text-button-text">Download PDF</span>
            </button>
            {canShare && (
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 md:px-4 py-2 hover:bg-surface-container-low transition-colors rounded-lg text-on-surface-variant active:scale-95"
                title="Share quote"
              >
                <MaterialIcon name="share" size={20} />
                <span className="hidden md:inline font-button-text text-button-text">Share</span>
              </button>
            )}
            <div className="h-8 w-px bg-outline-variant mx-1 hidden md:block"></div>
            <span className="font-label-mono text-label-mono bg-surface-container px-3 py-1 rounded-full text-on-surface-variant">
              {currentQuote.quoteNumber}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
          {/* Main Quote Document */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-outline-variant rounded-xl shadow-quote-sheet min-h-full quote-sheet overflow-hidden">
              {/* Brand Header */}
              <div className="p-6 md:p-10 border-b border-surface-subtle bg-white">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1">
                    <h1
                      className="font-headline-lg text-headline-lg mb-2"
                      style={{ color: brandColors.primary }}
                    >
                      Proposal for Landscape Works
                    </h1>
                    <p className="font-body-md text-on-surface-variant max-w-md">
                      Prepared for {currentQuote.clientName || "the client"}. Professional landscaping works.
                    </p>
                  </div>
                  <div className="text-left md:text-right shrink-0">
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
                    <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      {businessProfile.email && <div>{businessProfile.email}</div>}
                      {businessProfile.phone && <div>{businessProfile.phone}</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Client & Dates */}
              <div className="px-6 md:px-10 py-6 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-b border-surface-subtle bg-surface-container-low/30">
                <div>
                  <span className="font-label-mono text-label-mono text-on-surface-variant block mb-1">CLIENT</span>
                  <span className="font-body-md font-semibold">{currentQuote.clientName || "—"}</span>
                  {currentQuote.jobAddress && (
                    <div className="font-body-sm text-on-surface-variant mt-1">{currentQuote.jobAddress}</div>
                  )}
                </div>
                <div>
                  <span className="font-label-mono text-label-mono text-on-surface-variant block mb-1">DATE ISSUED</span>
                  <span className="font-body-md font-semibold">{formatDate(currentQuote.dateIssued)}</span>
                </div>
                <div>
                  <span className="font-label-mono text-label-mono text-on-surface-variant block mb-1">VALID UNTIL</span>
                  <span className="font-body-md font-semibold">{formatDate(currentQuote.expiryDate)}</span>
                </div>
                <div>
                  <span className="font-label-mono text-label-mono text-on-surface-variant block mb-1">STATUS</span>
                  <StatusChip status={currentQuote.status} />
                </div>
              </div>

              {/* Line Items Table */}
              <div className="px-6 md:px-10 py-6 md:py-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant">
                        <th className="py-3 font-label-mono text-label-mono text-on-surface-variant">DESCRIPTION</th>
                        <th className="py-3 font-label-mono text-label-mono text-on-surface-variant text-right">QTY</th>
                        <th className="py-3 font-label-mono text-label-mono text-on-surface-variant text-right">UNIT</th>
                        <th className="py-3 font-label-mono text-label-mono text-on-surface-variant text-right">
                          UNIT PRICE
                        </th>
                        <th className="py-3 font-label-mono text-label-mono text-on-surface-variant text-right">
                          AMOUNT
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-subtle">
                      {currentQuote.lineItems.map((item, index) => (
                        <tr
                          key={item.id}
                          className={
                            index % 2 === 1 ? "bg-surface-container-low/30" : "bg-white"
                          }
                        >
                          <td className="py-4 pr-4">
                            <div className="font-body-md font-semibold text-on-surface">{item.description}</div>
                            <div className="font-body-sm text-on-surface-variant mt-0.5">
                              {item.category}
                            </div>
                          </td>
                          <td className="py-4 text-right font-body-md">
                            {item.quantity}
                          </td>
                          <td className="py-4 text-right font-body-md text-on-surface-variant">
                            {item.unit}
                          </td>
                          <td className="py-4 text-right font-body-md">{formatCurrency(item.unitPrice)}</td>
                          <td className="py-4 text-right font-body-md font-semibold">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals & Terms */}
              <div className="px-6 md:px-10 py-8 md:py-10 border-t border-surface-subtle bg-white">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12">
                  <div className="max-w-sm flex-1">
                    <h3 className="font-headline-sm text-headline-sm mb-4">Terms & Conditions</h3>
                    <div className="space-y-2 text-on-surface-variant font-body-sm">
                      <p>{quoteDefaults.paymentTerms}</p>
                      <p>{quoteDefaults.termsOfService}</p>
                    </div>
                    {currentQuote.notes && (
                      <div className="mt-6">
                        <h4 className="font-label-mono text-label-mono text-on-surface-variant mb-2 uppercase">Notes</h4>
                        <p className="text-on-surface-variant font-body-sm">{currentQuote.notes}</p>
                      </div>
                    )}
                  </div>
                  <div className="w-full md:w-72 shrink-0 space-y-3">
                    <div className="flex justify-between font-body-md text-on-surface-variant">
                      <span>Subtotal</span>
                      <span>{formatCurrency(currentQuote.subtotal)}</span>
                    </div>
                    {currentQuote.discountPercent > 0 && (
                      <div className="flex justify-between font-body-md text-on-surface-variant">
                        <span>Discount ({currentQuote.discountPercent}%)</span>
                        <span className="text-error">-{formatCurrency(currentQuote.discountAmount)}</span>
                      </div>
                    )}
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
          </div>

          {/* Action Sidebar — no-print */}
          <div className="lg:col-span-4 sticky top-24 space-y-6 no-print" role="complementary">
            <div className="bg-surface-container border border-surface-subtle p-6 md:p-8 rounded-xl">
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
              {canShare && (
                <button
                  onClick={handleShare}
                  className="w-full h-12 mt-3 border border-outline-variant text-on-surface rounded-lg font-button-text hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <MaterialIcon name="share" size={18} />
                  Share Quote
                </button>
              )}
              <div className="mt-6 pt-6 border-t border-outline-variant flex flex-col gap-3">
                <p className="text-label-mono text-on-surface-variant uppercase tracking-wider">Document Settings</p>
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
              className="w-full h-12 border border-outline-variant rounded-lg font-button-text hover:bg-surface-container transition-colors active:scale-95"
            >
              Back to Review
            </button>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
