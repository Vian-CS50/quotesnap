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
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Left */}
          <div>
            <a href="#" className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4" style={{ color: "#5e6ad2" }} />
              <span
                className="text-sm tracking-tight"
                style={{ color: "#f7f8f8", fontWeight: 510, letterSpacing: "-0.13px" }}
              >
                QuoteSnap
              </span>
            </a>
            <p className="text-xs" style={{ color: "#62666d" }}>
              Built in Adelaide, Australia 🇦🇺
            </p>
          </div>

          {/* Center */}
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs transition-colors hover:text-white"
                style={{ color: "#8a8f98" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-3">
            <a
              href="mailto:support@quotesnap.com.au"
              className="text-xs transition-colors hover:text-white"
              style={{ color: "#8a8f98" }}
            >
              Support
            </a>
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: health?.ok ? "#5e6ad2" : health?.status === "offline" ? "#62666d" : "#62666d",
                }}
              />
              <span className="text-xs" style={{ color: "#62666d" }}>
                {health?.ok
                  ? "All systems operational"
                  : health?.status === "offline"
                  ? "Backend offline"
                  : "Checking..."}
              </span>
            </div>
          </div>
        </div>

        <div
          className="pt-6 text-center"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-xs" style={{ color: "#62666d" }}>
            &copy; 2026 QuoteSnap. Not American. Not corporate.
          </p>
        </div>
      </div>
    </footer>
  );
}
