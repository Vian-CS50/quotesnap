"use client";

import { useState, useRef, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

const BRAND_COLORS = [
  { name: "Forest", value: "#1B4D3E" },
  { name: "Gold", value: "#D49D26" },
  { name: "Brown", value: "#7c5800" },
  { name: "Terracotta", value: "#4c221c" },
  { name: "Sage", value: "#376757" },
  { name: "Slate", value: "#1A1A1A" },
];

const FONTS = [
  { label: "Inter (Modern Clean)", value: "Inter" },
  { label: "Roboto (Professional)", value: "Roboto" },
  { label: "Merriweather (Classic Serif)", value: "Merriweather" },
  { label: "JetBrains Mono (Industrial)", value: "JetBrains Mono" },
];

export default function SettingsPage() {
  const {
    settings,
    updateBusinessProfile,
    updateBrandColors,
    updateLabourRates,
    updateTaxSettings,
    updateQuoteDefaults,
  } = useSettings();

  const { businessProfile, brandColors, labourRates, taxSettings, quoteDefaults } = settings;
  const [saved, setSaved] = useState(false);
  const [selectedColor, setSelectedColor] = useState(brandColors.primary);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [fontSize, setFontSize] = useState<"standard" | "compact">("standard");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const handleLogoDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            updateBusinessProfile({ logoUrl: ev.target.result as string });
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [updateBusinessProfile]
  );

  const handleLogoClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleLogoFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            updateBusinessProfile({ logoUrl: ev.target.result as string });
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [updateBusinessProfile]
  );

  const handleColorSelect = useCallback(
    (color: string) => {
      setSelectedColor(color);
      updateBrandColors({ primary: color });
    },
    [updateBrandColors]
  );

  return (
    <AppShell title="Business Settings" footer={<Footer />}>
      <div className="px-margin-mobile md:px-margin-desktop py-8 max-w-container-max-width mx-auto w-full">
        <header className="mb-10">
          <h1 className="font-headline-lg text-headline-lg text-growth-green mb-2">
            Business Settings & Branding
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Manage your landscaping business profile, configure professional PDF branding, and set global quote defaults.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Settings Forms */}
          <div className="lg:col-span-8 space-y-gutter">
            {/* Business Profile */}
            <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MaterialIcon name="business" className="text-growth-green" />
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Business Profile</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Business Name"
                  value={businessProfile.businessName}
                  onChange={(v) => updateBusinessProfile({ businessName: v })}
                />
                <Input
                  label="ABN / Tax ID"
                  value={businessProfile.abn}
                  onChange={(v) => updateBusinessProfile({ abn: v })}
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value={businessProfile.email}
                  onChange={(v) => updateBusinessProfile({ email: v })}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={businessProfile.phone}
                  onChange={(v) => updateBusinessProfile({ phone: v })}
                />
                <div className="md:col-span-2 space-y-1">
                  <label className="font-body-sm font-bold text-on-surface-variant">Business Address</label>
                  <textarea
                    value={businessProfile.address}
                    onChange={(e) => updateBusinessProfile({ address: e.target.value })}
                    rows={2}
                    className="w-full bg-surface-base border border-outline-variant rounded-lg focus:border-growth-green focus:ring-1 focus:ring-growth-green px-4 py-2 text-body-md"
                  />
                </div>
              </div>
            </section>

            {/* Visual Identity */}
            <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MaterialIcon name="palette" className="text-growth-green" />
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Visual Identity</h2>
              </div>
              <div className="space-y-8">
                {/* Logo Upload */}
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div
                    className="w-32 h-32 bg-surface-container flex items-center justify-center border-2 border-dashed border-outline-variant rounded-xl overflow-hidden relative group cursor-pointer"
                    onDrop={handleLogoDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={handleLogoClick}
                  >
                    {businessProfile.logoUrl ? (
  // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={businessProfile.logoUrl}
                        alt="Business Logo"
                        className="w-20 h-20 object-contain"
                      />
                    ) : (
                      <MaterialIcon name="business" className="text-on-surface-variant opacity-50" size={48} />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <MaterialIcon name="upload" className="text-white" size={24} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-body-md font-bold mb-1">Company Logo</h4>
                    <p className="font-body-sm text-on-surface-variant mb-4">
                      Upload a high-resolution PNG or SVG. Recommended size: 512x512px.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFile}
                      className="hidden"
                    />
                    <input
                      type="text"
                      placeholder="Logo URL"
                      value={businessProfile.logoUrl || ""}
                      onChange={(e) => updateBusinessProfile({ logoUrl: e.target.value })}
                      className="w-full h-12 bg-surface-base border border-outline-variant rounded-lg focus:border-growth-green focus:ring-1 focus:ring-growth-green px-4 text-body-md"
                    />
                  </div>
                </div>

                <hr className="border-surface-variant" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* Brand Colors */}
                  <div>
                    <h4 className="font-body-md font-bold mb-4">Brand Colors</h4>
                    <div className="flex gap-4 flex-wrap">
                      {BRAND_COLORS.map((c) => (
                        <button
                          key={c.value}
                          onClick={() => handleColorSelect(c.value)}
                          className={cn(
                            "w-14 h-14 rounded-full cursor-pointer transition-all active:scale-90",
                            selectedColor === c.value
                              ? "ring-2 ring-offset-2 ring-growth-green"
                              : "hover:scale-105"
                          )}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                          type="button"
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <label className="font-body-sm text-on-surface-variant">Hex:</label>
                      <input
                        type="text"
                        value={brandColors.primary}
                        onChange={(e) => handleColorSelect(e.target.value)}
                        className="w-28 h-10 bg-surface-base border border-outline-variant rounded-lg px-3 font-label-mono text-sm focus:border-growth-green focus:ring-1 focus:ring-growth-green"
                      />
                      <div
                        className="w-8 h-8 rounded-full border border-outline-variant"
                        style={{ backgroundColor: brandColors.primary }}
                      />
                    </div>
                  </div>

                  {/* Document Typography */}
                  <div>
                    <h4 className="font-body-md font-bold mb-4">Document Typography</h4>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full h-12 bg-surface-base border border-outline-variant rounded-lg focus:ring-1 focus:ring-growth-green px-4 font-body-md"
                    >
                      {FONTS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-4 mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="font-size"
                          checked={fontSize === "standard"}
                          onChange={() => setFontSize("standard")}
                          className="text-growth-green focus:ring-growth-green"
                        />
                        <span className="text-body-sm">Standard</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="font-size"
                          checked={fontSize === "compact"}
                          onChange={() => setFontSize("compact")}
                          className="text-growth-green focus:ring-growth-green"
                        />
                        <span className="text-body-sm">Compact</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Labour Rates */}
            <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MaterialIcon name="groups" className="text-growth-green" />
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Labour Rates</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NumberInput
                  label="Default Hourly Rate"
                  value={labourRates.defaultHourlyRate}
                  onChange={(v) => updateLabourRates({ defaultHourlyRate: v })}
                  prefix="$"
                />
                <NumberInput
                  label="Crew Rate"
                  value={labourRates.crewRate}
                  onChange={(v) => updateLabourRates({ crewRate: v })}
                  prefix="$"
                />
                <NumberInput
                  label="Minimum Charge"
                  value={labourRates.minimumCharge}
                  onChange={(v) => updateLabourRates({ minimumCharge: v })}
                  prefix="$"
                />
              </div>
            </section>

            {/* Tax Settings */}
            <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MaterialIcon name="receipt" className="text-growth-green" />
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Tax Settings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <NumberInput
                  label="GST Rate"
                  value={taxSettings.gstRate}
                  onChange={(v) => updateTaxSettings({ gstRate: v })}
                  suffix="%"
                />
                <Input
                  label="Tax Number"
                  value={taxSettings.taxNumber}
                  onChange={(v) => updateTaxSettings({ taxNumber: v })}
                  placeholder="e.g. 12345678901"
                />
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={taxSettings.isRegistered}
                      onChange={(e) => updateTaxSettings({ isRegistered: e.target.checked })}
                      className="w-5 h-5 text-growth-green focus:ring-growth-green rounded"
                    />
                    <span className="font-body-sm font-bold text-on-surface">Registered for GST</span>
                  </label>
                </div>
              </div>
            </section>

            {/* Quote Defaults */}
            <section className="bg-surface-container-lowest border border-surface-variant rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <MaterialIcon name="description" className="text-growth-green" />
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Quote Defaults</h2>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="font-body-sm font-bold text-on-surface-variant">Default Expiry</label>
                    <select
                      value={quoteDefaults.defaultExpiryDays}
                      onChange={(e) => updateQuoteDefaults({ defaultExpiryDays: Number(e.target.value) })}
                      className="w-full h-12 bg-surface-base border border-outline-variant rounded-lg px-4 focus:border-growth-green focus:ring-1 focus:ring-growth-green font-body-md"
                    >
                      <option value={14}>14 Days</option>
                      <option value={30}>30 Days</option>
                      <option value={60}>60 Days</option>
                      <option value={90}>90 Days</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-body-sm font-bold text-on-surface-variant">Standard Margin</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={quoteDefaults.standardMargin}
                        onChange={(e) => updateQuoteDefaults({ standardMargin: Number(e.target.value) })}
                        className="w-full h-12 bg-surface-base border border-outline-variant rounded-lg px-4 focus:border-growth-green focus:ring-1 focus:ring-growth-green font-body-md"
                      />
                      <span className="absolute right-4 top-3 text-on-surface-variant">%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-body-sm font-bold text-on-surface-variant">Payment Schedule Terms</label>
                  <textarea
                    value={quoteDefaults.paymentTerms}
                    onChange={(e) => updateQuoteDefaults({ paymentTerms: e.target.value })}
                    rows={3}
                    className="w-full bg-surface-base border border-outline-variant rounded-lg px-4 py-3 text-body-sm focus:border-growth-green focus:ring-1 focus:ring-growth-green"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-body-sm font-bold text-on-surface-variant">Standard Terms of Service</label>
                  <textarea
                    value={quoteDefaults.termsOfService}
                    onChange={(e) => updateQuoteDefaults({ termsOfService: e.target.value })}
                    rows={4}
                    className="w-full bg-surface-base border border-outline-variant rounded-lg px-4 py-3 text-body-sm focus:border-growth-green focus:ring-1 focus:ring-growth-green"
                  />
                </div>
              </div>
            </section>

            {/* Save Button (mobile / bottom of form) */}
            <div className="lg:hidden">
              <button
                onClick={handleSave}
                className="w-full h-12 bg-growth-green text-white font-button-text rounded-lg hover:bg-opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <MaterialIcon name="save" size={20} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-surface-container-high border border-outline-variant rounded-xl overflow-hidden shadow-sm">
                <div className="bg-growth-green p-4 flex justify-between items-center">
                  <h3 className="text-white font-label-mono text-label-mono uppercase">Live PDF Preview</h3>
                  <MaterialIcon name="visibility" className="text-white" size={18} />
                </div>
                <div className="p-6 bg-white aspect-[1/1.4] m-4 shadow-inner border border-surface-variant flex flex-col gap-4 scale-95 origin-top">
                  <div className="flex justify-between items-start">
                    <div
                      className="w-12 h-12 rounded-sm flex items-center justify-center"
                      style={{ backgroundColor: brandColors.primary }}
                    >
                      {businessProfile.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={businessProfile.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-white font-bold text-xs">
                          {businessProfile.businessName.slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-label-mono text-[8px] text-on-surface-variant">QUOTE #QS-2024-001</p>
                      <p className="font-bold text-[10px]" style={{ color: brandColors.text, fontFamily }}>
                        {businessProfile.businessName}
                      </p>
                    </div>
                  </div>
                  <div className="h-[1px] bg-surface-variant"></div>
                  <div className="space-y-1">
                    <p className="font-bold text-[10px]" style={{ color: brandColors.primary }}>
                      Client Details
                    </p>
                    <p className="text-[8px] text-on-surface-variant">
                      Jane Smith<br />45 Garden Way, Malvern VIC
                    </p>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="grid grid-cols-4 border-b border-surface-variant pb-1">
                      <span className="col-span-2 text-[8px] font-bold">Item</span>
                      <span className="text-right text-[8px] font-bold">Qty</span>
                      <span className="text-right text-[8px] font-bold">Total</span>
                    </div>
                    <div className="grid grid-cols-4">
                      <span className="col-span-2 text-[8px]">Premium Turf Install</span>
                      <span className="text-right text-[8px]">120sqm</span>
                      <span className="text-right text-[8px]">$2,400</span>
                    </div>
                    <div className="grid grid-cols-4">
                      <span className="col-span-2 text-[8px]">Retaining Wall (Bluestone)</span>
                      <span className="text-right text-[8px]">15m</span>
                      <span className="text-right text-[8px]">$4,500</span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 flex justify-end">
                    <div className="w-32 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[8px]">Subtotal</span>
                        <span className="text-[8px]">$6,900</span>
                      </div>
                      <div className="flex justify-between border-t border-surface-variant pt-1">
                        <span className="text-[10px] font-bold" style={{ color: brandColors.primary }}>
                          Total (inc. GST)
                        </span>
                        <span className="text-[10px] font-bold" style={{ color: brandColors.primary }}>
                          $7,590
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-surface-container-low flex gap-2">
                  <button className="flex-1 h-10 border border-growth-green text-growth-green font-button-text text-sm rounded-lg transition-all hover:bg-growth-green hover:text-white active:scale-95">
                    Download Mockup
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded-lg hover:bg-white active:scale-95 transition-all">
                    <MaterialIcon name="share" size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleSave}
                  className={cn(
                    "w-full h-14 font-button-text rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95",
                    saved
                      ? "bg-growth-green/90 text-white"
                      : "bg-growth-green text-white hover:brightness-110"
                  )}
                >
                  <MaterialIcon name={saved ? "check" : "save"} size={20} />
                  {saved ? "Saved!" : "Save All Changes"}
                </button>
                <button className="w-full h-14 bg-white border border-outline-variant text-on-surface-variant font-button-text rounded-lg hover:bg-surface-container active:scale-95 transition-all">
                  Discard Changes
                </button>
              </div>

              <div className="p-4 bg-primary-fixed/20 border border-primary-fixed rounded-lg">
                <div className="flex gap-3">
                  <MaterialIcon name="info" className="text-growth-green" size={20} />
                  <p className="text-body-sm text-on-primary-fixed-variant leading-snug">
                    Changes to branding will apply to all <strong>future</strong> quotes. Existing quotes will retain their historical branding unless manually refreshed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="font-body-sm font-bold text-on-surface-variant">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 bg-surface-base border border-outline-variant rounded-lg focus:border-growth-green focus:ring-1 focus:ring-growth-green px-4 text-body-md"
      />
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="font-body-sm font-bold text-on-surface-variant">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-mono">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "w-full h-12 bg-surface-base border border-outline-variant rounded-lg focus:border-growth-green focus:ring-1 focus:ring-growth-green text-body-md",
            prefix && "pl-8",
            suffix && "pr-8",
            !prefix && !suffix && "px-4"
          )}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-label-mono">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
