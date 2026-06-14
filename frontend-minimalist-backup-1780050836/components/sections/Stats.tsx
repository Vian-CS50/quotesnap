"use client";

import { motion } from "framer-motion";
import AnimatedCounter from "../AnimatedCounter";

const stats = [
  {
    value: 2437,
    suffix: "+",
    label: "Quotes generated",
    sublabel: "By Adelaide landscapers this month",
  },
  {
    value: 94,
    suffix: "%",
    label: "Win rate",
    sublabel: "Faster quotes = more jobs won",
  },
  {
    value: 5.2,
    suffix: "hrs",
    decimals: 1,
    label: "Time saved per week",
    sublabel: "No more Sunday arvo paperwork",
  },
  {
    value: 30,
    suffix: "s",
    label: "Average quote time",
    sublabel: "From voice memo to PDF",
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
    <section className="py-16 md:py-24 border-y border-card-border">
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
              <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary mb-2">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                  duration={2500}
                />
              </div>
              <div className="text-sm md:text-base font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-xs md:text-sm text-muted">
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
