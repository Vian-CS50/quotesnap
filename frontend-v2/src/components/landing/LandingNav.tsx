"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          backgroundColor: "rgba(252, 249, 248, 0.9)",
        }}
        aria-label="Main navigation"
      >
        <nav className="max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop h-16 flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-on-surface-variant hover:text-growth-green transition-colors font-body-sm active:scale-95"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-on-surface-variant hover:text-growth-green transition-colors font-body-sm active:scale-95"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="text-on-surface-variant hover:text-growth-green transition-colors font-body-sm active:scale-95"
            >
              Pricing
            </button>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-on-surface-variant hover:text-growth-green transition-colors font-body-sm active:scale-95"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-growth-green text-white font-button-text rounded-lg px-5 py-2.5 hover:bg-opacity-90 active:scale-95 transition-all min-h-[44px] flex items-center"
            >
              New Quote
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <MaterialIcon
              name={mobileMenuOpen ? "close" : "menu"}
              size={24}
              className="text-on-surface"
            />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" style={{ top: "64px" }}>
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute top-0 left-0 right-0 bg-surface border-b border-surface-subtle p-6 flex flex-col gap-4 shadow-lg">
            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-left text-on-surface font-body-md py-3 px-2 rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 min-h-[44px]"
            >
              How it Works
            </button>
            <button
              onClick={() => scrollTo("how-it-works")}
              className="text-left text-on-surface font-body-md py-3 px-2 rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 min-h-[44px]"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="text-left text-on-surface font-body-md py-3 px-2 rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 min-h-[44px]"
            >
              Pricing
            </button>
            <hr className="border-surface-subtle" />
            <Link
              href="/login"
              className="text-on-surface-variant font-body-md py-3 px-2 rounded-lg hover:bg-surface-container-low transition-colors active:scale-95 min-h-[44px]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-growth-green text-white font-button-text rounded-lg px-5 py-3 text-center hover:bg-opacity-90 active:scale-95 transition-all min-h-[44px] flex items-center justify-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              New Quote
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
