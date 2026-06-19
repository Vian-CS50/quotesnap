# QuoteSnap Pro — Frontend v2

A functional Next.js 14 application for QuoteSnap, built from the static HTML/CSS designs in `/Users/viankruger/Downloads/stitch_quotesnap_minimalist_ui_redesign`.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with the "Field Logic" design system tokens
- **Fonts:** Geist, Inter, JetBrains Mono, Material Symbols Outlined
- **State:** React Context (`SettingsContext`, `QuoteContext`)
- **Backend:** FastAPI at `http://127.0.0.1:8341`

## Pages / Routes

| Route | Source design file | Purpose |
|-------|-------------------|---------|
| `/` | redirects to `/dashboard` | Entry point |
| `/dashboard` | `user_dashboard_api_integrated/code.html` | Overview, stats, recent quotes |
| `/quote/new` | `ai_drafting_workflow_developer_ready/code.html` | Voice memo → AI draft |
| `/quote/[id]/review` | `ai_review_finalization_hub_dev_ready/code.html` | Edit line items, profitability, finalize |
| `/materials` | `materials_pricing_manager/code.html` | Inventory, markup rules, labour rates |
| `/settings` | `settings_branding_hub/code.html` | Business profile, branding, quote defaults |
| `/quotes/[id]/preview` | `professional_quote_quotesnap_branding_pdf_export_1/code.html` | Client-facing PDF preview |
| `/clients` | `client_crm_hub_quotesnap_branding_1/code.html` | Client list from saved quotes |

## Backend API Integration

The app expects the QuoteSnap backend to expose these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/transcribe` | POST | Parse voice transcript into line items |
| `/api/materials` | GET | Return materials catalogue |
| `/api/quotes` | POST | Save a finalized quote |
| `/api/quotes/{id}` | GET | Retrieve a saved quote |
| `/api/quotes/{id}/pdf` | POST | Generate PDF-ready HTML |
| `/api/health` | GET | Backend status |

If the backend is unavailable, the frontend gracefully falls back to mock data so the UI remains demoable.

## Running Locally

### 1. Start the backend

```bash
cd /Users/viankruger/quotesnap/backend
source .venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8341 --reload
```

### 2. Start the frontend

```bash
cd /Users/viankruger/quotesnap/frontend-v2
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key Features Implemented

- **AI Drafting:** Browser speech recognition sends transcript to `/api/transcribe`; results are mapped to material/labor line items with loading shimmer states.
- **Review & Finalize:** Global quote state recalculates totals, profit, and margin in real time as quantities/prices change. Missing-quantity validation blocks finalization.
- **Materials Manager:** Inventory populated from `/api/materials`; global standard margin is editable and used as the default markup.
- **Settings & Branding:** Business profile, brand colours, and quote defaults persist to `localStorage` and inject into the PDF preview.
- **PDF Preview:** Print-friendly client quote view with `@media print` styles.
- **Error States:** Toasts, empty states, inline validation, and low-confidence AI warnings from the system spec are implemented as reusable components.

## Design System

Tailwind config extends the "Field Logic" tokens:

- **Primary:** `growth-green` `#1B4D3E`
- **Accent:** `utility-gold` `#D49D26`
- **Surface base:** `#F5F1EB`
- **Surface subtle:** `#EBE3D5`
- **Error:** `#ba1a1a`
- **Typography:** Geist (headlines), Inter (body), JetBrains Mono (labels/mono)

All custom tokens are defined in `tailwind.config.ts`.
