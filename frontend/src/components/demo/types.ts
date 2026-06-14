export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8341";
export const FREE_QUOTA = 3;
export const USAGE_KEY = "quotesnap_usage_count";
export const HISTORY_KEY = "quotesnap_history";

export const JOB_TYPES = [
  "Pool", "Deck", "Paving", "Retaining Wall", "Fencing",
  "Turf", "Garden", "Irrigation", "General", "Other",
];

export const MATERIALS_OPTIONS = [
  "Concrete pavers", "Treated pine", "Hardwood decking", "Composite decking",
  "Colorbond", "Instant turf", "Premium turf", "River rock / pebbles",
  "Concrete (pour)", "Garden soil / topsoil", "Mulch", "Other",
];

export const SITE_CONDITION_OPTIONS = [
  "Grass lawn", "Bare dirt", "Old concrete slab", "Existing pavers",
  "Overgrown garden", "Rocky ground", "Other",
];

export const EQUIPMENT_ACCESS = [
  "Wide access — truck + excavator OK",
  "Narrow access — mini excavator only",
  "Tight access — hand tools only",
  "Requires crane / hiab",
  "Other",
];

export const ACCESS_OPTIONS = [
  "Clear wide access", "Narrow side passage", "Steep driveway",
  "Low overhead clearance", "Stairs / steps to site", "Other",
];

export const SERVICES_OPTIONS = [
  "Gas line", "Water main", "Electrical", "Sewer",
  "Stormwater", "NBN / communications", "None known", "Other",
];

export const BUDGET_RANGES = [
  "Under $5,000", "$5,000 – $10,000", "$10,000 – $20,000",
  "$20,000 – $50,000", "$50,000+", "Other",
];

export const TIMELINES = [
  "ASAP", "Within 2 weeks", "Within 1 month", "Flexible", "Other",
];

export const SLOPES = ["Flat", "Gentle slope", "Moderate slope", "Steep", "Unknown"];

export const COUNCIL_OPTIONS = [
  "Yes — already approved", "Yes — pending approval",
  "No — not required", "Unsure",
];

export type JobDetails = {
  job_type: string;
  job_type_other: string;
  dimensions: string;
  materials: string;
  materials_other: string;
  site_condition: string;
  site_condition_other: string;
  access_notes: string;
  access_notes_other: string;
  equipment_access: string;
  equipment_access_other: string;
  budget_range: string;
  budget_range_other: string;
  timeline: string;
  timeline_other: string;
  slope: string;
  council_da: string;
  services_to_avoid: string;
  services_to_avoid_other: string;
  client_name: string;
  site_address: string;
  abn: string;
};

export type LineItem = {
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total: number;
};

export type QuoteDataType = {
  quote_number: string;
  date: string;
  client_name: string;
  job_address: string;
  line_items: LineItem[];
  subtotal: number;
  gst: number;
  total: number;
};

export type QuoteData = {
  transcript: string;
  quote_html: string;
  quote_data: QuoteDataType;
};

export type QuoteHistoryItem = {
  id: string;
  quote_number: string;
  client_name: string;
  date: string;
  total: number;
  quote_html: string;
  quote_data: QuoteDataType;
  transcript: string;
  follow_up?: boolean;
  won?: boolean;
  lost?: boolean;
};

export const DEFAULT_JOB_DETAILS: JobDetails = {
  job_type: "",
  job_type_other: "",
  dimensions: "",
  materials: "",
  materials_other: "",
  site_condition: "",
  site_condition_other: "",
  access_notes: "",
  access_notes_other: "",
  equipment_access: "",
  equipment_access_other: "",
  budget_range: "",
  budget_range_other: "",
  timeline: "",
  timeline_other: "",
  slope: "",
  council_da: "",
  services_to_avoid: "",
  services_to_avoid_other: "",
  client_name: "",
  site_address: "",
  abn: "",
};
