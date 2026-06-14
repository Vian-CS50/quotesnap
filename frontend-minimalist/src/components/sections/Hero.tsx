"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import PhoneMockup from "../PhoneMockup";

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const handler = () => setShowVideo(true);
    window.addEventListener("open-demo-video", handler);
    return () => window.removeEventListener("open-demo-video", handler);
  }, []);

  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-[#FDFCFA]">
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="reveal reveal-d1 inline-flex items-center gap-2 bg-[#FFF5F0] text-[#C2410C] text-xs font-semibold px-4 py-2 rounded-sm mb-8">
            Built for Adelaide landscapers
          </div>

          <h1 className="reveal reveal-d2 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#1C1917] mb-8">
            Win more jobs.{" "}
            <span className="text-[#C2410C]">Automatically.</span>
          </h1>

          <p className="reveal reveal-d3 text-lg md:text-xl leading-relaxed text-[#78716C] max-w-2xl mx-auto mb-12">
            AI writes your quote from a voice memo. Then reminds you to follow up 
            so you stop losing jobs to forgetfulness.
          </p>

          <div className="reveal reveal-d4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#demo"
              className="h-14 px-10 rounded-sm bg-[#1C1917] hover:bg-[#44403C] text-white font-semibold text-base inline-flex items-center justify-center transition-colors"
            >
              Try Free
            </a>
            <button
              onClick={() => setShowVideo(true)}
              className="h-14 px-8 rounded-sm border border-[#D6D3D1] hover:border-[#78716C] text-[#1C1917] font-medium text-base inline-flex items-center justify-center transition-colors gap-2"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </div>

          <div className="reveal reveal-d4 mt-20">
            <PhoneMockup />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
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
              <div className="rounded-sm overflow-hidden bg-black">
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
