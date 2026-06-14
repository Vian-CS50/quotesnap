"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import {
  Save,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Check,
  Crown,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8341";

interface LabourRate {
  name: string;
  rate: number;
}

interface JobTemplate {
  job_type: string;
  crew_size: number;
  daily_rate: number;
  markup: number;
}

interface PricingModel {
  labour_rates: Record<string, number>;
  material_markup_percent: number;
  contingency_percent: number;
  job_type_templates: Record<string, { crew_size: number; daily_rate: number; markup: number }>;
  default_crew_size: number;
  gst_included_in_rates: boolean;
  geographic_factor: number;
  notes: string;
}

const DEFAULT_MODEL: PricingModel = {
  labour_rates: {
    general: 65,
    skilled: 85,
    excavator: 120,
    concretor: 75,
    carpenter: 100,
    plumber: 125,
    fencing: 75,
    paving: 65,
  },
  material_markup_percent: 15,
  contingency_percent: 10,
  job_type_templates: {
    "Deck Construction": { crew_size: 2, daily_rate: 750, markup: 15 },
    "Retaining Wall": { crew_size: 2, daily_rate: 700, markup: 12 },
    Paving: { crew_size: 2, daily_rate: 650, markup: 10 },
    Fencing: { crew_size: 2, daily_rate: 600, markup: 10 },
    "Pool Installation": { crew_size: 3, daily_rate: 900, markup: 18 },
    Turf: { crew_size: 2, daily_rate: 550, markup: 8 },
  },
  default_crew_size: 2,
  gst_included_in_rates: false,
  geographic_factor: 1.0,
  notes: "",
};

const JOB_TYPES = [
  "Deck Construction",
  "Retaining Wall",
  "Paving",
  "Fencing",
  "Pool Installation",
  "Turf",
  "Garden Design",
  "Irrigation System",
  "General Landscaping",
];

