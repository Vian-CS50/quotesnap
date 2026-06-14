"use client";

import { useState } from "react";
import { Leaf, Menu, X, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(8,9,10,0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <Leaf className="w-4 h-4" style={{ color: "#5e6ad2" }} />
          <span
            className="text-sm tracking-tight"
            style={{ color: "#f7f8f8", fontWeight: 510, letterSpacing: "-0.13px" }}
          >
            QuoteSnap
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs transition-colors hover:text-white"
              style={{ color: "#8a8f98", fontWeight: 510 }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-demo-video"))}
            className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded text-xs transition-colors"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#d0d6e0",
              fontWeight: 510,
            }}
          >
            <Play className="w-3 h-3" />
            Watch Demo
          </button>
          <a
            href="#demo"
            className="inline-flex items-center justify-center h-8 px-4 rounded text-xs transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "#5e6ad2",
              color: "#ffffff",
              fontWeight: 510,
            }}
          >
            Try Free
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2"
          style={{ color: "#f7f8f8" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{
              background: "rgba(8,9,10,0.95)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-xs py-2 transition-colors hover:text-white"
                  style={{ color: "#8a8f98", fontWeight: 510 }}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new CustomEvent("open-demo-video"));
                }}
                className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded text-xs transition-colors mt-1"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#d0d6e0",
                  fontWeight: 510,
                }}
              >
                <Play className="w-3 h-3" />
                Watch Demo
              </button>
              <a
                href="#demo"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center h-8 px-4 rounded text-xs transition-all hover:opacity-90"
                style={{
                  background: "#5e6ad2",
                  color: "#ffffff",
                  fontWeight: 510,
                }}
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
