"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";
import { getMaterials } from "@/lib/api";
import { useSettings } from "@/context/SettingsContext";
import { Material, LaborRate } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getMaterials()
      .then((data) => {
        setMaterials(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load materials");
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return materials;
    return materials.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.category?.toLowerCase() || "").includes(q)
    );
  }, [materials, search]);

  const totalStockValue = useMemo(() => {
    return materials.reduce((sum, m) => sum + m.unitCost * (m.status === "In-Stock" ? 100 : m.status === "Low Stock" ? 20 : 0), 0);
  }, [materials]);

  const inStockCount = useMemo(() => materials.filter((m) => m.status === "In-Stock").length, [materials]);
  const lowStockCount = useMemo(() => materials.filter((m) => m.status === "Low Stock").length, [materials]);

  const avgBlendedRate = useMemo(() => {
    if (MOCK_LABOR.length === 0) return 0;
    return MOCK_LABOR.reduce((sum, r) => sum + r.hourlyRate, 0) / MOCK_LABOR.length;
  }, []);

  return (
    <AppShell title="Materials & Pricing" footer={<Footer />}>
      <main className="ml-0 md:ml-0 pt-0 pb-12 px-margin-mobile md:px-margin-desktop min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-growth-green mb-1">Materials</h1>
              <p className="font-body-sm text-on-surface-variant">
                Manage inventory, pricing, and labour rates
              </p>
            </div>
            <div className="flex items-center gap-3">
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
                  className="pl-10 pr-4 h-12 bg-surface-base border border-outline-variant rounded-lg focus:border-growth-green focus:ring-1 focus:ring-growth-green w-full sm:w-64 text-body-sm"
                />
              </div>
              <button
                className="h-12 px-4 bg-growth-green text-white font-button-text rounded-lg hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <MaterialIcon name="add" size={20} />
                <span className="hidden sm:inline">Add Material</span>
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
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
                    className="w-full h-12 bg-surface-base border border-outline-variant rounded-lg px-4 font-label-mono text-lg focus:border-growth-green focus:ring-1 focus:ring-growth-green"
                  />
                </div>
                <button className="self-end h-12 w-12 bg-surface-container-high text-growth-green rounded-lg hover:bg-surface-variant active:scale-95 transition-all flex items-center justify-center">
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
                  <div className="text-3xl font-bold text-growth-green">{formatCurrency(avgBlendedRate)}</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Avg. Blended Hourly Rate</div>
                </div>
                <MaterialIcon name="engineering" className="text-secondary" size={40} />
              </div>
              <div className="mt-4 pt-4 border-t border-surface-variant flex justify-between text-xs font-label-mono uppercase text-on-surface-variant">
                <span>{MOCK_LABOR.length} Crew Types</span>
                <span className="text-growth-green">Live Updates</span>
              </div>
            </div>

            <div className="bg-white border border-surface-subtle p-6 rounded-lg">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase mb-2 block">
                Inventory Value
              </span>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-3xl font-bold text-growth-green">{formatCurrency(totalStockValue)}</div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant">Total Current Stock Value</div>
                </div>
                <MaterialIcon name="inventory_2" className="text-secondary" size={40} />
              </div>
              <div className="mt-4 pt-4 border-t border-surface-variant flex justify-between text-xs font-label-mono uppercase text-on-surface-variant">
                <span>{inStockCount} In Stock</span>
                <span className={lowStockCount > 0 ? "text-error" : "text-on-surface-variant"}>
                  {lowStockCount} Items Low
                </span>
              </div>
            </div>
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Materials Table / Cards */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-headline-sm flex items-center gap-2">
                  <MaterialIcon name="list_alt" />
                  Materials Inventory
                </h2>
                <span className="font-label-mono text-label-mono text-on-surface-variant">
                  {filtered.length} of {materials.length} items
                </span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  <LoadingShimmer text="Loading materials..." />
                  <LoadingShimmer text="Loading materials..." />
                  <LoadingShimmer text="Loading materials..." />
                  <LoadingShimmer text="Loading materials..." />
                  <LoadingShimmer text="Loading materials..." />
                </div>
              ) : error ? (
                <EmptyState
                  icon="error"
                  title="Failed to load materials"
                  description={error}
                  action={{ label: "Retry", onClick: () => window.location.reload() }}
                />
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon="search_off"
                  title={search ? `No materials found for "${search}"` : "No materials available"}
                  description={search ? "Check your spelling or try a different search term." : "Add your first material to get started."}
                  action={!search ? { label: "Add Material", onClick: () => {} } : undefined}
                />
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block bg-white border border-surface-subtle rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-surface-variant">
                          <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">
                            Material
                          </th>
                          <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">
                            Category
                          </th>
                          <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant text-right">
                            Unit Cost
                          </th>
                          <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant text-right">
                            Markup
                          </th>
                          <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant text-right">
                            Sell Price
                          </th>
                          <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">
                            Stock Status
                          </th>
                          <th className="px-6 py-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((m, idx) => (
                          <tr
                            key={m.id}
                            className={cn(
                              "border-b border-surface-subtle hover:bg-surface-container-low transition-colors h-14",
                              idx % 2 === 1 && "bg-surface-container-low/30"
                            )}
                          >
                            <td className="px-6 py-4">
                              <div className="font-bold text-on-surface">{m.name}</div>
                              <div className="text-xs text-on-surface-variant">Per {m.unit}</div>
                            </td>
                            <td className="px-6 py-4">
                              {m.category && (
                                <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-label-mono border border-outline-variant">
                                  {m.category}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-label-mono text-on-surface text-right">
                              {formatCurrency(m.unitCost)}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs font-label-mono",
                                  m.markupPercent > 40
                                    ? "bg-secondary-fixed text-on-secondary-fixed"
                                    : m.markupPercent > 25
                                    ? "bg-primary-fixed text-on-primary-fixed"
                                    : "bg-surface-container text-on-surface-variant"
                                )}
                              >
                                {m.markupPercent}%
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-growth-green text-right">
                              {formatCurrency(m.sellPrice)}
                            </td>
                            <td className="px-6 py-4">
                              <StockBadge status={m.status} />
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="material-symbols-outlined text-on-surface-variant hover:text-growth-green active:scale-95 transition-all p-2">
                                edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {materials.length > 0 && (
                      <div className="p-4 border-t border-surface-variant bg-surface-container-lowest flex justify-center">
                        <button className="text-growth-green font-button-text text-button-text flex items-center gap-2 hover:underline active:scale-95 transition-all">
                          View All {materials.length} Items
                          <MaterialIcon name="arrow_forward" size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-3">
                    {filtered.map((m) => (
                      <div
                        key={m.id}
                        className="bg-white border border-surface-subtle rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-on-surface">{m.name}</div>
                            <div className="text-xs text-on-surface-variant">Per {m.unit}</div>
                          </div>
                          <StockBadge status={m.status} />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {m.category && (
                            <span className="px-2 py-0.5 rounded-full bg-surface-container text-[10px] font-label-mono border border-outline-variant">
                              {m.category}
                            </span>
                          )}
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-label-mono",
                              m.markupPercent > 40
                                ? "bg-secondary-fixed text-on-secondary-fixed"
                                : m.markupPercent > 25
                                ? "bg-primary-fixed text-on-primary-fixed"
                                : "bg-surface-container text-on-surface-variant"
                            )}
                          >
                            {m.markupPercent}% markup
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-subtle">
                          <div className="text-center">
                            <div className="text-[10px] font-label-mono uppercase text-on-surface-variant">Cost</div>
                            <div className="font-label-mono text-sm text-on-surface">{formatCurrency(m.unitCost)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] font-label-mono uppercase text-on-surface-variant">Sell</div>
                            <div className="font-label-mono text-sm font-bold text-growth-green">{formatCurrency(m.sellPrice)}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] font-label-mono uppercase text-on-surface-variant">Margin</div>
                            <div className="font-label-mono text-sm text-on-surface">
                              {formatCurrency(m.sellPrice - m.unitCost)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right Column — Labor Rates & Smart Markup */}
            <div className="space-y-8">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-sm text-headline-sm flex items-center gap-2">
                    <MaterialIcon name="groups" />
                    Labor Rates
                  </h2>
                  <button className="text-growth-green font-button-text text-sm hover:underline active:scale-95 transition-all">
                    Edit All
                  </button>
                </div>
                <div className="space-y-3">
                  {MOCK_LABOR.map((rate) => (
                    <div
                      key={rate.id}
                      className={cn(
                        "bg-white border border-surface-subtle p-4 rounded-lg flex justify-between items-center",
                        rate.highlight && "border-l-4 border-l-secondary"
                      )}
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
                <p className="text-sm opacity-80">
                  Automatic pricing tiers based on material categories. Overrides global settings.
                </p>
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
                <button className="w-full h-12 bg-white text-growth-green rounded-lg font-button-text text-sm hover:bg-primary-fixed active:scale-95 transition-all">
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

function StockBadge({ status }: { status: Material["status"] }) {
  const isInStock = status === "In-Stock";
  const isLow = status === "Low Stock";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-label-mono tracking-wide",
        isInStock && "bg-primary-fixed text-on-primary-fixed",
        isLow && "bg-error-container text-on-error-container",
        !isInStock && !isLow && "bg-surface-container text-on-surface-variant"
      )}
    >
      {status}
    </span>
  );
}
