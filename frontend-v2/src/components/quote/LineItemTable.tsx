"use client";

import { LineItem } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { StatusChip } from "@/components/ui/StatusChip";
import { useQuote } from "@/context/QuoteContext";

interface LineItemTableProps {
  quote: import("@/types").Quote;
}

export function LineItemTable({ quote }: LineItemTableProps) {
  const { updateLineItem, removeLineItem } = useQuote();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant">
            <th className="p-4 font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              Description
            </th>
            <th className="p-4 font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              Category
            </th>
            <th className="p-4 font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant text-center">
              Qty
            </th>
            <th className="p-4 font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              Unit Price
            </th>
            <th className="p-4 font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant text-right">
              Total
            </th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-subtle">
          {quote.lineItems.map((item) => (
            <LineItemRow key={item.id} item={item} onChange={updateLineItem} onDelete={removeLineItem} />
          ))}
          {quote.lineItems.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-body-sm text-on-surface-variant">
                No line items yet. Record a voice memo or add items manually.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function LineItemRow({
  item,
  onChange,
  onDelete,
}: {
  item: LineItem;
  onChange: (id: string, patch: Partial<LineItem>) => void;
  onDelete: (id: string) => void;
}) {
  const hasError = !item.quantity || item.quantity <= 0;
  const isWarning = item.confidence === "low" || item.confidence === "medium";

  return (
    <tr
      className={
        hasError
          ? "bg-error-container/20 hover:bg-error-container/30 transition-colors group"
          : "hover:bg-surface-container-low transition-colors group"
      }
    >
      <td className="p-4">
        <div className="font-body-md font-semibold flex items-center gap-2">
          <input
            type="text"
            value={item.description}
            onChange={(e) => onChange(item.id, { description: e.target.value })}
            className="bg-transparent border-none focus:ring-0 p-0 w-full font-body-md font-semibold"
            placeholder="Item description"
          />
          {hasError && <MaterialIcon name="error" className="text-error" size={20} />}
          {isWarning && !hasError && <MaterialIcon name="warning" className="text-utility-gold" size={20} />}
        </div>
        {hasError && (
          <div className="text-xs text-error font-semibold">Missing quantity in transcription</div>
        )}
        {isWarning && !hasError && (
          <div className="text-xs text-utility-gold font-semibold">Manual mapping required</div>
        )}
      </td>
      <td className="p-4">
        <StatusChip status={item.category} />
      </td>
      <td className="p-4 w-24">
        <input
          type="number"
          min={0}
          value={item.quantity ?? ""}
          onChange={(e) => onChange(item.id, { quantity: e.target.value === "" ? null : Number(e.target.value) })}
          className={cn(
            "w-full h-10 bg-surface-bright rounded focus:ring-0 text-center font-body-md",
            hasError
              ? "border-error border-2 placeholder:text-error/50"
              : "border-outline-variant border focus:border-growth-green"
          )}
          placeholder="0"
        />
      </td>
      <td className="p-4">
        <input
          type="number"
          min={0}
          step={0.01}
          value={item.unitPrice}
          onChange={(e) => onChange(item.id, { unitPrice: Number(e.target.value) })}
          className="w-24 h-10 bg-surface-bright border border-outline-variant rounded focus:border-growth-green focus:ring-0 font-body-md"
        />
      </td>
      <td className="p-4 text-right font-bold text-growth-green">{formatCurrency(item.total)}</td>
      <td className="p-4 text-right">
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MaterialIcon name="delete" size={18} />
        </button>
      </td>
    </tr>
  );
}
