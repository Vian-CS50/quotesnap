"use client";

import { motion } from "framer-motion";
import { Mic, Calculator, FileText, Palette, MapPin, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice to Draft Quote",
    desc: "Describe the job in plain English while you're still on site. No typing on a tiny screen.",
    size: "large",
  },
  {
    icon: MessageCircle,
    title: "Auto Follow-Up",
    desc: "Never lose a job because you forgot to follow up. Reminders + one-click messages.",
    size: "small",
  },
  {
    icon: Calculator,
    title: "GST Auto Calculated",
    desc: "10% GST added and itemised. ATO-ready formatting.",
    size: "small",
  },
  {
    icon: FileText,
    title: "Professional PDF",
    desc: "Clean, branded quotes that look like you paid a designer.",
    size: "small",
  },
  {
    icon: Palette,
    title: "Custom Branding",
    desc: "Your logo, colours, and terms. Every quote looks like your business.",
    size: "small",
  },
  {
    icon: MapPin,
    title: "Built in Adelaide",
    desc: "Made for SA landscapers. Local rates, local compliance, local support.",
    size: "large",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-wider mb-4 block" style={{ color: 'var(--text-muted)' }}>
            Features
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--foreground)', lineHeight: 1.1 }}>
            From voice memo to PDF in 30 seconds
          </h2>
          <p className="text-base md:text-lg max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
            No more Sunday arvo paperwork. QuoteSnap handles the maths, the formatting, and the follow-up — so you can review, edit, and send faster.
          </p>
        </motion.div>

        {/* Feature List — no cards, no bento, just clean rows */}
        <div className="space-y-0 border-t" style={{ borderColor: 'var(--border)' }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-start gap-5 md:gap-8 py-8 md:py-10 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5">
                <f.icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
