"use client";

import { ScrollReveal } from "./ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Record on site",
    description:
      "Talk through the job while you're still on the tools. 30 seconds, done.",
    icon: "mic",
  },
  {
    number: "02",
    title: "AI writes it",
    description:
      "Line items, materials, labour, GST. All calculated automatically.",
    icon: "auto_awesome",
  },
  {
    number: "03",
    title: "Send PDF",
    description:
      "Professional quote hits their inbox before you leave the driveway.",
    icon: "description",
  },
  {
    number: "04",
    title: "Auto follow-up",
    description:
      "Get reminded to follow up. Use one-click templates. Win jobs you'd normally forget.",
    icon: "notifications",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-surface py-16 md:py-24 px-margin-mobile md:px-margin-desktop"
    >
      <div className="max-w-container-max-width mx-auto">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <span className="font-label-mono uppercase tracking-widest text-on-surface-variant text-[10px] md:text-label-mono">
            THE PROCESS
          </span>
          <h2 className="font-headline-lg text-on-surface mt-3 text-[24px] md:text-[32px]">
            Quote while you drive. Send before you park.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <ScrollReveal key={step.number}>
              <div className="bg-white border border-surface-subtle p-6 rounded-lg h-full flex flex-col">
                <span className="font-label-mono text-growth-green text-[12px] uppercase tracking-widest mb-4">
                  {step.number}
                </span>
                <div className="mb-4">
                  <span
                    className="material-symbols-outlined text-growth-green"
                    style={{
                      fontSize: 28,
                      fontVariationSettings:
                        "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    {step.icon}
                  </span>
                </div>
                <h3 className="font-headline-sm text-on-surface mb-2">
                  {step.title}
                </h3>
                <p className="font-body-md text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
