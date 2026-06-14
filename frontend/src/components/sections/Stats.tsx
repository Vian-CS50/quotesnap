"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "../AnimatedCounter";

const stats = [
  {
    value: 30,
    suffix: "s",
    label: "Quote time",
    sublabel: "From voice memo to PDF",
  },
  {
    value: 10,
    suffix: "%",
    label: "GST calculated",
    sublabel: "ATO-ready formatting",
  },
  {
    value: 7,
    suffix: " days",
    decimals: 0,
    label: "Free trial",
    sublabel: "No credit card required",
  },
  {
    value: 1,
    suffix: " click",
    label: "Follow-up",
    sublabel: "Never lose a job to forgetfulness",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Stats() {
  return (
    <section className="py-16 md:py-24 border-y" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center"
            >
              <div className="font-serif text-4xl md:text-5xl lg:text-6xl mb-2" style={{ color: 'var(--primary)' }}>
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                  duration={2500}
                />
              </div>
              <div className="text-sm md:text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
                {stat.label}
              </div>
              <div className="text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
