"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "./MaterialIcon";
import { cn } from "@/lib/utils";

export interface Toast {
  id: string;
  type: "error" | "warning" | "success";
  title: string;
  message?: string;
}

interface ErrorToastProps {
  toast: Toast;
  onClose: () => void;
}

export function ErrorToast({ toast, onClose }: ErrorToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => Math.max(0, p - 2));
    }, 100);
    const closeTimer = setTimeout(onClose, 5000);
    return () => {
      clearInterval(timer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const isError = toast.type === "error";
  const borderClass = isError ? "border-error" : toast.type === "warning" ? "border-utility-gold" : "border-growth-green";
  const iconClass = isError ? "text-error" : toast.type === "warning" ? "text-utility-gold" : "text-growth-green";
  const iconName = isError ? "cloud_off" : toast.type === "warning" ? "warning" : "check_circle";

  return (
    <div
      className={cn(
        "bg-slate-deep text-white p-4 rounded-lg flex items-center justify-between shadow-lg border-l-4 min-w-[320px] max-w-md",
        borderClass,
        isError ? "animate-error-shake" : ""
      )}
    >
      <div className="flex items-center gap-3">
        <MaterialIcon name={iconName} className={iconClass} size={24} />
        <div>
          <p className="text-body-sm font-bold">{toast.title}</p>
          {toast.message && <p className="text-xs opacity-70">{toast.message}</p>}
        </div>
      </div>
      <button onClick={onClose} className="text-white opacity-50 hover:opacity-100">
        <MaterialIcon name="close" size={20} />
      </button>
      <div
        className={cn("absolute bottom-0 left-0 h-0.5 rounded-bl-lg", iconClass.replace("text-", "bg-"))}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
