"use client";

import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8341";

export default function Footer() {
  const [health, setHealth] = useState<{ status: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((r) => r.json())
      .then((d) => setHealth({ status: d.status || "unknown", ok: d.status === "ok" }))
      .catch(() => setHealth({ status: "offline", ok: false }));
  }, []);

  const links = [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Demo", href: "#demo" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Data Processing", href: "/dpa" },
  ];

  return (
    <footer className="border-t py-12" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Left */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              <span className="font-bold text-lg tracking-tight" style={{ color: 'var(--foreground)' }}>
                QuoteSnap
              </span>
            </a>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Built in Adelaide, Australia 🇦🇺
            </p>
          </div>

          {/* Center */}
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-3">
            <a href="mailto:vtradesof@gmail.com"
            className="text-sm transition-colors"
            style={{ color: 'var(--text-muted)' }}
            >
            Support
            </a>
            {/* TODO: Change to support@quotesnap.com.au once domain is purchased */}
            {legalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm transition-colors"
                style={{ color: 'var(--text-muted)' }}
              >
                {link.label}
              </a>
            ))}
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 ${
                  health?.ok ? "" : ""
                }`}
                style={{ 
                  backgroundColor: health?.ok ? 'var(--primary)' : 'var(--text-muted)',
                  borderRadius: '0px'
                }}
              />
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {health?.ok
                  ? "All systems operational"
                  : health?.status === "offline"
                  ? "Backend offline"
                  : "Checking..."}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            &copy; 2026 QuoteSnap. Built with sweat, not templates.
          </p>
        </div>
      </div>
    </footer>
  );
}
