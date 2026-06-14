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
      <div className="relative border-4 border-[#44403C] bg-[#1C1917] overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#44403C] z-10" />

        {/* Screen Content */}
        <div className="p-6 pt-10 space-y-4">
          {/* App Header */}
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 bg-[#FFF5F0] flex items-center justify-center">
              <span className="text-[#C2410C] text-xs font-bold">Q</span>
            </div>
            <div className="text-xs text-[#A8A29E]">QuoteSnap</div>
          </div>

          {/* Waveform */}
          <div className="flex items-center justify-center gap-1 h-16">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className={`w-2 bg-[#C2410C] animate-soundbar soundbar-${i}`}
                style={{
                  height: `${30 + Math.random() * 50}%`,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          {/* Status */}
          <div className="text-center">
            <span className="text-xs text-[#C2410C] font-medium">Recording...</span>
          </div>

          {/* Quote Preview Simulation */}
          <div className="bg-white p-3 space-y-2 border border-[#D6D3D1]">
            <div className="h-2 bg-[#1C1917]/10 w-3/4" />
            <div className="h-2 bg-[#1C1917]/10 w-1/2" />
            <div className="h-2 bg-[#1C1917]/10 w-5/6" />
            <div className="border-t border-[#D6D3D1] pt-2 space-y-1">
              <div className="flex justify-between text-[10px] text-[#A8A29E]">
                <span>Subtotal</span>
                <span>$8,500.00</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#A8A29E]">
                <span>GST (10%)</span>
                <span>$850.00</span>
              </div>
              <div className="flex justify-between text-[10px] text-[#C2410C] font-semibold">
                <span>Total</span>
                <span>$9,350.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#44403C]" />
      </div>
    </motion.div>
  );
}
