export type LineItemCategory = "MATERIAL" | "LABOR";

export interface LineItem {
  id: string;
  description: string;
  category: LineItemCategory;
  quantity: number | null;
  unit: string;
  unitPrice: number;
  total: number;
  confidence?: "high" | "medium" | "low";
  error?: string;
  notes?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientAddress?: string;
  jobAddress?: string;
  dateIssued: string;
  expiryDate: string;
  status: "Draft" | "Sent" | "Won" | "Lost";
  lineItems: LineItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  laborCost: number;
  materialCost: number;
  projectedProfit: number;
  marginPercent: number;
  notes?: string;
  terms?: string;
}

export interface Material {
  id: string;
  name: string;
  unit: string;
  unitCost: number;
  markupPercent: number;
  sellPrice: number;
  status: "In-Stock" | "Low Stock" | "Out of Stock";
  category?: string;
}

export interface LaborRate {
  id: string;
  name: string;
  description: string;
  hourlyRate: number;
  costRate: number;
  highlight?: boolean;
}

export interface BusinessProfile {
  businessName: string;
  abn: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
}

export interface BrandColors {
  primary: string;
  accent: string;
  text: string;
}

export interface QuoteDefaults {
  defaultExpiryDays: number;
  taxRate: number;
  paymentTerms: string;
  termsOfService: string;
  standardMargin: number;
}

export interface AppSettings {
  businessProfile: BusinessProfile;
  brandColors: BrandColors;
  quoteDefaults: QuoteDefaults;
}

export interface TranscriptionResult {
  transcript: string;
  lineItems: LineItem[];
  demoMode?: boolean;
}
