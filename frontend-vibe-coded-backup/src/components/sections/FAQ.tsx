"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do I need to type everything?",
    answer:
      "Nah. Hit record, talk through the job, and the AI handles the rest. You can edit before sending if you want.",
  },
  {
    question: "How does the follow-up work?",
    answer:
      "QuoteSnap tracks when you sent each quote and reminds you to follow up after 2 days. One click copies a pre-written message or opens SMS/WhatsApp. Never lose a job to forgetfulness again.",
  },
  {
    question: "Can I edit the quote before sending?",
    answer:
      "Of course. Review the line items, adjust prices, add notes. You're in control.",
  },
  {
    question: "Does it handle pools, decks, and retaining walls?",
    answer:
      "Yep. Built specifically for landscaping scope — pools, decks, paving, retaining walls, turf, fencing, irrigation, and gardens. The AI knows SA rates and materials.",
  },
  {
    question: "Is my data safe?",
    answer:
      "100%. We don't sell your info or your client details. Your quote history stays in your browser unless you choose to export it.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32" style={{ backgroundColor: 'var(--surface-warm)' }}>
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-wider mb-4 block" style={{ color: 'var(--text-muted)' }}>
            FAQ
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--foreground)', lineHeight: 1.1 }}>
            Questions?
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="border overflow-hidden"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: 'var(--border)',
                borderRadius: '0px'
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left"
              >
                <span className="font-medium text-sm md:text-base pr-4" style={{ color: 'var(--foreground)' }}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                  style={{ color: 'var(--text-muted)' }}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 md:px-5 pb-4 md:pb-5 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
