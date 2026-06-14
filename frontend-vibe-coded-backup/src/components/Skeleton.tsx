"use client";

import { motion } from "framer-motion";

export function SkeletonLine({ width = "100%", height = "1rem" }: { width?: string; height?: string }) {
  return (
    <motion.div
      className="animate-pulse"
      style={{
        width,
        height,
        backgroundColor: "var(--border-light)",
        borderRadius: "0px",
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 p-4 border-2" style={{ borderColor: "var(--border)", borderRadius: "0px" }}>
      <SkeletonLine width="60%" height="1.5rem" />
      <SkeletonLine width="100%" height="0.875rem" />
      <SkeletonLine width="80%" height="0.875rem" />
      <div className="flex gap-2 pt-2">
        <SkeletonLine width="5rem" height="2rem" />
        <SkeletonLine width="5rem" height="2rem" />
      </div>
    </div>
  );
}

export function SkeletonQuote() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SkeletonLine width="40%" height="1.5rem" />
        <SkeletonLine width="20%" height="1.5rem" />
      </div>
      <div className="space-y-2">
        <SkeletonLine width="100%" height="3rem" />
        <SkeletonLine width="100%" height="3rem" />
        <SkeletonLine width="100%" height="3rem" />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <SkeletonLine width="8rem" height="2.5rem" />
        <SkeletonLine width="8rem" height="2.5rem" />
      </div>
    </div>
  );
}
