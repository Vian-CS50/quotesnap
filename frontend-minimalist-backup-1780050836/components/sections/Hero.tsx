"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Mic, FileText, Clock } from "lucide-react";
import ParticleBackground from "../ParticleBackground";

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const handler = () => setShowVideo(true);
    window.addEventListener("open-demo-video", handler);
    return () => window.removeEventListener("open-demo-video", handler);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <ParticleBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="lg:col-span-3">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 mb-8"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "6px",
                padding: "6px 12px",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#5e6ad2" }} />
              <span className="text-xs font-medium" style={{ color: "#8a8f98", fontWeight: 510 }}>
                Built for Adelaide landscapers
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl md:text-5xl lg:text-[56px] font-medium tracking-tight mb-6"
              style={{
                color: "#f7f8f8",
                lineHeight: 1.03,
                letterSpacing: "-1.4px",
                fontWeight: 510,
              }}
            >
              Win more landscaping jobs. Automatically.
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-base md:text-lg leading-relaxed mb-10 max-w-xl"
              style={{ color: "#8a8f98", lineHeight: 1.6, letterSpacing: "-0.165px" }}
            >
              AI writes your quote from a voice memo. Then reminds you to follow up so you stop losing jobs to forgetfulness.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <a
                href="#demo"
                className="h-11 px-6 rounded-md font-medium text-sm inline-flex items-center justify-center transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "#5e6ad2",
                  color: "#ffffff",
                  fontWeight: 510,
                }}
              >
                Try Free
              </a>
              <button
                onClick={() => setShowVideo(true)}
                className="h-11 px-6 rounded-md font-medium text-sm inline-flex items-center justify-center gap-2 transition-all hover:opacity-80"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#d0d6e0",
                  fontWeight: 510,
                }}
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </button>
            </motion.div>

            {/* Micro stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-6 mt-10"
            >
              {[
                { icon: Clock, label: "30 sec", desc: "per quote" },
                { icon: Mic, label: "Voice", desc: "to PDF" },
                { icon: FileText, label: "ATO", desc: "ready" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" style={{ color: "#62666d" }} />
                  <div>
                    <span className="text-xs font-medium" style={{ color: "#d0d6e0", fontWeight: 510 }}>{item.label}</span>
                    <span className="text-xs ml-1" style={{ color: "#62666d" }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Product screenshot / abstract visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {/* Mock quote preview */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: "#62666d", fontWeight: 510 }}>QUOTE #QS-2847</p>
                    <p className="text-sm" style={{ color: "#f7f8f8", fontWeight: 510 }}>Retaining Wall — Golden Grove</p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: "rgba(94,106,210,0.1)",
                      color: "#7170ff",
                      fontWeight: 510,
                    }}
                  >
                    Draft
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { item: "Concrete sleepers (200x50mm)", qty: "24 units", price: "$1,440" },
                    { item: "Labour — 2 crew x 2 days", qty: "32 hrs", price: "$2,560" },
                    { item: "Steel posts 100UC", qty: "12 units", price: "$720" },
                    { item: "GST (10%)", qty: "", price: "$472" },
                  ].map((line, i) => (
                    <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <div>
                        <p className="text-sm" style={{ color: "#d0d6e0" }}>{line.item}</p>
                        {line.qty && <p className="text-xs mt-0.5" style={{ color: "#62666d" }}>{line.qty}</p>}
                      </div>
                      <p className="text-sm font-medium" style={{ color: "#f7f8f8", fontWeight: 510 }}>{line.price}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-sm" style={{ color: "#8a8f98" }}>Total</p>
                  <p className="text-lg font-medium" style={{ color: "#f7f8f8", fontWeight: 590 }}>$5,192.00</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-[400px] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute -top-12 right-0 transition-colors"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="rounded-xl overflow-hidden" style={{ background: "#0f1011", border: "1px solid rgba(255,255,255,0.08)" }}>
                <video
                  src="/demo-video.mp4"
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-auto"
                  style={{ aspectRatio: "9/16" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
