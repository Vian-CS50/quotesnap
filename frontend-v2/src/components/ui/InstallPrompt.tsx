"use client";

import { useEffect, useState, useCallback } from "react";
import { MaterialIcon } from "./MaterialIcon";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "quotesnap_install_prompt_dismissed";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if previously dismissed
    try {
      const stored = localStorage.getItem(DISMISS_KEY);
      if (stored === "true") {
        setDismissed(true);
      }
    } catch {
      // localStorage may be unavailable in some contexts
    }

    // Detect mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // ignore
    }
  }, []);

  const visible = deferredPrompt !== null && !dismissed && isMobile;

  return (
    <div
      className={cn(
        "fixed bottom-16 left-4 right-4 z-50 transition-transform duration-300 md:hidden",
        visible ? "translate-y-0" : "translate-y-[150%]"
      )}
      role="dialog"
      aria-hidden={!visible}
      aria-label="Install app prompt"
    >
      <div className="bg-growth-green text-white p-4 rounded-xl shadow-lg flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <MaterialIcon name="download" size={24} className="text-white flex-shrink-0" />
          <p className="font-body-sm text-sm leading-snug">
            Add QuoteSnap to your home screen for quick access.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleInstall}
            className="bg-white text-growth-green font-button-text text-sm px-4 h-10 rounded-lg hover:bg-primary-fixed active:scale-95 transition-all"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 active:scale-95 transition-all"
            aria-label="Dismiss install prompt"
          >
            <MaterialIcon name="close" size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
