"use client";

import { ScrollReveal } from "./ScrollReveal";

const stats = [
  { value: "0s", label: "QUOTE TIME" },
  { value: "10%", label: "EST. AUTO-CALC" },
  { value: "0 Days", label: "FREE TRIAL" },
  { value: "1 Click", label: "FOLLOW-UP" },
];

export function StatsBar() {
  return (
    <section className="bg-surface-base border-t border-b border-surface-subtle py-10 md:py-12 px-margin-mobile md:px-margin-desktop">
      <ScrollReveal>
        <div className="max-w-container-max-width mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center">
                <span className="font-headline-md font-bold text-growth-green text-[24px] md:text-[28px]">
                  {stat.value}
                </span>
                <span className="font-label-mono uppercase tracking-widest text-on-surface-variant text-[10px] md:text-label-mono mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
