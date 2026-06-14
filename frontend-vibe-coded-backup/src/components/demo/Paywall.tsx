"use client";

import { motion } from "framer-motion";
import { X, Zap, Check } from "lucide-react";

interface PaywallProps {
  onClose: () => void;
  onCheckout: () => void;
  checkoutLoading: boolean;
}

const features = [
  "Unlimited AI landscaping quotes",
  "Auto follow-up reminders + templates",
  "Voice memos to PDF in 30 seconds",
  "SMS, WhatsApp, Email share",
  "GST calculations",
  "Quote win/loss tracking",
];

export default function Paywall({ onClose, onCheckout, checkoutLoading }: PaywallProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-md border-2 p-6 md:p-8"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--primary)",
          borderRadius: "0px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div
            className="inline-flex items-center justify-center w-12 h-12 mb-4"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3
            className="font-serif text-2xl mb-2"
            style={{ color: "var(--foreground)" }}
          >
            You have used all 3 free quotes
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Upgrade to Pro to generate unlimited quotes and unlock all features.
          </p>
        </div>

        <div className="border-2 p-6 mb-6" style={{ borderColor: "var(--border)", borderRadius: "0px" }}>
          <div className="flex items-baseline gap-2 mb-1 justify-center">
            <span className="font-serif text-5xl" style={{ color: "var(--foreground)" }}>
              $25.99
            </span>
            <span style={{ color: "var(--text-muted)" }}>AUD/month</span>
          </div>
          <p className="text-center text-sm font-medium mb-6" style={{ color: "var(--primary)" }}>
            Less than a coffee per day
          </p>

          <ul className="space-y-3 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <Check className="w-4 h-4 flex-shrink-0" style={{ color: "var(--primary)" }} />
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={onCheckout}
            disabled={checkoutLoading}
            className="w-full h-12 font-mono text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--primary)",
              color: "white",
              borderRadius: "0px",
            }}
          >
            {checkoutLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              "Upgrade to Pro — $25.99/mo"
            )}
          </button>
        </div>

        <p className="text-center text-xs" style={{ color: "var(--text-muted)" }}>
          7 days free trial. Cancel anytime. No lock-in.
        </p>
      </motion.div>
    </motion.div>
  );
}
