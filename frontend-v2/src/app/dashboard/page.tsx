"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { useQuote } from "@/context/QuoteContext";
import { formatCurrency, formatDate } from "@/lib/utils";

const ACTIVITY = [
  { icon: "check_circle", color: "text-growth-green", bg: "bg-primary-fixed", title: "Quote Accepted", desc: "Miller Estate renovation marked as won.", time: "10:45 AM" },
  { icon: "mail", color: "text-on-surface-variant", bg: "bg-surface-container-highest", title: "Quote Viewed", desc: "Jonathan Reed viewed Patio proposal for the 3rd time.", time: "09:12 AM" },
  { icon: "assignment_late", color: "text-error", bg: "bg-error-container", title: "Stock Alert", desc: "Flagstone (Medium Grey) low in inventory.", time: "YESTERDAY" },
];

export default function DashboardPage() {
  const { quotes, createDraft } = useQuote();

  const totalPipeline = quotes.reduce((sum, q) => sum + q.total, 0);
  const conversionRate = quotes.length ? ((quotes.filter((q) => q.status === "Won").length / quotes.length) * 100).toFixed(1) : "0.0";

  return (
    <AppShell title="Dashboard" footer={<Footer />}>
      <div className="p-margin-desktop max-w-container-max-width mx-auto w-full">
        {/* Quick Actions & Stats */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Primary Action Card */}
          <div className="col-span-12 lg:col-span-8 bg-growth-green p-8 rounded-xl flex flex-col md:flex-row justify-between items-center relative overflow-hidden text-white">
            <div className="relative z-10 space-y-4 max-w-md">
              <h3 className="font-headline-lg text-headline-lg">Ready to start a new project?</h3>
              <p className="font-body-md text-body-md opacity-90">
                Quickly generate a professional quote using our AI-assisted material estimator or voice-to-quote tool.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/quote/new"
                  onClick={() => createDraft()}
                  className="bg-white text-growth-green font-button-text text-button-text px-8 py-4 rounded-lg flex items-center gap-2 hover:bg-surface-container-low active:scale-95 transition-all"
                >
                  <MaterialIcon name="add" size={20} />
                  New Quote
                </Link>
                <Link
                  href="/quote/new"
                  onClick={() => createDraft()}
                  className="bg-growth-green border border-white/30 text-white font-button-text text-button-text px-6 py-4 rounded-lg flex items-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
                >
                  <MaterialIcon name="mic" size={20} />
                  Voice Memo
                </Link>
              </div>
            </div>
            <div className="hidden md:block opacity-20">
              <MaterialIcon name="architecture" size={160} filled />
            </div>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg height="100%" width="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                <pattern height="10" id="grid" patternUnits="userSpaceOnUse" width="10">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                </pattern>
                <rect fill="url(#grid)" height="100%" width="100%"></rect>
              </svg>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-4">
            <StatCard label="Active Pipeline" value={formatCurrency(totalPipeline)} icon="payments" color="text-utility-gold" bg="bg-secondary-fixed" />
            <StatCard label="Conversion Rate" value={`${conversionRate}%`} icon="trending_up" color="text-growth-green" bg="bg-primary-fixed" />
            <StatCard label="Total Quotes" value={String(quotes.length)} icon="request_quote" color="text-on-surface" bg="bg-surface-container-high" />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Recent Quotes */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-headline-sm text-headline-sm">Recent Quotes</h4>
              <Link href="/quote/new" className="text-growth-green font-body-sm font-semibold hover:underline">
                View all quotes
              </Link>
            </div>

            {quotes.length === 0 ? (
              <EmptyState
                icon="request_quote"
                title="No quotes found"
                description="Get started by creating your first landscape estimate using AI transcription or the manual builder."
                action={{ label: "Create New Quote", onClick: () => createDraft() }}
              />
            ) : (
              <div className="space-y-3">
                {quotes.slice(0, 5).map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/quotes/${quote.id}/preview`}
                    className="bg-white border border-surface-subtle hover:border-growth-green/30 transition-colors p-4 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-container-low rounded-lg flex items-center justify-center">
                        <MaterialIcon name="landscape" className="text-on-surface-variant" size={24} />
                      </div>
                      <div>
                        <h5 className="font-body-md font-semibold">{quote.clientName || "Untitled Quote"}</h5>
                        <p className="font-label-mono text-label-mono text-on-surface-variant">
                          {quote.quoteNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="font-body-md font-bold text-growth-green">{formatCurrency(quote.total)}</p>
                        <p className="font-label-mono text-label-mono text-on-surface-variant">
                          {formatDate(quote.dateIssued)}
                        </p>
                      </div>
                      <StatusChip status={quote.status} />
                      <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-surface-container-low rounded transition-all">
                        <MaterialIcon name="more_vert" size={20} />
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <h4 className="font-headline-sm text-headline-sm">Activity Feed</h4>
            <div className="bg-surface-base border border-surface-subtle rounded-xl p-6 relative overflow-hidden">
              <div className="space-y-6 relative z-10">
                {ACTIVITY.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 ${item.bg} rounded-full flex items-center justify-center`}>
                        <MaterialIcon name={item.icon} className={item.color} size={16} />
                      </div>
                      {idx !== ACTIVITY.length - 1 && <div className="w-0.5 flex-1 bg-outline-variant/30 my-1"></div>}
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold">{item.title}</p>
                      <p className="text-body-sm text-on-surface-variant">{item.desc}</p>
                      <p className="text-[10px] font-label-mono text-on-surface-variant mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-24 md:bottom-8 right-8 z-50 no-print">
        <Link
          href="/quote/new"
          onClick={() => createDraft()}
          className="w-16 h-16 bg-growth-green text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform group relative"
        >
          <MaterialIcon name="mic" size={32} />
          <span className="absolute -top-12 right-0 bg-slate-deep text-white text-[10px] px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-label-mono uppercase">
            Quick Dictate
          </span>
        </Link>
      </div>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  bg,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-surface-base border border-surface-subtle p-6 rounded-xl flex items-center justify-between">
      <div>
        <p className="font-label-mono text-label-mono text-on-surface-variant uppercase">{label}</p>
        <p className="font-headline-md text-headline-md mt-1">{value}</p>
      </div>
      <div className={`${color} ${bg} p-3 rounded-lg`}>
        <MaterialIcon name={icon} size={24} />
      </div>
    </div>
  );
}
