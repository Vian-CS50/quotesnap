"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer, Mail, MessageCircle, Copy, CheckCircle2,
  Edit3, X, Plus, Trash2, FileText, Loader2, Zap,
} from "lucide-react";
import { QuoteData, QuoteDataType, API_URL } from "./types";

interface QuoteDisplayProps {
  quote: QuoteData;
  onQuoteUpdate: (quote: QuoteData) => void;
}

const REVIEW_ACK_KEY = "quotesnap_review_acknowledged";

export default function QuoteDisplay({ quote, onQuoteUpdate }: QuoteDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<QuoteDataType | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [invoiceView, setInvoiceView] = useState(false);
  const [invoiceHtml, setInvoiceHtml] = useState<string | null>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewChecked, setReviewChecked] = useState(false);
  const [pendingAction, setPendingAction] = useState<"pdf" | "copy" | "email" | "whatsapp" | null>(null);

  const hasAcknowledged = typeof window !== "undefined"
    ? localStorage.getItem(REVIEW_ACK_KEY) === "true"
    : false;

  const startEditing = useCallback(() => {
    setEditedData(JSON.parse(JSON.stringify(quote.quote_data)));
    setIsEditing(true);
  }, [quote]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setEditedData(null);
  }, []);

  const updateLineItem = useCallback((index: number, field: string, value: string | number) => {
    setEditedData((prev) => {
      if (!prev) return prev;
      const items = [...prev.line_items];
      items[index] = { ...items[index], [field]: value };
      if (field === "quantity" || field === "unit_price") {
        const q = parseFloat(String(items[index].quantity)) || 0;
        const p = parseFloat(String(items[index].unit_price)) || 0;
        items[index].total = Math.round(q * p * 100) / 100;
      }
      const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
      const gst = Math.round(subtotal * 0.10 * 100) / 100;
      const total = Math.round((subtotal + gst) * 100) / 100;
      return { ...prev, line_items: items, subtotal, gst, total };
    });
  }, []);

  const addLineItem = useCallback(() => {
    setEditedData((prev) => {
      if (!prev) return prev;
      const items = [...prev.line_items, { description: "", quantity: 1, unit: "job", unit_price: 0, total: 0 }];
      return { ...prev, line_items: items };
    });
  }, []);

  const deleteLineItem = useCallback((index: number) => {
    setEditedData((prev) => {
      if (!prev) return prev;
      const items = prev.line_items.filter((_, i) => i !== index);
      const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
      const gst = Math.round(subtotal * 0.10 * 100) / 100;
      const total = Math.round((subtotal + gst) * 100) / 100;
      return { ...prev, line_items: items, subtotal, gst, total };
    });
  }, []);

  const saveEdits = useCallback(async () => {
    if (!editedData) return;
    setEditSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/render-quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });
      if (!res.ok) throw new Error("Failed to render quote");
      const data = await res.json();
      onQuoteUpdate({
        ...quote,
        quote_html: data.quote_html,
        quote_data: data.quote_data,
      });
      setIsEditing(false);
      setEditedData(null);
    } catch (err) {
      alert("Failed to save edits. Please try again.");
    } finally {
      setEditSaving(false);
    }
  }, [editedData, quote, onQuoteUpdate]);

  const executeDownloadPDF = useCallback(async () => {
    setPdfLoading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("quote-preview");
      if (!element) return;
      await html2pdf()
        .set({
          margin: [10, 10],
          filename: `${quote.quote_data.quote_number}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    } finally {
      setPdfLoading(false);
    }
  }, [quote]);

  const executeCopyQuote = useCallback(() => {
    const text = quote.quote_data.line_items
      .map((item) => `${item.description}: ${item.quantity} ${item.unit} @ $${item.unit_price} = $${item.total}`)
      .join("\n");
    navigator.clipboard.writeText(text + `\n\nSubtotal: $${quote.quote_data.subtotal}\nGST: $${quote.quote_data.gst}\nTotal: $${quote.quote_data.total}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [quote]);

  const executeShareEmail = useCallback(() => {
    const subject = encodeURIComponent(`Quote ${quote.quote_data.quote_number}`);
    const body = encodeURIComponent(`Hi ${quote.quote_data.client_name},\n\nPlease find your quote attached.\n\nTotal: $${quote.quote_data.total} AUD\n\nLet me know if you have any questions.`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }, [quote]);

  const executeShareWhatsApp = useCallback(() => {
    const text = encodeURIComponent(
      `Quote ${quote.quote_data.quote_number} for ${quote.quote_data.client_name}\nTotal: $${quote.quote_data.total} AUD`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }, [quote]);

  const runProtectedAction = useCallback((action: "pdf" | "copy" | "email" | "whatsapp") => {
    if (hasAcknowledged) {
      if (action === "pdf") executeDownloadPDF();
      if (action === "copy") executeCopyQuote();
      if (action === "email") executeShareEmail();
      if (action === "whatsapp") executeShareWhatsApp();
      return;
    }
    setPendingAction(action);
    setShowReviewModal(true);
    setReviewChecked(false);
  }, [hasAcknowledged, executeDownloadPDF, executeCopyQuote, executeShareEmail, executeShareWhatsApp]);

  const confirmReview = useCallback(() => {
    if (!reviewChecked) return;
    localStorage.setItem(REVIEW_ACK_KEY, "true");
    setShowReviewModal(false);
    if (pendingAction === "pdf") executeDownloadPDF();
    if (pendingAction === "copy") executeCopyQuote();
    if (pendingAction === "email") executeShareEmail();
    if (pendingAction === "whatsapp") executeShareWhatsApp();
    setPendingAction(null);
  }, [reviewChecked, pendingAction, executeDownloadPDF, executeCopyQuote, executeShareEmail, executeShareWhatsApp]);

  const generateInvoice = useCallback(async () => {
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
    } catch (err) {
      alert("Failed to generate invoice.");
    } finally {
      setInvoiceLoading(false);
    }
  }, [quote]);

  const data = isEditing && editedData ? editedData : quote.quote_data;

  return (
    <div className="space-y-6">
      {/* Review Acknowledgment Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-md border-2 p-6 md:p-8"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                borderRadius: "0px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <h3
                  className="font-serif text-xl mb-2"
                  style={{ color: "var(--foreground)" }}
                >
                  Review before sending
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  QuoteSnap drafts quotes with AI. Before you send this to a client, confirm you've reviewed it for accuracy.
                </p>
              </div>

              <label className="flex items-start gap-3 p-4 border-2 cursor-pointer transition-colors mb-6"
                style={{
                  borderColor: reviewChecked ? "var(--primary)" : "var(--border)",
                  backgroundColor: reviewChecked ? "rgba(27, 77, 62, 0.05)" : "var(--surface)",
                  borderRadius: "0px",
                }}
              >
                <input
                  type="checkbox"
                  checked={reviewChecked}
                  onChange={(e) => setReviewChecked(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-600"
                />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  I have reviewed this draft quote for pricing, quantities, materials, and scope. I understand I am responsible for the final quote sent to my client.
                </span>
              </label>

              <button
                onClick={confirmReview}
                disabled={!reviewChecked}
                className="w-full h-12 font-mono text-xs uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "white",
                  borderRadius: "0px",
                }}
              >
                Continue
              </button>

              <p className="text-center text-xs mt-4" style={{ color: "var(--text-muted)" }}>
                This acknowledgment is required under our{" "}
                <a href="/terms" target="_blank" className="underline">Terms of Service</a>.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {!isEditing ? (
          <>
            <button onClick={() => runProtectedAction("pdf")} disabled={pdfLoading} className="h-10 px-4 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 border transition-colors disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}>
              {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
              PDF
            </button>
            <button onClick={() => runProtectedAction("copy")} className="h-10 px-4 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 border transition-colors" style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}>
              {copied ? <CheckCircle2 className="w-4 h-4" style={{ color: "var(--primary)" }} /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={() => runProtectedAction("email")} className="h-10 px-4 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 border transition-colors" style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}>
              <Mail className="w-4 h-4" /> Email
            </button>
            <button onClick={() => runProtectedAction("whatsapp")} className="h-10 px-4 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 border transition-colors" style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}>
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
            <button onClick={startEditing} className="h-10 px-4 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 border transition-colors" style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}>
              <Edit3 className="w-4 h-4" /> Edit
            </button>
            <button onClick={() => invoiceView ? setInvoiceView(false) : generateInvoice()} disabled={invoiceLoading} className="h-10 px-4 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 border transition-colors disabled:opacity-50" style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}>
              {invoiceLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {invoiceView ? "Quote" : "Invoice"}
            </button>
          </>
        ) : (
          <>
            <button onClick={saveEdits} disabled={editSaving} className="h-10 px-4 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors disabled:opacity-50" style={{ backgroundColor: "var(--primary)", color: "white", borderRadius: "0px" }}>
              {editSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Save
            </button>
            <button onClick={cancelEditing} className="h-10 px-4 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 border transition-colors" style={{ borderColor: "var(--border)", color: "var(--foreground)", borderRadius: "0px" }}>
              <X className="w-4 h-4" /> Cancel
            </button>
          </>
        )}
      </div>

      {/* Review banner */}
      {!isEditing && (
        <div className="p-4 border-l-4 text-sm" style={{
          backgroundColor: "rgba(245, 158, 11, 0.08)",
          borderColor: "var(--accent)",
          color: "var(--text-secondary)",
        }}>
          <strong style={{ color: "var(--foreground)" }}>AI-generated draft.</strong>{" "}
          Review all line items, quantities, and pricing before sending to your client. You are responsible for the final quote.
        </div>
      )}

      {/* Quote Preview / Edit */}
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {editedData?.line_items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-end p-4 border-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", borderRadius: "0px" }}>
                <div className="col-span-4">
                  <label className="text-xs font-mono uppercase" style={{ color: "var(--text-muted)" }}>Description</label>
                  <input value={item.description} onChange={(e) => updateLineItem(i, "description", e.target.value)} className="w-full h-9 px-2 text-sm border focus:outline-none" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)", borderRadius: "0px" }} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-mono uppercase" style={{ color: "var(--text-muted)" }}>Qty</label>
                  <input type="number" value={item.quantity} onChange={(e) => updateLineItem(i, "quantity", e.target.value)} className="w-full h-9 px-2 text-sm border focus:outline-none" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)", borderRadius: "0px" }} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-mono uppercase" style={{ color: "var(--text-muted)" }}>Unit</label>
                  <input value={item.unit} onChange={(e) => updateLineItem(i, "unit", e.target.value)} className="w-full h-9 px-2 text-sm border focus:outline-none" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)", borderRadius: "0px" }} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-mono uppercase" style={{ color: "var(--text-muted)" }}>Price</label>
                  <input type="number" step="0.01" value={item.unit_price} onChange={(e) => updateLineItem(i, "unit_price", e.target.value)} className="w-full h-9 px-2 text-sm border focus:outline-none" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)", borderRadius: "0px" }} />
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-sm font-mono" style={{ color: "var(--foreground)" }}>${item.total}</span>
                </div>
                <div className="col-span-1">
                  <button onClick={() => deleteLineItem(i)} className="h-9 w-9 flex items-center justify-center border transition-colors" style={{ borderColor: "var(--danger)", color: "var(--danger)", borderRadius: "0px" }}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={addLineItem} className="h-10 px-4 font-mono text-xs uppercase tracking-wider inline-flex items-center gap-2 border transition-colors" style={{ borderColor: "var(--primary)", color: "var(--primary)", borderRadius: "0px" }}>
              <Plus className="w-4 h-4" /> Add Line Item
            </button>
            <div className="flex justify-end gap-4 text-sm font-mono pt-4" style={{ color: "var(--foreground)" }}>
              <div>Subtotal: ${editedData?.subtotal}</div>
              <div>GST: ${editedData?.gst}</div>
              <div className="font-bold">Total: ${editedData?.total}</div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div id="quote-preview" className="border-2 overflow-hidden" style={{ borderColor: "var(--border)", borderRadius: "0px" }}>
              <iframe
                srcDoc={invoiceView && invoiceHtml ? invoiceHtml : quote.quote_html}
                title={invoiceView ? "Invoice Preview" : "Quote Preview"}
                className="w-full"
                style={{ height: "600px", border: "none" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
