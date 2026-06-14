"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Record on site",
    body: "Talk through the job while you are still on the tools. 30 seconds, done.",
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs uppercase tracking-wider mb-4 block" style={{ color: 'var(--text-muted)' }}>
            How It Works
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--foreground)', lineHeight: 1.1 }}>
            Quote while you drive. Send before you park.
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-8 md:gap-12"
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={itemVariants}
              className="text-center"
            >
              <div className="mb-3">
                <span 
                  className="font-mono text-3xl md:text-4xl font-bold tracking-tighter"
                  style={{ color: 'var(--primary)', opacity: 0.2 }}
                >
                  {step.num}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {step.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
