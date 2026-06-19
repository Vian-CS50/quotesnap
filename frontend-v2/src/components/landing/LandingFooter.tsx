"use client";

import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-surface-subtle h-16 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max-width mx-auto h-full flex flex-col md:flex-row items-center justify-between gap-2 py-4 md:py-0">
        {/* Left: Logo */}
        <Link
          href="/"
          className="font-headline-sm font-bold text-growth-green flex items-center gap-2 active:scale-95 transition-transform"
          aria-label="QuoteSnap home"
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontVariationSettings:
                "'FILL' 1, 'wght' 600, 'GRAD' 0, 'opsz' 24",
            }}
          >
            potted_plant
          </span>
          QuoteSnap
        </Link>

        {/* Center: Links */}
        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            href="/terms"
            className="font-label-mono uppercase tracking-widest text-on-surface-variant text-[10px] md:text-label-mono hover:text-growth-green transition-colors active:scale-95 min-h-[44px] flex items-center"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="font-label-mono uppercase tracking-widest text-on-surface-variant text-[10px] md:text-label-mono hover:text-growth-green transition-colors active:scale-95 min-h-[44px] flex items-center"
          >
            Privacy
          </Link>
          <Link
            href="/status"
            className="font-label-mono uppercase tracking-widest text-on-surface-variant text-[10px] md:text-label-mono hover:text-growth-green transition-colors active:scale-95 min-h-[44px] flex items-center"
          >
            Status
          </Link>
          <Link
            href="/docs"
            className="font-label-mono uppercase tracking-widest text-on-surface-variant text-[10px] md:text-label-mono hover:text-growth-green transition-colors active:scale-95 min-h-[44px] flex items-center"
          >
            Documentation
          </Link>
        </nav>

        {/* Right: Location */}
        <span className="font-label-mono uppercase tracking-widest text-on-surface-variant text-[10px] md:text-label-mono">
          Built in Adelaide, Australia 🇦🇺
        </span>
      </div>
    </footer>
  );
}
