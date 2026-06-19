"use client";

export function Footer() {
  return (
    <footer className="hidden md:flex h-16 bg-surface-container-lowest border-t border-surface-subtle items-center justify-between px-8">
      <span className="font-headline-sm text-headline-sm text-growth-green font-bold">
        QuoteSnap
      </span>
      <div className="flex items-center gap-6">
        <a href="#" className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant hover:text-growth-green transition-colors">
          Terms
        </a>
        <a href="#" className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant hover:text-growth-green transition-colors">
          Privacy
        </a>
        <a href="#" className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant hover:text-growth-green transition-colors">
          Status
        </a>
        <a href="#" className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant hover:text-growth-green transition-colors">
          Documentation
        </a>
      </div>
      <span className="font-label-mono text-label-mono text-on-surface-variant">
        Built in Adelaide, Australia 🇦🇺
      </span>
    </footer>
  );
}
