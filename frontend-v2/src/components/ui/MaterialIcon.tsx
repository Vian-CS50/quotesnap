"use client";

import { cn } from "@/lib/utils";

interface MaterialIconProps {
  name: string;
  className?: string;
  filled?: boolean;
  size?: number;
}

export function MaterialIcon({ name, className, filled = false, size = 24 }: MaterialIconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
    >
      {name}
    </span>
  );
}
