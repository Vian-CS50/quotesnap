import type { LineItem, Material, Quote, TranscriptionResult } from "@/types";
import type { LoginCredentials, SignupData } from "@/types";
import { getToken } from "@/lib/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8341";

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    headers,
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// --- Auth fetch helper (explicit token injection) ---
export async function authFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { headers, ...options });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// --- Auth endpoints ---
export async function login(credentials: LoginCredentials): Promise<{ token: string }> {
  return fetchJson<{ token: string }>(`${API_BASE}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function signup(data: SignupData): Promise<{ token: string }> {
  return fetchJson<{ token: string }>(`${API_BASE}/api/auth/signup`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function forgotPassword(email: string): Promise<{ success: boolean }> {
  return fetchJson<{ success: boolean }>(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string): Promise<{ success: boolean }> {
  return fetchJson<{ success: boolean }>(`${API_BASE}/api/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify({ token, password }),
  });
}

export async function getMe(): Promise<{ user: { id: string; email: string; name: string } }> {
  return fetchJson<{ user: { id: string; email: string; name: string } }>(`${API_BASE}/api/auth/me`);
}

// --- Mock materials catalogue (fallback when /api/materials is unavailable) ---
const MOCK_MATERIALS: Material[] = [
  { id: "m1", name: "Premium Bermuda Turf", unit: "Sq Ft", unitCost: 0.65, markupPercent: 40, sellPrice: 0.91, status: "In-Stock", category: "Turf" },
  { id: "m2", name: "Dark Cedar Mulch", unit: "Cubic Yard", unitCost: 28.0, markupPercent: 35, sellPrice: 37.8, status: "In-Stock", category: "Mulch" },
  { id: "m3", name: "Concrete Pavers (Grey)", unit: "Pallet", unitCost: 420.0, markupPercent: 25, sellPrice: 525.0, status: "Low Stock", category: "Hardscape" },
  { id: "m4", name: "Topsoil Mix", unit: "Ton", unitCost: 18.5, markupPercent: 50, sellPrice: 27.75, status: "In-Stock", category: "Soil" },
  { id: "m5", name: "Bristol Stone Pavers (Steel Blue)", unit: "Sq Ft", unitCost: 3.21, markupPercent: 40, sellPrice: 4.5, status: "In-Stock", category: "Hardscape" },
  { id: "m6", name: "Black Hardwood Mulch", unit: "Cubic Yard", unitCost: 33.33, markupPercent: 35, sellPrice: 45.0, status: "In-Stock", category: "Mulch" },
  { id: "m7", name: "Base Stone (Crushed)", unit: "Ton", unitCost: 22.86, markupPercent: 40, sellPrice: 32.0, status: "In-Stock", category: "Stone" },
  { id: "m8", name: "Retaining Wall Blocks", unit: "Unit", unitCost: 18.12, markupPercent: 25, sellPrice: 22.65, status: "Low Stock", category: "Hardscape" },
];

export async function getMaterials(): Promise<Material[]> {
  try {
    return await fetchJson<Material[]>(`${API_BASE}/api/materials`);
  } catch {
    return MOCK_MATERIALS;
  }
}

export async function transcribeAudio(transcript: string): Promise<TranscriptionResult> {
  try {
    return await fetchJson<TranscriptionResult>(`${API_BASE}/api/transcribe`, {
      method: "POST",
      body: JSON.stringify({ transcript }),
    });
  } catch {
    return parseTranscriptLocally(transcript);
  }
}

function parseTranscriptLocally(transcript: string): TranscriptionResult {
  const lower = transcript.toLowerCase();
  const items: LineItem[] = [];

  const sqftMatch = lower.match(/(\d+)\s*(sq\s*ft|square\s*feet|sqm|m2)/);
  if (sqftMatch || lower.includes("paver") || lower.includes("patio")) {
    const sqft = sqftMatch ? parseInt(sqftMatch[1], 10) : 400;
    items.push({
      id: "fallback_1",
      description: "Bristol Stone Pavers (Steel Blue)",
      category: "MATERIAL",
      quantity: sqft,
      unit: "Sq Ft",
      unitPrice: 4.5,
      total: sqft * 4.5,
      confidence: "high",
    });
  }

  const cyMatch = lower.match(/(\d+)\s*(cubic\s*yards?|yards?|yd)/);
  if (cyMatch || lower.includes("mulch")) {
    const cy = cyMatch ? parseInt(cyMatch[1], 10) : 4;
    items.push({
      id: "fallback_2",
      description: "Dark Cedar Mulch",
      category: "MATERIAL",
      quantity: cy,
      unit: "Cubic Yard",
      unitPrice: 45,
      total: cy * 45,
      confidence: "high",
    });
  }

  const hrMatch = lower.match(/(\d+)\s*(hours?|hrs?)/);
  if (hrMatch || lower.includes("brush") || lower.includes("clearing")) {
    const hrs = hrMatch ? parseInt(hrMatch[1], 10) : 2;
    items.push({
      id: "fallback_3",
      description: "Brush Clearing (Site Prep)",
      category: "LABOR",
      quantity: hrs,
      unit: "Hours",
      unitPrice: 65,
      total: hrs * 65,
      confidence: "medium",
    });
  }

  if (items.length === 0) {
    items.push({
      id: "fallback_generic",
      description: "General Landscaping Works",
      category: "LABOR",
      quantity: 1,
      unit: "Job",
      unitPrice: 850,
      total: 850,
      confidence: "low",
    });
  }

  return { transcript, lineItems: items, demoMode: true };
}

export async function createQuote(quote: Quote): Promise<Quote> {
  try {
    return await fetchJson<Quote>(`${API_BASE}/api/quotes`, {
      method: "POST",
      body: JSON.stringify(quote),
    });
  } catch {
    return quote;
  }
}

export async function generatePdf(quoteId: string): Promise<{ url: string; html?: string }> {
  try {
    return await fetchJson<{ url: string; html: string }>(`${API_BASE}/api/quotes/${quoteId}/pdf`, {
      method: "POST",
    });
  } catch {
    return { url: "", html: "" };
  }
}

export async function healthCheck(): Promise<{ status: string; moonshot_configured?: boolean }> {
  return fetchJson(`${API_BASE}/api/health`);
}
