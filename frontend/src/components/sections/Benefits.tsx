"use client";

import { motion } from "framer-motion";
import { Mic, Clock, FileText, Bell } from "lucide-react";

const benefits = [
  {
    icon: Mic,
    title: "Talk, don't type",
    description:
      "Describe the job while you're still on site. No more thumb-typing on a tiny screen or forgetting details by the time you get home.",
  },
  {
    icon: Clock,
    title: "Quotes in 30 seconds",
    description:
      "What used to take 45 minutes of paperwork now happens before you leave the driveway. Generate, review, send — done.",
  },
  {
    icon: FileText,
    title: "Professional PDFs",
    description:
      "Clean, itemised quotes with GST broken out. Your clients see a proper document, not a text message or scrap of paper.",
  },
  {
    icon: Bell,
    title: "Follow-up reminders",
    description:
      "QuoteSnap tracks when you sent each quote and reminds you to follow up. Stop losing jobs because life got busy.",
  },
];

export default function Benefits() {
  return (
    <section className="py-20 md:py-32" style={{ backgroundColor: 'var(--surface-warm)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-wider mb-4 block" style={{ color: 'var(--text-muted)' }}>
            Why landscapers use it
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--foreground)', lineHeight: 1.1 }}>
            Built for how you actually work
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div
                  className="w-12 h-12 flex-shrink-0 flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(27, 77, 62, 0.1)',
                    borderRadius: '0px'
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    {b.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {b.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
