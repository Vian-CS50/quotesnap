"use client";

import Link from "next/link";

interface HeroSectionProps {
  onDemoClick?: () => void;
}

export function HeroSection({ onDemoClick }: HeroSectionProps) {
  return (
    <section className="bg-surface pt-24 pb-16 md:pt-32 md:pb-24 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max-width mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
          {/* Left: Text Content */}
          <div className="flex flex-col gap-6 order-1">
            {/* Badge */}
            <span className="font-label-mono uppercase tracking-widest text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full w-fit text-[10px] md:text-label-mono">
              BUILT FOR LANDSCAPERS
            </span>

            {/* Headline */}
            <h1 className="font-headline-lg text-growth-green text-[24px] md:text-[56px] md:leading-[1.1] leading-[1.2] tracking-tight">
              Write quotes in the van.
              <br />
              Win jobs in your sleep.
            </h1>

            {/* Subheadline */}
            <p className="font-body-lg text-on-surface-variant max-w-lg">
              Talk for 30 seconds. QuoteSnap drafts a professional PDF quote from
              your voice memo — then reminds you to follow up so you stop losing
              jobs to forgetfulness.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link
                href="/signup"
                className="bg-growth-green text-white font-button-text rounded-lg px-6 py-3 text-center hover:bg-opacity-90 active:scale-95 transition-all min-h-[48px] flex items-center justify-center"
              >
                Try Free Now
              </Link>
              <button
                onClick={onDemoClick}
                className="border border-slate-deep text-slate-deep font-button-text rounded-lg px-6 py-3 text-center hover:bg-surface-container-low active:scale-95 transition-all min-h-[48px]"
              >
                Watch Demo
              </button>
            </div>

            {/* Trust Text */}
            <p className="font-label-mono uppercase tracking-widest text-on-surface-variant text-[10px] md:text-label-mono mt-2">
              TRUSTED BY 100+ PROS IN ADELAIDE
            </p>
          </div>

          {/* Right: Floating Glass Mockup */}
          <div className="order-2 flex justify-center md:justify-end">
            <div
              className="relative w-full max-w-md rounded-xl p-6 shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(27, 77, 62, 0.1)",
              }}
            >
              {/* Mockup Window Header */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-surface-subtle">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-2 font-label-mono text-[10px] text-on-surface-variant uppercase tracking-widest">
                  QuoteSnap Preview
                </span>
              </div>

              {/* Mockup Content */}
              <div className="space-y-4">
                {/* Client Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-headline-sm text-on-surface text-[14px]">
                      Johnson Residence
                    </p>
                    <p className="font-body-sm text-on-surface-variant">
                      42 Rose Ave, Prospect
                    </p>
                  </div>
                  <span className="font-label-mono text-[10px] text-growth-green bg-primary-fixed px-2 py-1 rounded-full uppercase">
                    DRAFT
                  </span>
                </div>

                {/* Line Items */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-surface-subtle/50">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-on-surface-variant"
                        style={{ fontSize: 16 }}
                      >
                        grass
                      </span>
                      <span className="font-body-sm text-on-surface">
                        Premium turf install (45m²)
                      </span>
                    </div>
                    <span className="font-body-sm font-semibold text-on-surface">
                      $1,350.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-surface-subtle/50">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-on-surface-variant"
                        style={{ fontSize: 16 }}
                      >
                        water
                      </span>
                      <span className="font-body-sm text-on-surface">
                        Irrigation system repair
                      </span>
                    </div>
                    <span className="font-body-sm font-semibold text-on-surface">
                      $480.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-surface-subtle/50">
                    <div className="flex items-center gap-2">
                      <span
                        className="material-symbols-outlined text-on-surface-variant"
                        style={{ fontSize: 16 }}
                      >
                        build
                      </span>
                      <span className="font-body-sm text-on-surface">
                        Labour — 6 hours
                      </span>
                    </div>
                    <span className="font-body-sm font-semibold text-on-surface">
                      $720.00
                    </span>
                  </div>
                </div>

                {/* Totals */}
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between font-body-sm text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>$2,550.00</span>
                  </div>
                  <div className="flex justify-between font-body-sm text-on-surface-variant">
                    <span>GST (10%)</span>
                    <span>$255.00</span>
                  </div>
                  <div className="flex justify-between font-headline-sm text-growth-green pt-2 border-t border-surface-subtle">
                    <span>Total</span>
                    <span>$2,805.00</span>
                  </div>
                </div>

                {/* AI Badge */}
                <div className="flex items-center gap-2 pt-2">
                  <span
                    className="material-symbols-outlined text-growth-green"
                    style={{
                      fontSize: 14,
                      fontVariationSettings:
                        "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                    }}
                  >
                    auto_awesome
                  </span>
                  <span className="font-label-mono text-[10px] text-growth-green uppercase tracking-widest">
                    AI Generated in 30s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
