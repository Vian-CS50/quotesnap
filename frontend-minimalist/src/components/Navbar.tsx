"use client";

import { useState } from "react";
import { List, X, Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Demo", href: "#demo" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDFCFA] border-b border-[#D6D3D1]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight text-[#1C1917]">
            QuoteSnap
          </span>
        </a>

        {/* Desktop Links — explicit margins instead of gap for robust spacing */}
        <div className="hidden md:flex items-center">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="mx-4 text-sm text-[#78716C] hover:text-[#1C1917] transition-colors font-medium"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-demo-video"))}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-sm border border-[#D6D3D1] hover:border-[#78716C] text-[#1C1917] font-medium text-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Watch Demo
          </button>
          <a
            href="#demo"
            className="ml-3 inline-flex items-center justify-center h-10 px-5 rounded-sm bg-[#1C1917] hover:bg-[#44403C] text-white font-semibold text-sm transition-colors"
          >
            Try Free
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-[#1C1917]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FDFCFA] border-b border-[#D6D3D1] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-[#78716C] hover:text-[#1C1917] font-medium py-1"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#demo"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center h-10 rounded-sm bg-[#1C1917] text-white font-semibold text-sm leading-10 mt-2"
              >
                Try Free
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
