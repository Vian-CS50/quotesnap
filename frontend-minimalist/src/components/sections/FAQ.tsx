"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CaretDown } from "@phosphor-icons/react";

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
    <section id="faq" className="py-20 md:py-32 bg-[#F5F4F0]">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C1917] mb-4">
            Questions?
          </h2>
          <p className="text-base md:text-lg text-[#A8A29E]">
            Everything you need to know.
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white border border-[#D6D3D1] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left"
              >
                <span className="text-[#1C1917] font-medium text-sm md:text-base pr-4">
                  {faq.question}
                </span>
                <CaretDown
                  className={`w-5 h-5 text-[#A8A29E] flex-shrink-0 transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm md:text-base text-[#78716C] leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
