"use client";

import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { cn } from "@/lib/utils";

const steps = ["Draft", "Review", "Finalize"] as const;

export function ProgressIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;
        const isLast = idx === steps.length - 1;

        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors",
                  isActive
                    ? "bg-growth-green text-white border-growth-green"
                    : isCompleted
                    ? "bg-surface-container border-growth-green text-growth-green"
                    : "bg-surface-container border-outline text-on-surface-variant"
                )}
              >
                {isCompleted ? (
                  <MaterialIcon name="check" size={16} />
                ) : (
                  <span className="font-label-mono text-sm">{stepNum}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-label-mono",
                  isActive ? "text-growth-green font-bold" : "text-on-surface-variant opacity-50"
                )}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "w-12 h-[2px] mb-4",
                  isCompleted ? "bg-growth-green" : "bg-surface-variant"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
