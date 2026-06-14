"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "quotesnap_cookie_consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
              We use essential cookies for payments (Stripe) and analytics (Simple Analytics, no tracking).{" "}
              <a href="/privacy" className="underline" style={{ color: "var(--primary)" }}>
                Privacy Policy
              </a>
            </p>
            <button
              onClick={accept}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider whitespace-nowrap"
              style={{
                backgroundColor: "var(--primary)",
                color: "white",
              }}
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
