"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Was spending every Sunday arvo doing quotes instead of with the kids. Now I write them in the van and the app reminds me to follow up. Won 3 jobs last week I would've forgotten.",
    name: "Dave M.",
    role: "Landscaper",
    location: "Golden Grove, SA",
    initials: "DM",
  },
  {
    quote:
      "Sent a quote while I was still in the client's driveway. The follow-up message went out 2 days later. They signed that afternoon.",
    name: "Sarah K.",
    role: "Landscaper",
    location: "McLaren Vale, SA",
    initials: "SK",
  },
  {
    quote:
      "Used to write quotes on the back of receipts. Now they look professional AND the follow-ups happen without me thinking about it.",
    name: "Mike R.",
    role: "Pool Builder",
    location: "Adelaide Hills, SA",
    initials: "MR",
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

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={itemVariants}
              className="bg-card border border-card-border rounded-xl p-6 relative"
            >
              {/* Quote mark background */}
              <span className="absolute top-4 right-4 text-6xl font-serif text-primary/10 select-none leading-none">
                &ldquo;
              </span>

              <p className="text-foreground text-base leading-relaxed mb-6 relative z-10">
                {t.quote}
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-primary">
                    {t.role}
                    <span className="text-muted">, {t.location}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
