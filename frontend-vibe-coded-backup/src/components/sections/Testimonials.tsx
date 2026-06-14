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
    <section className="py-20 md:py-32" style={{ backgroundColor: 'var(--surface-warm)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-wider mb-4 block" style={{ color: 'var(--text-muted)' }}>
            Testimonials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--foreground)', lineHeight: 1.1 }}>
            What Adelaide tradies say
          </h2>
        </div>
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
              className="border p-6 relative"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: 'var(--border)',
                borderRadius: '0px'
              }}
            >
              {/* Quote mark background */}
              <span className="absolute top-4 right-4 text-6xl font-serif select-none leading-none" style={{ color: 'rgba(27, 77, 62, 0.1)' }}>
                &ldquo;
              </span>

              <p className="text-base leading-relaxed mb-6 relative z-10" style={{ color: 'var(--foreground)' }}>
                {t.quote}
              </p>

              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'rgba(27, 77, 62, 0.2)',
                    borderRadius: '0px'
                  }}
                >
                  <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {t.role}
                    <span style={{ color: 'var(--text-muted)' }}>, {t.location}</span>
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
