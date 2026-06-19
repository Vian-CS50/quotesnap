"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { VoiceRecorder } from "@/components/quote/VoiceRecorder";
import { DraftingPreview } from "@/components/quote/DraftingPreview";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { transcribeAudio } from "@/lib/api";
import { useQuote } from "@/context/QuoteContext";
import { LineItem } from "@/types";
import { generateId } from "@/lib/utils";

export default function NewQuotePage() {
  const router = useRouter();
  const { currentQuote, createDraft, updateQuote, saveCurrentQuote } = useQuote();
  const [isProcessing, setIsProcessing] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [typedTranscript, setTypedTranscript] = useState("");

  useEffect(() => {
    if (!currentQuote) createDraft();
  }, [currentQuote, createDraft]);

  const handleTranscript = useCallback(
    async (transcript: string) => {
      if (!currentQuote) return;
      setIsProcessing(true);
      try {
        const result = await transcribeAudio(transcript);
        setDemoMode(result.demoMode ?? false);

        const mapped: LineItem[] = result.lineItems.map((item) => ({
          ...item,
          id: generateId("li"),
        }));

        updateQuote({
          lineItems: [...currentQuote.lineItems, ...mapped],
        });
      } catch (err) {
        console.error(err);
        alert("Failed to transcribe audio. Please try again or enter details manually.");
      } finally {
        setIsProcessing(false);
      }
    },
    [currentQuote, updateQuote]
  );

  const handleSaveDraft = () => {
    saveCurrentQuote();
    router.push("/dashboard");
  };

  const handleReview = () => {
    saveCurrentQuote();
    router.push(`/quote/${currentQuote?.id}/review`);
  };

  const materials = currentQuote?.lineItems.filter((i) => i.category === "MATERIAL") || [];
  const labor = currentQuote?.lineItems.filter((i) => i.category === "LABOR") || [];
  const total = currentQuote?.subtotal || 0;

  return (
    <AppShell
      title="New Quote"
      footer={<Footer />}
    >
      {/* Simplified Top AppBar for this flow */}
      <header className="w-full sticky top-16 bg-surface border-b border-surface-subtle z-30">
        <div className="flex justify-between items-center h-16 px-8 max-w-container-max-width mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-surface-container-low transition-colors rounded-full active:scale-95"
            >
              <MaterialIcon name="close" size={24} />
            </button>
            <span className="font-headline-md text-headline-md font-bold text-growth-green">QuoteSnap Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant hidden md:block">
              Drafting Mode
            </span>
            <button
              onClick={handleSaveDraft}
              className="bg-growth-green text-on-primary font-button-text text-button-text px-6 py-2 rounded transition-all hover:opacity-90 active:scale-95"
            >
              Save Draft
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col max-w-4xl mx-auto w-full px-margin-mobile md:px-0 py-12">
        <VoiceRecorder onTranscriptReady={handleTranscript} isProcessing={isProcessing} />

        {/* Type it out option */}
        <section className="w-full mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-surface-subtle"></div>
            <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">Or type it out</span>
            <div className="h-px flex-1 bg-surface-subtle"></div>
          </div>
          <div className="bg-white border border-surface-subtle rounded-lg p-6 space-y-4">
            <label className="font-body-sm font-bold text-on-surface-variant block">
              Describe the job scope, materials, and labour
            </label>
            <textarea
              value={typedTranscript}
              onChange={(e) => setTypedTranscript(e.target.value)}
              placeholder="e.g. 20x15 paver patio in the backyard. Need 400 sq ft of Bristol Stone steel blue, 4 cubic yards of mulch, and 2 hours of brush clearing."
              rows={4}
              className="w-full bg-surface-base border border-outline-variant rounded-lg p-4 text-body-md focus:border-growth-green focus:ring-1 focus:ring-growth-green resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!typedTranscript.trim()) return;
                  handleTranscript(typedTranscript);
                  setTypedTranscript("");
                }}
                disabled={!typedTranscript.trim() || isProcessing}
                className="bg-growth-green text-white font-button-text text-button-text px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
              >
                <MaterialIcon name="auto_awesome" size={18} />
                Draft from Text
              </button>
            </div>
          </div>
        </section>

        <DraftingPreview
          materials={materials}
          labor={labor}
          total={total}
          isProcessing={isProcessing}
        />

        {demoMode && (
          <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-secondary-fixed/30 border border-secondary rounded-lg text-on-secondary-container text-body-sm">
            <MaterialIcon name="info" size={18} />
            Demo mode: AI service unavailable, using keyword-matched template.
          </div>
        )}

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleReview}
            disabled={!currentQuote || currentQuote.lineItems.length === 0}
            className="bg-slate-deep text-white font-button-text text-button-text h-12 px-10 rounded-lg flex items-center justify-center gap-2 hover:bg-black transition-all disabled:opacity-50"
          >
            Review & Finalize
            <MaterialIcon name="arrow_forward" size={20} />
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-on-surface-variant bg-surface-container-low px-4 py-2 rounded-full border border-surface-subtle">
            <MaterialIcon name="info" size={16} />
            <span className="font-body-sm">&quot;Add 500sqft of mulch and 4 hours of grading...&quot;</span>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
