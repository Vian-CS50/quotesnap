"use client";

import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section
      className="py-20 md:py-32 relative"
      style={{
        background:
          "radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Stop writing quotes at 10pm
          </h2>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto mb-10">
            Get home earlier. Win more jobs. Look professional doing it.
          </p>
          <a
            href="#demo"
            className="inline-flex items-center justify-center h-16 px-12 rounded-2xl bg-accent hover:bg-accent-hover text-background font-semibold text-xl transition-all hover:scale-105 active:scale-95 animate-bounce"
            style={{ animationDuration: "2s" }}
          >
            Start Free. 30 Seconds
          </a>
        </motion.div>
      </div>
    </section>
  );
}
