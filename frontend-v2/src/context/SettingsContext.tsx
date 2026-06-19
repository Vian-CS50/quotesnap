"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { AppSettings } from "@/types";

const DEFAULT_SETTINGS: AppSettings = {
  businessProfile: {
    businessName: "Evergreen Landscapes & Co.",
    abn: "45 123 456 789",
    email: "ops@evergreen-landscapes.au",
    phone: "+61 400 123 456",
    address: "12 Industrial Drive, Oakleigh South, VIC 3167, Australia",
    logoUrl: "",
  },
  brandColors: {
    primary: "#1B4D3E",
    accent: "#D49D26",
    text: "#1A1A1A",
  },
  labourRates: {
    defaultHourlyRate: 65,
    crewRate: 45,
    minimumCharge: 250,
  },
  taxSettings: {
    gstRate: 10,
    taxNumber: "",
    isRegistered: true,
  },
  quoteDefaults: {
    defaultExpiryDays: 30,
    taxRate: 10,
    paymentTerms:
      "50% commencement deposit required. Remaining balance due within 7 days of practical completion of landscaping works.",
    termsOfService:
      "Quote is based on visible site conditions. Concealed rock or underground services may incur additional excavation costs. Access for machinery must be maintained throughout project duration.",
    standardMargin: 35,
  },
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  updateBusinessProfile: (patch: Partial<AppSettings["businessProfile"]>) => void;
  updateBrandColors: (patch: Partial<AppSettings["brandColors"]>) => void;
  updateLabourRates: (patch: Partial<AppSettings["labourRates"]>) => void;
  updateTaxSettings: (patch: Partial<AppSettings["taxSettings"]>) => void;
  updateQuoteDefaults: (patch: Partial<AppSettings["quoteDefaults"]>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("quotesnap-settings");
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("quotesnap-settings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (patch: Partial<AppSettings>) =>
    setSettings((s) => ({ ...s, ...patch }));

  const updateBusinessProfile = (patch: Partial<AppSettings["businessProfile"]>) =>
    setSettings((s) => ({ ...s, businessProfile: { ...s.businessProfile, ...patch } }));

  const updateBrandColors = (patch: Partial<AppSettings["brandColors"]>) =>
    setSettings((s) => ({ ...s, brandColors: { ...s.brandColors, ...patch } }));

  const updateLabourRates = (patch: Partial<AppSettings["labourRates"]>) =>
    setSettings((s) => ({ ...s, labourRates: { ...s.labourRates, ...patch } }));

  const updateTaxSettings = (patch: Partial<AppSettings["taxSettings"]>) =>
    setSettings((s) => ({ ...s, taxSettings: { ...s.taxSettings, ...patch } }));

  const updateQuoteDefaults = (patch: Partial<AppSettings["quoteDefaults"]>) =>
    setSettings((s) => ({ ...s, quoteDefaults: { ...s.quoteDefaults, ...patch } }));

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateBusinessProfile,
        updateBrandColors,
        updateLabourRates,
        updateTaxSettings,
        updateQuoteDefaults,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
