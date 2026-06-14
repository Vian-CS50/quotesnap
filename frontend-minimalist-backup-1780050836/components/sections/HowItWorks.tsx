"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Record on site",
    body: "Talk through the job while you're still on the tools. 30 seconds, done.",
  },
  {
    num: "02",
    title: "AI writes it",
    body: "Line items, materials, labour, GST. All calculated automatically.",
  },
  {
    num: "03",
    title: "Send PDF",
    body: "Professional quote hits their inbox before you leave the driveway.",
  },
  {
    num: "04",
    title: "Auto follow-up",
    body: "Get reminded to follow up. Use one-click templates. Win jobs you'd normally forget.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="text-xs font-medium mb-3" style={{ color: "#62666d", fontWeight: 510, letterSpacing: "-0.13px" }}>
            How it works
          </p>
          <h2
            className="text-3xl md:text-4xl font-medium tracking-tight"
            style={{ color: "#f7f8f8", lineHeight: 1.1, letterSpacing: "-0.704px", fontWeight: 510 }}
          >
            Four steps. That is it.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 md:p-8"
              style={{ background: "#08090a" }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="text-xs font-medium mt-1"
                  style={{ color: "#62666d", fontWeight: 510, fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {step.num}
                </span>
                <div>
                  <h3
                    className="text-sm font-medium mb-2"
                    style={{ color: "#f7f8f8", fontWeight: 510, letterSpacing: "-0.13px" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#8a8f98", lineHeight: 1.6 }}>
                    {step.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
