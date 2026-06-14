"use client";

import { Trees, Fence, Waves, Shovel } from "lucide-react";

const trades = [
  { icon: Trees, label: "Landscapers" },
  { icon: Fence, label: "Fencing" },
  { icon: Waves, label: "Pool Builders" },
  { icon: Shovel, label: "Concreters" },
];

export default function TrustBar() {
  return (
    <section className="py-12 bg-white border-t border-b border-[#D6D3D1]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <p className="text-center text-[#A8A29E] text-sm mb-8 tracking-wide uppercase">
          Trusted by 100+ Adelaide tradespeople
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {trades.map((trade) => (
            <div
              key={trade.label}
              className="flex items-center gap-2 text-[#78716C] hover:text-[#1C1917] transition-colors cursor-default"
            >
              <trade.icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-sm font-medium">{trade.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
