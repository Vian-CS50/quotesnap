"use client";

import { useState } from "react";
import { LineItem } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { StatusChip } from "@/components/ui/StatusChip";
import { useQuote } from "@/context/QuoteContext";

interface LineItemTableProps {
  quote: import("@/types").Quote;
}

export function LineItemTable({ quote }: LineItemTableProps) {
  const { updateLineItem, removeLineItem, addLineItem } = useQuote();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-surface-variant">
              <th className="p-4 font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                Item
              </th>
              <th className="p-4 font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant text-center">
                Qty
              </th>
              <th className="p-4 font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant text-center">
                Unit
              </th>
              <th className="p-4 font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant text-right">
                Unit Price
              </th>
              <th className="p-4 font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant text-right">
                Total
              </th>
              <th className="p-4 w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-subtle">
            {quote.lineItems.map((item) => (
              <LineItemRow
                key={item.id}
                item={item}
                isEditing={editingId === item.id}
                onToggleEdit={() => setEditingId(editingId === item.id ? null : item.id)}
                onChange={updateLineItem}
                onDelete={removeLineItem}
              />
            ))}
            {quote.lineItems.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-body-sm text-on-surface-variant">
                  No line items yet. Add an item to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4 p-4">
        {quote.lineItems.map((item) => (
          <LineItemCard
            key={item.id}
            item={item}
            isEditing={editingId === item.id}
            onToggleEdit={() => setEditingId(editingId === item.id ? null : item.id)}
            onChange={updateLineItem}
            onDelete={removeLineItem}
          />
        ))}
        {quote.lineItems.length === 0 && (
          <div className="p-8 text-center text-body-sm text-on-surface-variant bg-surface-container-low rounded-lg border border-surface-subtle">
            No line items yet. Add an item to get started.
          </div>
        )}
      </div>

      {/* Add Item Button */}
      <div className="p-4 border-t border-surface-subtle">
        <button
          onClick={() => {
            addLineItem();
            // Auto-edit the newly added item (last one)
            setTimeout(() => {
              const lastId = quote.lineItems[quote.lineItems.length - 1]?.id;
              if (lastId) setEditingId(lastId);
            }, 50);
          }}
          className="w-full h-12 border border-dashed border-outline-variant rounded-lg font-button-text text-on-surface-variant flex items-center justify-center gap-2 hover:bg-surface-container-low hover:border-growth-green hover:text-growth-green transition-all active:scale-95"
        >
          <MaterialIcon name="add" size={18} />
          Add Line Item
        </button>
      </div>
    </div>
  );
}

