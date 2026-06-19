"use client";

import Link from "next/link";
import { ScrollReveal } from "./ScrollReveal";

export function FinalCTA() {
  return (
    <section className="bg-growth-green text-on-primary py-16 md:py-24 px-margin-mobile md:px-margin-desktop">
      <ScrollReveal>
        <div className="max-w-container-max-width mx-auto text-center">
          <h2 className="font-headline-lg text-white text-[28px] md:text-[48px] leading-tight">
            Stop writing quotes at 10pm
          </h2>
          <p className="font-body-lg text-white/80 mt-4 max-w-2xl mx-auto">
            Get home earlier. Win more jobs. Look professional doing it. Join
            100+ landscapers who have reclaimed their Sunday afternoons.
          </p>

          <div className="mt-8">
            <Link
              href="/signup"
              className="inline-block bg-white text-growth-green font-button-text rounded-lg px-8 py-4 hover:bg-surface-container-low active:scale-95 transition-all min-h-[48px]"
            >
              Start Free. 30 Seconds
            </Link>
          </div>

          <p className="font-label-mono uppercase tracking-widest text-white/60 text-[10px] md:text-label-mono mt-4">
            NO CREDIT CARD REQUIRED — CANCEL ANYTIME
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
