"use client";

import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <section
      className="py-20 md:py-32 relative"
      style={{ backgroundColor: 'var(--primary)' }}
    >
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'white', lineHeight: 1.1 }}>
            Stop writing quotes at 10pm
          </h2>
          <p className="text-base md:text-lg max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Get home earlier. Win more jobs. Look professional doing it.
          </p>
          <a
            href="#demo"
            className="inline-flex items-center justify-center h-16 px-12 font-mono text-xs uppercase tracking-wider transition-colors"
            style={{ 
              backgroundColor: 'white', 
              color: 'var(--primary)',
              borderRadius: '0px'
            }}
          >
            Start Free. 30 Seconds
          </a>
        </motion.div>
      </div>
    </section>
  );
}
