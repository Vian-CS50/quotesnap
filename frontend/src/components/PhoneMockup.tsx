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
      <div className="relative border-4 overflow-hidden" style={{ borderColor: '#334155', backgroundColor: '#0f172a', borderRadius: '2.5rem' }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 z-10" style={{ backgroundColor: '#334155', borderRadius: '0 0 12px 12px' }} />

        {/* Screen Content */}
        <div className="p-6 pt-10 space-y-4">
          {/* App Header */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: 'rgba(27,77,62,0.2)', borderRadius: '0px' }}>
              <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>Q</span>
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>QuoteSnap</div>
          </div>

          {/* Waveform */}
          <div className="flex items-center justify-center gap-1 h-16">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className={`w-2 animate-soundbar soundbar-${i}`}
                style={{
                  backgroundColor: 'var(--primary)',
                  borderRadius: '0px',
                  height: `${30 + Math.random() * 50}%`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          {/* Status */}
          <div className="text-center">
            <span className="text-xs font-medium" style={{ color: 'var(--primary)' }}>Recording...</span>
          </div>

          {/* Quote Preview Simulation */}
          <div className="p-3 space-y-2 border" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '0px' }}>
            <div className="h-2 w-3/4" style={{ backgroundColor: 'rgba(var(--foreground-rgb), 0.1)', borderRadius: '0px' }} />
            <div className="h-2 w-1/2" style={{ backgroundColor: 'rgba(var(--foreground-rgb), 0.1)', borderRadius: '0px' }} />
            <div className="h-2 w-5/6" style={{ backgroundColor: 'rgba(var(--foreground-rgb), 0.1)', borderRadius: '0px' }} />
            <div className="border-t pt-2 space-y-1" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>$8,500.00</span>
              </div>
              <div className="flex justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span>GST (10%)</span>
                <span>$850.00</span>
              </div>
              <div className="flex justify-between text-[10px] font-semibold" style={{ color: 'var(--primary)' }}>
                <span>Total</span>
                <span>$9,350.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1" style={{ backgroundColor: '#475569', borderRadius: '0px' }} />
      </div>
    </motion.div>
  );
}
