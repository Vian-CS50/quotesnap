"use client";

import { useState } from "react";
import { Leaf, Menu, X, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Demo", href: "#demo" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg tracking-tight text-foreground">
            QuoteSnap
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-demo-video"))}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl border border-card-border hover:border-foreground/20 text-foreground font-medium text-sm transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Watch Demo
          </button>
          <a
            href="#demo"
            className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-colors"
          >
            Try Free
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-card-border overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-muted hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new CustomEvent("open-demo-video"));
                }}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl border border-card-border hover:border-foreground/20 text-foreground font-medium text-sm transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                Watch Demo
              </button>
              <a
                href="#demo"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center h-10 px-5 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-colors mt-2"
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
