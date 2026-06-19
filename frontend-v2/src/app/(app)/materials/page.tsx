"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { getMaterials } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { Material, LaborRate } from "@/types";
import { formatCurrency } from "@/lib/utils";

const MOCK_LABOR: LaborRate[] = [
  { id: "l1", name: "Crew Leader", description: "Supervisory & Layout", hourlyRate: 75, costRate: 45 },
  { id: "l2", name: "General Crew", description: "Installation & Maintenance", hourlyRate: 45, costRate: 28 },
  { id: "l3", name: "Specialized Tech", description: "Irrigation & Lighting", hourlyRate: 95, costRate: 60, highlight: true },
];

export default function MaterialsPage() {
  const { settings, updateQuoteDefaults } = useSettings();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMaterials()
      .then(setMaterials)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return materials.filter((m) => m.name.toLowerCase().includes(q) || m.category?.toLowerCase().includes(q));
  }, [materials, search]);

  return (
    <AppShell title="Materials & Pricing" footer={<Footer />}>
      <main className="ml-0 md:ml-0 pt-0 pb-12 px-8 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-surface-subtle p-6 rounded-lg flex flex-col justify-between">
              <div>
                <span className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2 block">
                  Global Configuration
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Markup Rules</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block font-body-sm text-body-sm font-bold mb-1">Standard Margin (%)</label>
                  <input
                    type="number"
                    value={settings.quoteDefaults.standardMargin}
                    onChange={(e) => updateQuoteDefaults({ standardMargin: Number(e.target.value) })}
                    className="w-full bg-surface-container-low border border-outline-variant focus:border-growth-green focus:ring-0 rounded-lg p-2 font-label-mono text-lg"
                  />
                </div>
                <button className="self-end p-3 bg-surface-container-high text-growth-green rounded-lg hover:bg-surface-variant transition-colors">
                  <MaterialIcon name="save" size={20} />
                </button>
              </div>
            </div>

            <div className="bg-white border border-surface-subtle p-6 rounded-lg">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2 block">
                Labor Overview
              </span>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold text-growth-green">$58.50</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Avg. Blended Hourly Rate</div>
                </div>
                <MaterialIcon name="engineering" className="text-secondary" size={40} />
              </div>
              <div className="mt-4 pt-4 border-t border-surface-variant flex justify-between text-xs font-label-mono uppercase text-on-surface-variant">
                <span>3 Crew Types</span>
                <span className="text-growth-green">Live Updates</span>
              </div>
            </div>

            <div className="bg-white border border-surface-subtle p-6 rounded-lg">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2 block">
                Inventory Value
              </span>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold text-growth-green">$12,450.00</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Total Current Stock Value</div>
                </div>
                <MaterialIcon name="inventory_2" className="text-secondary" size={40} />
              </div>
              <div className="mt-4 pt-4 border-t border-surface-variant flex justify-between text-xs font-label-mono uppercase text-on-surface-variant">
                <span>82% In Stock</span>
                <span className="text-error">4 Items Low</span>
              </div>
            </div>
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Materials Table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-headline-sm text-headline-sm flex items-center gap-2">
                  <MaterialIcon name="list_alt" />
                  Materials Inventory
                </h2>
                <div className="relative">
                  <MaterialIcon
                    name="search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                    size={18}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search materials..."
                    className="pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg focus:border-growth-green focus:ring-0 w-64 text-sm"
                  />
                </div>
              </div>

              <div className="bg-white border border-surface-subtle rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-surface-variant">
                      <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">
                        Item Name
                      </th>
                      <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">
                        Unit Cost
                      </th>
                      <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">
                        Markup
                      </th>
                      <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">
                        Sell Price
                      </th>
                      <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">
                        Status
                      </th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-variant">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-on-surface-variant">Loading materials...</td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-0">
                          <EmptyState
                            icon="search_off"
                            title={`No materials found for "${search}"`}
                            description="Check your spelling or add a custom material."
                          />
                        </td>
                      </tr>
                    ) : (
                      filtered.map((m, idx) => (
                        <tr
                          key={m.id}
                          className={`hover:bg-surface-container-lowest transition-colors h-14 ${
                            idx % 2 === 1 ? "bg-surface-container-low/30" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="font-bold text-on-surface">{m.name}</div>
                            <div className="text-xs text-on-surface-variant">Per {m.unit}</div>
                          </td>
                          <td className="px-6 py-4 font-label-mono text-on-surface">{formatCurrency(m.unitCost)}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-surface-container-high rounded-full text-xs font-label-mono">
                              {m.markupPercent}%
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-growth-green">{formatCurrency(m.sellPrice)}</td>
                          <td className="px-6 py-4">
                            <StatusChip status={m.status} />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="material-symbols-outlined text-on-surface-variant hover:text-growth-green">
                              edit
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="p-4 border-t border-surface-variant bg-surface-container-lowest flex justify-center">
                  <button className="text-growth-green font-button-text text-button-text flex items-center gap-2 hover:underline">
                    View All {materials.length} Items
                    <MaterialIcon name="arrow_forward" size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-sm text-headline-sm flex items-center gap-2">
                    <MaterialIcon name="groups" />
                    Labor Rates
                  </h2>
                  <button className="text-growth-green font-button-text text-sm hover:underline">Edit All</button>
                </div>
                <div className="space-y-3">
                  {MOCK_LABOR.map((rate) => (
                    <div
                      key={rate.id}
                      className={`bg-white border border-surface-subtle p-4 rounded-lg flex justify-between items-center ${
                        rate.highlight ? "border-l-4 border-l-secondary" : ""
                      }`}
                    >
                      <div>
                        <div className="font-bold text-on-surface">{rate.name}</div>
                        <div className="text-xs text-on-surface-variant">{rate.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-label-mono font-bold text-growth-green">
                          {formatCurrency(rate.hourlyRate)}/hr
                        </div>
                        <div className="text-[10px] uppercase text-on-surface-variant">Cost: {formatCurrency(rate.costRate)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-primary-container text-on-primary-container p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-2">
                  <MaterialIcon name="trending_up" />
                  <h3 className="font-headline-sm text-headline-sm">Smart Markup</h3>
                </div>
                <p className="text-sm opacity-80">Automatic pricing tiers based on material categories. Overrides global settings.</p>
                <div className="space-y-2">
                  {[
                    { label: "Bulk Materials", value: "40%" },
                    { label: "Hardscape / Pavers", value: "25%" },
                    { label: "Planting / Greenery", value: "55%" },
                  ].map((tier) => (
                    <div
                      key={tier.label}
                      className="flex justify-between items-center text-xs font-label-mono py-2 border-b border-white/20"
                    >
                      <span>{tier.label}</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded">{tier.value}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 bg-white text-growth-green rounded-lg font-button-text text-sm hover:bg-primary-fixed transition-colors">
                  Manage Tiers
                </button>
              </section>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
