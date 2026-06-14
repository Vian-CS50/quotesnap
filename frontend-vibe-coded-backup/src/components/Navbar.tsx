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
    <nav 
      className="fixed top-0 left-0 right-0 z-50 border-b" 
      style={{ 
        backgroundColor: 'rgba(var(--color-background-rgb), 0.9)', 
        borderColor: 'var(--border)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <Leaf className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          <span className="font-serif font-bold text-lg tracking-tight" style={{ color: 'var(--foreground)' }}>
            QuoteSnap
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-mono uppercase tracking-wider transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("open-demo-video"))}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 border font-mono text-xs uppercase tracking-wider transition-colors"
            style={{ 
              borderColor: 'var(--border)', 
              color: 'var(--foreground)',
              borderRadius: '0px'
            }}
          >
            <Play className="w-3.5 h-3.5" />
            Watch Demo
          </button>
          <a
            href="#demo"
            className="inline-flex items-center justify-center h-10 px-5 font-mono text-xs uppercase tracking-wider transition-colors"
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'white',
              borderRadius: '0px'
            }}
          >
            Try Free
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2"
          style={{ color: 'var(--foreground)' }}
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
            className="md:hidden border-b overflow-hidden"
            style={{ 
              backgroundColor: 'var(--background)', 
              borderColor: 'var(--border)'
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm py-2 font-mono uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  window.dispatchEvent(new CustomEvent("open-demo-video"));
                }}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-5 border font-mono text-xs uppercase tracking-wider transition-colors"
                style={{ 
                  borderColor: 'var(--border)', 
                  color: 'var(--foreground)',
                  borderRadius: '0px'
                }}
              >
                <Play className="w-3.5 h-3.5" />
                Watch Demo
              </button>
              <a
                href="#demo"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center h-10 px-5 font-mono text-xs uppercase tracking-wider transition-colors mt-2"
                style={{ 
                  backgroundColor: 'var(--primary)', 
                  color: 'white',
                  borderRadius: '0px'
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
