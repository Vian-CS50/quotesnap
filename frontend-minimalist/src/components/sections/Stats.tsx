"use client";

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

export default function Stats() {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-[#D6D3D1]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#C2410C] mb-2">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals || 0}
                  duration={2500}
                />
              </div>
              <div className="text-sm md:text-base font-semibold text-[#1C1917] mb-1">
                {stat.label}
              </div>
              <div className="text-xs md:text-sm text-[#A8A29E]">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
