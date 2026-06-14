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
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className="bg-card border border-card-border rounded-xl p-6 hover:border-primary/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
