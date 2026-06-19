"use client";

export function Footer() {
  return (
    <footer className="w-full border-t border-surface-subtle bg-surface-container-lowest py-8 px-8 mt-auto">
      <div className="max-w-container-max-width mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-label-mono text-label-mono uppercase tracking-widest text-growth-green font-bold">
            QuoteSnap Pro
          </span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 QuoteSnap Pro. All rights reserved.</p>
        </div>
        <div className="flex gap-6">
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-growth-green transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-growth-green transition-colors" href="#">
            Terms of Service
          </a>
          <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-growth-green transition-colors" href="#">
            Legal
          </a>
        </div>
      </div>
    </footer>
  );
}
