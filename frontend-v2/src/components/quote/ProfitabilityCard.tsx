"use client";

import { Quote } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface ProfitabilityCardProps {
  quote: Quote;
}

export function ProfitabilityCard({ quote }: ProfitabilityCardProps) {
  const margin = quote.marginPercent;
  const marginWidth = `${Math.min(Math.max(margin, 0), 100)}%`;

  return (
    <section className="bg-growth-green text-on-primary p-6 rounded-lg shadow-sm relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-label-mono uppercase tracking-widest opacity-80">
              Projected Profitability
            </p>
            <h4 className="text-3xl font-headline-lg mt-1">{formatCurrency(quote.projectedProfit)}</h4>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1">
            <MaterialIcon name="trending_up" size={16} />
            <span className="font-label-mono text-sm">{margin.toFixed(1)}%</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="opacity-80">Labor Costs</span>
            <span>{formatCurrency(quote.laborCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="opacity-80">Material Total</span>
            <span>{formatCurrency(quote.materialCost)}</span>
          </div>
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-utility-gold transition-all duration-300" style={{ width: marginWidth }} />
          </div>
          <p className="text-[10px] leading-snug opacity-70">
            <MaterialIcon name="info" size={12} className="mr-1" />
            Margin is {margin >= 20 ? "within" : "below"} the target range for Landscaping services.
          </p>
        </div>
      </div>
    </section>
  );
}
