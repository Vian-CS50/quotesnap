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

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32">
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
            Testimonials
          </p>
          <h2
            className="text-3xl md:text-4xl font-medium tracking-tight"
            style={{ color: "#f7f8f8", lineHeight: 1.1, letterSpacing: "-0.704px", fontWeight: 510 }}
          >
            What Adelaide tradies say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.05)" }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 md:p-8"
              style={{ background: "#08090a" }}
            >
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#d0d6e0", lineHeight: 1.6 }}>
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(94,106,210,0.1)" }}
                >
                  <span className="text-xs font-medium" style={{ color: "#7170ff", fontWeight: 510 }}>
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "#f7f8f8", fontWeight: 510 }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: "#62666d" }}>
                    {t.role}, {t.location}
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
