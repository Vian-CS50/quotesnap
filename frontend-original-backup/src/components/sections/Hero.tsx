"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";
import PhoneMockup from "../PhoneMockup";

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  // Listen for global video open events from Navbar / FAB
  useEffect(() => {
    const handler = () => setShowVideo(true);
    window.addEventListener("open-demo-video", handler);
    return () => window.removeEventListener("open-demo-video", handler);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-1/2 -right-1/2 w-full h-full opacity-20 animate-mesh-rotate"
          style={{
            background:
              "radial-gradient(circle at center, rgba(16,185,129,0.4), transparent 60%)",
          }}
        />
        <div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full opacity-10 animate-mesh-rotate"
          style={{
            background:
              "radial-gradient(circle at center, rgba(5,150,105,0.4), transparent 60%)",
            animationDirection: "reverse",
            animationDuration: "12s",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-8"
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Built for Adelaide landscapers
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6"
          >
            Win more landscaping jobs.{" "}
            <span className="text-primary">Automatically.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base md:text-lg leading-relaxed text-muted max-w-2xl mx-auto mb-10"
          >
            AI writes your quote from a voice memo. Then reminds you to follow up so you stop losing jobs to forgetfulness.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#demo"
              className="h-12 px-8 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-base inline-flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              Try Free
            </a>
            <button
              onClick={() => setShowVideo(true)}
              className="h-12 px-8 rounded-xl border border-card-border hover:border-foreground/20 text-foreground font-medium text-base inline-flex items-center justify-center transition-colors gap-2"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </motion.div>

          {/* Phone Mockup */}
          <div className="mt-16">
            <PhoneMockup />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
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
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="rounded-2xl overflow-hidden bg-black shadow-2xl">
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
