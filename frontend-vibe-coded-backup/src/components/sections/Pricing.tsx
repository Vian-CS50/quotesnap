"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8341";

const features = [
  "Unlimited AI landscaping quotes",
  "Auto follow-up reminders + templates",
  "Voice memos to PDF in 30 seconds",
  "SMS, WhatsApp, Email share",
  "GST calculations",
  "Quote win/loss tracking",
];

export default function Pricing() {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = useCallback(async (plan: "monthly") => {
    setCheckoutLoading(plan);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      <div className="max-w-7xl mx-auto px-4 md:px-6">
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
            Simple pricing. No surprises.
          </h2>
        </motion.div>

        <div className="max-w-md mx-auto">
          {/* Monthly Plan */}
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
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>
              Pro Monthly
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif text-5xl" style={{ color: 'var(--foreground)' }}>
                $25.99
              </span>
              <span style={{ color: 'var(--text-muted)' }}>AUD/month</span>
            </div>
            <p className="text-sm font-medium mb-6" style={{ color: 'var(--primary)' }}>
              Less than a coffee per day
            </p>

            <ul className="space-y-3 text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--primary)' }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => startCheckout("monthly")}
              disabled={checkoutLoading !== null}
              className="w-full h-12 font-mono text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'white',
                borderRadius: '0px'
              }}
            >
              {checkoutLoading === "monthly" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Start Free Trial — $25.99/mo"
              )}
            </button>
          </motion.div>
        </div>

        {error && (
          <p className="text-center text-sm mt-4" style={{ color: 'var(--danger)' }}>{error}</p>
        )}

        <p className="text-center text-sm mt-8 max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
          7 days free trial. Then $25.99/month. Cancel anytime. No lock-in. Aussie dollars.
        </p>
      </div>
    </section>
  );
}
