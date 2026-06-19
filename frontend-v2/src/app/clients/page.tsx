"use client";

import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { useQuote } from "@/context/QuoteContext";
import { formatCurrency } from "@/lib/utils";

export default function ClientsPage() {
  const { quotes } = useQuote();

  const clients = Array.from(
    quotes
      .filter((q) => q.clientName)
      .reduce((map, q) => {
        const existing = map.get(q.clientName);
        if (!existing || new Date(q.dateIssued) > new Date(existing.lastQuoteDate)) {
          map.set(q.clientName, {
            name: q.clientName,
            quoteCount: (existing?.quoteCount || 0) + 1,
            totalValue: (existing?.totalValue || 0) + q.total,
            lastQuoteDate: q.dateIssued,
            status: q.status,
          });
        } else {
          existing.quoteCount += 1;
          existing.totalValue += q.total;
        }
        return map;
      }, new Map<string, { name: string; quoteCount: number; totalValue: number; lastQuoteDate: string; status: string }>())
      .values()
  );

  return (
    <AppShell title="Client CRM" footer={<Footer />}>
      <div className="p-margin-desktop max-w-container-max-width mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-headline-lg text-headline-sm">Client CRM Hub</h1>
          <button className="bg-growth-green text-white font-button-text text-button-text h-10 px-4 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all">
            <MaterialIcon name="add" size={18} />
            Add Client
          </button>
        </div>

        {clients.length === 0 ? (
          <EmptyState
            icon="group"
            title="No clients yet"
            description="Your client list will populate as you create quotes."
          />
        ) : (
          <div className="bg-white border border-surface-subtle rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-surface-variant">
                  <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">Client</th>
                  <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">Quotes</th>
                  <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">Total Value</th>
                  <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">Last Active</th>
                  <th className="px-6 py-4 font-label-mono text-label-mono uppercase text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant">
                {clients.map((client, idx) => (
                  <tr
                    key={client.name}
                    className={`hover:bg-surface-container-lowest transition-colors h-14 ${
                      idx % 2 === 1 ? "bg-surface-container-low/30" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                          <span className="font-label-mono text-growth-green">{client.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-bold text-on-surface">{client.name}</div>
                          <div className="text-xs text-on-surface-variant">Adelaide, SA</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-label-mono">{client.quoteCount}</td>
                    <td className="px-6 py-4 font-bold text-growth-green">{formatCurrency(client.totalValue)}</td>
                    <td className="px-6 py-4 text-body-sm text-on-surface-variant">{client.lastQuoteDate}</td>
                    <td className="px-6 py-4">
                      <StatusChip status={client.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
