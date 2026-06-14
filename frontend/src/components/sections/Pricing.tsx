"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Zap, Crown } from "lucide-react";
import { useAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8341";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("qs_access_token") || localStorage.getItem("access_token");
}

const proFeatures = [
  "Unlimited AI landscaping quotes",
  "Auto follow-up reminders + templates",
  "Voice memos to draft PDF in 30 seconds",
  "SMS, WhatsApp, Email share",
  "GST calculations",
  "Quote win/loss tracking",
];

const eliteFeatures = [
  "Everything in Pro",
  "Custom pricing model builder",
  "Set your own labour rates per crew type",
  "Material markup rules",
  "Job-type templates (deck, paving, pool, etc.)",
  "AI uses YOUR numbers in every quote",
];

export default function Pricing() {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const currentTier = user?.subscription_tier || "free";
  const isPro = currentTier === "pro";
  const isElite = currentTier === "elite";
  const isPaid = isPro || isElite;

  const startCheckout = useCallback(async (plan: "pro" | "elite") => {
    const token = getToken();
    if (!token) {
      setError("Please log in first to upgrade.");
      window.location.href = "/login?redirect=/pricing";
      return;
    }
    setCheckoutLoading(plan);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
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
      setCheckoutLoading(null);
    }
  }, []);

  return (
    <section id="pricing" className="py-20 md:py-32" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-wider mb-4 block" style={{ color: 'var(--text-muted)' }}>
            Pricing
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--foreground)', lineHeight: 1.1 }}>
            Less than a coffee per day
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative border-2 p-6 md:p-8"
            style={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: 'var(--primary)',
              borderRadius: '0px'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                Pro
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif text-5xl" style={{ color: 'var(--foreground)' }}>
                $25.99
              </span>
              <span style={{ color: 'var(--text-muted)' }}>AUD/month</span>
            </div>
            <p className="text-sm font-medium mb-6" style={{ color: 'var(--primary)' }}>
              For solo landscapers winning more jobs
            </p>

            <ul className="space-y-3 text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => startCheckout("pro")}
              disabled={checkoutLoading !== null || isPro}
              className="w-full h-12 font-mono text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: isPro ? 'var(--surface)' : 'var(--primary)', 
                color: isPro ? 'var(--text-muted)' : 'white',
                border: isPro ? '1px solid var(--border)' : 'none',
                borderRadius: '0px'
              }}
            >
              {checkoutLoading === "pro" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : isPro ? (
                "Current Plan"
              ) : isElite ? (
                "Included in Elite"
              ) : (
                "Get Pro"
              )}
            </button>
          </motion.div>

          {/* Elite Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative border-2 p-6 md:p-8"
            style={{ 
              backgroundColor: 'var(--surface)', 
              borderColor: 'var(--accent)',
              borderRadius: '0px'
            }}
          >
            {isElite && (
              <div className="absolute -top-3 right-4 px-3 py-1 text-xs font-mono uppercase tracking-wider" style={{ backgroundColor: 'var(--primary)', color: 'white' }}>
                Active
              </div>
            )}
            {!isElite && (
              <div className="absolute -top-3 right-4 px-3 py-1 text-xs font-mono uppercase tracking-wider" style={{ backgroundColor: 'var(--accent)', color: 'var(--background)' }}>
                Best Value
              </div>
            )}
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-5 h-5" style={{ color: 'var(--accent)' }} />
              <h3 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
                Elite
              </h3>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif text-5xl" style={{ color: 'var(--foreground)' }}>
                $49.99
              </span>
              <span style={{ color: 'var(--text-muted)' }}>AUD/month</span>
            </div>
            <p className="text-sm font-medium mb-6" style={{ color: 'var(--accent)' }}>
              Your pricing model. Your rules. Every quote.
            </p>

            <ul className="space-y-3 text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              {eliteFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => startCheckout("elite")}
              disabled={checkoutLoading !== null || isElite}
              className="w-full h-12 font-mono text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: isElite ? 'var(--surface)' : 'var(--accent)', 
                color: isElite ? 'var(--text-muted)' : 'var(--background)',
                border: isElite ? '1px solid var(--border)' : 'none',
                borderRadius: '0px'
              }}
            >
              {checkoutLoading === "elite" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : isElite ? (
                "Current Plan"
              ) : isPro ? (
                "Upgrade to Elite"
              ) : (
                "Get Elite"
              )}
            </button>
          </motion.div>
        </div>

        {error && (
          <p className="text-center text-sm mt-6" style={{ color: 'var(--danger)' }}>{error}</p>
        )}

        <p className="text-center text-sm mt-8 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          Cancel anytime — no lock-in contract. 
          You must be 18+ or have guardian consent. <a href="/terms" className="underline">Terms apply</a>.
        </p>
      </div>
    </section>
  );
}
