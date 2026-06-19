"use client";

import { cn } from "@/lib/utils";

interface StatusChipProps {
  status: string;
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  const lower = status.toLowerCase();
  const colorClass =
    lower === "won" || lower === "in-stock" || lower === "paid"
      ? "bg-primary-container text-on-primary-container"
      : lower === "sent" || lower === "pending approval"
      ? "bg-secondary-fixed text-on-secondary-fixed"
      : lower === "draft"
      ? "bg-surface-container-highest text-on-surface-variant"
      : lower === "lost" || lower === "low stock"
      ? "bg-error-container text-on-error-container"
      : "bg-surface-container text-on-surface-variant";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold font-label-mono uppercase tracking-wide",
        colorClass,
        className
      )}
    >
      {status}
    </span>
  );
}
