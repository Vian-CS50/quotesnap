"use client";

import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          onClick={() => window.dispatchEvent(new CustomEvent("open-demo-video"))}
          className="fixed bottom-6 right-6 z-40 h-12 px-5 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
          style={{ 
            backgroundColor: 'var(--accent)', 
            color: 'white',
            borderRadius: '0px'
          }}
        >
          <Play className="w-4 h-4" />
          Watch Demo
        </motion.button>
      )}
    </AnimatePresence>
  );
}
