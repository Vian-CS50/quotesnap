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

  return (
    <footer className="bg-[#050811] border-t border-card-border py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Left */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-3">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="font-bold text-lg tracking-tight text-foreground">
                QuoteSnap
              </span>
            </a>
            <p className="text-sm text-muted">
              Built in Adelaide, Australia 🇦🇺
            </p>
          </div>

          {/* Center */}
          <div className="flex flex-col gap-2">
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

          {/* Right */}
          <div className="flex flex-col gap-3">
            <a
              href="mailto:support@quotesnap.com.au"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Support
            </a>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  health?.ok ? "bg-primary" : "bg-muted"
                }`}
              />
              <span className="text-xs text-muted">
                {health?.ok
                  ? "All systems operational"
                  : health?.status === "offline"
                  ? "Backend offline"
                  : "Checking..."}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-card-border pt-6 text-center">
          <p className="text-xs text-muted">
            &copy; 2026 QuoteSnap. Not American. Not corporate.
          </p>
        </div>
      </div>
    </footer>
  );
}
