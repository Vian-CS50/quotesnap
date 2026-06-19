"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { ProgressIndicator } from "@/components/quote/ProgressIndicator";
import { ProfitabilityCard } from "@/components/quote/ProfitabilityCard";
import { LineItemTable } from "@/components/quote/LineItemTable";
import { QuoteSummary } from "@/components/quote/QuoteSummary";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";
import { useQuote } from "@/context/QuoteContext";
import { createQuote } from "@/lib/api";

export default function ReviewQuotePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    quotes,
    currentQuote,
    setCurrentQuote,
    updateQuote,
    saveCurrentQuote,
  } = useQuote();
  const [isSending, setIsSending] = useState(false);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [templateMessage, setTemplateMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentQuote || currentQuote.id !== id) {
      const found = quotes.find((q) => q.id === id);
      if (found) setCurrentQuote(found);
    }
  }, [id, quotes, currentQuote, setCurrentQuote]);

  useEffect(() => {
    if (currentQuote) {
      setDiscountInput(currentQuote.discountPercent.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuote?.discountPercent]);

  useEffect(() => {
    if (templateMessage) {
      const timer = setTimeout(() => setTemplateMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [templateMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const canFinalize = useMemo(() => {
    if (!currentQuote) return false;
    return currentQuote.lineItems.length > 0 && currentQuote.lineItems.every((i) => i.quantity && i.quantity > 0);
  }, [currentQuote]);

  const handleSaveDraft = () => {
    saveCurrentQuote();
    router.push("/dashboard");
  };

  const handleDiscountChange = (value: string) => {
    setDiscountInput(value);
    const num = value === "" ? 0 : Number(value);
    if (!isNaN(num) && num >= 0 && num <= 100) {
      updateQuote({ discountPercent: num });
    }
  };

  const handleDownloadPdf = () => {
    if (!currentQuote) return;
    router.push(`/quotes/${currentQuote.id}/preview`);
  };

  const handleSaveTemplate = () => {
    setIsSavingTemplate(true);
    setTimeout(() => {
      setIsSavingTemplate(false);
      setTemplateMessage("Quote saved as template.");
    }, 1200);
  };

  const handleSendQuote = async () => {
    if (!currentQuote || !canFinalize) return;
    setIsSending(true);
    saveCurrentQuote();
    try {
      await createQuote({ ...currentQuote, status: "Sent" });
    } catch {
      setError("Failed to send quote. Please try again.");
    }
    setIsSending(false);
    setShowSuccess(true);
  };

  const handleSuccessSend = () => {
    if (!currentQuote) return;
    saveCurrentQuote();
    setShowSuccess(false);
    router.push("/dashboard");
  };

  const handleSuccessViewPdf = () => {
    if (!currentQuote) return;
    setShowSuccess(false);
    router.push(`/quotes/${currentQuote.id}/preview`);
  };

  if (!currentQuote) {
    const found = quotes.find((q) => q.id === id);
    if (!found) {
      return (
        <AppShell title="Review Quote">
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
      <AppShell title="Review Quote">
        <div className="p-margin-desktop max-w-container-max-width mx-auto flex flex-col items-center justify-center min-h-[50vh]">
          <LoadingShimmer text="Loading quote..." />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Review Quote" footer={<Footer />}>
      {/* Inline Messages */}
      {templateMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] bg-primary-container text-on-primary-container px-6 py-3 rounded-lg shadow-lg font-body-sm flex items-center gap-2 animate-slide-in">
          <MaterialIcon name="check_circle" size={20} />
          {templateMessage}
        </div>
      )}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[70] bg-error-container text-on-error-container px-6 py-3 rounded-lg shadow-lg font-body-sm flex items-center gap-2 animate-error-shake">
          <MaterialIcon name="error" size={20} />
          {error}
        </div>
      )}

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-surface-subtle rounded-xl shadow-2xl p-8 md:p-12 max-w-sm w-full text-center animate-slide-in">
            <div className="w-16 h-16 bg-growth-green rounded-full flex items-center justify-center mx-auto mb-6">
              <MaterialIcon name="check" size={32} className="text-white" />
            </div>
            <h2 className="font-headline-lg text-headline-lg mb-2">Quote Finalized</h2>
            <p className="text-on-surface-variant font-body-sm mb-8">
              Your quote has been saved and is ready to send to the client.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSuccessSend}
                className="w-full h-12 bg-growth-green text-white rounded-lg font-button-text flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
              >
                <MaterialIcon name="send" size={18} />
                Send to Client
              </button>
              <button
                onClick={handleSuccessViewPdf}
                className="w-full h-12 border border-outline-variant text-on-surface rounded-lg font-button-text flex items-center justify-center gap-2 hover:bg-surface-container-low active:scale-95 transition-all"
              >
                <MaterialIcon name="visibility" size={18} />
                View PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Toolbar */}
      <div className="bg-surface-bright px-margin-mobile md:px-8 py-6 border-b border-outline-variant sticky top-16 z-30">
        <div className="max-w-container-max-width mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
              <span className="text-xs font-label-mono uppercase tracking-widest">Quotes</span>
              <MaterialIcon name="chevron_right" size={16} />
              <span className="text-xs font-label-mono uppercase tracking-widest text-growth-green">AI Draft Review</span>
            </nav>
            <h1 className="font-headline-lg text-headline-lg">Review & Finalize Quote</h1>
          </div>
          <div className="flex items-center gap-4">
            <ProgressIndicator currentStep={2} />
            <button
              onClick={handleSaveDraft}
              className="hidden md:flex items-center gap-2 h-10 px-4 border border-outline-variant rounded-lg font-button-text text-on-surface-variant hover:bg-surface-container-low active:scale-95 transition-all"
            >
              <MaterialIcon name="save" size={18} />
              Save Draft
            </button>
          </div>
        </div>
      </div>

      <div className="px-margin-mobile md:px-margin-desktop py-8 bg-surface-container-lowest flex-grow">
        <div className="max-w-container-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <ProfitabilityCard quote={currentQuote} />

            {/* Summary Panel */}
            <div className="bg-surface border border-surface-subtle rounded-xl p-6">
              <h3 className="font-headline-sm text-headline-sm mb-4 flex items-center gap-2">
                <MaterialIcon name="receipt" className="text-growth-green" size={20} />
                Quote Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between font-body-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatCurrency(currentQuote.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center font-body-sm text-on-surface-variant">
                  <span>Discount (%)</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discountInput}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    className="w-16 h-8 bg-surface-bright border border-outline-variant rounded text-right font-body-sm px-2 focus:border-growth-green focus:ring-0"
                  />
                </div>
                {currentQuote.discountPercent > 0 && (
                  <div className="flex justify-between font-body-sm text-error">
                    <span>Discount Amount</span>
                    <span>-{formatCurrency(currentQuote.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-body-sm text-on-surface-variant">
                  <span>Tax ({currentQuote.taxRate}%)</span>
                  <span>{formatCurrency(currentQuote.taxAmount)}</span>
                </div>
                <div className="flex justify-between font-headline-sm font-bold pt-3 border-t border-outline-variant">
                  <span>Total</span>
                  <span className="text-growth-green">{formatCurrency(currentQuote.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8">
            <section className="bg-surface border border-surface-subtle rounded-xl flex flex-col overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-headline-md text-headline-md">Quote Line Items</h3>
                  <p className="text-on-surface-variant font-body-sm">Review and adjust the quantities extracted by AI.</p>
                </div>
              </div>

              <LineItemTable quote={currentQuote} />
              <QuoteSummary quote={currentQuote} />
            </section>

            {/* CTA Actions */}
            <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-end gap-4">
              <button
                onClick={handleSaveTemplate}
                disabled={isSavingTemplate}
                className="w-full md:w-auto h-12 px-8 border border-outline-variant text-on-surface-variant rounded-lg font-button-text hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSavingTemplate ? (
                  <>
                    <MaterialIcon name="progress_activity" className="animate-spin" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    <MaterialIcon name="bookmark_border" size={18} />
                    Save as Template
                  </>
                )}
              </button>
              <button
                onClick={handleDownloadPdf}
                className="w-full md:w-auto h-12 px-8 border border-growth-green text-growth-green rounded-lg font-button-text hover:bg-growth-green hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <MaterialIcon name="download" size={18} />
                Download PDF
              </button>
              <button
                onClick={handleSendQuote}
                disabled={!canFinalize || isSending}
                className="w-full md:w-auto h-12 px-10 bg-growth-green text-white rounded-lg font-button-text flex items-center justify-center gap-2 hover:opacity-90 shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <MaterialIcon name="progress_activity" className="animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Quote
                    <MaterialIcon name="send" size={20} />
                  </>
                )}
              </button>
            </div>
            {!canFinalize && currentQuote.lineItems.length > 0 && (
              <p className="text-right text-error text-body-sm mt-2">
                Please fix missing quantities before finalizing.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
