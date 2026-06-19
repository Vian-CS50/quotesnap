"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { settings, updateBusinessProfile, updateBrandColors, updateQuoteDefaults } = useSettings();
  const { businessProfile, brandColors, quoteDefaults } = settings;

  return (
    <AppShell title="Business Settings" footer={<Footer />}>
      <div className="px-margin-mobile md:px-margin-desktop py-8 max-w-container-max-width mx-auto w-full">
        <header className="mb-10">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Business Settings & Branding</h1>
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
                    className="w-full bg-surface-base border border-outline-variant rounded focus:border-growth-green focus:ring-1 focus:ring-growth-green px-4 py-2 text-body-md"
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
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className="w-32 h-32 bg-surface-container flex items-center justify-center border-2 border-dashed border-outline-variant rounded-xl overflow-hidden relative group">
                    {businessProfile.logoUrl ? (
                      <img src={businessProfile.logoUrl} alt="Business Logo" className="w-20 h-20 object-contain" />
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
                      type="text"
                      placeholder="Logo URL"
                      value={businessProfile.logoUrl || ""}
                      onChange={(e) => updateBusinessProfile({ logoUrl: e.target.value })}
                      className="w-full h-12 bg-surface-base border border-outline-variant rounded focus:border-growth-green focus:ring-1 px-4 text-body-md"
                    />
                  </div>
                </div>
                <hr className="border-surface-variant" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h4 className="font-body-md font-bold mb-4">Brand Colors</h4>
                    <div className="flex gap-4">
                      <ColorSwatch label="PRIMARY" color={brandColors.primary} onChange={(c) => updateBrandColors({ primary: c })} active />
                      <ColorSwatch label="ACCENT" color={brandColors.accent} onChange={(c) => updateBrandColors({ accent: c })} />
                      <ColorSwatch label="TEXT" color={brandColors.text} onChange={(c) => updateBrandColors({ text: c })} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-body-md font-bold mb-4">Document Typography</h4>
                    <select className="w-full h-12 bg-surface-base border border-outline-variant rounded focus:ring-1 focus:ring-growth-green px-4 font-body-md">
                      <option>Inter (Modern Clean)</option>
                      <option>Roboto (Professional)</option>
                      <option>Merriweather (Classic Serif)</option>
                      <option>JetBrains Mono (Industrial)</option>
                    </select>
                    <div className="flex items-center gap-4 mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="font-size" defaultChecked className="text-growth-green focus:ring-growth-green" />
                        <span className="text-body-sm">Standard</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="font-size" className="text-growth-green focus:ring-growth-green" />
                        <span className="text-body-sm">Compact</span>
                      </label>
                    </div>
                  </div>
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
                      className="w-full h-12 bg-surface-base border border-outline-variant rounded px-4"
                    >
                      <option value={14}>14 Days</option>
                      <option value={30}>30 Days</option>
                      <option value={60}>60 Days</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-body-sm font-bold text-on-surface-variant">Standard Tax Rate</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={quoteDefaults.taxRate}
                        onChange={(e) => updateQuoteDefaults({ taxRate: Number(e.target.value) })}
                        className="w-full h-12 bg-surface-base border border-outline-variant rounded px-4"
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
                    className="w-full bg-surface-base border border-outline-variant rounded px-4 py-3 text-body-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-body-sm font-bold text-on-surface-variant">Standard Terms of Service</label>
                  <textarea
                    value={quoteDefaults.termsOfService}
                    onChange={(e) => updateQuoteDefaults({ termsOfService: e.target.value })}
                    rows={4}
                    className="w-full bg-surface-base border border-outline-variant rounded px-4 py-3 text-body-sm"
                  />
                </div>
              </div>
            </section>
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
                        <img src={businessProfile.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                      ) : (
                        <span className="text-white font-bold text-xs">{businessProfile.businessName.slice(0, 2)}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-label-mono text-[8px] text-on-surface-variant">QUOTE #QS-2024-001</p>
                      <p className="font-bold text-[10px]" style={{ color: brandColors.text }}>
                        {businessProfile.businessName}
                      </p>
                    </div>
                  </div>
                  <div className="h-[1px] bg-surface-variant"></div>
                  <div className="space-y-1">
                    <p className="font-bold text-[10px]" style={{ color: brandColors.primary }}>
                      Client Details
                    </p>
                    <p className="text-[8px] text-on-surface-variant">Jane Smith<br />45 Garden Way, Malvern VIC</p>
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
                  <button className="flex-1 h-10 border border-growth-green text-growth-green font-button-text text-sm rounded transition-all hover:bg-growth-green hover:text-white">
                    Download Mockup
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded hover:bg-white transition-colors">
                    <MaterialIcon name="share" size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button className="w-full h-14 bg-growth-green text-white font-button-text rounded shadow-sm hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                  <MaterialIcon name="save" size={20} />
                  Save All Changes
                </button>
                <button className="w-full h-14 bg-white border border-outline-variant text-on-surface-variant font-button-text rounded hover:bg-surface-container transition-all">
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="font-body-sm font-bold text-on-surface-variant">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 bg-surface-base border border-outline-variant rounded focus:border-growth-green focus:ring-1 focus:ring-growth-green px-4 text-body-md"
      />
    </div>
  );
}

function ColorSwatch({
  label,
  color,
  onChange,
  active = false,
}: {
  label: string;
  color: string;
  onChange: (c: string) => void;
  active?: boolean;
}) {
  return (
    <div className="space-y-2">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-14 h-14 rounded-full cursor-pointer border-0 p-0 overflow-hidden",
          active && "ring-2 ring-offset-2 ring-growth-green"
        )}
      />
      <p className="text-center font-label-mono text-[10px]">{label}</p>
    </div>
  );
}
