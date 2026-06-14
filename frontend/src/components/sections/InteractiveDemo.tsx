"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Wand2 } from "lucide-react";
import VoiceInput from "@/components/demo/VoiceInput";
import JobForm from "@/components/demo/JobForm";
import QuoteDisplay from "@/components/demo/QuoteDisplay";
import QuoteHistory from "@/components/demo/QuoteHistory";
import Paywall from "@/components/demo/Paywall";
import ProgressIndicator from "@/components/ProgressIndicator";
import MaterialCalculator from "@/components/MaterialCalculator";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth";
import {
  API_URL,
  FREE_QUOTA,
  HISTORY_KEY,
  DEFAULT_JOB_DETAILS,
  type JobDetails,
  type QuoteData,
  type QuoteHistoryItem,
} from "@/components/demo/types";

function loadHistory(): QuoteHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(items: QuoteHistoryItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("qs_access_token");
}

export default function InteractiveDemo() {
  const { user, refreshUser } = useAuth();
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [history, setHistory] = useState<QuoteHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [jobDetails, setJobDetails] = useState<JobDetails>(DEFAULT_JOB_DETAILS);

  // Sync usage count from server when user changes
  useEffect(() => {
    setHistory(loadHistory());
    if (user) {
      setUsageCount(user.quotes_used);
    } else {
      setUsageCount(0);
    }
  }, [user]);

  const generateQuote = useCallback(async () => {
    const cleanTranscript = transcript.trim();
    if (!cleanTranscript || cleanTranscript.length < 10) {
      setError("Please describe the job first. Tap the mic and talk for 30 seconds.");
      return;
    }

    // Server will enforce quota, but check early for better UX
    if (user && !user.is_subscribed && user.quotes_remaining <= 0) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError(null);
    setQuote(null);

    try {
      const display = (val: string, other: string) =>
        val === "Other" && other ? `Other — ${other}` : val;

      const payload = {
        transcript: cleanTranscript,
        job_details: {
          job_type: display(jobDetails.job_type, jobDetails.job_type_other),
          dimensions: jobDetails.dimensions,
          client_name: jobDetails.client_name,
          site_address: jobDetails.site_address,
          abn: jobDetails.abn,
          materials: display(jobDetails.materials, jobDetails.materials_other),
          site_condition: display(jobDetails.site_condition, jobDetails.site_condition_other),
          equipment_access: display(jobDetails.equipment_access, jobDetails.equipment_access_other),
          access_notes: display(jobDetails.access_notes, jobDetails.access_notes_other),
          services_to_avoid: display(jobDetails.services_to_avoid, jobDetails.services_to_avoid_other),
          slope: jobDetails.slope,
          council_da: jobDetails.council_da,
          budget_range: display(jobDetails.budget_range, jobDetails.budget_range_other),
          timeline: display(jobDetails.timeline, jobDetails.timeline_other),
        },
      };

      const token = getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/generate-quote`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setError("Please sign in to draft quotes.");
        setLoading(false);
        return;
      }

      if (res.status === 403) {
        const data = await res.json().catch(() => ({}));
        if (data.detail === "QUOTA_EXCEEDED") {
          setShowPaywall(true);
          setLoading(false);
          return;
        }
        throw new Error(data.detail || "Quota exceeded");
      }

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      const data: QuoteData = await res.json();

      setQuote(data);

      const newItem: QuoteHistoryItem = {
        id: Date.now().toString(),
        quote_number: data.quote_data.quote_number,
        client_name: data.quote_data.client_name || "TBA",
        date: data.quote_data.date,
        total: data.quote_data.total,
        quote_html: data.quote_html,
        quote_data: data.quote_data,
        transcript: data.transcript,
        follow_up: false,
        won: false,
        lost: false,
      };
      const updated = [newItem, ...history];
      setHistory(updated);
      saveHistory(updated);

      // Refresh user from server to get updated quota
      await refreshUser();
    } catch (err: any) {
      setError(err.message || "Failed to draft quote.");
    } finally {
      setLoading(false);
    }
  }, [transcript, jobDetails, history, user, refreshUser]);

  const startCheckout = useCallback(async () => {
    setCheckoutLoading(true);
    setError(null);
    try {
      const token = getToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: "POST",
        headers,
        body: JSON.stringify({ plan: "monthly" }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      setError(err.message || "Checkout failed. Please try again.");
      setCheckoutLoading(false);
    }
  }, []);

  const loadQuoteFromHistory = useCallback((item: QuoteHistoryItem) => {
    setQuote({
      transcript: item.transcript,
      quote_html: item.quote_html,
      quote_data: item.quote_data,
    });
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      saveHistory(updated);
      return updated;
    });
  }, []);

  const toggleFollowUp = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, follow_up: !item.follow_up } : item
      );
      saveHistory(updated);
      return updated;
    });
  }, []);

  const markWon = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, won: true, follow_up: false, lost: false } : item
      );
      saveHistory(updated);
      return updated;
    });
  }, []);

  const markLost = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, won: false, follow_up: false, lost: true } : item
      );
      saveHistory(updated);
      return updated;
    });
  }, []);

  return (
    <section id="demo" className="py-20 md:py-32" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-wider mb-4 block" style={{ color: "var(--text-muted)" }}>
            Try It
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--foreground)', lineHeight: 1.1 }}>
            Draft a quote in 30 seconds.
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Tap the mic, describe the job, and let AI build the first draft. You review and send.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="border-2 p-6 md:p-8 space-y-6"
          style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderRadius: "0px" }}
        >
          {/* Progress */}
          {loading && <ProgressIndicator />}

          {/* Voice Input */}
          <VoiceInput
            transcript={transcript}
            onTranscriptChange={setTranscript}
            isListening={isListening}
            onListeningChange={setIsListening}
            error={error}
            onError={setError}
          />

          {/* Job Form Toggle */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-mono uppercase tracking-wider transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            {showForm ? "Hide job details" : "Add job details (optional)"}
          </button>

          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <JobForm jobDetails={jobDetails} onChange={setJobDetails} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Material Calculator */}
          <MaterialCalculator />

          {/* Generate Button */}
          <AuthGuard>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={generateQuote}
              disabled={loading}
              className="w-full h-14 font-mono text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--primary)",
                color: "white",
                borderRadius: "0px",
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Drafting quote...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  {user && !user.is_subscribed && user.quotes_remaining <= 0
                    ? "Upgrade to generate more"
                    : "Draft Quote"}
                </>
              )}
            </motion.button>
          </AuthGuard>

          {/* Server-side quota indicator for logged-in users */}
          {user && !user.is_subscribed && (
            <p className="text-center text-xs font-mono" style={{ color: "var(--text-muted)" }}>
              {user.quotes_remaining} of {FREE_QUOTA} free quotes remaining
            </p>
          )}

          {/* Quote Display */}
          <AnimatePresence>
            {quote && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <QuoteDisplay
                  quote={quote}
                  onQuoteUpdate={setQuote}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Quote History Sidebar */}
      <QuoteHistory
        history={history}
        onLoad={loadQuoteFromHistory}
        onDelete={deleteHistoryItem}
        onToggleFollowUp={toggleFollowUp}
        onMarkWon={markWon}
        onMarkLost={markLost}
        isOpen={showHistory}
        onToggle={() => setShowHistory(!showHistory)}
      />

      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <Paywall
            onClose={() => setShowPaywall(false)}
            onCheckout={startCheckout}
            checkoutLoading={checkoutLoading}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
