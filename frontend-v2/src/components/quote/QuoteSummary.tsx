"use client";

import { Quote } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface QuoteSummaryProps {
  quote: Quote;
}

export function QuoteSummary({ quote }: QuoteSummaryProps) {
  return (
    <div className="p-6 bg-surface-container border-t border-outline-variant flex flex-col items-end gap-2">
      <div className="flex justify-between w-full max-w-xs text-on-surface-variant font-body-sm">
        <span>Subtotal</span>
        <span>{formatCurrency(quote.subtotal)}</span>
      </div>
      {quote.discountPercent > 0 && (
        <div className="flex justify-between w-full max-w-xs text-on-surface-variant font-body-sm">
          <span>Discount ({quote.discountPercent}%)</span>
          <span className="text-error">-{formatCurrency(quote.discountAmount)}</span>
        </div>
      )}
      <div className="flex justify-between w-full max-w-xs text-on-surface-variant font-body-sm">
        <span>Tax ({quote.taxRate}%)</span>
        <span>{formatCurrency(quote.taxAmount)}</span>
      </div>
      <div className="flex justify-between w-full max-w-xs mt-2 pt-2 border-t border-outline-variant">
        <span className="font-headline-sm font-bold">Total</span>
        <span className="font-headline-sm font-bold text-growth-green">{formatCurrency(quote.total)}</span>
      </div>
    </div>
  );
}
