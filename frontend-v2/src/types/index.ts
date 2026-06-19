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

export interface LabourRates {
  defaultHourlyRate: number;
  crewRate: number;
  minimumCharge: number;
}

export interface TaxSettings {
  gstRate: number;
  taxNumber: string;
  isRegistered: boolean;
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
  labourRates: LabourRates;
  taxSettings: TaxSettings;
  quoteDefaults: QuoteDefaults;
}

export interface TranscriptionResult {
  transcript: string;
  lineItems: LineItem[];
  demoMode?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  businessName?: string;
  subscription?: 'pro' | 'elite' | 'trial';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface ContactLog {
  type: "phone" | "email" | "note";
  date: string;
  title: string;
  description: string;
}

export interface SiteLocation {
  name: string;
  address: string;
}

export type ClientStatus = "Active" | "Lead" | "Past";

export interface ClientRecord {
  id: string;
  name: string;
  clientId: string;
  contactName: string;
  contactTitle: string;
  contactPhone: string;
  contactEmail: string;
  status: ClientStatus;
  totalValue: number;
  siteLocations: SiteLocation[];
  quotes: Quote[];
  contactLogs: ContactLog[];
  isPremium: boolean;
}


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  businessName: string;
}
