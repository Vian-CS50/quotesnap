"use client";

import { useState, useEffect } from "react";

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
    <footer className="bg-white border-t border-[#D6D3D1] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <a href="#" className="flex items-center gap-2 mb-3">
              <span className="font-bold text-lg tracking-tight text-[#1C1917]">
                QuoteSnap
              </span>
            </a>
            <p className="text-sm text-[#A8A29E]">
              Built in Adelaide, Australia
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[#78716C] hover:text-[#1C1917] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="text-right">
            <p className="text-xs text-[#A8A29E]">
              Status:{" "}
              <span
                className={`inline-block w-2 h-2 mr-1 ${
                  health?.ok ? "bg-[#C2410C]" : "bg-[#D6D3D1]"
                }`}
              />
              {health?.status || "checking..."}
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#D6D3D1] text-center">
          <p className="text-xs text-[#A8A29E]">
            &copy; {new Date().getFullYear()} QuoteSnap. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