function LineItemRow({
  item,
  isEditing,
  onToggleEdit,
  onChange,
  onDelete,
}: {
  item: LineItem;
  isEditing: boolean;
  onToggleEdit: () => void;
  onChange: (id: string, patch: Partial<LineItem>) => void;
  onDelete: (id: string) => void;
}) {
  const hasError = !item.quantity || item.quantity <= 0;
  const isWarning = item.confidence === "low" || item.confidence === "medium";

  return (
    <tr
      className={cn(
        "border-b border-surface-subtle hover:bg-surface-container-low transition-colors group animate-slide-in",
        hasError && "bg-error-container/20 hover:bg-error-container/30"
      )}
    >
      <td className="p-4">
        <div className="font-body-md font-semibold flex items-center gap-2">
          {isEditing ? (
            <input
              type="text"
              value={item.description}
              onChange={(e) => onChange(item.id, { description: e.target.value })}
              className="bg-transparent border-none focus:ring-0 p-0 w-full font-body-md font-semibold"
              placeholder="Item description"
            />
          ) : (
            <span className="font-body-md font-semibold">{item.description || "Untitled item"}</span>
          )}
          {hasError && <MaterialIcon name="error" className="text-error" size={20} />}
          {isWarning && !hasError && <MaterialIcon name="warning" className="text-utility-gold" size={20} />}
        </div>
        {isEditing ? (
          <div className="mt-2 flex items-center gap-2">
            <StatusChip status={item.category} />
          </div>
        ) : (
          <div className="font-body-sm text-on-surface-variant mt-1">
            {item.category}
          </div>
        )}
        {hasError && (
          <div className="text-xs text-error font-semibold mt-1">Missing quantity</div>
        )}
        {isWarning && !hasError && (
          <div className="text-xs text-utility-gold font-semibold mt-1">Manual mapping required</div>
        )}
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
      <td className="p-4 w-24">
        <input
          type="text"
          value={item.unit}
          onChange={(e) => onChange(item.id, { unit: e.target.value })}
          className="w-full h-10 bg-surface-bright border border-outline-variant rounded focus:border-growth-green focus:ring-0 text-center font-body-sm"
        />
      </td>
      <td className="p-4 w-32">
        <input
          type="number"
          min={0}
          step={0.01}
          value={item.unitPrice}
          onChange={(e) => onChange(item.id, { unitPrice: Number(e.target.value) })}
          className="w-full h-10 bg-surface-bright border border-outline-variant rounded focus:border-growth-green focus:ring-0 text-right font-body-md px-2"
        />
      </td>
      <td className="p-4 text-right font-bold text-growth-green font-body-md">
        {formatCurrency(item.total)}
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onToggleEdit}
            className="p-2 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hover:bg-surface-container-high rounded-lg active:scale-95"
            aria-label={isEditing ? "Done editing" : "Edit item"}
          >
            <MaterialIcon name={isEditing ? "check" : "edit"} size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error-container/30 rounded-lg active:scale-95"
            aria-label="Delete item"
          >
            <MaterialIcon name="delete" size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function LineItemCard({
  item,
  isEditing,
  onToggleEdit,
  onChange,
  onDelete,
}: {
  item: LineItem;
  isEditing: boolean;
  onToggleEdit: () => void;
  onChange: (id: string, patch: Partial<LineItem>) => void;
  onDelete: (id: string) => void;
}) {
  const hasError = !item.quantity || item.quantity <= 0;

  return (
    <div className={cn(
      "bg-surface border border-surface-subtle rounded-lg p-4 animate-slide-in",
      hasError && "bg-error-container/20 border-error-container"
    )}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={item.description}
              onChange={(e) => onChange(item.id, { description: e.target.value })}
              className="w-full bg-surface-bright border border-outline-variant rounded px-3 py-2 font-body-md font-semibold focus:border-growth-green focus:ring-0"
              placeholder="Item description"
            />
          ) : (
            <h4 className="font-body-md font-semibold truncate">{item.description || "Untitled item"}</h4>
          )}
          <div className="mt-1">
            <StatusChip status={item.category} />
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleEdit}
            className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg active:scale-95"
            aria-label={isEditing ? "Done editing" : "Edit item"}
          >
            <MaterialIcon name={isEditing ? "check" : "edit"} size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-on-surface-variant hover:bg-error-container/30 rounded-lg active:scale-95"
            aria-label="Delete item"
          >
            <MaterialIcon name="delete" size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
            Qty
          </label>
          <input
            type="number"
            min={0}
            value={item.quantity ?? ""}
            onChange={(e) => onChange(item.id, { quantity: e.target.value === "" ? null : Number(e.target.value) })}
            className={cn(
              "w-full h-10 bg-surface-bright rounded focus:ring-0 text-center font-body-md",
              hasError
                ? "border-error border-2"
                : "border-outline-variant border focus:border-growth-green"
            )}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
            Unit
          </label>
          <input
            type="text"
            value={item.unit}
            onChange={(e) => onChange(item.id, { unit: e.target.value })}
            className="w-full h-10 bg-surface-bright border border-outline-variant rounded focus:border-growth-green focus:ring-0 text-center font-body-sm"
          />
        </div>
        <div>
          <label className="block font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
            Unit Price
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={item.unitPrice}
            onChange={(e) => onChange(item.id, { unitPrice: Number(e.target.value) })}
            className="w-full h-10 bg-surface-bright border border-outline-variant rounded focus:border-growth-green focus:ring-0 text-right font-body-md px-2"
          />
        </div>
        <div>
          <label className="block font-label-mono text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">
            Total
          </label>
          <div className="h-10 flex items-center justify-end font-body-md font-bold text-growth-green px-2">
            {formatCurrency(item.total)}
          </div>
        </div>
      </div>

      {hasError && (
        <div className="text-xs text-error font-semibold mt-2">Missing quantity</div>
      )}
    </div>
  );
}
