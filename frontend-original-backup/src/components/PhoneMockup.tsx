"use client";

import { motion } from "framer-motion";

export default function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
      className="relative mx-auto max-w-[320px]"
    >
      {/* Phone Frame */}
      <div className="relative rounded-[2.5rem] border-4 border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-700 rounded-b-xl z-10" />

        {/* Screen Content */}
        <div className="p-6 pt-10 space-y-4">
          {/* App Header */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">Q</span>
            </div>
            <div className="text-xs text-muted">QuoteSnap</div>
          </div>

          {/* Waveform */}
          <div className="flex items-center justify-center gap-1 h-16">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className={`w-2 bg-primary rounded-full animate-soundbar soundbar-${i}`}
                style={{
                  height: `${30 + Math.random() * 50}%`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          {/* Status */}
          <div className="text-center">
            <span className="text-xs text-primary font-medium">Recording...</span>
          </div>

          {/* Quote Preview Simulation */}
          <div className="bg-card rounded-xl p-3 space-y-2 border border-card-border">
            <div className="h-2 bg-foreground/10 rounded w-3/4" />
            <div className="h-2 bg-foreground/10 rounded w-1/2" />
            <div className="h-2 bg-foreground/10 rounded w-5/6" />
            <div className="border-t border-card-border pt-2 space-y-1">
              <div className="flex justify-between text-[10px] text-muted">
                <span>Subtotal</span>
                <span>$8,500.00</span>
              </div>
              <div className="flex justify-between text-[10px] text-muted">
                <span>GST (10%)</span>
                <span>$850.00</span>
              </div>
              <div className="flex justify-between text-[10px] text-primary font-semibold">
                <span>Total</span>
                <span>$9,350.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-600 rounded-full" />
      </div>
    </motion.div>
  );
}
