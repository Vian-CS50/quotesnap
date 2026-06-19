"use client";

import { ReactNode } from "react";
import { SettingsProvider } from "./SettingsContext";
import { QuoteProvider } from "./QuoteContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <QuoteProvider>{children}</QuoteProvider>
    </SettingsProvider>
  );
}