export default function PricingModelPage() {
  const [model, setModel] = useState<PricingModel>(DEFAULT_MODEL);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isElite, setIsElite] = useState(false);
  const [labourRates, setLabourRates] = useState<LabourRate[]>([]);
  const [jobTemplates, setJobTemplates] = useState<JobTemplate[]>([]);
  const { user } = useAuth();

  // Fetch existing model + verify tier
  useEffect(() => {
    let cancelled = false;
    const fetchData = async (retryCount = 0) => {
      try {
        // Always fetch fresh profile directly — auth context may be stale
        const token = localStorage.getItem("qs_access_token") || localStorage.getItem("access_token");
        if (!token) {
          if (!cancelled) {
            setError("Please sign in to access pricing models.");
            setLoading(false);
          }
          return;
        }

        const meRes = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!meRes.ok) throw new Error("Failed to fetch profile");
        const me = await meRes.json();
        const tier = me.subscription_tier;

        if (cancelled) return;
        setIsElite(tier === "elite");

        if (tier !== "elite") {
          // Retry up to 3 times with 1.5s delay — handles webhook race condition
          if (retryCount < 3) {
            setTimeout(() => fetchData(retryCount + 1), 1500);
            return;
          }
          setError("Custom pricing models are only available on the Elite plan.");
          setLoading(false);
          return;
        }

        // Fetch pricing model
        const pmRes = await fetch(`${API_URL}/api/pricing-model`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (pmRes.ok) {
          const data = await pmRes.json();
          if (data.pricing_model) {
            const m = data.pricing_model as PricingModel;
            setModel(m);
            setLabourRates(
              Object.entries(m.labour_rates || {}).map(([name, rate]) => ({
                name,
                rate: Number(rate),
              }))
            );
            setJobTemplates(
              Object.entries(m.job_type_templates || {}).map(
                ([job_type, vals]) => ({
                  job_type,
                  crew_size: (vals as any).crew_size || 2,
                  daily_rate: (vals as any).daily_rate || 650,
                  markup: (vals as any).markup || 10,
                })
              )
            );
          } else {
            setLabourRates(
              Object.entries(DEFAULT_MODEL.labour_rates).map(([name, rate]) => ({
                name,
                rate,
              }))
            );
            setJobTemplates(
              Object.entries(DEFAULT_MODEL.job_type_templates).map(
                ([job_type, vals]) => ({
                  job_type,
                  crew_size: vals.crew_size,
                  daily_rate: vals.daily_rate,
                  markup: vals.markup,
                })
              )
            );
          }
        }
        if (!cancelled) setLoading(false);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || "Failed to load pricing model");
          setLoading(false);
        }
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const updateModelFromState = useCallback(() => {
    const labour: Record<string, number> = {};
    labourRates.forEach((r) => {
      if (r.name.trim()) labour[r.name.trim()] = r.rate;
    });
    const templates: Record<string, { crew_size: number; daily_rate: number; markup: number }> =
      {};
    jobTemplates.forEach((t) => {
      if (t.job_type.trim())
        templates[t.job_type.trim()] = {
          crew_size: t.crew_size,
          daily_rate: t.daily_rate,
          markup: t.markup,
        };
    });
    setModel((prev) => ({
      ...prev,
      labour_rates: labour,
      job_type_templates: templates,
    }));
  }, [labourRates, jobTemplates]);

  useEffect(() => {
    updateModelFromState();
  }, [labourRates, jobTemplates, updateModelFromState]);

  const saveModel = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const token = localStorage.getItem("qs_access_token") || localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(`${API_URL}/api/pricing-model`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(model),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const clearModel = async () => {
    if (!confirm("Clear your custom pricing model? This cannot be undone.")) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("qs_access_token") || localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");
      const res = await fetch(`${API_URL}/api/pricing-model`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to clear");
      setModel(DEFAULT_MODEL);
      setLabourRates(
        Object.entries(DEFAULT_MODEL.labour_rates).map(([name, rate]) => ({
          name,
          rate,
        }))
      );
      setJobTemplates(
        Object.entries(DEFAULT_MODEL.job_type_templates).map(
          ([job_type, vals]) => ({
            job_type,
            crew_size: vals.crew_size,
            daily_rate: vals.daily_rate,
            markup: vals.markup,
          })
        )
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addLabourRate = () =>
    setLabourRates([...labourRates, { name: "", rate: 0 }]);
  const removeLabourRate = (i: number) =>
    setLabourRates(labourRates.filter((_, idx) => idx !== i));
  const updateLabourRate = (i: number, field: keyof LabourRate, value: string | number) =>
    setLabourRates(
      labourRates.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    );

  const addJobTemplate = () =>
    setJobTemplates([
      ...jobTemplates,
      { job_type: JOB_TYPES[0], crew_size: 2, daily_rate: 650, markup: 10 },
    ]);
  const removeJobTemplate = (i: number) =>
    setJobTemplates(jobTemplates.filter((_, idx) => idx !== i));
  const updateJobTemplate = (i: number, field: keyof JobTemplate, value: string | number) =>
    setJobTemplates(
      jobTemplates.map((t, idx) => (idx === i ? { ...t, [field]: value } : t))
    );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </main>
    );
  }

  if (!isElite) {
    return (
      <main className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-3">Elite Plan Required</h1>
          <p className="text-slate-400 mb-6">
            {error || "Custom pricing models are only available on the Elite plan. Upgrade to define your own labour rates, markups, and job templates."}
          </p>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all"
          >
            Upgrade to Elite
          </Link>
          <Link
            href="/"
            className="block mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0F19] py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#1E293B] text-slate-400 hover:text-white hover:bg-[#151B2B] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Custom Pricing Model</h1>
            <p className="text-sm text-slate-400">
              Define your rates. The AI uses these in every quote.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <Check className="w-4 h-4 shrink-0" />
            Pricing model saved successfully.
          </div>
        )}

        {/* Labour Rates */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-[#151B2B] border border-[#1E293B] rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Labour Rates ($/hr)</h2>
            <button
              onClick={addLabourRate}
              className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add rate
            </button>
          </div>
          <div className="space-y-3">
            {labourRates.map((rate, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  value={rate.name}
                  onChange={(e) => updateLabourRate(i, "name", e.target.value)}
                  placeholder="e.g. general, skilled, excavator"
                  className="flex-1 h-10 px-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50"
                />
                <div className="flex items-center">
                  <span className="text-slate-500 text-sm mr-2">$</span>
                  <input
                    type="number"
                    value={rate.rate}
                    onChange={(e) => updateLabourRate(i, "rate", Number(e.target.value))}
                    className="w-24 h-10 px-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-emerald-500/50"
                  />
                  <span className="text-slate-500 text-sm ml-2">/hr</span>
                </div>
                <button
                  onClick={() => removeLabourRate(i)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Material Markup & Contingency */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 bg-[#151B2B] border border-[#1E293B] rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Markup & Contingency</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Material Markup (%)</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={model.material_markup_percent}
                  onChange={(e) =>
                    setModel({ ...model, material_markup_percent: Number(e.target.value) })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-emerald-500/50"
                />
                <span className="text-slate-500 text-sm ml-2">%</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Applied to all material line items
              </p>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Default Contingency (%)</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={model.contingency_percent}
                  onChange={(e) =>
                    setModel({ ...model, contingency_percent: Number(e.target.value) })
                  }
                  className="w-full h-10 px-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-emerald-500/50"
                />
                <span className="text-slate-500 text-sm ml-2">%</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Added when site conditions are uncertain
              </p>
            </div>
          </div>
        </motion.section>

        {/* Job Type Templates */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 bg-[#151B2B] border border-[#1E293B] rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Job-Type Templates</h2>
            <button
              onClick={addJobTemplate}
              className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add template
            </button>
          </div>
          <div className="space-y-4">
            {jobTemplates.map((t, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end p-4 rounded-lg bg-[#0B0F19] border border-[#1E293B]"
              >
                <div className="md:col-span-1">
                  <label className="block text-xs text-slate-500 mb-1">Job Type</label>
                  <select
                    value={t.job_type}
                    onChange={(e) => updateJobTemplate(i, "job_type", e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#151B2B] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-emerald-500/50"
                  >
                    {JOB_TYPES.map((jt) => (
                      <option key={jt} value={jt}>
                        {jt}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Crew Size</label>
                  <input
                    type="number"
                    value={t.crew_size}
                    onChange={(e) => updateJobTemplate(i, "crew_size", Number(e.target.value))}
                    min={1}
                    max={10}
                    className="w-full h-10 px-3 rounded-lg bg-[#151B2B] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Daily Rate ($)</label>
                  <input
                    type="number"
                    value={t.daily_rate}
                    onChange={(e) => updateJobTemplate(i, "daily_rate", Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-lg bg-[#151B2B] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Markup (%)</label>
                    <input
                      type="number"
                      value={t.markup}
                      onChange={(e) => updateJobTemplate(i, "markup", Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-lg bg-[#151B2B] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <button
                    onClick={() => removeJobTemplate(i)}
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all mb-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Defaults */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 bg-[#151B2B] border border-[#1E293B] rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Defaults</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Default Crew Size</label>
              <input
                type="number"
                value={model.default_crew_size}
                onChange={(e) =>
                  setModel({ ...model, default_crew_size: Number(e.target.value) })
                }
                min={1}
                max={10}
                className="w-full h-10 px-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Geographic Factor</label>
              <input
                type="number"
                step={0.1}
                value={model.geographic_factor}
                onChange={(e) =>
                  setModel({ ...model, geographic_factor: Number(e.target.value) })
                }
                min={0.5}
                max={3.0}
                className="w-full h-10 px-3 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm focus:outline-none focus:border-emerald-500/50"
              />
              <p className="text-xs text-slate-600 mt-1">
                1.0 = Adelaide metro. Higher for regional/remote.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="gst_included"
              checked={model.gst_included_in_rates}
              onChange={(e) =>
                setModel({ ...model, gst_included_in_rates: e.target.checked })
              }
              className="w-4 h-4 rounded border-[#1E293B] bg-[#0B0F19] text-emerald-500 focus:ring-emerald-500/50"
            />
            <label htmlFor="gst_included" className="text-sm text-slate-300">
              Rates entered above already include GST
            </label>
          </div>
        </motion.section>

        {/* Notes */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 bg-[#151B2B] border border-[#1E293B] rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Notes</h2>
          <textarea
            value={model.notes}
            onChange={(e) => setModel({ ...model, notes: e.target.value })}
            placeholder="Any internal notes about your pricing approach..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-[#0B0F19] border border-[#1E293B] text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 resize-none"
          />
        </motion.section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={saveModel}
            disabled={saving}
            className="flex-1 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-semibold transition-all inline-flex items-center justify-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Pricing Model
          </button>
          <button
            onClick={clearModel}
            disabled={saving}
            className="h-12 px-6 rounded-xl border border-[#1E293B] text-slate-400 hover:text-red-400 hover:border-red-500/30 disabled:opacity-50 transition-all inline-flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>
      </div>
    </main>
  );
}
