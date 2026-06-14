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
    <section id="pricing" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Simple pricing
          </h2>
          <p className="text-base md:text-lg text-muted">
            Win one extra job and it pays for a year.
          </p>
        </motion.div>

        <div className="max-w-md mx-auto">
          {/* Monthly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-card border-2 border-primary rounded-2xl p-6 md:p-8"
          >
            <h3 className="text-lg font-bold text-foreground mb-2">
              Pro Monthly
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-extrabold text-foreground">
                $25.99
              </span>
              <span className="text-muted">AUD/month</span>
            </div>
            <p className="text-sm text-primary font-medium mb-6">
              Less than a coffee per day
            </p>

            <ul className="space-y-3 text-sm text-foreground/80 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => startCheckout("monthly")}
              disabled={checkoutLoading !== null}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-background font-semibold transition-all inline-flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
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
          <p className="text-center text-sm text-danger mt-4">{error}</p>
        )}

        <p className="text-center text-sm text-muted mt-8 max-w-xl mx-auto">
          7 days free trial. Then $25.99/month. Cancel anytime. No lock-in. Aussie dollars.
        </p>
      </div>
    </section>
  );
}
