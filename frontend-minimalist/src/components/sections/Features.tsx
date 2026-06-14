"use client";

import { Microphone, ChatTeardropText, Calculator, FileText, Palette, MapPin } from "@phosphor-icons/react";

const features = [
  {
    icon: Microphone,
    title: "Voice to Quote",
    desc: "Describe the job in plain English. No typing on a tiny screen.",
    large: true,
  },
  {
    icon: ChatTeardropText,
    title: "Auto Follow-Up",
    desc: "Never lose a job because you forgot to follow up. Reminders + one-click messages.",
    large: true,
  },
  {
    icon: Calculator,
    title: "GST Auto Calculated",
    desc: "10% GST added and itemised. ATO-ready formatting.",
    large: false,
  },
  {
    icon: FileText,
    title: "Professional PDF",
    desc: "Clean, branded quotes that look like you paid a designer.",
    large: false,
  },
  {
    icon: Palette,
    title: "Custom Branding",
    desc: "Your logo, colours, and terms. Every quote looks like your business.",
    large: false,
  },
  {
    icon: MapPin,
    title: "Built in Adelaide",
    desc: "Made for SA landscapers. Local rates, local compliance, local support.",
    large: false,
  },
];

export default function Features() {
  const largeFeatures = features.filter((f) => f.large);
  const smallFeatures = features.filter((f) => !f.large);

  return (
    <section id="features" className="py-20 md:py-32 bg-[#F5F4F0]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1C1917] mb-4">
            Everything you need
          </h2>
          <p className="text-base md:text-lg text-[#A8A29E] max-w-2xl mx-auto">
            No bloat. Just the tools that win jobs.
          </p>
        </div>

        {/* Large feature blocks — 2-column, full width cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {largeFeatures.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-[#D6D3D1] p-8 hover:border-[#C2410C] transition-colors group"
            >
              <f.icon className="w-8 h-8 text-[#C2410C] mb-5" weight="duotone" />
              <h3 className="text-xl font-semibold text-[#1C1917] mb-2">
                {f.title}
              </h3>
              <p className="text-base text-[#78716C] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Small feature blocks — 4-column tighter grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {smallFeatures.map((f) => (
            <div
              key={f.title}
              className="bg-white border border-[#D6D3D1] p-6 hover:border-[#C2410C] transition-colors group"
            >
              <f.icon className="w-6 h-6 text-[#C2410C] mb-4" weight="duotone" />
              <h3 className="text-base font-semibold text-[#1C1917] mb-1">
                {f.title}
              </h3>
              <p className="text-sm text-[#78716C] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
