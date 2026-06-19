"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Footer } from "@/components/layout/Footer";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { StatusChip } from "@/components/ui/StatusChip";
import { EmptyState } from "@/components/ui/EmptyState";
import { useQuote } from "@/context/QuoteContext";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  deriveClientsFromQuotes,
  formatContactDate,
  getLogIcon,
  getLogIconBg,
} from "@/lib/clients";
import { Quote, ClientRecord, ClientStatus } from "@/types";

/* ─── Sub‑components ─────────────────────────────────────────── */

function ClientStatusBadge({ status }: { status: ClientStatus }) {
  const classes: Record<ClientStatus, string> = {
    Active: "bg-green-100 text-green-800",
    Lead: "bg-utility-gold/20 text-utility-gold",
    Past: "bg-slate-200 text-slate-600",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-label-mono",
        classes[status]
      )}
    >
      {status}
    </span>
  );
}

function ClientListCard({
  client,
  selected,
  onClick,
}: {
  client: ClientRecord;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left bg-white border rounded-lg p-4 transition-colors",
        selected
          ? "border-growth-green bg-growth-green/[0.03]"
          : "border-surface-subtle hover:border-growth-green/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
            <span className="font-label-mono text-growth-green text-sm">
              {client.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <div className="font-body-md font-bold text-on-surface truncate">
              {client.name}
            </div>
            <div className="font-label-mono text-label-mono text-on-surface-variant">
              {client.clientId}
            </div>
          </div>
        </div>
        <ClientStatusBadge status={client.status} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-on-surface-variant min-w-0">
          <MaterialIcon name="person" size={16} />
          <span className="font-body-sm truncate">{client.contactName}</span>
        </div>
        <span className="font-body-md font-bold text-growth-green flex-shrink-0 ml-2">
          {formatCurrency(client.totalValue)}
        </span>
      </div>
    </button>
  );
}

function QuoteHistoryTable({
  quotes,
  onQuoteClick,
}: {
  quotes: Quote[];
  onQuoteClick: (id: string) => void;
}) {
  return (
    <div className="bg-white border border-surface-subtle rounded-lg overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-surface-variant">
              <th className="px-6 py-3 font-label-mono text-label-mono uppercase text-on-surface-variant">
                Quote #
              </th>
              <th className="px-6 py-3 font-label-mono text-label-mono uppercase text-on-surface-variant">
                Date
              </th>
              <th className="px-6 py-3 font-label-mono text-label-mono uppercase text-on-surface-variant">
                Service
              </th>
              <th className="px-6 py-3 font-label-mono text-label-mono uppercase text-on-surface-variant">
                Status
              </th>
              <th className="px-6 py-3 font-label-mono text-label-mono uppercase text-on-surface-variant text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant">
            {quotes.map((q) => (
              <tr
                key={q.id}
                onClick={() => onQuoteClick(q.id)}
                className="border-b border-surface-subtle hover:bg-surface-container-low transition-colors group cursor-pointer"
              >
                <td className="px-6 py-4 font-label-mono text-label-mono text-on-surface">
                  {q.quoteNumber}
                </td>
                <td className="px-6 py-4 font-body-sm text-on-surface-variant">
                  {formatDate(q.dateIssued)}
                </td>
                <td className="px-6 py-4 font-body-sm text-on-surface">
                  {q.lineItems[0]?.description || "Quote"}
                </td>
                <td className="px-6 py-4">
                  <StatusChip status={q.status} />
                </td>
                <td className="px-6 py-4 font-body-sm font-bold text-on-surface text-right">
                  {formatCurrency(q.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-surface-variant">
        {quotes.map((q) => (
          <div
            key={q.id}
            onClick={() => onQuoteClick(q.id)}
            className="p-4 hover:bg-surface-container-low transition-colors cursor-pointer active:scale-95"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-label-mono text-label-mono text-on-surface">
                  {q.quoteNumber}
                </div>
                <div className="font-body-sm text-on-surface-variant mt-0.5">
                  {formatDate(q.dateIssued)}
                </div>
              </div>
              <StatusChip status={q.status} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="font-body-sm text-on-surface truncate max-w-[60%]">
                {q.lineItems[0]?.description || "Quote"}
              </span>
              <span className="font-body-sm font-bold text-on-surface">
                {formatCurrency(q.total)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactLogsTimeline({ logs }: { logs: ClientRecord["contactLogs"] }) {
  return (
    <div className="relative">
      {/* Vertical connector */}
      <div className="absolute left-[19px] top-2 bottom-2 w-px bg-surface-variant" />
      <div className="space-y-4">
        {logs.map((log, idx) => (
          <div key={idx} className="relative flex gap-4 items-start">
            <div
              className={cn(
                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                getLogIconBg(log.type)
              )}
            >
              <MaterialIcon name={getLogIcon(log.type)} size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-body-sm font-semibold text-on-surface">
                  {log.title}
                </span>
                <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-wide">
                  {formatContactDate(log.date)}
                </span>
              </div>
              <p className="font-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                {log.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientDetailPanel({
  client,
  onClose,
  isMobile,
}: {
  client: ClientRecord;
  onClose: () => void;
  isMobile?: boolean;
}) {
  const router = useRouter();

  const handleQuoteClick = useCallback(
    (id: string) => {
      router.push(`/quotes/${id}/preview`);
    },
    [router]
  );

  const quoteCount = client.quotes.length;

  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Header */}
      <div className="border-b border-surface-subtle bg-white p-6 flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {isMobile && (
                <button
                  onClick={onClose}
                  className="p-2 -ml-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Back"
                >
                  <MaterialIcon name="arrow_back" size={24} />
                </button>
              )}
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                {client.name}
              </h2>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {client.isPremium && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider font-label-mono">
                  <MaterialIcon name="verified" size={12} />
                  Premium Client
                </span>
              )}
              <ClientStatusBadge status={client.status} />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-headline-md text-headline-md font-bold text-growth-green">
              {formatCurrency(client.totalValue)}
            </div>
            <div className="font-body-sm text-on-surface-variant">
              {quoteCount} quote{quoteCount !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <button className="bg-growth-green text-white font-button-text text-button-text h-10 px-4 rounded-lg flex items-center gap-2 hover:bg-opacity-90 active:scale-95 transition-all min-h-[44px]">
            <MaterialIcon name="edit" size={18} />
            Edit Client
          </button>
          <button className="border border-growth-green text-growth-green font-button-text text-button-text h-10 px-4 rounded-lg flex items-center gap-2 hover:bg-growth-green hover:text-white active:scale-95 transition-all min-h-[44px]">
            <MaterialIcon name="chat" size={18} />
            Send Message
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Contact Info */}
        <section>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">
            Contact Information
          </h3>
          <div className="bg-white border border-surface-subtle rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                <MaterialIcon name="badge" size={18} className="text-on-surface-variant" />
              </div>
              <div>
                <div className="font-body-md font-semibold text-on-surface">
                  {client.contactName}
                </div>
                <div className="font-body-sm text-on-surface-variant">
                  {client.contactTitle}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                <MaterialIcon name="phone" size={18} className="text-on-surface-variant" />
              </div>
              <a
                href={`tel:${client.contactPhone}`}
                className="font-body-md text-on-surface hover:text-growth-green transition-colors"
              >
                {client.contactPhone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                <MaterialIcon name="email" size={18} className="text-on-surface-variant" />
              </div>
              <a
                href={`mailto:${client.contactEmail}`}
                className="font-body-md text-on-surface hover:text-growth-green transition-colors truncate"
              >
                {client.contactEmail}
              </a>
            </div>
          </div>
        </section>

        {/* Site Locations */}
        <section>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">
            Site Locations
          </h3>
          <div className="space-y-3">
            {client.siteLocations.map((loc, idx) => (
              <div
                key={idx}
                className="bg-white border border-surface-subtle rounded-lg p-4 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MaterialIcon name="location_on" size={18} className="text-on-surface-variant" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-body-md font-semibold text-on-surface">
                    {loc.name}
                  </div>
                  <div className="font-body-sm text-on-surface-variant">
                    {loc.address}
                  </div>
                </div>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(loc.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-growth-green font-body-sm hover:underline flex items-center gap-1 flex-shrink-0"
                >
                  <MaterialIcon name="map" size={16} />
                  Map
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Quote History */}
        <section>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">
            Quote History
          </h3>
          {client.quotes.length === 0 ? (
            <EmptyState
              icon="request_quote"
              title="No quotes yet"
              description="This client doesn't have any quotes on record."
            />
          ) : (
            <QuoteHistoryTable quotes={client.quotes} onQuoteClick={handleQuoteClick} />
          )}
        </section>

        {/* Contact Logs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Contact Logs
            </h3>
            <button className="bg-growth-green text-white font-button-text text-button-text h-9 px-3 rounded-lg flex items-center gap-1.5 hover:bg-opacity-90 active:scale-95 transition-all min-h-[44px]">
              <MaterialIcon name="add" size={16} />
              New Note
            </button>
          </div>
          <div className="bg-white border border-surface-subtle rounded-lg p-5">
            <ContactLogsTimeline logs={client.contactLogs} />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */

export default function ClientsPage() {
  const { quotes } = useQuote();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const clients = useMemo(() => deriveClientsFromQuotes(quotes), [quotes]);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return clients;
    const q = searchQuery.toLowerCase().trim();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.clientId.toLowerCase().includes(q) ||
        c.contactName.toLowerCase().includes(q) ||
        c.contactEmail.toLowerCase().includes(q) ||
        c.contactPhone.includes(q)
    );
  }, [clients, searchQuery]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) || null,
    [clients, selectedClientId]
  );

  const handleSelectClient = useCallback((client: ClientRecord) => {
    setSelectedClientId(client.id);
    setMobileDetailOpen(true);
  }, []);

  const handleCloseMobileDetail = useCallback(() => {
    setMobileDetailOpen(false);
  }, []);

  const recordCount = filteredClients.length;

  return (
    <AppShell title="Client CRM" footer={<Footer />}>
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] md:h-[calc(100vh-64px)]">
        {/* ─── Left Panel: Client List ─── */}
        <div className="w-full md:w-[380px] lg:w-1/3 md:min-w-[340px] md:max-w-[450px] flex flex-col border-r border-surface-subtle bg-surface">
          {/* List header */}
          <div className="p-4 md:p-6 border-b border-surface-subtle bg-white flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h1 className="font-headline-lg text-headline-lg font-bold text-growth-green">
                  Clients
                </h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-mono text-[10px] uppercase tracking-wider">
                  {recordCount} Record{recordCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="relative">
              <MaterialIcon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, ID, or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 w-full text-body-sm focus:ring-1 focus:ring-growth-green outline-none placeholder:text-on-surface-variant/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
                  aria-label="Clear search"
                >
                  <MaterialIcon name="close" size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Client list */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
            {clients.length === 0 ? (
              <EmptyState
                icon="group"
                title="No clients yet"
                description="Your client list will populate as you create quotes."
              />
            ) : filteredClients.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-4">
                  <MaterialIcon
                    name="search_off"
                    className="text-on-surface-variant"
                    size={32}
                  />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1">
                  No results found
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Try a different search term
                </p>
              </div>
            ) : (
              filteredClients.map((client) => (
                <ClientListCard
                  key={client.id}
                  client={client}
                  selected={selectedClientId === client.id}
                  onClick={() => handleSelectClient(client)}
                />
              ))
            )}
          </div>
        </div>

        {/* ─── Right Panel: Client Detail (Desktop) ─── */}
        <div className="hidden md:flex flex-1 flex-col bg-surface overflow-hidden">
          {selectedClient ? (
            <ClientDetailPanel
              client={selectedClient}
              onClose={() => setSelectedClientId(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6">
                <MaterialIcon
                  name="group"
                  className="text-on-surface-variant/40"
                  size={40}
                />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                Select a client
              </h3>
              <p className="font-body-sm text-on-surface-variant max-w-xs">
                Choose a client from the list to view their details, quote history, and contact logs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Mobile Detail Overlay ─── */}
      {mobileDetailOpen && selectedClient && (
        <div className="fixed inset-0 z-[60] bg-white md:hidden flex flex-col">
          <ClientDetailPanel
            client={selectedClient}
            onClose={handleCloseMobileDetail}
            isMobile
          />
        </div>
      )}
    </AppShell>
  );
}
