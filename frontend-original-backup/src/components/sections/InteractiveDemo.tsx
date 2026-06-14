"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Printer,
  Mail,
  MessageCircle,
  Phone,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Trash2,
  Plus,
  Edit3,
  Wand2,
  Copy,
  Share2,
  CheckCircle2,
  AlertCircle,
  Zap,
  X,
} from "lucide-react";
import MediaUpload from "../MediaUpload";
import ProgressIndicator from "../ProgressIndicator";
import MaterialCalculator from "../MaterialCalculator";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8341";
const FREE_QUOTA = 3;
const USAGE_KEY = "quotesnap_usage_count";

const JOB_TYPES = [
  "Pool",
  "Deck",
  "Paving",
  "Retaining Wall",
  "Fencing",
  "Turf",
  "Garden",
  "Irrigation",
  "General",
  "Other",
];

const MATERIALS_OPTIONS = [
  "Concrete pavers",
  "Treated pine",
  "Hardwood decking",
  "Composite decking",
  "Colorbond",
  "Instant turf",
  "Premium turf",
  "River rock / pebbles",
  "Concrete (pour)",
  "Garden soil / topsoil",
  "Mulch",
  "Other",
];

const SITE_CONDITION_OPTIONS = [
  "Grass lawn",
  "Bare dirt",
  "Old concrete slab",
  "Existing pavers",
  "Overgrown garden",
  "Rocky ground",
  "Other",
];

const EQUIPMENT_ACCESS = [
  "Wide access — truck + excavator OK",
  "Narrow access — mini excavator only",
  "Tight access — hand tools only",
  "Requires crane / hiab",
  "Other",
];

const ACCESS_OPTIONS = [
  "Clear wide access",
  "Narrow side passage",
  "Steep driveway",
  "Low overhead clearance",
  "Stairs / steps to site",
  "Other",
];

const SERVICES_OPTIONS = [
  "Gas line",
  "Water main",
  "Electrical",
  "Sewer",
  "Stormwater",
  "NBN / communications",
  "None known",
  "Other",
];

const BUDGET_RANGES = [
  "Under $5,000",
  "$5,000 – $10,000",
  "$10,000 – $20,000",
  "$20,000 – $50,000",
  "$50,000+",
  "Other",
];

const TIMELINES = [
  "ASAP",
  "Within 2 weeks",
  "Within 1 month",
  "Flexible",
  "Other",
];

const SLOPES = ["Flat", "Gentle slope", "Moderate slope", "Steep", "Unknown"];

const COUNCIL_OPTIONS = [
  "Yes — already approved",
  "Yes — pending approval",
  "No — not required",
  "Unsure",
];

type JobDetails = {
  job_type: string;
  job_type_other: string;
  dimensions: string;
  materials: string;
  materials_other: string;
  site_condition: string;
  site_condition_other: string;
  access_notes: string;
  access_notes_other: string;
  equipment_access: string;
  equipment_access_other: string;
  budget_range: string;
  budget_range_other: string;
  timeline: string;
  timeline_other: string;
  slope: string;
  council_da: string;
  services_to_avoid: string;
  services_to_avoid_other: string;
  client_name: string;
  site_address: string;
  abn: string;
};

type QuoteHistoryItem = {
  id: string;
  quote_number: string;
  client_name: string;
  date: string;
  total: number;
  quote_html: string;
  quote_data: any;
  transcript: string;
  site_photos?: string[];
  follow_up?: boolean;
  won?: boolean;
  lost?: boolean;
};

type QuoteData = {
  transcript: string;
  quote_html: string;
  quote_data: {
    quote_number: string;
    date: string;
    client_name: string;
    job_address: string;
    line_items: Array<{
      description: string;
      quantity: number;
      unit: string;
      unit_price: number;
      total: number;
    }>;
    subtotal: number;
    gst: number;
    total: number;
  };
  site_photos?: string[];
};

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
    <div>
      <label className="block text-xs font-medium text-muted mb-1.5">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 px-3 pr-10 bg-background border border-card-border rounded-lg text-sm text-foreground appearance-none focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
          style={{ color: value ? "inherit" : "#94a3b8" }}
        >
          <option value="" style={{ color: "#94a3b8" }}>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} style={{ color: "#0f172a" }}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      </div>
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
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted mb-1.5">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-3 bg-background border border-card-border rounded-lg text-sm text-foreground placeholder:text-muted/50 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
      />
    </div>
  );
}

const HISTORY_KEY = "quotesnap_history";

function loadHistory(): QuoteHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    // Backward compatibility: ensure follow_up, won, and lost exist
    return parsed.map((item: any) => ({
      ...item,
      follow_up: item.follow_up ?? false,
      won: item.won ?? false,
      lost: item.lost ?? false,
    }));
  } catch {
    return [];
  }
}

function saveHistory(items: QuoteHistoryItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 50)));
}

function isQuoteOld(dateStr: string): boolean {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    return diffMs > 3 * 24 * 60 * 60 * 1000; // > 3 days
  } catch {
    return false;
  }
}

