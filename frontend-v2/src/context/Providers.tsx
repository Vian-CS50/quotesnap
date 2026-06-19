"use client";

import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { SettingsProvider } from "./SettingsContext";
import { QuoteProvider } from "./QuoteContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <SettingsProvider>
          <QuoteProvider>{children}</QuoteProvider>
        </SettingsProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
