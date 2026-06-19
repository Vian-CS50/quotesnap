"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from "react";
import type { LineItem, Quote } from "@/types";
import { generateId, generateQuoteNumber, addDays } from "@/lib/utils";
import { useSettings } from "./SettingsContext";

interface QuoteContextType {
  quotes: Quote[];
  currentQuote: Quote | null;
  setCurrentQuote: (quote: Quote | null) => void;
  createDraft: (clientName?: string) => Quote;
  updateQuote: (patch: Partial<Quote>) => void;
  updateLineItem: (id: string, patch: Partial<LineItem>) => void;
  addLineItem: (item?: Partial<LineItem>) => void;
  removeLineItem: (id: string) => void;
  saveCurrentQuote: () => void;
  deleteQuote: (id: string) => void;
  recalcQuote: (quote: Quote) => Quote;
}

const STORAGE_KEY = "quotesnap-quotes";

function emptyQuote(settings: { taxRate: number; defaultExpiryDays: number }): Quote {
  const today = new Date().toISOString().split("T")[0];
  return {
    id: generateId("quote"),
    quoteNumber: generateQuoteNumber(),
    clientName: "",
    dateIssued: today,
    expiryDate: addDays(today, settings.defaultExpiryDays),
    status: "Draft",
    lineItems: [],
    subtotal: 0,
    discountPercent: 0,
    discountAmount: 0,
    taxRate: settings.taxRate,
    taxAmount: 0,
    total: 0,
    laborCost: 0,
    materialCost: 0,
    projectedProfit: 0,
    marginPercent: 0,
  };
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setQuotes(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
  }, [quotes]);

  const recalcQuote = useCallback((quote: Quote): Quote => {
    const lineItems = quote.lineItems.map((item) => {
      const qty = item.quantity ?? 0;
      const total = qty * item.unitPrice;
      return { ...item, total };
    });

    const materialCost = lineItems
      .filter((i) => i.category === "MATERIAL")
      .reduce((sum, i) => sum + i.total, 0);
    const laborCost = lineItems
      .filter((i) => i.category === "LABOR")
      .reduce((sum, i) => sum + i.total, 0);
    const subtotal = lineItems.reduce((sum, i) => sum + i.total, 0);
    const discountAmount = subtotal * (quote.discountPercent / 100);
    const taxable = subtotal - discountAmount;
    const taxAmount = taxable * (quote.taxRate / 100);
    const total = taxable + taxAmount;
    const projectedProfit = total - (laborCost + materialCost * 0.6); // rough cost model
    const marginPercent = total > 0 ? (projectedProfit / total) * 100 : 0;

    return {
      ...quote,
      lineItems,
      materialCost,
      laborCost,
      subtotal,
      discountAmount,
      taxAmount,
      total,
      projectedProfit,
      marginPercent,
    };
  }, []);

  const createDraft = useCallback(
    (clientName = "") => {
      const draft = recalcQuote({
        ...emptyQuote(settings.quoteDefaults),
        clientName,
      });
      setCurrentQuote(draft);
      return draft;
    },
    [settings.quoteDefaults, recalcQuote]
  );

  const updateQuote = useCallback(
    (patch: Partial<Quote>) => {
      setCurrentQuote((q) => {
        if (!q) return q;
        return recalcQuote({ ...q, ...patch });
      });
    },
    [recalcQuote]
  );

  const updateLineItem = useCallback(
    (id: string, patch: Partial<LineItem>) => {
      setCurrentQuote((q) => {
        if (!q) return q;
        const items = q.lineItems.map((item) =>
          item.id === id ? { ...item, ...patch } : item
        );
        return recalcQuote({ ...q, lineItems: items });
      });
    },
    [recalcQuote]
  );

  const addLineItem = useCallback(
    (item?: Partial<LineItem>) => {
      setCurrentQuote((q) => {
        if (!q) return q;
        const newItem: LineItem = {
          id: generateId("li"),
          description: "",
          category: "MATERIAL",
          quantity: 1,
          unit: "item",
          unitPrice: 0,
          total: 0,
          ...item,
        };
        return recalcQuote({ ...q, lineItems: [...q.lineItems, newItem] });
      });
    },
    [recalcQuote]
  );

  const removeLineItem = useCallback(
    (id: string) => {
      setCurrentQuote((q) => {
        if (!q) return q;
        return recalcQuote({
          ...q,
          lineItems: q.lineItems.filter((i) => i.id !== id),
        });
      });
    },
    [recalcQuote]
  );

  const saveCurrentQuote = useCallback(() => {
    setCurrentQuote((q) => {
      if (!q) return q;
      const saved = recalcQuote(q);
      setQuotes((prev) => {
        const idx = prev.findIndex((x) => x.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      return saved;
    });
  }, [recalcQuote]);

  const deleteQuote = useCallback((id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    setCurrentQuote((q) => (q?.id === id ? null : q));
  }, []);

  const value = useMemo(
    () => ({
      quotes,
      currentQuote,
      setCurrentQuote,
      createDraft,
      updateQuote,
      updateLineItem,
      addLineItem,
      removeLineItem,
      saveCurrentQuote,
      deleteQuote,
      recalcQuote,
    }),
    [
      quotes,
      currentQuote,
      setCurrentQuote,
      createDraft,
      updateQuote,
      updateLineItem,
      addLineItem,
      removeLineItem,
      saveCurrentQuote,
      deleteQuote,
      recalcQuote,
    ]
  );

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
