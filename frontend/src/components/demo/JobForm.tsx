"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  JobDetails,
  JOB_TYPES,
  MATERIALS_OPTIONS,
  SITE_CONDITION_OPTIONS,
  EQUIPMENT_ACCESS,
  ACCESS_OPTIONS,
  SERVICES_OPTIONS,
  BUDGET_RANGES,
  TIMELINES,
  SLOPES,
  COUNCIL_OPTIONS,
} from "./types";

interface JobFormProps {
  jobDetails: JobDetails;
  onChange: (details: JobDetails) => void;
}

function isValidABN(abn: string): boolean {
  if (!abn) return true;
  const cleaned = abn.replace(/\s/g, "");
  if (!/^\d{11}$/.test(cleaned)) return false;
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    const digit = parseInt(cleaned[i], 10);
    const weight = weights[i];
    sum += (i === 0 ? digit - 1 : digit) * weight;
  }
  return sum % 89 === 0;
}

function formatABNInput(abn: string): string {
  const cleaned = abn.replace(/\s/g, "").replace(/\D/g, "").slice(0, 11);
  if (cleaned.length <= 2) return cleaned;
  if (cleaned.length <= 5) return `${cleaned.slice(0, 2)} ${cleaned.slice(2)}`;
  if (cleaned.length <= 8) return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  placeholder = "Select...",
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
        {required && <span style={{ color: "var(--danger)" }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 px-3 text-sm border-2 focus:outline-none appearance-none cursor-pointer"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
          borderRadius: "0px",
        }}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
        {required && <span style={{ color: "var(--danger)" }}>*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 text-sm border-2 focus:outline-none"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--foreground)",
          borderRadius: "0px",
        }}
      />
    </div>
  );
}

function ABNField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const valid = isValidABN(value);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(formatABNInput(e.target.value))}
        placeholder={placeholder}
        maxLength={14}
        className="w-full h-10 px-3 text-sm border-2 focus:outline-none"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: valid ? "var(--border)" : "var(--danger)",
          color: "var(--foreground)",
          borderRadius: "0px",
        }}
      />
      {value && !valid && (
        <p className="text-xs" style={{ color: "var(--danger)" }}>
          Invalid ABN format. Must be 11 digits.
        </p>
      )}
    </div>
  );
}

export default function JobForm({ jobDetails, onChange }: JobFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateField = (field: keyof JobDetails, value: string) => {
    onChange({ ...jobDetails, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Job Type"
          value={jobDetails.job_type}
          onChange={(v) => updateField("job_type", v)}
          options={JOB_TYPES}
        />
        {jobDetails.job_type === "Other" && (
          <TextField
            label="Job Type (Other)"
            value={jobDetails.job_type_other}
            onChange={(v) => updateField("job_type_other", v)}
            placeholder="Specify job type..."
          />
        )}
        <TextField
          label="Client Name"
          value={jobDetails.client_name}
          onChange={(v) => updateField("client_name", v)}
          placeholder="e.g. John Smith"
        />
        <TextField
          label="Site Address"
          value={jobDetails.site_address}
          onChange={(v) => updateField("site_address", v)}
          placeholder="e.g. 42 Oak St, Adelaide SA 5000"
        />
        <TextField
          label="Dimensions / Area"
          value={jobDetails.dimensions}
          onChange={(v) => updateField("dimensions", v)}
          placeholder="e.g. 5m x 8m or 200 sqm"
        />
        <SelectField
          label="Materials"
          value={jobDetails.materials}
          onChange={(v) => updateField("materials", v)}
          options={MATERIALS_OPTIONS}
        />
        {jobDetails.materials === "Other" && (
          <TextField
            label="Materials (Other)"
            value={jobDetails.materials_other}
            onChange={(v) => updateField("materials_other", v)}
            placeholder="Specify materials..."
          />
        )}
        <SelectField
          label="Budget Range"
          value={jobDetails.budget_range}
          onChange={(v) => updateField("budget_range", v)}
          options={BUDGET_RANGES}
        />
        <SelectField
          label="Timeline"
          value={jobDetails.timeline}
          onChange={(v) => updateField("timeline", v)}
          options={TIMELINES}
        />
      </div>

      <motion.button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider transition-colors"
        style={{ color: "var(--text-muted)" }}
        whileTap={{ scale: 0.98 }}
      >
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        Advanced Details
      </motion.button>

      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
        >
          <SelectField
            label="Site Condition"
            value={jobDetails.site_condition}
            onChange={(v) => updateField("site_condition", v)}
            options={SITE_CONDITION_OPTIONS}
          />
          <SelectField
            label="Equipment Access"
            value={jobDetails.equipment_access}
            onChange={(v) => updateField("equipment_access", v)}
            options={EQUIPMENT_ACCESS}
          />
          <SelectField
            label="Site Access"
            value={jobDetails.access_notes}
            onChange={(v) => updateField("access_notes", v)}
            options={ACCESS_OPTIONS}
          />
          <SelectField
            label="Services to Avoid"
            value={jobDetails.services_to_avoid}
            onChange={(v) => updateField("services_to_avoid", v)}
            options={SERVICES_OPTIONS}
          />
          <SelectField
            label="Slope"
            value={jobDetails.slope}
            onChange={(v) => updateField("slope", v)}
            options={SLOPES}
          />
          <SelectField
            label="Council DA"
            value={jobDetails.council_da}
            onChange={(v) => updateField("council_da", v)}
            options={COUNCIL_OPTIONS}
          />
          <ABNField
            label="ABN"
            value={jobDetails.abn}
            onChange={(v) => updateField("abn", v)}
            placeholder="XX XXX XXX XXX"
          />
        </motion.div>
      )}
    </div>
  );
}
