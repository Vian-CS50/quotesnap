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
import { useQuote } from "@/context/QuoteContext";
import { createQuote } from "@/lib/api";

export default function ReviewQuotePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { quotes, currentQuote, setCurrentQuote, addLineItem, saveCurrentQuote } = useQuote();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (!currentQuote || currentQuote.id !== id) {
      const found = quotes.find((q) => q.id === id);
      if (found) setCurrentQuote(found);
    }
  }, [id, quotes, currentQuote, setCurrentQuote]);

  const canFinalize = useMemo(() => {
    if (!currentQuote) return false;
    return currentQuote.lineItems.every((i) => i.quantity && i.quantity > 0);
  }, [currentQuote]);

  const handleSaveDraft = () => {
    saveCurrentQuote();
    router.push("/dashboard");
  };

  const handleSyncCrm = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("Quote synchronized to CRM (demo).");
    }, 1800);
  };

  const handleFinalize = async () => {
    if (!currentQuote) return;
    saveCurrentQuote();
    await createQuote(currentQuote);
    router.push(`/quotes/${currentQuote.id}/preview`);
  };

  if (!currentQuote) {
    return (
      <AppShell title="Review Quote">
        <div className="p-margin-desktop text-center">Loading quote...</div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Review Quote" footer={<Footer />}>
      {/* Top Toolbar */}
      <div className="bg-surface-bright px-8 py-6 border-b border-outline-variant sticky top-16 z-30">
        <div className="max-w-container-max-width mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <nav className="flex items-center gap-2 text-on-surface-variant mb-2">
              <span className="text-xs font-label-mono uppercase tracking-widest">Quotes</span>
              <MaterialIcon name="chevron_right" size={16} />
              <span className="text-xs font-label-mono uppercase tracking-widest text-growth-green">AI Draft Review</span>
            </nav>
            <h1 className="font-headline-lg text-headline-lg">Review & Finalize Quote</h1>
          </div>
          <ProgressIndicator currentStep={2} />
        </div>
      </div>

      <div className="p-margin-desktop bg-surface-container-lowest flex-grow">
        <div className="max-w-container-max-width mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <section className="bg-surface p-6 border border-surface-subtle rounded-xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline-sm text-headline-sm flex items-center gap-2">
                  <MaterialIcon name="graphic_eq" className="text-growth-green" />
                  Voice Memo Source
                </h3>
                <span className="bg-primary-container text-on-primary-container text-[10px] font-label-mono px-2 py-1 rounded">
                  PROCESSED
                </span>
              </div>
              <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 italic text-on-surface-variant leading-relaxed font-body-sm">
                &quot;...we&apos;re looking at a 20x15 paver patio in the backyard. Need about 400 square feet of Bristol
                Stone, steel blue. Also, let&apos;s add 4 cubic yards of mulch for the flower beds and maybe 2 hours of
                brush clearing...&quot;
              </div>
              <div className="flex items-center gap-4 mt-2">
                <button className="flex-1 h-10 bg-slate-deep text-white rounded-lg font-button-text flex items-center justify-center gap-2 hover:bg-black transition-colors">
                  <MaterialIcon name="play_arrow" size={18} filled />
                  Play Audio
                </button>
                <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors">
                  <MaterialIcon name="download" size={20} />
                </button>
              </div>
            </section>

            <ProfitabilityCard quote={currentQuote} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8">
            <section className="bg-surface border border-surface-subtle rounded-xl flex flex-col overflow-hidden">
              <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-headline-md text-headline-md">Quote Line Items</h3>
                  <p className="text-on-surface-variant font-body-sm">Review and adjust the quantities extracted by AI.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => addLineItem()}
                    className="h-10 px-4 border border-outline-variant rounded-lg font-button-text flex items-center gap-2 hover:bg-surface-container-high transition-colors"
                  >
                    <MaterialIcon name="add" size={18} />
                    Add Item
                  </button>
                  <button className="h-10 px-4 bg-growth-green text-white rounded-lg font-button-text flex items-center gap-2 hover:bg-black transition-colors">
                    <MaterialIcon name="auto_awesome" size={18} />
                    Re-Sync AI
                  </button>
                </div>
              </div>

              <LineItemTable quote={currentQuote} />
              <QuoteSummary quote={currentQuote} />
            </section>

            {/* CTA Actions */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-end gap-4">
              <button
                onClick={handleSaveDraft}
                className="w-full md:w-auto h-12 px-8 border border-slate-deep text-slate-deep rounded-lg font-button-text hover:bg-surface-container-high transition-all"
              >
                Save as Draft
              </button>
              <button
                onClick={handleSyncCrm}
                disabled={isSyncing}
                className="w-full md:w-auto h-12 px-8 bg-slate-deep text-white rounded-lg font-button-text flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-70"
              >
                {isSyncing ? (
                  <>
                    <MaterialIcon name="progress_activity" className="animate-spin" size={20} />
                    Syncing...
                  </>
                ) : (
                  <>
                    <MaterialIcon name="cloud_upload" size={20} />
                    Save & Sync to CRM
                  </>
                )}
              </button>
              <button
                onClick={handleFinalize}
                disabled={!canFinalize}
                className="w-full md:w-auto h-12 px-10 bg-growth-green text-white rounded-lg font-button-text flex items-center justify-center gap-2 hover:opacity-90 shadow-md transition-all disabled:opacity-50"
              >
                Finalize & Send Quote
                <MaterialIcon name="send" size={20} />
              </button>
            </div>
            {!canFinalize && (
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
