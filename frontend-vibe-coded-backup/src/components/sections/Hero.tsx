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
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
            className="inline-flex items-center gap-2 border text-xs font-medium px-3 py-1.5 mb-8"
            style={{ 
              backgroundColor: 'rgba(27, 77, 62, 0.1)', 
              borderColor: 'rgba(27, 77, 62, 0.2)', 
              color: 'var(--primary)',
              borderRadius: '0px'
            }}
          >
            <span className="w-1.5 h-1.5 animate-pulse" style={{ backgroundColor: 'var(--primary)' }} />
            Built for Adelaide landscapers
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0 }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-tight mb-6"
            style={{ color: 'var(--foreground)', lineHeight: 1.1 }}
          >
            Win more landscaping jobs.{" "}
            <span style={{ color: 'var(--primary)' }}>Automatically.</span>
          </motion.h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10"
            style={{ color: 'var(--text-secondary)' }}
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
              className="h-12 px-8 font-mono text-xs uppercase tracking-wider inline-flex items-center justify-center transition-colors"
              style={{ 
                backgroundColor: 'var(--primary)', 
                color: 'white',
                borderRadius: '0px'
              }}
            >
              Try Free
            </a>
            <button
              onClick={() => setShowVideo(true)}
              className="h-12 px-8 font-mono text-xs uppercase tracking-wider inline-flex items-center justify-center transition-colors gap-2 border"
              style={{ 
                borderColor: 'var(--border)', 
                color: 'var(--foreground)',
                borderRadius: '0px'
              }}
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
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
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="overflow-hidden bg-black" style={{ borderRadius: '0px' }}>
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
