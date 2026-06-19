"use client";

import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";

const proFeatures = [
  "Unlimited AI landscaping quotes",
  "Auto follow-up reminders + templates",
  "Voice memos to PDF in 30 seconds",
  "GST calculations & tracking",
];

const eliteFeatures = [
  "Everything in Pro",
  "Custom pricing model builder",
  "Set your own labour rates",
  "Material markup rules",
  "Job-type templates",
];

function CheckIcon() {
  return (
    <span
      className="material-symbols-outlined text-growth-green flex-shrink-0"
      style={{
        fontSize: 20,
        fontVariationSettings:
          "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24",
      }}
    >
      check
    </span>
  );
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="bg-surface py-16 md:py-24 px-margin-mobile md:px-margin-desktop"
    >
      <div className="max-w-container-max-width mx-auto">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="font-headline-lg text-on-surface text-[24px] md:text-[32px]">
            Less than a coffee per day
          </h2>
          <p className="font-body-lg text-on-surface-variant mt-3">
            Simple, transparent pricing. Cancel anytime.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {/* Pro Card */}
          <ScrollReveal>
            <div className="bg-white border border-surface-subtle p-8 rounded-xl shadow-sm h-full flex flex-col">
              <div className="mb-6">
                <span className="font-label-mono uppercase tracking-widest text-on-surface-variant text-[10px] md:text-label-mono">
                  PRO
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-headline-lg text-on-surface text-[32px]">
                    $25.99
                  </span>
                  <span className="font-body-md text-on-surface-variant">
                    AUD/month
                  </span>
                </div>
                <p className="font-body-md text-on-surface-variant mt-2">
                  For solo landscapers winning more jobs
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {proFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 font-body-md text-on-surface"
                  >
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup?plan=pro"
                className="block w-full border border-growth-green text-growth-green font-button-text rounded-lg px-6 py-3 text-center hover:bg-growth-green hover:text-white active:scale-95 transition-all min-h-[48px] flex items-center justify-center"
              >
                Get Pro
              </Link>
            </div>
          </ScrollReveal>

          {/* Elite Card */}
          <ScrollReveal>
            <div className="relative bg-white border border-growth-green/30 p-8 rounded-xl shadow-sm h-full flex flex-col">
              {/* Best Value Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-growth-green text-white px-4 py-1 rounded-full font-label-mono text-[10px] uppercase tracking-widest">
                  BEST VALUE
                </span>
              </div>

              <div className="mb-6 pt-2">
                <span className="font-label-mono uppercase tracking-widest text-on-surface-variant text-[10px] md:text-label-mono">
                  ELITE
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="font-headline-lg text-on-surface text-[32px]">
                    $49.99
                  </span>
                  <span className="font-body-md text-on-surface-variant">
                    AUD/month
                  </span>
                </div>
                <p className="font-body-md text-on-surface-variant mt-2">
                  Your pricing model. Your rules.
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {eliteFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 font-body-md text-on-surface"
                  >
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup?plan=elite"
                className="block w-full bg-growth-green text-white font-button-text rounded-lg px-6 py-3 text-center hover:bg-opacity-90 active:scale-95 transition-all min-h-[48px] flex items-center justify-center"
              >
                Get Elite
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
