"use client";

import { LineItem } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { LoadingShimmer } from "@/components/ui/LoadingShimmer";

interface DraftingPreviewProps {
  materials: LineItem[];
  labor: LineItem[];
  total: number;
  isProcessing?: boolean;
}

function MiniLineItem({ item }: { item: LineItem }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-surface-variant/50 animate-slide-in">
      <div className="flex flex-col">
        <span className="font-body-md font-semibold text-left">{item.description || "Untitled item"}</span>
        <span className="font-body-sm text-on-surface-variant text-left">
          {item.quantity ?? 0} {item.unit}
        </span>
      </div>
      <span className="font-label-mono text-label-mono text-growth-green">{formatCurrency(item.total)}</span>
    </div>
  );
}

export function DraftingPreview({ materials, labor, total, isProcessing = false }: DraftingPreviewProps) {
  return (
    <section className="w-full" id="ai-drafting-container">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MaterialIcon name="auto_awesome" className="text-growth-green" filled size={24} />
          <h2 className="font-headline-sm text-headline-sm">AI Drafting Preview</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-low rounded-full">
          <div className={cn("w-2 h-2 rounded-full", isProcessing ? "bg-growth-green animate-recording-pulse" : "bg-growth-green")} />
          <span className="font-label-mono text-label-mono text-on-surface-variant uppercase">
            {isProcessing ? "Processing..." : "Draft Ready"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Materials Column */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white border border-surface-subtle p-6 rounded-lg min-h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-mono text-label-mono text-on-surface-variant tracking-wider uppercase">
                Materials & Supplies
              </span>
              <MaterialIcon name="inventory_2" className="text-on-surface-variant" size={18} />
            </div>
            <div className="space-y-3" data-mapping-id="materials-line-items" id="materials-list">
              {materials.length === 0 && !isProcessing && (
                <p className="text-body-sm text-on-surface-variant italic">No materials detected yet.</p>
              )}
              {materials.map((item) => (
                <MiniLineItem key={item.id} item={item} />
              ))}
              {isProcessing && <LoadingShimmer />}
            </div>
          </div>
        </div>

        {/* Labor & Summary Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border border-surface-subtle p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="font-label-mono text-label-mono text-on-surface-variant tracking-wider uppercase">
                Labor & Crew
              </span>
              <MaterialIcon name="engineering" className="text-on-surface-variant" size={18} />
            </div>
            <div className="space-y-3" data-mapping-id="labor-line-items" id="labor-list">
              {labor.length === 0 && !isProcessing && (
                <p className="text-body-sm text-on-surface-variant italic">No labor detected yet.</p>
              )}
              {labor.map((item) => (
                <MiniLineItem key={item.id} item={item} />
              ))}
              {isProcessing && <div className="h-10 w-full animate-ai-shimmer bg-surface-container-lowest rounded border border-dashed border-outline-variant" />}
            </div>
          </div>

          <div className="bg-growth-green text-on-primary p-8 rounded-lg shadow-sm" id="quote-summary-preview">
            <span className="font-label-mono text-label-mono text-on-primary-container tracking-wider uppercase mb-4 block">
              Estimated Total
            </span>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="font-headline-lg text-headline-lg">{formatCurrency(total).split(".")[0]}</span>
              <span className="font-body-sm text-on-primary-container">.{formatCurrency(total).split(".")[1]}</span>
            </div>
            <div className="space-y-2 border-t border-on-primary-container/30 pt-4">
              <div className="flex justify-between font-body-sm">
                <span className="text-on-primary-container">Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between font-body-sm opacity-60">
                <span className="text-on-primary-container">Tax (Calculated at end)</span>
                <span>--</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
