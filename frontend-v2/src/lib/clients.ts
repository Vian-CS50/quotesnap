import { Quote, ClientRecord, ClientStatus, SiteLocation, ContactLog } from "@/types";
import { addDays } from "@/lib/utils";

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickFromHash<T>(hash: number, arr: T[]): T {
  return arr[hash % arr.length];
}

function generateMockData(name: string) {
  const h = hashString(name);
  const firstNames = [
    "James", "Sarah", "Michael", "Emma", "David", "Olivia", "Chris", "Jessica",
    "Daniel", "Sophie", "Matthew", "Amy", "Andrew", "Rebecca", "Benjamin", "Laura",
  ];
  const lastNames = [
    "Wilson", "Thompson", "Anderson", "Taylor", "Martin", "White", "Harris", "Clark",
    "Walker", "Robinson", "Evans", "King", "Scott", "Green", "Baker", "Edwards",
  ];
  const titles = [
    "Project Manager", "Site Supervisor", "Owner", "Director", "Operations Manager",
    "Estimator", "Contractor", "Builder", "Foreman", "Site Manager",
  ];
  const streets = [
    "King William St", "Grote St", "North Terrace", "Glenelg Rd", "Morphett St",
    "Pulteney St", "Hutt St", "Rundle St", "Waymouth St", "Pirie St",
    "Franklin St", "Flinders St", "Fullarton Rd", "Magill Rd", "Portrush Rd",
  ];
  const suburbs = [
    "Adelaide", "Glenelg", "Prospect", "Unley", "Norwood", "Henley Beach",
    "Burnside", "Mitcham", "Brighton", "Marion", "Golden Grove", "Mawson Lakes",
  ];

  const contactFirst = pickFromHash(h, firstNames);
  const contactLast = pickFromHash(h + 1, lastNames);
  const contactName = `${contactFirst} ${contactLast}`;
  const contactTitle = pickFromHash(h + 2, titles);

  const phonePrefix = (h % 90 + 10).toString().padStart(2, "0");
  const phoneMid = (h % 900 + 100).toString().padStart(3, "0");
  const phoneEnd = (h % 9000 + 1000).toString().padStart(4, "0");
  const contactPhone = `04${phonePrefix} ${phoneMid} ${phoneEnd}`;
  const contactEmail = `${contactFirst.toLowerCase()}.${contactLast.toLowerCase()}@example.com`;

  const streetNum = (h % 200) + 1;
  const street = pickFromHash(h + 3, streets);
  const suburb = pickFromHash(h + 4, suburbs);
  const postcode = 5000 + (h % 30);
  const address = `${streetNum} ${street}, ${suburb} SA ${postcode}`;

  const siteCount = (h % 3) === 0 ? 2 : 1;
  const siteLocations: SiteLocation[] = [
    { name: "Primary Site", address },
  ];
  if (siteCount > 1) {
    siteLocations.push({
      name: "Secondary Site",
      address: `${streetNum + 5} ${street}, ${suburb} SA ${postcode}`,
    });
  }

  const clientId = `CL-${(h % 90000 + 10000).toString()}`;

  return {
    contactName,
    contactTitle,
    contactPhone,
    contactEmail,
    siteLocations,
    clientId,
  };
}

function generateContactLogs(name: string): ContactLog[] {
  const h = hashString(name);
  const logTemplates = [
    { type: "phone" as const, title: "Initial consultation", description: "Discussed project scope, timeline, and budget requirements." },
    { type: "email" as const, title: "Quote sent", description: "Sent detailed estimate via email with itemised breakdown." },
    { type: "note" as const, title: "Site visit completed", description: "Walked through the site and took measurements. Photos attached." },
    { type: "phone" as const, title: "Follow-up call", description: "Answered questions about materials and pricing options." },
    { type: "email" as const, title: "Revised quote", description: "Sent updated quote with requested changes to scope." },
    { type: "note" as const, title: "Material check", description: "Confirmed availability of specialty items with supplier." },
    { type: "phone" as const, title: "Contract discussion", description: "Reviewed terms and conditions for the upcoming job." },
    { type: "email" as const, title: "Invoice reminder", description: "Sent follow-up for pending payment on completed work." },
  ];

  const baseCount = (h % 4) + 2;
  const logs: ContactLog[] = [];
  const today = new Date().toISOString().split("T")[0];

  for (let i = 0; i < baseCount; i++) {
    const t = pickFromHash(h + i + 10, logTemplates);
    const daysAgo = (h + i * 7) % 90 + 1;
    const date = addDays(today, -daysAgo);
    const hour = 10 + (i % 8);
    const minute = (h + i * 13) % 60;
    logs.push({
      type: t.type,
      date: `${date}T${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`,
      title: t.title,
      description: t.description,
    });
  }

  logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return logs;
}

function computeClientStatus(quotes: Quote[]): ClientStatus {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const hasWonOrSentRecent = quotes.some((q) => {
    const date = new Date(q.dateIssued);
    return (q.status === "Won" || q.status === "Sent") && date >= thirtyDaysAgo;
  });

  if (hasWonOrSentRecent) return "Active";

  const allDraft = quotes.every((q) => q.status === "Draft");
  if (allDraft) return "Lead";

  const allLost = quotes.every((q) => q.status === "Lost");
  const noRecent = quotes.every((q) => new Date(q.dateIssued) < ninetyDaysAgo);

  if (allLost || noRecent) return "Past";

  return "Active";
}

export function deriveClientsFromQuotes(quotes: Quote[]): ClientRecord[] {
  const grouped = new Map<string, Quote[]>();

  for (const q of quotes) {
    if (!q.clientName) continue;
    const arr = grouped.get(q.clientName) || [];
    arr.push(q);
    grouped.set(q.clientName, arr);
  }

  const clients: ClientRecord[] = [];

  for (const [name, clientQuotes] of Array.from(grouped.entries())) {
    const mock = generateMockData(name);
    const sortedQuotes = [...clientQuotes].sort(
      (a, b) => new Date(b.dateIssued).getTime() - new Date(a.dateIssued).getTime()
    );

    const totalValue = clientQuotes.reduce((sum: number, q: Quote) => sum + q.total, 0);
    const status = computeClientStatus(clientQuotes);
    const isPremium = totalValue > 50000 || clientQuotes.length > 5;

    clients.push({
      id: `client_${hashString(name).toString(36)}`,
      name,
      clientId: mock.clientId,
      contactName: mock.contactName,
      contactTitle: mock.contactTitle,
      contactPhone: mock.contactPhone,
      contactEmail: mock.contactEmail,
      status,
      totalValue,
      siteLocations: mock.siteLocations,
      quotes: sortedQuotes,
      contactLogs: generateContactLogs(name),
      isPremium,
    });
  }

  return clients.sort((a, b) => b.totalValue - a.totalValue);
}

export function formatContactDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    if (hours === 0) {
      const mins = Math.floor(diffMs / (1000 * 60));
      return mins <= 1 ? "Just now" : `${mins}m ago`;
    }
    return `${hours}h ago`;
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getLogIcon(type: ContactLog["type"]): string {
  switch (type) {
    case "phone":
      return "phone";
    case "email":
      return "email";
    case "note":
      return "sticky_note_2";
    default:
      return "chat";
  }
}

export function getLogIconBg(type: ContactLog["type"]): string {
  switch (type) {
    case "phone":
      return "bg-primary-container text-on-primary-container";
    case "email":
      return "bg-secondary-fixed text-on-secondary-fixed";
    case "note":
      return "bg-surface-container-highest text-on-surface-variant";
    default:
      return "bg-surface-container text-on-surface-variant";
  }
}
