"use client";

import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function VideoFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.dispatchEvent(new CustomEvent("open-demo-video"))}
          className="fixed bottom-6 right-6 z-40 h-12 px-5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors"
        >
          <Play className="w-4 h-4" />
          Watch Demo
        </motion.button>
      )}
    </AnimatePresence>
  );
}
