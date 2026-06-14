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
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs font-medium mb-3" style={{ color: "#62666d", fontWeight: 510, letterSpacing: "-0.13px" }}>
            Pricing
          </p>
          <h2
            className="text-3xl md:text-4xl font-medium tracking-tight"
            style={{ color: "#f7f8f8", lineHeight: 1.1, letterSpacing: "-0.704px", fontWeight: 510 }}
          >
            Simple pricing
          </h2>
          <p className="text-base mt-3" style={{ color: "#8a8f98", lineHeight: 1.6 }}>
            Win one extra job and it pays for a year.
          </p>
        </motion.div>

        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-lg p-6 md:p-8"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 className="text-sm font-medium mb-2" style={{ color: "#f7f8f8", fontWeight: 510 }}>
              Pro Monthly
            </h3>
            <div className="flex items-baseline gap-2 mb-1">
              <span
                className="text-5xl font-medium"
                style={{ color: "#f7f8f8", fontWeight: 510, letterSpacing: "-1.056px", lineHeight: 1 }}
              >
                $25.99
              </span>
              <span className="text-sm" style={{ color: "#8a8f98" }}>AUD/month</span>
            </div>
            <p className="text-xs mb-8" style={{ color: "#62666d", fontWeight: 510 }}>
              Less than a coffee per day
            </p>

            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm" style={{ color: "#d0d6e0" }}>
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#5e6ad2" }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => startCheckout("monthly")}
              disabled={checkoutLoading !== null}
              className="w-full h-11 rounded-md font-medium text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              style={{
                background: "#5e6ad2",
                color: "#ffffff",
                fontWeight: 510,
              }}
            >
              {checkoutLoading === "monthly" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Start Free Trial"
              )}
            </button>
          </motion.div>
        </div>

        {error && (
          <p className="text-sm mt-4" style={{ color: "#ef4444" }}>{error}</p>
        )}

        <p className="text-xs mt-6 max-w-md" style={{ color: "#62666d" }}>
          7 days free trial. Then $25.99/month. Cancel anytime. No lock-in. Aussie dollars.
        </p>
      </div>
    </section>
  );
}
