"use client";

export function LoadingShimmer({ text = "Parsing dimensions..." }: { text?: string }) {
  return (
    <div className="h-16 w-full animate-ai-shimmer bg-surface-container-lowest rounded-lg border border-dashed border-outline-variant flex items-center px-4">
      <span className="font-body-sm italic text-on-surface-variant">{text}</span>
    </div>
  );
}
