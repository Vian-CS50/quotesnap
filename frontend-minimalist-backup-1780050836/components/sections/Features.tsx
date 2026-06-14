"use client";

import { motion } from "framer-motion";
import { Mic, Calculator, FileText, Palette, MapPin, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice to Quote",
    desc: "Describe the job in plain English. No typing on a tiny screen.",
  },
  {
    icon: MessageCircle,
    title: "Auto Follow-Up",
    desc: "Never lose a job because you forgot to follow up. Reminders + one-click messages.",
  },
  {
    icon: Calculator,
    title: "GST Auto Calculated",
    desc: "10% GST added and itemised. ATO-ready formatting.",
  },
  {
    icon: FileText,
    title: "Professional PDF",
    desc: "Clean, branded quotes that look like you paid a designer.",
  },
  {
    icon: Palette,
    title: "Custom Branding",
    desc: "Your logo, colours, and terms. Every quote looks like your business.",
  },
  {
    icon: MapPin,
    title: "Built in Adelaide",
    desc: "Made for SA landscapers. Local rates, local compliance, local support.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
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
            Features
          </p>
          <h2
            className="text-3xl md:text-4xl font-medium tracking-tight"
            style={{ color: "#f7f8f8", lineHeight: 1.1, letterSpacing: "-0.704px", fontWeight: 510 }}
          >
            Everything you need to quote faster
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className="p-6 md:p-8 transition-colors hover:bg-white/[0.02]"
              style={{ background: "#08090a" }}
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center mb-4"
                style={{ background: "rgba(94,106,210,0.1)" }}
              >
                <f.icon className="w-4 h-4" style={{ color: "#7170ff" }} />
              </div>
              <h3
                className="text-sm font-medium mb-2"
                style={{ color: "#f7f8f8", fontWeight: 510, letterSpacing: "-0.13px" }}
              >
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#8a8f98", lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
