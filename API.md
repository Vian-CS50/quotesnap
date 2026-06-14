# QuoteSnap API Contract

**Base URL:** `http://localhost:8341`

**CORS:** Enabled for all origins.

---

## Endpoint 1: Generate Quote

**POST** `/api/generate-quote`

Generates a professional landscaping quote from a voice memo transcript.

### Request Body
```json
{
  "transcript": "Front yard reno for the Smiths in Burnside. Rip out old garden bed, install retaining wall 12m, lay turf 40sqm, plant 5 hedges and mulch. Materials 2800, labour 3 days 2 guys at 85hr, total 8500. Before Christmas."
}
```

### Response Body
```json
{
  "transcript": "Front yard reno for the Smiths in Burnside...",
  "quote_html": "<!DOCTYPE html>... (full HTML document for PDF rendering)",
  "quote_data": {
    "quote_number": "QS-20260423-D95F",
    "date": "23 April 2026",
    "valid_until": "23 May 2026",
    "business_name": "",
    "client_name": "Smiths",
    "job_address": "Burnside",
    "line_items": [
      {
        "description": "Site preparation and removal of existing garden bed",
        "quantity": 1,
        "unit": "job",
        "unit_price": 450.00,
        "total": 450.00
      }
    ],
    "subtotal": 8500.00,
    "gst": 850.00,
    "total": 9350.00,
    "notes": "...",
    "terms": "..."
  },
  "demo_mode": false
}
```

**Note:** `demo_mode` is `true` when the AI API is unavailable and a keyword-matched template quote was returned instead. The frontend should display a small badge when this happens.

### Frontend Usage
1. User records voice memo or types description
2. Send transcript to this endpoint
3. Display `quote_html` in an iframe for preview
4. User can print the iframe to PDF via browser print dialog

---

## Endpoint 2: Create Stripe Checkout Session

**POST** `/api/create-checkout-session`

Creates a Stripe Checkout session and returns the redirect URL.

### Request Body
```json
{
  "plan": "monthly"   // or "lifetime"
}
```

### Response Body
```json
{
  "url": "https://checkout.stripe.com/..."   // redirect user here
}
```

### Frontend Usage
1. User clicks "Start Pro Monthly" or "Get Lifetime Access"
2. Send plan to this endpoint
3. Redirect browser to the returned `url`
4. Stripe handles payment, then redirects back to success/cancel pages

---

## Endpoint 3: Health Check

**GET** `/api/health`

Returns backend status.

### Response Body
```json
{
  "status": "ok",
  "moonshot_configured": true
}
```

---

## Frontend Pages Already Built (don't rebuild)

These pages exist in the Next.js app. Kimi should **style and improve** them, not recreate the logic:

- `/` — Main landing page + demo + pricing
- `/checkout-success` — Post-payment thank you page
- `/checkout-cancel` — Cancelled checkout page

## What Kimi Should Build

Kimi's job is **visual design and frontend styling only**:
- Redesign the landing page (`/`) with better UI/UX
- Style the demo section (voice recorder + quote preview)
- Style the pricing cards
- Add animations, scroll effects, responsive design
- Keep the existing API calls working

**Do NOT change:**
- The API endpoint URLs
- The request/response JSON structures
- The checkout flow logic
- The voice recording logic (Web Speech API)
