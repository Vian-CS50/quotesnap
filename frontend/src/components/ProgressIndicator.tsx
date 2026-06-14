"use client";

import { Wand2 } from "lucide-react";

export default function ProgressIndicator() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-card-border border-t-primary animate-spin" />
        <Wand2 className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <p className="text-sm text-muted font-medium">Writing your quote...</p>
    </div>
  );
}