export default function InteractiveDemo() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [recognition, setRecognition] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [history, setHistory] = useState<QuoteHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [followUpCopied, setFollowUpCopied] = useState<string | null>(null);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [invoiceView, setInvoiceView] = useState(false);
  const [invoiceHtml, setInvoiceHtml] = useState<string | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const [showPaywall, setShowPaywall] = useState(false);
  const [usageCount, setUsageCount] = useState(() => {
    if (typeof window === "undefined") return 0;
    const raw = localStorage.getItem(USAGE_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
  });
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const [jobDetails, setJobDetails] = useState<JobDetails>({
    job_type: "",
    job_type_other: "",
    dimensions: "",
    materials: "",
    materials_other: "",
    site_condition: "",
    site_condition_other: "",
    access_notes: "",
    access_notes_other: "",
    equipment_access: "",
    equipment_access_other: "",
    budget_range: "",
    budget_range_other: "",
    timeline: "",
    timeline_other: "",
    slope: "",
    council_da: "",
    services_to_avoid: "",
    services_to_avoid_other: "",
    client_name: "",
    site_address: "",
    abn: "",
  });

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  // Setup Web Speech API
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-AU";

    rec.onresult = (event: any) => {
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript + " ";
        }
      }
      setTranscript((prev) => (prev + " " + final).trim());
    };

    rec.onerror = (event: any) => {
      if (event.error === "no-speech") return;
      setError(`Speech error: ${event.error}`);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    setRecognition(rec);
  }, []);

  const toggleListening = useCallback(() => {
    setError(null);
    if (!recognition) {
      setError(
        "Speech recognition not supported in this browser. Try Chrome or Safari."
      );
      return;
    }
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      setQuote(null);
    }
  }, [recognition, isListening]);

  const startCheckout = useCallback(async (plan: "monthly") => {
    setCheckoutLoading(plan);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (err: any) {
      setError(err.message || "Checkout failed. Please try again.");
      setCheckoutLoading(null);
    }
  }, []);

  const generateQuote = useCallback(async () => {
    const cleanTranscript = transcript.trim();
    if (!cleanTranscript || cleanTranscript.length < 10) {
      setError("Please describe the job first. Tap the mic and talk for 30 seconds.");
      return;
    }

    if (usageCount >= FREE_QUOTA) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError(null);
    setQuote(null);

    try {
      const displayJobType =
        jobDetails.job_type === "Other" && jobDetails.job_type_other
          ? `Other — ${jobDetails.job_type_other}`
          : jobDetails.job_type;

      const displayBudget =
        jobDetails.budget_range === "Other" && jobDetails.budget_range_other
          ? `Other — ${jobDetails.budget_range_other}`
          : jobDetails.budget_range;

      const displayTimeline =
        jobDetails.timeline === "Other" && jobDetails.timeline_other
          ? `Other — ${jobDetails.timeline_other}`
          : jobDetails.timeline;

      const displayEquipment =
        jobDetails.equipment_access === "Other" && jobDetails.equipment_access_other
          ? `Other — ${jobDetails.equipment_access_other}`
          : jobDetails.equipment_access;

      const displayMaterials =
        jobDetails.materials === "Other" && jobDetails.materials_other
          ? `Other — ${jobDetails.materials_other}`
          : jobDetails.materials;

      const displaySiteCondition =
        jobDetails.site_condition === "Other" && jobDetails.site_condition_other
          ? `Other — ${jobDetails.site_condition_other}`
          : jobDetails.site_condition;

      const displayAccess =
        jobDetails.access_notes === "Other" && jobDetails.access_notes_other
          ? `Other — ${jobDetails.access_notes_other}`
          : jobDetails.access_notes;

      const displayServices =
        jobDetails.services_to_avoid === "Other" && jobDetails.services_to_avoid_other
          ? `Other — ${jobDetails.services_to_avoid_other}`
          : jobDetails.services_to_avoid;

      const payload: any = {
        transcript: cleanTranscript,
        images: images.length > 0 ? images : undefined,
        video: video || undefined,
        job_details: {
          job_type: displayJobType,
          dimensions: jobDetails.dimensions,
          client_name: jobDetails.client_name,
          site_address: jobDetails.site_address,
          abn: jobDetails.abn,
          materials: displayMaterials,
          site_condition: displaySiteCondition,
          equipment_access: displayEquipment,
          access_notes: displayAccess,
          services_to_avoid: displayServices,
          slope: jobDetails.slope,
          council_da: jobDetails.council_da,
          budget_range: displayBudget,
          timeline: displayTimeline,
        },
      };

      const res = await fetch(`${API_URL}/api/generate-quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      const data: QuoteData = await res.json();

      setQuote(data);

      // Save to history
      const newItem: QuoteHistoryItem = {
        id: Date.now().toString(),
        quote_number: data.quote_data.quote_number,
        client_name: data.quote_data.client_name || "TBA",
        date: data.quote_data.date,
        total: data.quote_data.total,
        quote_html: data.quote_html,
        quote_data: data.quote_data,
        transcript: data.transcript,
        site_photos: data.site_photos,
        follow_up: false,
        won: false,
        lost: false,
      };
      const updated = [newItem, ...history];
      setHistory(updated);
      saveHistory(updated);

      // Increment usage count
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem(USAGE_KEY, String(newCount));
    } catch (err: any) {
      setError(err.message || "Failed to generate quote.");
    } finally {
      setLoading(false);
    }
  }, [transcript, images, video, jobDetails, history]);

  const loadQuoteFromHistory = useCallback((item: QuoteHistoryItem) => {
    setQuote({
      transcript: item.transcript,
      quote_html: item.quote_html,
      quote_data: item.quote_data,
      site_photos: item.site_photos,
    });
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const deleteHistoryItem = useCallback(
    (id: string) => {
      const updated = history.filter((h) => h.id !== id);
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  const toggleFollowUp = useCallback(
    (id: string) => {
      const updated = history.map((item) =>
        item.id === id ? { ...item, follow_up: !item.follow_up } : item
      );
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  const markWon = useCallback(
    (id: string) => {
      const updated = history.map((item) =>
        item.id === id ? { ...item, won: true, follow_up: false, lost: false } : item
      );
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  const markLost = useCallback(
    (id: string) => {
      const updated = history.map((item) =>
        item.id === id ? { ...item, won: false, follow_up: false, lost: true } : item
      );
      setHistory(updated);
      saveHistory(updated);
    },
    [history]
  );

  // Edit quote functions
  const startEditing = useCallback(() => {
    if (!quote) return;
    setEditedData(JSON.parse(JSON.stringify(quote.quote_data)));
    setIsEditing(true);
  }, [quote]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditedData(null);
  }, []);

  const updateLineItem = useCallback(
    (index: number, field: string, value: string | number) => {
      setEditedData((prev: any) => {
        if (!prev) return prev;
        const items = [...prev.line_items];
        items[index] = { ...items[index], [field]: value };
        if (field === "quantity" || field === "unit_price") {
          const q = parseFloat(items[index].quantity) || 0;
          const p = parseFloat(items[index].unit_price) || 0;
          items[index].total = Math.round(q * p * 100) / 100;
        }
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
        const gst = Math.round(subtotal * 0.10 * 100) / 100;
        const total = Math.round((subtotal + gst) * 100) / 100;
        return { ...prev, line_items: items, subtotal, gst, total };
      });
    },
    []
  );

  const addLineItem = useCallback(() => {
    setEditedData((prev: any) => {
      if (!prev) return prev;
      const items = [
        ...prev.line_items,
        { description: "", quantity: 1, unit: "job", unit_price: 0, total: 0 },
      ];
      return { ...prev, line_items: items };
    });
  }, []);

  const deleteLineItem = useCallback((index: number) => {
    setEditedData((prev: any) => {
      if (!prev) return prev;
      const items = prev.line_items.filter((_: any, i: number) => i !== index);
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.total || 0), 0);
      const gst = Math.round(subtotal * 0.10 * 100) / 100;
      const total = Math.round((subtotal + gst) * 100) / 100;
      return { ...prev, line_items: items, subtotal, gst, total };
    });
  }, []);

  const saveEdits = useCallback(async () => {
    if (!editedData || !quote) return;
    setEditSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/render-quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });
      if (!res.ok) throw new Error("Failed to render quote");
      const data = await res.json();
      const updatedQuote: QuoteData = {
        ...quote,
        quote_html: data.quote_html,
        quote_data: data.quote_data,
      };
      setQuote(updatedQuote);
      setIsEditing(false);
      setEditedData(null);
      // Update history
      setHistory((prev) => {
        const updated = prev.map((item) =>
          item.quote_number === updatedQuote.quote_data.quote_number
            ? {
                ...item,
                quote_html: data.quote_html,
                quote_data: data.quote_data,
                total: data.quote_data.total,
              }
            : item
        );
        saveHistory(updated);
        return updated;
      });
    } catch (err: any) {
      setError(err.message || "Failed to save edits.");
    } finally {
      setEditSaving(false);
    }
  }, [editedData, quote]);

  const downloadPDF = useCallback(async () => {
    if (!quote) return;
    setPdfLoading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const container = document.createElement("div");
      container.innerHTML = quote.quote_html;
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.width = "800px";
      document.body.appendChild(container);

      const opt = {
        margin: [10, 10, 10, 10] as [number, number, number, number],
        filename: `Quote-${quote.quote_data.quote_number}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: {
          unit: "mm" as const,
          format: "a4" as const,
          orientation: "portrait" as const,
        },
      };

      await html2pdf().set(opt).from(container).save();
      document.body.removeChild(container);
    } catch (e) {
      setError("PDF generation failed. Try using Print instead.");
    } finally {
      setPdfLoading(false);
    }
  }, [quote]);

  const printQuote = useCallback(() => {
    if (!quote) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(quote.quote_html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  }, [quote]);

  const emailQuote = useCallback(() => {
    if (!quote) return;
    const client = quote.quote_data.client_name || "Client";
    const total = quote.quote_data.total.toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD",
    });
    const items = quote.quote_data.line_items
      .map((i) => `• ${i.description.substring(0, 60)}${i.description.length > 60 ? "..." : ""} — ${i.total.toLocaleString("en-AU", { style: "currency", currency: "AUD" })}`)
      .join("%0A");
    const subtotal = quote.quote_data.subtotal.toLocaleString("en-AU", { style: "currency", currency: "AUD" });
    const gst = quote.quote_data.gst.toLocaleString("en-AU", { style: "currency", currency: "AUD" });
    const body = `Hi ${client},%0A%0AI have prepared your landscaping quote.%0A%0AQuote #: ${quote.quote_data.quote_number}%0ADate: ${quote.quote_data.date}%0A%0ALine items:%0A${items}%0A%0ASubtotal: ${subtotal}%0AGST (10%): ${gst}%0ATotal: ${total}%0A%0APlease review and let me know if you have any questions.%0A%0ARegards`;
    window.open(`mailto:?subject=Quote ${quote.quote_data.quote_number}&body=${body}`);
  }, [quote]);

  const smsQuote = useCallback(() => {
    if (!quote) return;
    const total = quote.quote_data.total.toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD",
    });
    const body = `Hi, your quote ${quote.quote_data.quote_number} is ready. Total: ${total}. Let me know if you have any questions.`;
    window.open(`sms:?body=${encodeURIComponent(body)}`);
  }, [quote]);

  const copySMS = useCallback(() => {
    if (!quote) return;
    const client = quote.quote_data.client_name || "there";
    const total = quote.quote_data.total.toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD",
    });
    const text = `Hi ${client}, your quote ${quote.quote_data.quote_number} is ready. Total: ${total}. Valid 30 days. Reply to accept.`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied("sms");
      setTimeout(() => setCopied(null), 2000);
    });
  }, [quote]);

  const whatsappQuote = useCallback(() => {
    if (!quote) return;
    const total = quote.quote_data.total.toLocaleString("en-AU", {
      style: "currency",
      currency: "AUD",
    });
    const body = `Hi, your quote ${quote.quote_data.quote_number} is ready. Total: ${total}. Let me know if you have any questions.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(body)}`);
  }, [quote]);

  const BRAND_DOMAIN = "quotesnap.com.au";

  const shareWithMate = useCallback(() => {
    const text = `This app wrote my quote in 30 seconds. Built for Adelaide landscapers. ${BRAND_DOMAIN}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied("mate");
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  const getFollowUpMessage = useCallback((item: QuoteHistoryItem, type: "48hr" | "1week" | "final") => {
    const client = item.client_name || "there";
    const quoteNum = item.quote_number;
    if (type === "48hr") {
      return `Hi ${client}, just checking in on your landscaping quote (${quoteNum}). Any questions? Happy to adjust scope if needed.`;
    }
    if (type === "1week") {
      return `Hi ${client}, your landscaping quote (${quoteNum}) is still valid for 30 days. Let me know if you'd like to lock in a start date.`;
    }
    return `Hi ${client}, final reminder — your landscaping quote (${quoteNum}) expires in 3 days. If timing's the issue, we can discuss a phased approach.`;
  }, []);

  const copyFollowUp = useCallback((item: QuoteHistoryItem, type: "48hr" | "1week" | "final") => {
    const text = getFollowUpMessage(item, type);
    navigator.clipboard.writeText(text).then(() => {
      setFollowUpCopied(`${item.id}-${type}`);
      setTimeout(() => setFollowUpCopied(null), 2000);
    });
  }, [getFollowUpMessage]);

  const openSMSFollowUp = useCallback((item: QuoteHistoryItem, type: "48hr" | "1week" | "final") => {
    const text = getFollowUpMessage(item, type);
    window.open(`sms:?body=${encodeURIComponent(text)}`);
  }, [getFollowUpMessage]);

  const openWhatsAppFollowUp = useCallback((item: QuoteHistoryItem, type: "48hr" | "1week" | "final") => {
    const text = getFollowUpMessage(item, type);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  }, [getFollowUpMessage]);

  const updateJobDetail = (field: keyof JobDetails, value: string) => {
    setJobDetails((prev) => ({ ...prev, [field]: value }));
  };

  const filledFieldsCount = Object.values(jobDetails).filter(
    (v) => v.trim() !== ""
  ).length;

  const isOtherJobType = jobDetails.job_type === "Other";
  const isOtherBudget = jobDetails.budget_range === "Other";
  const isOtherTimeline = jobDetails.timeline === "Other";
  const isOtherEquipment = jobDetails.equipment_access === "Other";
  const isOtherMaterials = jobDetails.materials === "Other";
  const isOtherSiteCondition = jobDetails.site_condition === "Other";
  const isOtherAccess = jobDetails.access_notes === "Other";
  const isOtherServices = jobDetails.services_to_avoid === "Other";

  return (
    <section
      id="demo"
      className="py-20 md:py-32 relative"
      style={{
        background:
          "radial-gradient(circle at center, rgba(16,185,129,0.05), transparent 70%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            See it in action
          </h2>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
            Tap the mic, talk for 30 seconds, get a professional quote.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Pane — Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-card-border rounded-2xl p-5 md:p-8"
          >
            <div className="flex flex-col items-center gap-5">
              {/* Mic Hero */}
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={toggleListening}
                  className={`h-32 w-32 rounded-full flex items-center justify-center transition-all shadow-xl ${
                    isListening
                      ? "bg-danger animate-pulse shadow-danger/40 scale-105"
                      : "bg-accent hover:bg-accent-hover hover:scale-105 shadow-accent/40"
                  } text-background`}
                  aria-label={isListening ? "Stop recording" : "Start recording"}
                >
                  <Mic className="w-12 h-12" />
                </button>
                <p className="text-lg font-semibold text-foreground text-center">
                  Tap, talk for 30 seconds, tap again. That is it.
                </p>
                <p className="text-sm text-muted">
                  {isListening ? "Listening... tap to stop" : "Start recording"}
                </p>
              </div>

              {/* Waveform when listening */}
              {isListening && (
                <div className="flex items-center justify-center gap-1 h-8">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className={`w-1.5 bg-primary rounded-full animate-soundbar soundbar-${i}`}
                      style={{ height: `${25 + Math.random() * 60}%` }}
                    />
                  ))}
                </div>
              )}

              {/* Transcript Input */}
              <div className="w-full">
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Front yard for the Smiths in Burnside. Retaining wall 12m, turf 40sqm, 5 hedges, mulch. Materials $2,800. Labour 3 days. Before Christmas."
                  className="w-full h-28 p-4 bg-background border border-card-border rounded-xl text-sm text-foreground placeholder:text-muted/50 focus:ring-2 focus:ring-primary focus:border-primary resize-none outline-none transition-all"
                />
              </div>

              {/* Add Details Toggle */}
              <button
                onClick={() => setShowForm((s) => !s)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-card-border hover:border-primary/50 transition-colors text-sm group"
              >
                <span className="flex items-center gap-2 text-foreground">
                  {filledFieldsCount > 0 ? (
                    <Edit3 className="w-4 h-4 text-primary" />
                  ) : (
                    <Plus className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                  )}
                  <span className="font-medium">
                    {filledFieldsCount > 0
                      ? `${filledFieldsCount} detail${filledFieldsCount > 1 ? "s" : ""} added`
                      : "Add job details (optional)"}
                  </span>
                </span>
                {showForm ? (
                  <ChevronUp className="w-4 h-4 text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted" />
                )}
              </button>

              {/* Collapsible Form */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full overflow-hidden"
                  >
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-card-border" />
                        <span className="text-xs font-medium uppercase tracking-wider text-muted">
                          Job Details
                        </span>
                        <div className="h-px flex-1 bg-card-border" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <SelectField
                          label="Job Type"
                          value={jobDetails.job_type}
                          onChange={(v) => updateJobDetail("job_type", v)}
                          options={JOB_TYPES}
                          placeholder="Select type..."
                        />
                        <TextField
                          label="Dimensions / Area"
                          value={jobDetails.dimensions}
                          onChange={(v) => updateJobDetail("dimensions", v)}
                          placeholder="e.g. 12m x 4m"
                        />
                      </div>

                      <AnimatePresence>
                        {jobDetails.job_type === "Other" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <TextField
                              label="Please specify job type"
                              value={jobDetails.job_type_other}
                              onChange={(v) => updateJobDetail("job_type_other", v)}
                              placeholder="e.g. Outdoor kitchen, pergola"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <TextField
                          label="Client Name"
                          value={jobDetails.client_name}
                          onChange={(v) => updateJobDetail("client_name", v)}
                          placeholder="e.g. John Smith"
                        />
                        <TextField
                          label="Site Address"
                          value={jobDetails.site_address}
                          onChange={(v) => updateJobDetail("site_address", v)}
                          placeholder="e.g. 42 Main St, Burnside"
                        />
                      </div>

                      <TextField
                        label="Your ABN"
                        value={jobDetails.abn}
                        onChange={(v) => updateJobDetail("abn", v)}
                        placeholder="e.g. 12 345 678 901"
                      />

                      {/* Advanced Toggle */}
                      <button
                        data-advanced-toggle
                        onClick={() => setShowAdvanced((s) => !s)}
                        className="w-full flex items-center justify-between p-2.5 rounded-lg border border-card-border/60 hover:border-card-border transition-colors text-sm"
                      >
                        <span className="text-muted font-medium">Advanced (optional)</span>
                        {showAdvanced ? (
                          <ChevronUp className="w-4 h-4 text-muted" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted" />
                        )}
                      </button>

                      <AnimatePresence>
                        {showAdvanced && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="space-y-3 pb-1">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <SelectField
                                  label="Materials"
                                  value={jobDetails.materials}
                                  onChange={(v) => updateJobDetail("materials", v)}
                                  options={MATERIALS_OPTIONS}
                                  placeholder="Select materials..."
                                />
                                <SelectField
                                  label="Site Condition"
                                  value={jobDetails.site_condition}
                                  onChange={(v) => updateJobDetail("site_condition", v)}
                                  options={SITE_CONDITION_OPTIONS}
                                  placeholder="Select condition..."
                                />
                                <SelectField
                                  label="Equipment Access"
                                  value={jobDetails.equipment_access}
                                  onChange={(v) => updateJobDetail("equipment_access", v)}
                                  options={EQUIPMENT_ACCESS}
                                  placeholder="Select..."
                                />
                                <SelectField
                                  label="Access Notes"
                                  value={jobDetails.access_notes}
                                  onChange={(v) => updateJobDetail("access_notes", v)}
                                  options={ACCESS_OPTIONS}
                                  placeholder="Select access..."
                                />
                                <SelectField
                                  label="Services to Avoid"
                                  value={jobDetails.services_to_avoid}
                                  onChange={(v) => updateJobDetail("services_to_avoid", v)}
                                  options={SERVICES_OPTIONS}
                                  placeholder="Select services..."
                                />
                                <SelectField
                                  label="Site Slope"
                                  value={jobDetails.slope}
                                  onChange={(v) => updateJobDetail("slope", v)}
                                  options={SLOPES}
                                  placeholder="Select..."
                                />
                                <SelectField
                                  label="Council Approval / DA"
                                  value={jobDetails.council_da}
                                  onChange={(v) => updateJobDetail("council_da", v)}
                                  options={COUNCIL_OPTIONS}
                                  placeholder="Select..."
                                />
                                <SelectField
                                  label="Budget Range"
                                  value={jobDetails.budget_range}
                                  onChange={(v) => updateJobDetail("budget_range", v)}
                                  options={BUDGET_RANGES}
                                  placeholder="Select..."
                                />
                              </div>
                              <SelectField
                                label="Timeline"
                                value={jobDetails.timeline}
                                onChange={(v) => updateJobDetail("timeline", v)}
                                options={TIMELINES}
                                placeholder="Select..."
                              />

                              {/* Other reveals */}
                              <AnimatePresence>
                                {isOtherMaterials && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <TextField label="Please specify materials" value={jobDetails.materials_other} onChange={(v) => updateJobDetail("materials_other", v)} placeholder="e.g. Bluestone, bamboo screening" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <AnimatePresence>
                                {isOtherBudget && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <TextField label="Please specify budget" value={jobDetails.budget_range_other} onChange={(v) => updateJobDetail("budget_range_other", v)} placeholder="e.g. $65,000" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <AnimatePresence>
                                {isOtherTimeline && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <TextField label="Please specify timeline" value={jobDetails.timeline_other} onChange={(v) => updateJobDetail("timeline_other", v)} placeholder="e.g. After school holidays" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <AnimatePresence>
                                {isOtherEquipment && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <TextField label="Please specify equipment access" value={jobDetails.equipment_access_other} onChange={(v) => updateJobDetail("equipment_access_other", v)} placeholder="e.g. Crane from front street" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <AnimatePresence>
                                {isOtherSiteCondition && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <TextField label="Please specify site condition" value={jobDetails.site_condition_other} onChange={(v) => updateJobDetail("site_condition_other", v)} placeholder="e.g. Recently demolished house" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <AnimatePresence>
                                {isOtherAccess && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <TextField label="Please specify access notes" value={jobDetails.access_notes_other} onChange={(v) => updateJobDetail("access_notes_other", v)} placeholder="e.g. Shared driveway with neighbour" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                              <AnimatePresence>
                                {isOtherServices && (
                                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <TextField label="Please specify services to avoid" value={jobDetails.services_to_avoid_other} onChange={(v) => updateJobDetail("services_to_avoid_other", v)} placeholder="e.g. Telstra pit in corner" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Material Calculator */}
              <MaterialCalculator />

              {/* Generate Button */}
              <button
                onClick={generateQuote}
                disabled={loading}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary-hover disabled:bg-card-border disabled:cursor-not-allowed text-background font-semibold transition-all inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Wand2 className="w-4 h-4 animate-spin" />
                    Writing your quote...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Write My Quote
                  </>
                )}
              </button>

              {/* Usage Indicator */}
              {usageCount < FREE_QUOTA && (
                <div className="w-full">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted">
                      {usageCount} of {FREE_QUOTA} free quotes used
                    </span>
                    <span className="text-primary font-medium">
                      {FREE_QUOTA - usageCount} left
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-card-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(usageCount / FREE_QUOTA) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              {usageCount >= FREE_QUOTA && (
                <p className="text-xs text-center text-accent font-medium">
                  Free limit reached — upgrade to keep quoting
                </p>
              )}

              {/* Media Upload */}
              <div className="w-full">
                <p className="text-xs font-medium text-muted mb-2">
                  Add photos (optional)
                </p>
                <MediaUpload
                  images={images}
                  video={video}
                  onImagesChange={setImages}
                  onVideoChange={setVideo}
                />
              </div>

              {error && (
                <div className="w-full p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                  {error}
                </div>
              )}

              {/* History Toggle */}
              {history.length > 0 && (
                <div className="w-full">
                  {/* Stats Bar */}
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const won = history.filter((h) => h.won).length;
                      const lost = history.filter((h) => h.lost).length;
                      const pending = history.filter((h) => !h.won && !h.lost).length;
                      const totalValue = history.filter((h) => h.won).reduce((sum, h) => sum + h.total, 0);
                      return (
                        <>
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                            {won} Won
                          </span>
                          <span className="text-xs font-medium text-muted bg-card-border/30 px-2 py-1 rounded">
                            {pending} Pending
                          </span>
                          <span className="text-xs font-medium text-danger bg-danger/10 px-2 py-1 rounded">
                            {lost} Lost
                          </span>
                          {totalValue > 0 && (
                            <span className="text-xs font-medium text-foreground ml-auto">
                              ${totalValue.toLocaleString("en-AU", { minimumFractionDigits: 0 })} won
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <button
                    onClick={() => setShowHistory((s) => !s)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-card-border hover:border-primary/50 transition-colors text-sm"
                  >
                    <span className="flex items-center gap-2 text-muted">
                      <Clock className="w-4 h-4" />
                      Recent Quotes ({history.length})
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted transition-transform ${
                        showHistory ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {showHistory && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                          {history.map((item) => {
                            const old = isQuoteOld(item.date) && !item.won && !item.follow_up;
                            return (
                              <div
                                key={item.id}
                                className="flex flex-col gap-2 p-3 rounded-lg border border-card-border hover:border-primary/50 hover:bg-primary/5 transition-colors group"
                              >
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => loadQuoteFromHistory(item)}
                                    className="flex-1 text-left text-sm"
                                  >
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-3.5 h-3.5 text-muted flex-shrink-0" />
                                      <span className="font-medium text-foreground truncate">
                                        {item.quote_number}
                                      </span>
                                      <span className="text-xs text-muted">
                                        {item.client_name}
                                      </span>
                                      {old && (
                                        <span className="text-[10px] font-bold bg-danger text-background px-1.5 py-0.5 rounded animate-pulse">
                                          FOLLOW UP NOW
                                        </span>
                                      )}
                                      {item.won && (
                                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                          <CheckCircle2 className="w-3 h-3" />
                                          Won
                                        </span>
                                      )}
                                      {item.lost && (
                                        <span className="text-[10px] font-bold bg-muted/20 text-muted px-1.5 py-0.5 rounded">
                                          Lost
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs text-primary font-medium">
                                        ${item.total.toLocaleString("en-AU", {
                                          minimumFractionDigits: 2,
                                        })}
                                      </span>
                                      <span className="text-xs text-muted">
                                        {item.date}
                                      </span>
                                    </div>
                                  </button>
                                  <button
                                    onClick={() => deleteHistoryItem(item.id)}
                                    className="p-1.5 rounded-md text-muted hover:text-danger hover:bg-danger/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                {!item.won && (
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {old && (
                                      <div className="flex items-center gap-1.5 w-full">
                                        <span className="text-[10px] uppercase tracking-wider text-danger font-bold">Follow up:</span>
                                        {(["48hr", "1week", "final"] as const).map((type) => (
                                          <button
                                            key={type}
                                            onClick={() => copyFollowUp(item, type)}
                                            className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                                              followUpCopied === `${item.id}-${type}`
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-card-border text-muted hover:text-foreground"
                                            }`}
                                            title={`Copy ${type} follow-up message`}
                                          >
                                            {followUpCopied === `${item.id}-${type}` ? "Copied!" : type}
                                          </button>
                                        ))}
                                        <button
                                          onClick={() => openSMSFollowUp(item, "48hr")}
                                          className="text-[10px] px-1.5 py-0.5 rounded border border-card-border text-muted hover:text-foreground transition-colors"
                                        >
                                          SMS
                                        </button>
                                        <button
                                          onClick={() => openWhatsAppFollowUp(item, "48hr")}
                                          className="text-[10px] px-1.5 py-0.5 rounded border border-card-border text-muted hover:text-foreground transition-colors"
                                        >
                                          WA
                                        </button>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                      <label className="flex items-center gap-1.5 text-xs text-muted cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={item.follow_up ?? false}
                                          onChange={() => toggleFollowUp(item.id)}
                                          className="w-3.5 h-3.5 rounded border-card-border"
                                        />
                                        Followed up
                                      </label>
                                      <button
                                        onClick={() => markWon(item.id)}
                                        className="text-xs text-primary hover:text-primary-hover font-medium"
                                      >
                                        Mark Won
                                      </button>
                                      <button
                                        onClick={() => markLost(item.id)}
                                        className="text-xs text-muted hover:text-danger font-medium"
                                      >
                                        Mark Lost
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Pane — Quote Preview / Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card border border-card-border rounded-2xl overflow-hidden flex flex-col"
          >
            {!quote && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <FileTextIcon className="w-8 h-8 text-primary/50" />
                </div>
                <p className="text-muted text-sm">
                  Your quote preview will appear here
                </p>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 gap-6">
                <ProgressIndicator />
              </div>
            )}

            {quote && !isEditing && (
              <>
                <div className="p-4 md:p-6 border-b border-card-border flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {invoiceView ? "Tax Invoice Preview" : "Quote Preview"}
                    </h3>
                    <p className="text-sm text-muted">
                      {quote.quote_data.quote_number} · {quote.quote_data.date}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={startEditing}
                      className="h-9 px-3 rounded-lg border border-card-border hover:border-primary/50 text-foreground text-sm font-medium inline-flex items-center gap-2 transition-colors"
                      title="Edit quote"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={copySMS}
                      className={`h-9 px-3 rounded-lg border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                        copied === "sms"
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-card-border hover:border-primary/50 text-foreground"
                      }`}
                      title="Copy SMS message"
                    >
                      {copied === "sms" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">Copy SMS</span>
                    </button>
                    <button
                      onClick={smsQuote}
                      className="h-9 px-3 rounded-lg border border-card-border hover:border-primary/50 text-foreground text-sm font-medium inline-flex items-center gap-2 transition-colors"
                      title="SMS to client"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="hidden sm:inline">SMS</span>
                    </button>
                    <button
                      onClick={whatsappQuote}
                      className="h-9 px-3 rounded-lg border border-card-border hover:border-primary/50 text-foreground text-sm font-medium inline-flex items-center gap-2 transition-colors"
                      title="WhatsApp to client"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </button>
                    <button
                      onClick={emailQuote}
                      className="h-9 px-3 rounded-lg border border-card-border hover:border-primary/50 text-foreground text-sm font-medium inline-flex items-center gap-2 transition-colors"
                      title="Email to client"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="hidden sm:inline">Email</span>
                    </button>
                    <button
                      onClick={downloadPDF}
                      disabled={pdfLoading}
                      className="h-9 px-3 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-card-border text-background text-sm font-medium inline-flex items-center gap-2 transition-colors"
                    >
                      {pdfLoading ? (
                        <span className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      PDF
                    </button>
                    <button
                      onClick={printQuote}
                      className="h-9 px-3 rounded-lg border border-card-border hover:border-foreground/20 text-foreground text-sm font-medium inline-flex items-center gap-2 transition-colors"
                      title="Print"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (invoiceView) {
                          setInvoiceView(false);
                          return;
                        }
                        setInvoiceLoading(true);
                        try {
                          const res = await fetch(`${API_URL}/api/render-invoice`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(quote.quote_data),
                          });
                          if (!res.ok) throw new Error("Failed to generate invoice");
                          const data = await res.json();
                          setInvoiceHtml(data.invoice_html);
                          setInvoiceView(true);
                        } catch (err: any) {
                          setError(err.message || "Invoice generation failed");
                        } finally {
                          setInvoiceLoading(false);
                        }
                      }}
                      disabled={invoiceLoading}
                      className={`h-9 px-3 rounded-lg border text-sm font-medium inline-flex items-center gap-2 transition-colors ${
                        invoiceView
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-card-border hover:border-primary/50 text-foreground"
                      }`}
                      title={invoiceView ? "Back to quote" : "Convert to invoice"}
                    >
                      {invoiceLoading ? (
                        <span className="w-3.5 h-3.5 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      <span className="hidden sm:inline">{invoiceView ? "Quote" : "Invoice"}</span>
                    </button>
                  </div>
                </div>

                {/* Share with a mate */}
                <div className="px-4 md:px-6 pt-4">
                  <button
                    onClick={shareWithMate}
                    className={`w-full h-9 rounded-lg border text-sm font-medium inline-flex items-center justify-center gap-2 transition-colors ${
                      copied === "mate"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-card-border hover:border-primary/50 text-muted hover:text-foreground"
                    }`}
                  >
                    {copied === "mate" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                    {copied === "mate" ? "Copied!" : "Share with a mate"}
                  </button>
                </div>

                <div className="p-4 md:p-6 border-b border-card-border bg-background/50">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted mb-2">
                    What we heard
                  </p>
                  <p className="text-sm text-foreground/80 italic">
                    &ldquo;{quote.transcript}&rdquo;
                  </p>
                </div>

                {/* Site Photos */}
                {quote.site_photos && quote.site_photos.length > 0 && (
                  <div className="p-4 md:p-6 border-b border-card-border">
                    <p className="text-xs font-medium uppercase tracking-wider text-primary mb-3">
                      Site Photos
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {quote.site_photos.map((photo, idx) => (
                        <img
                          key={idx}
                          src={photo}
                          alt={`Site photo ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-card-border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex-1 p-4 md:p-6 overflow-auto">
                  <div
                    className="border border-card-border rounded-xl overflow-hidden bg-white"
                    style={{ height: "600px" }}
                  >
                    <iframe
                      srcDoc={invoiceView && invoiceHtml ? invoiceHtml : quote.quote_html}
                      className="w-full h-full"
                      title={invoiceView ? "Invoice Preview" : "Quote Preview"}
                    />
                  </div>
                </div>
              </>
            )}

            {quote && isEditing && editedData && (
              <>
                <div className="p-4 md:p-6 border-b border-card-border flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Edit Quote
                    </h3>
                    <p className="text-sm text-muted">
                      {editedData.quote_number}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={cancelEditing}
                      className="h-9 px-4 rounded-lg border border-card-border hover:border-foreground/20 text-foreground text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdits}
                      disabled={editSaving}
                      className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-card-border text-background text-sm font-medium inline-flex items-center gap-2 transition-colors"
                    >
                      {editSaving ? (
                        <span className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      ) : (
                        <Edit3 className="w-4 h-4" />
                      )}
                      Save
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-6 space-y-5">
                  {/* Client info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Business Name</label>
                      <input
                        type="text"
                        value={editedData.business_name || ""}
                        onChange={(e) => setEditedData({ ...editedData, business_name: e.target.value })}
                        placeholder="e.g. GreenScape Landscaping"
                        className="w-full h-10 px-3 bg-background border border-card-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Client Name</label>
                      <input
                        type="text"
                        value={editedData.client_name || ""}
                        onChange={(e) => setEditedData({ ...editedData, client_name: e.target.value })}
                        className="w-full h-10 px-3 bg-background border border-card-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-muted mb-1.5">Job Address</label>
                      <input
                        type="text"
                        value={editedData.job_address || ""}
                        onChange={(e) => setEditedData({ ...editedData, job_address: e.target.value })}
                        className="w-full h-10 px-3 bg-background border border-card-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  {/* Line Items */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground">Line Items</h4>
                      <button
                        onClick={addLineItem}
                        className="h-8 px-3 rounded-lg border border-card-border hover:border-primary/50 text-foreground text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Item
                      </button>
                    </div>

                    {editedData.line_items.map((item: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl border border-card-border bg-background/50 space-y-2">
                        <div className="flex items-start gap-2">
                          <textarea
                            value={item.description}
                            onChange={(e) => updateLineItem(idx, "description", e.target.value)}
                            placeholder="Item description"
                            rows={2}
                            className="flex-1 p-2.5 bg-background border border-card-border rounded-lg text-sm text-foreground placeholder:text-muted/50 focus:ring-2 focus:ring-primary focus:border-primary resize-none outline-none"
                          />
                          <button
                            onClick={() => deleteLineItem(idx)}
                            className="p-2 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">Qty</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.quantity}
                              onChange={(e) => updateLineItem(idx, "quantity", e.target.value)}
                              className="w-full h-9 px-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">Unit</label>
                            <select
                              value={item.unit}
                              onChange={(e) => updateLineItem(idx, "unit", e.target.value)}
                              className="w-full h-9 px-2 bg-background border border-card-border rounded-lg text-sm text-foreground appearance-none focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            >
                              {["job", "m", "m2", "m3", "hr", "day", "each", "L", "tonne"].map((u) => (
                                <option key={u} value={u} className="text-black dark:text-white bg-white dark:bg-gray-900">
                                  {u}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">$/Unit</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.unit_price}
                              onChange={(e) => updateLineItem(idx, "unit_price", e.target.value)}
                              className="w-full h-9 px-2 bg-background border border-card-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-wider text-muted mb-1">Total</label>
                            <div className="h-9 px-2 flex items-center rounded-lg bg-card-border/30 text-sm font-medium text-foreground">
                              ${Number(item.total || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="p-4 rounded-xl border border-card-border bg-background/50 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">Subtotal</span>
                      <span className="text-foreground font-medium">${Number(editedData.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted">GST (10%)</span>
                      <span className="text-foreground font-medium">${Number(editedData.gst || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base pt-2 border-t border-card-border">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-bold text-primary">${Number(editedData.total || 0).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Notes & Terms */}
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Notes</label>
                      <textarea
                        value={editedData.notes || ""}
                        onChange={(e) => setEditedData({ ...editedData, notes: e.target.value })}
                        rows={3}
                        className="w-full p-3 bg-background border border-card-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted mb-1.5">Terms</label>
                      <textarea
                        value={editedData.terms || ""}
                        onChange={(e) => setEditedData({ ...editedData, terms: e.target.value })}
                        rows={3}
                        className="w-full p-3 bg-background border border-card-border rounded-lg text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none outline-none"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
      {/* Paywall Modal */}
      <AnimatePresence>
        {showPaywall && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPaywall(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-card-border rounded-2xl p-6 md:p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPaywall(false)}
                className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  You are on a roll
                </h3>
                <p className="text-sm text-muted">
                  You have used all {FREE_QUOTA} free quotes. Upgrade to Pro for unlimited AI quotes.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => startCheckout("monthly")}
                  disabled={checkoutLoading !== null}
                  className="w-full h-11 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-background font-semibold transition-all inline-flex items-center justify-center gap-2"
                >
                  {checkoutLoading === "monthly" ? (
                    <>
                      <Wand2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>Pro Monthly — $25.99/mo</>
                  )}
                </button>

              </div>

              <p className="text-xs text-center text-muted mt-4">
                7-day free trial on monthly. Cancel anytime. No lock-in.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}
