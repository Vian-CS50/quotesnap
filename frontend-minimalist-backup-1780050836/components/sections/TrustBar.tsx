"use client";

import { motion } from "framer-motion";
import { Trees, Fence, Waves, Shovel } from "lucide-react";

const trades = [
  { icon: Trees, label: "Landscapers" },
  { icon: Fence, label: "Fencing" },
  { icon: Waves, label: "Pool Builders" },
  { icon: Shovel, label: "Concreters" },
];

export default function TrustBar() {
  return (
    <section className="py-12 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-muted text-sm mb-8"
        >
          Trusted by 100+ Adelaide landscapers
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {trades.map((trade) => (
            <div
              key={trade.label}
              className="flex items-center gap-2 text-muted opacity-60 hover:opacity-100 transition-opacity"
            >
              <trade.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{trade.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
