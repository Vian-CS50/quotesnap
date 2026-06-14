"use client";

import { useState, useCallback } from "react";
import { Calculator, X, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CalcType = "turf" | "pavers" | "concrete" | "mulch" | "wall" | "fence";

interface CalcResult {
  label: string;
  value: string;
  unit: string;
  note?: string;
}

const CALC_CONFIGS: Record<CalcType, { title: string; fields: { key: string; label: string; unit: string }[]; calc: (vals: Record<string, number>) => CalcResult[] }> = {
  turf: {
    title: "Turf Calculator",
    fields: [
      { key: "length", label: "Length", unit: "m" },
      { key: "width", label: "Width", unit: "m" },
    ],
    calc: (vals) => {
      const area = (vals.length || 0) * (vals.width || 0);
      const wastage = area * 1.05;
      return [
        { label: "Area", value: area.toFixed(1), unit: "m²" },
        { label: "With 5% wastage", value: wastage.toFixed(1), unit: "m²" },
        { label: "Soil volume (100mm)", value: (area * 0.1).toFixed(2), unit: "m³" },
      ];
    },
  },
  pavers: {
    title: "Paver Calculator",
    fields: [
      { key: "length", label: "Length", unit: "m" },
      { key: "width", label: "Width", unit: "m" },
      { key: "paver_width", label: "Paver width", unit: "mm" },
      { key: "paver_length", label: "Paver length", unit: "mm" },
    ],
    calc: (vals) => {
      const area = (vals.length || 0) * (vals.width || 0);
      const pw = (vals.paver_width || 400) / 1000;
      const pl = (vals.paver_length || 400) / 1000;
      const paverArea = pw * pl;
      const count = paverArea > 0 ? Math.ceil((area * 1.05) / paverArea) : 0;
      const edging = ((vals.length || 0) + (vals.width || 0)) * 2;
      return [
        { label: "Area", value: area.toFixed(1), unit: "m²" },
        { label: "Pavers needed", value: count.toLocaleString(), unit: "pcs" },
        { label: "Edging length", value: edging.toFixed(1), unit: "m" },
        { label: "Road base (100mm)", value: (area * 0.1).toFixed(2), unit: "m³" },
      ];
    },
  },
  concrete: {
    title: "Concrete Calculator",
    fields: [
      { key: "length", label: "Length", unit: "m" },
      { key: "width", label: "Width", unit: "m" },
      { key: "depth", label: "Depth", unit: "mm" },
    ],
    calc: (vals) => {
      const area = (vals.length || 0) * (vals.width || 0);
      const depthM = (vals.depth || 100) / 1000;
      const volume = area * depthM;
      const withWastage = volume * 1.05;
      return [
        { label: "Area", value: area.toFixed(1), unit: "m²" },
        { label: "Volume", value: volume.toFixed(2), unit: "m³" },
        { label: "With 5% wastage", value: withWastage.toFixed(2), unit: "m³" },
        { label: "Reo mesh sheets (approx)", value: String(Math.ceil(area / 12)), unit: "sheets" },
      ];
    },
  },
  mulch: {
    title: "Mulch Calculator",
    fields: [
      { key: "length", label: "Length", unit: "m" },
      { key: "width", label: "Width", unit: "m" },
      { key: "depth", label: "Depth", unit: "mm" },
    ],
    calc: (vals) => {
      const area = (vals.length || 0) * (vals.width || 0);
      const depthM = (vals.depth || 75) / 1000;
      const volume = area * depthM;
      const bags = Math.ceil(volume / 0.03);
      return [
        { label: "Area", value: area.toFixed(1), unit: "m²" },
        { label: "Volume", value: volume.toFixed(2), unit: "m³" },
        { label: "Bulk bags (30L)", value: bags.toLocaleString(), unit: "bags" },
      ];
    },
  },
  wall: {
    title: "Retaining Wall Calculator",
    fields: [
      { key: "length", label: "Wall length", unit: "m" },
      { key: "height", label: "Wall height", unit: "m" },
    ],
    calc: (vals) => {
      const length = vals.length || 0;
      const height = vals.height || 0;
      const area = length * height;
      const sleepers = Math.ceil(length / 2.4) * Math.ceil(height / 0.2);
      const posts = Math.ceil(length / 2.4) + 1;
      const drainage = length;
      return [
        { label: "Face area", value: area.toFixed(1), unit: "m²" },
        { label: "Sleepers (2.4m)", value: sleepers.toString(), unit: "pcs" },
        { label: "Posts", value: posts.toString(), unit: "pcs" },
        { label: "Drainage aggregate", value: drainage.toFixed(1), unit: "m" },
      ];
    },
  },
  fence: {
    title: "Fencing Calculator",
    fields: [
      { key: "length", label: "Fence length", unit: "m" },
      { key: "height", label: "Panel height", unit: "m" },
    ],
    calc: (vals) => {
      const length = vals.length || 0;
      const panels = Math.ceil(length / 2.4);
      const posts = panels + 1;
      const concrete = posts * 0.02;
      return [
        { label: "Panels (2.4m)", value: panels.toString(), unit: "pcs" },
        { label: "Posts", value: posts.toString(), unit: "pcs" },
        { label: "Concrete (20kg bags)", value: Math.ceil(concrete * 25).toString(), unit: "bags" },
      ];
    },
  },
};

export default function MaterialCalculator() {
  const [open, setOpen] = useState(false);
  const [calcType, setCalcType] = useState<CalcType>("turf");
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const updateValue = useCallback((key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const config = CALC_CONFIGS[calcType];
  const numericValues: Record<string, number> = {};
  config.fields.forEach((f) => {
    numericValues[f.key] = parseFloat(values[f.key]) || 0;
  });
  const results = config.calc(numericValues);

  const copyResults = useCallback(() => {
    const text = `${config.title}\n${results.map((r) => `${r.label}: ${r.value} ${r.unit}`).join("\n")}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [config, results]);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full flex items-center justify-between p-3 rounded-xl border border-card-border hover:border-primary/50 transition-colors text-sm group"
      >
        <span className="flex items-center gap-2 text-foreground">
          <Calculator className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
          <span className="font-medium">Material Calculator</span>
        </span>
        {open ? <X className="w-4 h-4 text-muted" /> : <span className="text-xs text-muted">Turf · Pavers · Concrete · Mulch · Wall · Fence</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">
              {/* Calc Type Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(CALC_CONFIGS) as CalcType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => { setCalcType(type); setValues({}); }}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      calcType === type
                        ? "bg-primary text-background"
                        : "bg-card-border/30 text-muted hover:text-foreground"
                    }`}
                  >
                    {CALC_CONFIGS[type].title.replace(" Calculator", "")}
                  </button>
                ))}
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {config.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">
                      {field.label} ({field.unit})
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={values[field.key] || ""}
                      onChange={(e) => updateValue(field.key, e.target.value)}
                      placeholder="0"
                      className="w-full h-9 px-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Results */}
              {results.some((r) => parseFloat(r.value) > 0) && (
                <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-primary">{config.title}</span>
                    <button
                      onClick={copyResults}
                      className="text-xs text-muted hover:text-foreground inline-flex items-center gap-1 transition-colors"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  {results.map((r) => (
                    <div key={r.label} className="flex justify-between text-sm">
                      <span className="text-muted">{r.label}</span>
                      <span className="font-medium text-foreground">
                        {r.value} <span className="text-xs text-muted">{r.unit}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
