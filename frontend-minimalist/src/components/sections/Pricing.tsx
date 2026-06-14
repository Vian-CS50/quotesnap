"use client";

import { useState, useCallback } from "react";
import { Check, Spinner } from "@phosphor-icons/react";

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
    <section id="pricing" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C1917] mb-4">
            Simple pricing
          </h2>
          <p className="text-base md:text-lg text-[#A8A29E]">
            Win one extra job and it pays for a year.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative bg-[#F5F4F0] border-2 border-[#C2410C] p-6 md:p-8">
            <h3 className="text-lg font-bold text-[#1C1917] mb-2">
              Pro Monthly
            </h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-extrabold text-[#1C1917]">
                $25.99
              </span>
              <span className="text-[#A8A29E]">AUD/month</span>
            </div>
            <p className="text-sm text-[#C2410C] font-medium mb-6">
              Less than a coffee per day
            </p>

            <ul className="space-y-3 text-sm text-[#1C1917]/80 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-[#C2410C] flex-shrink-0" weight="bold" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => startCheckout("monthly")}
              disabled={checkoutLoading !== null}
              className="w-full h-12 bg-[#C2410C] hover:bg-[#9A3412] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors inline-flex items-center justify-center gap-2"
            >
              {checkoutLoading === "monthly" ? (
                <>
                  <Spinner className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Start Free Trial — $25.99/mo"
              )}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-red-600 mt-4">{error}</p>
        )}

        <p className="text-center text-sm text-[#A8A29E] mt-8 max-w-xl mx-auto">
          7 days free trial. Then $25.99/month. Cancel anytime. No lock-in. Aussie dollars.
        </p>
      </div>
    </section>
  );
}
