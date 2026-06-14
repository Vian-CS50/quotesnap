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
    <section id="features" className="py-20 md:py-32" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <span className="font-mono text-xs uppercase tracking-wider mb-4 block" style={{ color: 'var(--text-muted)' }}>
            Features
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl mb-4" style={{ color: 'var(--foreground)', lineHeight: 1.1 }}>
            Everything you need. Nothing you don't.
          </h2>
        </div>
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
              className="border p-6 transition-colors duration-300"
              style={{ 
                backgroundColor: 'var(--surface)', 
                borderColor: 'var(--border)',
                borderRadius: '0px'
              }}
            >
              <div 
                className="w-10 h-10 flex items-center justify-center mb-4"
                style={{ 
                  backgroundColor: 'rgba(27, 77, 62, 0.1)',
                  borderRadius: '0px'
                }}
              >
                <f.icon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
