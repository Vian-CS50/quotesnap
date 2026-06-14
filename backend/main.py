"""
QuoteSnap Backend — AI Quote Drafting for Australian Landscapers
FastAPI + Moonshot API (OpenAI-compatible) + OpenCV + DALL-E 3
"""

from __future__ import annotations

import os
from dotenv import load_dotenv

# Load .env BEFORE any module-level env var reads
load_dotenv()

import re
import json
import base64
import logging
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional

import httpx
import stripe
from fastapi import FastAPI, HTTPException, Request, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from jinja2 import Environment, select_autoescape
from pydantic import BaseModel, Field, validator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Auth imports
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import auth as auth_module
from auth import (
    User,
    get_db,
    init_db,
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_current_user,
    get_current_user_optional,
    get_quota_status,
    increment_quote_usage,
    generate_totp_secret,
    get_totp_uri,
    verify_totp,
    activate_subscription,
    deactivate_subscription,
    CustomPricingModel,
    SignupRequest,
    LoginRequest,
    TwoFALoginRequest,
    TwoFAVerifyRequest,
    TokenResponse,
    TwoFASetupResponse,
    UserProfile,
)

# =============================================================================
# SECURITY CONFIGURATION
# =============================================================================

# Environment
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
IS_PRODUCTION = ENVIRONMENT.lower() == "production"

# API Key for sensitive endpoints
API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise RuntimeError(
        "FATAL: API_KEY environment variable is not set. "
        "Generate a strong key (e.g. openssl rand -hex 32) and add it to your .env file."
    )

# Security logging
SECURITY_LOG_PATH = os.getenv("SECURITY_LOG_PATH", "/tmp/quotesnap-security.log")
security_logger = logging.getLogger("quotesnap.security")
security_logger.setLevel(logging.INFO)
if not security_logger.handlers:
    handler = logging.FileHandler(SECURITY_LOG_PATH)
    handler.setFormatter(logging.Formatter(
        '%(asctime)s | %(levelname)s | %(message)s'
    ))
    security_logger.addHandler(handler)

# Request size limits
MAX_PAYLOAD_SIZE = 10 * 1024 * 1024  # 10MB

# Rate limits (per IP)
RATE_LIMITS = {
    "generate_quote": "5/minute",
    "render_quote": "10/minute",
    "render_invoice": "10/minute",
    "create_checkout": "5/minute",
    "stripe_webhook": "60/minute",
    "health": "30/minute",
    "stripe_config": "60/minute",
    "root": "30/minute",
    "checkout_success": "30/minute",
    "checkout_cancel": "30/minute",
}


def log_security_event(event_type: str, detail: str, client_ip: str = "unknown"):
    """Log security events to dedicated security log."""
    security_logger.info(f"{event_type} | IP={client_ip} | {detail}")


def sanitize_string(value: str, max_length: int = 5000) -> str:
    """Sanitize string input: strip HTML, control chars, enforce length."""
    if not isinstance(value, str):
        return ""
    # Remove HTML tags
    value = re.sub(r'<[^>]+>', '', value)
    # Remove control characters except newline and tab
    value = re.sub(r'[---]', '', value)
    # Enforce length
    return value[:max_length]


def validate_abn(abn: str) -> bool:
    """Validate Australian Business Number using mod 89 checksum."""
    if not abn:
        return True  # ABN is optional
    # Strip spaces and non-digits
    digits = re.sub(r'\D', '', abn)
    if len(digits) != 11:
        return False
    if not digits.isdigit():
        return False
    # Weights: 10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19
    weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
    total = sum(int(d) * w for d, w in zip(digits, weights))
    return total % 89 == 0


def validate_base64(data: str, max_size: int = 5 * 1024 * 1024) -> bool:
    """Validate base64 string: check format, prefix, and decoded size."""
    if not data or len(data) > 15 * 1024 * 1024:
        return False
    # Check for data URI prefix (e.g., data:image/jpeg;base64,)
    if data.startswith('data:'):
        parts = data.split(',', 1)
        if len(parts) != 2:
            return False
        data = parts[1]
    try:
        decoded = base64.b64decode(data, validate=True)
        return len(decoded) <= max_size
    except Exception:
        return False


# =============================================================================
# API KEY AUTHENTICATION
# =============================================================================

async def verify_api_key(x_api_key: Optional[str] = Header(None, alias="X-API-Key")):
    """Dependency to verify API key for sensitive endpoints."""
    if not API_KEY:
        # API key not configured — skip check (dev mode)
        return True
    if not x_api_key:
        log_security_event("MISSING_API_KEY", "Request missing X-API-Key header", "unknown")
        raise HTTPException(status_code=401, detail="Missing API key")
    if not secrets.compare_digest(x_api_key, API_KEY):
        log_security_event("INVALID_API_KEY", "Invalid API key provided", "unknown")
        raise HTTPException(status_code=403, detail="Invalid API key")
    return True

# Stripe setup
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")
DOMAIN = os.getenv("DOMAIN", "http://localhost:3000")

_stripe_configured = STRIPE_SECRET_KEY and STRIPE_SECRET_KEY.startswith("sk_") and "Replace" not in STRIPE_SECRET_KEY
if _stripe_configured:
    stripe.api_key = STRIPE_SECRET_KEY
else:
    print("WARNING: STRIPE_SECRET_KEY not configured. Checkout will return demo URLs.")

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="QuoteSnap API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Init auth DB on startup
@app.on_event("startup")
async def startup_event():
    await init_db()

# =============================================================================
# CORS — Restrictive in production, permissive in development
# =============================================================================
if IS_PRODUCTION:
    allowed_origins = [DOMAIN]
    allowed_methods = ["GET", "POST"]
    allowed_headers = ["Content-Type", "Authorization", "X-API-Key"]
else:
    allowed_origins = [DOMAIN, "http://localhost:3000", "http://localhost:3456"]
    allowed_methods = ["GET", "POST"]
    allowed_headers = ["Content-Type", "Authorization", "X-API-Key"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=allowed_methods,
    allow_headers=allowed_headers,
)

# =============================================================================
# SECURITY HEADERS MIDDLEWARE
# =============================================================================

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    if IS_PRODUCTION:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
    return response


# =============================================================================
# HTTPS REDIRECT MIDDLEWARE (Production only)
# =============================================================================

@app.middleware("http")
async def https_redirect(request: Request, call_next):
    if IS_PRODUCTION:
        proto = request.headers.get("x-forwarded-proto", "")
        if proto == "http":
            url = request.url.replace(scheme="https")
            return RedirectResponse(str(url), status_code=301)
    return await call_next(request)


# =============================================================================
# SECURITY LOGGING MIDDLEWARE
# =============================================================================

@app.middleware("http")
async def log_requests(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    response = await call_next(request)
    
    # Log suspicious requests
    if response.status_code == 429:
        log_security_event("RATE_LIMIT_EXCEEDED", f"{request.method} {request.url.path}", client_ip)
    elif response.status_code == 413:
        log_security_event("PAYLOAD_TOO_LARGE", f"{request.method} {request.url.path}", client_ip)
    elif response.status_code == 401:
        log_security_event("UNAUTHORIZED", f"{request.method} {request.url.path}", client_ip)
    elif response.status_code == 403:
        log_security_event("FORBIDDEN", f"{request.method} {request.url.path}", client_ip)
    
    return response

# Moonshot API (OpenAI-compatible client)
MOONSHOT_API_KEY = os.getenv("MOONSHOT_API_KEY", "")
MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1"

if not MOONSHOT_API_KEY:
    print("WARNING: MOONSHOT_API_KEY not set. Set it in .env file.")

# ---------------------------------------------------------------------------
# Quote generation prompt
# ---------------------------------------------------------------------------
QUOTE_SYSTEM_PROMPT = """\
You are QuoteSnap, a senior estimator and quote writer for Australian landscaping businesses. You have 15 years experience writing quotes that win jobs and protect landscapers from disputes.
## YOUR JOB
Convert a landscaper's structured job details and voice memo transcript into a professional, itemised quote.

## SOURCE OF TRUTH — READ THIS CAREFULLY

You have TWO sources of information, ranked by reliability:

1. **STRUCTURED JOB DETAILS (HIGHEST PRIORITY)** — This is a form the landscaper filled out. Treat every field as factual and primary. If dimensions are provided, use them to calculate exact material quantities. If a job type is specified, scope the quote to that exact job type ONLY.

2. **VOICE TRANSCRIPT (SECONDARY)** — Use this for context, pricing guidance, and client details the landscaper mentioned. If the transcript contradicts the structured form, the form wins.

## ABSOLUTE RULES — BREAK ANY OF THESE AND THE QUOTE IS WRONG

### Rule 1: NEVER hallucinate scope
If the job type is "Deck Construction", do NOT add pool excavation, turf laying, or retaining walls unless explicitly mentioned in the form or transcript. Quote ONLY what was asked for.

### Rule 2: Labour must show crew size, days, AND rate breakdown
Every labour line item must be fully transparent:
- Number of people in the crew (e.g., 2 persons, 3 persons)
- Number of days (or hours) on site
- Daily rate per person OR blended crew rate
- Show the math: "2 persons × 2 days × $850/day = $3,400"

Break down WHAT tasks take HOW LONG:
- GOOD: "Labour — site prep and excavation (1 day), formwork and steel (0.5 day), concrete pour and finish (1 day) — 2-person crew, total 2.5 days × $850/day = $2,125"
- BAD: "Labour — 3 days" ← Unacceptable. What happened each day? How many people?

### Rule 3: Realistic job duration benchmarks
Use these as MINIMUM realistic timeframes. If the landscaper says less, respect their expertise BUT add a note flagging the aggressive timeline.

- **Pool installation (in-ground concrete)**: 3–6 weeks minimum
- **Pool installation (fibreglass shell)**: 1–2 weeks minimum
- **Pool installation (above-ground, small)**: 2–5 days
- **Deck construction**: 1–2 weeks
- **Retaining wall**: 3–7 days
- **Paving (under 50m2)**: 2–4 days
- **Paving (50–100m2)**: 4–7 days
- **Turf / lawn**: 1–2 days
- **Fencing (under 20m)**: 1–2 days
- **Fencing (20–50m)**: 2–4 days
- **Garden design / planting**: 1–3 days
- **Irrigation system**: 1–2 days
- **General landscaping (small)**: 1–3 days
- **General landscaping (large)**: 1–2 weeks

If a landscaper claims a concrete pool in 3 days, you MUST add a note: "Timeline appears aggressive for in-ground concrete pool. Standard timeframe is 3–6 weeks. Confirm with landscaper before sending to client."

### Rule 4: Calculate materials from dimensions
If the form provides dimensions, calculate exact quantities:
- Area in m2 = length x width
- Volume in m3 = area x depth
- Linear metres = length of wall/fence/deck edge
- Pavers needed = area / paver size (add 5% wastage)
- Concrete = volume x 1.05 (5% wastage)
- Turf = area in m2 (add 5% wastage)
- Mulch at 75mm depth = area x 0.075m (add 10% wastage)

Show your working in the description: "Supply and lay 42m2 premium instant turf (40m2 area + 5% wastage)"

### Rule 5: Use "Supply and install" or "Supply only"
Always specify whether materials are included.

### Rule 6: Exclusions protect landscapers
If the form or transcript didn't mention something critical, add it as a note or in the terms:
- "Does not include council approvals or DA"
- "Does not include relocation of existing services (plumbing, electrical)"
- "Final price subject to site conditions after excavation"
- "Does not include soil testing or engineering certification"

### Rule 7: Generalised assumptions from industry data
If the landscaper does NOT mention a specific detail, you MAY use a generalised industry-standard default. Do NOT state the default as a fact the landscaper provided. Instead, phrase it as "standard" or "typical" and note the assumption clearly.

## BUDGET GUIDANCE FROM TRANSCRIPT
If the landscaper mentions a dollar figure ("about 3500 dollars", "maybe 5 grand", "cost me around 4k"), treat this as their EXPECTED PRICE ANCHOR. Your itemised breakdown should land in this ballpark. If your calculated total is significantly higher or lower, add a note explaining the discrepancy: "The landscaper estimated ~$3,500. This breakdown totals $4,200 due to additional concrete footing requirements not initially discussed." Do NOT ignore their price anchor — it represents their client expectation or their own cost estimate.

**Industry standard defaults (use only when not specified):**
- **Fence height:** 1.8m for Colorbond/privacy, 1.2m for picket, 2.1m for security. If unsure, use 1.8m and note "standard height assumed."
- **Pool depth:** 1.5m for fibreglass shells, 1.8m for concrete. If unsure, use 1.5m.
- **Deck height:** 150mm above existing surface (standard step-down).
- **Paver thickness:** 40mm concrete pavers on 100mm road base.
- **Retaining wall height:** 400–600mm for garden beds, 1.2m+ for structural. If unsure, use 400mm.
- **Turf prep:** 100mm topsoil depth before laying.
- **Mulch depth:** 75mm standard coverage.
- **Crew size:** Fencing = 2 persons, Decking = 2 persons, Paving = 2 persons, Pool = 3–4 persons (plumber + excavator + concretor), Retaining wall = 2 persons, Turf = 2 persons, General landscaping = 2 persons.
- **Concrete strength:** 20 MPa for footings, 25 MPa for slabs, 32 MPa for pool surrounds.
- **Standard Colorbond colour:** Monument or Surfmist (most common). If colour not specified, write "standard colour" and note "confirm colour with client."
- **Gate width:** 1.0m pedestrian gate as standard. Note "confirm gate size and location with client."

**Phrasing rules:**
- BAD: "Supply and install 1.8m high Colorbond fence" ← Sounds like the landscaper specified 1.8m.
- GOOD: "Supply and install Colorbond fencing to standard height (1.8m) including posts, rails, and infill panels" ← Default is stated openly.
- BAD: "Labour — 2-person fencing crew" ← Sounds specific.
- GOOD: "Labour — standard fencing crew for removal, post setting, and panel installation (2 persons, 2 days)" ← Default is transparent.
- If ANY default might affect price significantly, add to notes: "Quote assumes standard specifications. Confirm fence height, colour, and gate requirements with client before ordering materials."

## OUTPUT FORMAT
Respond with ONLY a JSON object. No markdown, no explanation, no code fences.

```json
{
  "business_name": "",
  "client_name": "from form or transcript, or TBA",
  "job_address": "from form or transcript, or TBA",
  "quote_number": "auto-generated",
  "date": "today's date",
  "valid_until": "30 days from today",
  "line_items": [
    {"description": "professional scoped description with quantities shown", "quantity": 1, "unit": "job|m|m2|hr|day|each|L|tonne", "unit_price": 0.00, "total": 0.00}
  ],
  "subtotal": 0.00,
  "gst": 0.00,
  "total": 0.00,
  "notes": "helpful context including any timeline warnings",
  "terms": "standard payment and variation terms"
}
```

## AUSTRALIAN PRICING BENCHMARKS — ADELAIDE / SOUTH AUSTRALIA (2025–2026)
Use these as guides when the landscaper doesn't specify exact pricing. These are verified market rates for Adelaide metro and Hills.

### Labour — Charge-Out Rates (per person, incl overheads)
These are what the landscaper bills the client, NOT award wages.
- General landscaping labourer: $55–$75/hr
- Skilled landscaper: $65–$85/hr
- Mini excavator operator (wet hire): $95–$150/hr
- Concretor: $60–$90/hr
- Carpenter / deck builder: $80–$120/hr
- Licensed plumber (pools): $90–$160/hr
- Fencing contractor: $60–$90/hr
- Paving contractor: $50–$80/hr
- Typical crew: 2 people
- Typical day rate per person: $480–$720 (8 hr day)

### Materials — Supply + Install (Adelaide rates)
- Instant turf Kikuyu (supply + lay): $8–$15/m2
- Sir Walter Buffalo (supply + lay): $18–$28/m2
- TifTuf Bermuda (supply + lay): $20–$28/m2
- Plain concrete 100mm (supply + pour): $100–$130/m2
- Reinforced concrete (supply + pour): $120–$160/m2
- Exposed aggregate (supply + pour): $110–$150/m2 basic; $250–$450/m2 driveway
- Treated pine decking (supply + install): $200–$250/m2
- Merbau hardwood decking (supply + install): $320–$480/m2
- Spotted Gum decking (supply + install): $300–$400+/m2
- Composite decking (supply + install): $350–$500/m2
- Treated pine sleepers (supply only): $15–$25/lineal metre
- Retaining wall treated pine (supply + install, up to 1.2m): $350–$550/lineal metre
- Retaining wall concrete sleepers (supply + install, up to 1.2m): $450–$700/lineal metre
- Colorbond fencing (supply + install): $85–$145/lineal metre
- Timber/picket fencing (supply + install): $75–$120/lineal metre
- Concrete pavers (supply + install including base): $120–$180/m2
- Bluestone pavers (supply + install): $100–$180/m2
- Clay/brick pavers (supply + install): $70–$90/m2
- Limestone pavers (supply + install): $80–$120/m2
- Travertine pavers (supply + install): $130–$200/m2
- Standard plants 150mm pot: $15–$35 each
- Advanced plants 300mm pot: $45–$85 each
- Trees (advanced): $150–$400 each
- Garden soil / topsoil (supply + spread): $80–$100/m3
- Mulch basic (supply + spread): $35–$50/m3
- Mulch premium (supply + spread): $65–$95/m3
- River rock / pebbles (supply): $45–$130/tonne
- Fibreglass pool shell (supply only): $15,000–$35,000
- In-ground concrete pool (supply + install): $35,000–$80,000
- Glass pool fencing semi-frameless (supply + install): $200–$275/lineal metre
- Glass pool fencing frameless (supply + install): $275–$450/lineal metre

### Other Costs (Adelaide)
- Skip bin 4m3: $250–$460
- Skip bin 6m3: $350–$550
- Soil removal / excavation (standard soil): $30–$50/m3
- Soil removal / excavation (rocky/debris): $50–$150/m3
- Pool excavation (total job): $2,500–$5,000 depending on access and soil
- Crane hire (wet hire): $170–$350/hr, minimum 4 hours
- Pool fencing compliance inspection (SA): $150–$300
- Council DA / approval (SA): $92.50–$2,000+ depending on scope
- Soil testing: $300–$900
- Engineering certification: $500–$1,500
- Concrete cutting: $15–$25/lineal metre

### Equipment Hire (Adelaide dry hire, per day)
- Mini excavator 1.7T: $220–$250/day
- Mini excavator 3T: $300–$350/day
- Skid steer / bobcat: $220–$320/day
- Compactor / plate: $60–$180/day

## GST RULES
- GST is ALWAYS 10% in Australia
- Calculate GST on the subtotal: subtotal x 0.10 = gst
- Total = subtotal + gst
- Show all three figures clearly
- Do NOT mark up prices to "include GST" — show it separate

## CONTINGENCY
Add a 10% contingency line item if ANY of these apply:
- Site conditions are unknown (old garden, possible rocks, roots)
- Weather-dependent work
- Client mentioned a tight deadline
- Any excavation or demolition involved
- Access is difficult (narrow side passage, steep block)
- Pool or retaining wall work
Label it: "Contingency for unforeseen site conditions (10%)"

## CLIENT & JOB DETAILS
Extract from the structured form FIRST, then from the transcript:
- client_name: Use form value if provided. Otherwise look in transcript. Capitalise properly (e.g., "the smiths" → "The Smiths", "mcdonalds" → "McDonalds"). If neither, "TBA".
- job_address: Use form value if provided. Otherwise look in transcript. Capitalise suburb names properly (e.g., "glenelg" → "Glenelg", "mclaren vale" → "McLaren Vale"). If neither, "TBA".
- business_name: If the landscaper mentions their company name, use it. Otherwise leave empty.

## NOTES SECTION
Write 2–4 sentences that:
- Confirm what IS included
- Mention any key assumptions (e.g., "Assumes clear access to rear yard")
- Flag any timeline concerns if the estimate seems aggressive
- Keep it friendly but professional

## TERMS SECTION
Use this standard Australian landscaping terms template, adapted if the landscaper mentioned specific terms:
"Payment due within 14 days of quote acceptance. 50% deposit required to commence work. All work subject to final site inspection and measurement. Variations charged at cost plus 20%. Cancellation within 48 hours of scheduled start may incur a 25% fee."

## EXAMPLES

### Example 1 — Good conversion with dimensions
INPUT form: job_type="Retaining Wall", dimensions="12m long x 400mm high", materials="Treated pine sleepers"
INPUT transcript: "Front yard for the Smiths in Burnside. Retaining wall about 12 metres, lay fresh turf maybe 40 square metres, plant 5 hedges and mulch. Materials probably 2,800, labour 3 days with 2 guys at 85 an hour."

OUTPUT line_items:
1. "Remove and dispose of existing garden bed including vegetation, topsoil, and root systems. Dispose of green waste off-site." — 1 job — $680
2. "Supply and install treated pine sleeper retaining wall, 12m linear length x 400mm high, including concrete footings, drainage behind wall, and geotextile fabric." — 12 m — $310/m — $3,720
3. "Supply and lay premium instant turf including soil preparation, levelling, and initial watering." — 40 m2 — $32/m2 — $1,280
4. "Supply and plant 5 advanced hedge specimens (Lilly Pilly or similar) including soil amendment and staking." — 5 each — $75 — $375
5. "Supply and spread premium organic mulch to garden beds at 75mm depth." — 1 job — $420
6. "Labour — site prep and excavation (1 day), retaining wall installation (1.5 days), turf laying and planting (0.5 day) — 2-person crew, 3 days total × $680/day per person = $4,080"
7. "Contingency for unforeseen site conditions including rock, root systems, or access issues." — 1 job — $855
Subtotal: $11,410 | GST: $1,141 | Total: $12,551

### Example 2 — Minimal info
INPUT form: job_type="Paving", dimensions="20m2 courtyard"
INPUT transcript: "Small job in Glenelg. Pave a courtyard about 20 square metres. Just concrete pavers. Maybe 5 grand all up."

OUTPUT line_items:
1. "Site preparation including excavation to 100mm depth, removal of existing surface, and disposal of spoil." — 1 job — $850
2. "Supply and lay standard concrete pavers on compacted road base and bedding sand, including cuts and edging." — 20 m2 — $145/m2 — $2,900
3. "Supply and install concrete edging restraint." — 20 m — $25/m — $500
4. "Labour — paving crew for excavation, base preparation, laying, and compaction — 2 persons, 2 days × $425/day per person = $1,700"
Subtotal: $5,950 | GST: $595 | Total: $6,545

## CRITICAL RULES
- NEVER make up a client name. Use "TBA" if not mentioned.
- NEVER guarantee prices if site unseen. Add contingency and notes.
- ALWAYS show GST separately.
- ALWAYS round to 2 decimal places for currency.
- NEVER invent line items not supported by the form or transcript.
- If the landscaper gives a total, treat it as a guide. Your job is to break it down properly.
- If costs don't add up to what the landscaper expected, that's fine. The breakdown is what matters.
- Output ONLY the JSON object. Nothing else.
"""

# ---------------------------------------------------------------------------
# HTML Quote Template
# ---------------------------------------------------------------------------
QUOTE_HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Quote {{ quote_number }}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #f1f5f9;
      color: #1e293b;
      line-height: 1.5;
      padding: 40px 20px;
    }
    .page {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      padding: 48px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 3px solid #16a34a;
    }
    .brand h1 {
      font-size: 28px;
      font-weight: 800;
      color: #16a34a;
      letter-spacing: -0.5px;
    }
    .brand p {
      color: #64748b;
      font-size: 14px;
      margin-top: 4px;
    }
    .quote-meta {
      text-align: right;
    }
    .quote-meta .label {
      font-size: 12px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .quote-meta .value {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }
    .client-info {
      margin-bottom: 32px;
    }
    .client-info h2 {
      font-size: 14px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .client-info p {
      font-size: 15px;
      color: #334155;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      text-align: left;
      padding: 12px 8px;
      font-size: 12px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
      border-bottom: 2px solid #e2e8f0;
      letter-spacing: 0.5px;
    }
    td {
      padding: 14px 8px;
      font-size: 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    td.num { text-align: right; font-variant-numeric: tabular-nums; }
    .totals {
      margin-left: auto;
      width: 300px;
      margin-top: 8px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #475569;
    }
    .totals-row.grand {
      border-top: 2px solid #16a34a;
      margin-top: 8px;
      padding-top: 12px;
      font-size: 18px;
      font-weight: 800;
      color: #16a34a;
    }
    .notes {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }
    .notes h3 {
      font-size: 14px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .notes p {
      font-size: 13px;
      color: #64748b;
      line-height: 1.6;
    }
    .terms {
      margin-top: 24px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
    }
    .accept-box {
      margin-top: 32px;
      padding: 20px;
      border: 2px dashed #cbd5e1;
      border-radius: 8px;
      text-align: center;
    }
    .accept-box p {
      font-size: 13px;
      color: #64748b;
      margin-bottom: 12px;
    }
    .signature-line {
      display: inline-block;
      width: 280px;
      border-bottom: 1px solid #94a3b8;
      margin: 0 8px;
    }
    .render-section {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }
    .render-section h3 {
      font-size: 14px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }
    .render-image {
      width: 100%;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand">
        <h1>{{ business_name or 'LANDSCAPING QUOTE' }}</h1>
        <p>Professional Landscaping Services</p>
        {% if abn %}<p style="font-size: 12px; color: #64748b; margin-top: 2px;">ABN: {{ abn }}</p>{% endif %}
      </div>
      <div class="quote-meta">
        <div class="label">Quote #</div>
        <div class="value">{{ quote_number }}</div>
        <div class="label">Date</div>
        <div class="value">{{ date }}</div>
        <div class="label">Valid Until</div>
        <div class="value">{{ valid_until }}</div>
      </div>
    </div>

    <div class="client-info">
      <h2>Client</h2>
      <p><strong>{{ client_name or 'Client Name' }}</strong></p>
      <p>{{ job_address or 'Job Address' }}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:50%">Description</th>
          <th style="width:15%">Qty</th>
          <th style="width:15%">Unit</th>
          <th style="width:20%" class="num">Amount</th>
        </tr>
      </thead>
      <tbody>
        {% for item in line_items %}
        <tr>
          <td>{{ item.description }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.unit }}</td>
          <td class="num">${{ "%.2f"|format(item.total) }}</td>
        </tr>
        {% endfor %}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${{ "%.2f"|format(subtotal) }}</span>
      </div>
      <div class="totals-row">
        <span>GST (10%)</span>
        <span>${{ "%.2f"|format(gst) }}</span>
      </div>
      <div class="totals-row grand">
        <span>Total</span>
        <span>${{ "%.2f"|format(total) }}</span>
      </div>
    </div>

    {% if notes %}
    <div class="notes">
      <h3>Notes</h3>
      <p>{{ notes }}</p>
    </div>
    {% endif %}

    <div class="terms">
      <strong>Terms &amp; Conditions:</strong> {{ terms or 'Payment due within 14 days of quote acceptance. 50% deposit required to commence work. All work subject to final site inspection and measurement. Variations charged at cost plus 20%.' }}
    </div>

    <div style="margin-top: 16px; padding: 12px; background: #fef3c7; border-radius: 8px; font-size: 11px; color: #92400e; line-height: 1.5;">
      <strong>AI-Generated Draft — Review Required:</strong> This document is an AI-assisted draft. The business owner is responsible for reviewing all line items, quantities, materials, pricing, and scope for accuracy before sending to the client. QuoteSnap is a software tool, not a licensed estimator or professional advisor.
    </div>

    <div class="accept-box">
      <p>Accept this quote by signing below and returning to us.</p>
      <p>Client Signature <span class="signature-line"></span> Date <span class="signature-line" style="width:120px"></span></p>
    </div>
  </div>
</body>
</html>"""

# ---------------------------------------------------------------------------
# HTML Invoice Template
# ---------------------------------------------------------------------------
INVOICE_HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice {{ quote_number }}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #f1f5f9;
      color: #1e293b;
      line-height: 1.5;
      padding: 40px 20px;
    }
    .page {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      padding: 48px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 3px solid #16a34a;
    }
    .brand h1 {
      font-size: 28px;
      font-weight: 800;
      color: #16a34a;
      letter-spacing: -0.5px;
    }
    .brand p {
      color: #64748b;
      font-size: 14px;
      margin-top: 4px;
    }
    .brand .tax-label {
      font-size: 11px;
      font-weight: 700;
      color: #16a34a;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 6px;
      border: 1px solid #16a34a;
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
    }
    {% if abn %}<p style="font-size: 12px; color: #64748b; margin-top: 2px;">ABN: {{ abn }}</p>{% endif %}
    .quote-meta {
      text-align: right;
    }
    .quote-meta .label {
      font-size: 12px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    .quote-meta .value {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }
    .client-info {
      margin-bottom: 32px;
    }
    .client-info h2 {
      font-size: 14px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .client-info p {
      font-size: 15px;
      color: #334155;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      text-align: left;
      padding: 12px 8px;
      font-size: 12px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
      border-bottom: 2px solid #e2e8f0;
      letter-spacing: 0.5px;
    }
    td {
      padding: 14px 8px;
      font-size: 14px;
      border-bottom: 1px solid #f1f5f9;
    }
    td.num { text-align: right; font-variant-numeric: tabular-nums; }
    .totals {
      margin-left: auto;
      width: 300px;
      margin-top: 8px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
      color: #475569;
    }
    .totals-row.grand {
      border-top: 2px solid #16a34a;
      margin-top: 8px;
      padding-top: 12px;
      font-size: 18px;
      font-weight: 800;
      color: #16a34a;
    }
    .notes {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }
    .notes h3 {
      font-size: 14px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .notes p {
      font-size: 13px;
      color: #64748b;
      line-height: 1.6;
    }
    .payment-box {
      margin-top: 32px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }
    .payment-box h3 {
      font-size: 14px;
      text-transform: uppercase;
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }
    .payment-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      color: #475569;
      padding: 4px 0;
    }
    .thank-you {
      margin-top: 32px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand">
        <h1>{{ business_name or 'LANDSCAPING INVOICE' }}</h1>
        <p>Professional Landscaping Services</p>
        <div class="tax-label">Tax Invoice</div>
        {% if abn %}<p style="font-size: 12px; color: #64748b; margin-top: 2px;">ABN: {{ abn }}</p>{% endif %}
      </div>
      <div class="quote-meta">
        <div class="label">Invoice #</div>
        <div class="value">{{ quote_number }}</div>
        <div class="label">Date</div>
        <div class="value">{{ date }}</div>
        <div class="label">Due Date</div>
        <div class="value">{{ valid_until }}</div>
      </div>
    </div>

    <div class="client-info">
      <h2>Bill To</h2>
      <p><strong>{{ client_name or 'Client Name' }}</strong></p>
      <p>{{ job_address or 'Job Address' }}</p>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:50%">Description</th>
          <th style="width:15%">Qty</th>
          <th style="width:15%">Unit</th>
          <th style="width:20%" class="num">Amount</th>
        </tr>
      </thead>
      <tbody>
        {% for item in line_items %}
        <tr>
          <td>{{ item.description }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.unit }}</td>
          <td class="num">${{ "%.2f"|format(item.total) }}</td>
        </tr>
        {% endfor %}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${{ "%.2f"|format(subtotal) }}</span>
      </div>
      <div class="totals-row">
        <span>GST (10%)</span>
        <span>${{ "%.2f"|format(gst) }}</span>
      </div>
      <div class="totals-row grand">
        <span>Total Due</span>
        <span>${{ "%.2f"|format(total) }}</span>
      </div>
    </div>

    {% if notes %}
    <div class="notes">
      <h3>Notes</h3>
      <p>{{ notes }}</p>
    </div>
    {% endif %}

    <div class="payment-box">
      <h3>Payment Details</h3>
      <div class="payment-row"><span>Payment terms:</span> <span>Due within 7 days</span></div>
      <div class="payment-row"><span>PayID:</span> <span>Use email or mobile linked to this business</span></div>
      <div class="payment-row"><span>Direct deposit:</span> <span>BSB / Account details to be provided</span></div>
      <div class="payment-row"><span>Reference:</span> <span>{{ quote_number }}</span></div>
    </div>

    <div class="thank-you">
      <p>Thank you for your business.</p>
      <p style="font-size: 11px; color: #94a3b8; margin-top: 8px;">This invoice was generated using QuoteSnap software. The business owner is responsible for its accuracy.</p>
    </div>
  </div>
</body>
</html>"""

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _smart_title(s: str) -> str:
    """Capitalise names/suburbs sensibly (handles Mc, O', etc)."""
    if not s:
        return s
    # Handle common Irish/Scottish prefixes
    for prefix in ["mc", "o'", "mac"]:
        if s.lower().startswith(prefix) and len(s) > len(prefix):
            if prefix == "o'":
                s = "O'" + s[len(prefix):].title()
            else:
                s = prefix.capitalize() + s[len(prefix):].title()
            return s
    return s.title()


def _extract_budget_hint(transcript: str) -> str:
    """Extract price/budget mentions from transcript to guide AI pricing."""
    import re
    hints = []
    # Patterns like "about 3500 dollars", "around $4k", "maybe 5 grand", "cost me 3500", "roughly 4000"
    patterns = [
        r"(?:about|around|roughly|maybe|probably|cost me|all up|budget of)\s*[:]?\s*(?:\$)?\s*([0-9,]+(?:\.[0-9]+)?)\s*(?:dollars?|k|grand|g)?",
        r"(?:\$)\s*([0-9,]+(?:\.[0-9]+)?)\s*(?:k|grand|g)?\s*(?:all up|total|budget|roughly|about)?",
        r"([0-9,]+)\s*(?:k|grand|g)\s*(?:all up|total|budget|roughly|about)?",
    ]
    t = transcript.lower()
    for pat in patterns:
        for m in re.finditer(pat, t):
            raw = m.group(0)
            val = m.group(1).replace(",", "")
            # Normalise 'k' / 'grand'
            if "k" in raw or "grand" in raw or " g" in raw:
                try:
                    val = str(int(float(val) * 1000))
                except ValueError:
                    pass
            hints.append(f"${val}")
    if hints:
        return f"The landscaper mentioned these budget guides in their voice memo: {', '.join(hints)}. Use these as pricing anchors — your breakdown should land in this ballpark unless the scope clearly justifies a very different price. If your calculated total is significantly different, add a note explaining why."
    return ""


def generate_quote_number() -> str:
    from datetime import datetime
    return f"QS-{datetime.now().strftime('%Y%m%d')}-{os.urandom(3).hex().upper()}"


def _generate_demo_quote(transcript: str, job_details: Optional[dict] = None) -> dict:
    """Demo mode: generate a relevant quote based on transcript keywords."""
    from datetime import datetime, timedelta
    t = transcript.lower()
    today = datetime.now()
    client_name = "TBA"
    job_address = "TBA"

    # Extract client name
    for phrase in ["for the ", "for ", "job for "]:
        if phrase in t:
            rest = t.split(phrase, 1)[1]
            name = _smart_title(rest.split(" in ")[0].split(" at ")[0].split(".")[0].strip())
            if len(name) > 2 and len(name) < 40:
                client_name = name
                break

    # Extract suburb
    for phrase in [" in ", " at "]:
        if phrase in t:
            rest = t.split(phrase, 1)[1]
            suburb = _smart_title(rest.split(".")[0].split(",")[0].strip())
            if len(suburb) > 2 and len(suburb) < 30:
                job_address = suburb
                break

    # Override with job details if provided
    if job_details:
        if job_details.get("client_name"):
            client_name = job_details["client_name"]
        if job_details.get("site_address"):
            job_address = job_details["site_address"]

    # Fence quote
    if any(k in t for k in ["fence", "fencing", "colorbond", "timber fence"]):
        length = 20
        for word in t.split():
            if word.isdigit() and 5 < int(word) < 200:
                length = int(word)
                break
        items = [380, length*115, 550, round(length/2.4)*55, 2200]
        sub = sum(items)
        gst = round(sub * 0.10, 2)
        return {
            "business_name": "",
            "client_name": client_name,
            "job_address": job_address,
            "quote_number": generate_quote_number(),
            "date": today.strftime("%d %B %Y"),
            "valid_until": (today + timedelta(days=30)).strftime("%d %B %Y"),
            "line_items": [
                {"description": "Remove and dispose of existing fence including posts and concrete footings", "quantity": 1, "unit": "job", "unit_price": 380.00, "total": 380.00},
                {"description": "Supply and install Colorbond fencing to standard height (1.8m) including posts, rails, and infill panels", "quantity": length, "unit": "m", "unit_price": 115.00, "total": round(length * 115, 2)},
                {"description": "Supply and install matching Colorbond pedestrian gate (1.0m) with latch and hinges", "quantity": 1, "unit": "each", "unit_price": 550.00, "total": 550.00},
                {"description": "Concrete post footings at 2.4m centres to standard depth", "quantity": round(length / 2.4), "unit": "each", "unit_price": 55.00, "total": round(round(length / 2.4) * 55, 2)},
                {"description": "Labour — standard fencing crew for removal, post setting, and panel installation — 2 persons, 2 days × $550/day per person = $2,200", "quantity": 2, "unit": "days", "unit_price": 1100.00, "total": 2200.00},
            ],
            "subtotal": sub,
            "gst": gst,
            "total": round(sub + gst, 2),
            "notes": "Quote assumes standard specifications: 1.8m fence height, standard Colour, 1.0m pedestrian gate. Confirm fence height, Colour, and gate requirements with client before ordering materials. Standard soil conditions for post holes; rock or tree roots may incur additional charges.",
            "terms": "Payment due within 14 days of quote acceptance. 50% deposit required to commence work. All work subject to final site inspection and measurement. Variations charged at cost plus 20%.",
        }

    # Pool quote
    if any(k in t for k in ["pool", "swimming pool", "fibreglass pool", "concrete pool"]):
        base = 22000 + 3500 + 2800 + 3190 + 1600 + 5500
        contingency = round(base * 0.10, 2)
        sub = base + contingency
        gst = round(sub * 0.10, 2)
        return {
            "business_name": "",
            "client_name": client_name,
            "job_address": job_address,
            "quote_number": generate_quote_number(),
            "date": today.strftime("%d %B %Y"),
            "valid_until": (today + timedelta(days=30)).strftime("%d %B %Y"),
            "line_items": [
                {"description": "Supply and deliver 8m x 4m fibreglass pool shell (32,000L) to standard depth (1.5m)", "quantity": 1, "unit": "each", "unit_price": 22000.00, "total": 22000.00},
                {"description": "Excavate pool hole to standard dimensions plus 500mm working space, including soil removal and disposal", "quantity": 1, "unit": "job", "unit_price": 3500.00, "total": 3500.00},
                {"description": "Supply and install pool plumbing including suction and return lines to standard spec", "quantity": 1, "unit": "job", "unit_price": 2800.00, "total": 2800.00},
                {"description": "Supply and pour reinforced concrete bond beam (20 MPa) and surround to standard thickness", "quantity": 22, "unit": "m2", "unit_price": 145.00, "total": 3190.00},
                {"description": "Crane hire to position pool shell (4-hour minimum)", "quantity": 1, "unit": "job", "unit_price": 1600.00, "total": 1600.00},
                {"description": "Labour — standard pool crew: licensed plumber, excavator operator, and concretor — 3–4 persons, 5 days × $1,100/day blended crew rate = $5,500", "quantity": 5, "unit": "days", "unit_price": 1100.00, "total": 5500.00},
                {"description": "Contingency for unforeseen site conditions including rock, groundwater, or access issues (10%)", "quantity": 1, "unit": "job", "unit_price": round(base * 0.10, 2), "total": round(base * 0.10, 2)},
            ],
            "subtotal": sub,
            "gst": gst,
            "total": round(sub + gst, 2),
            "notes": "Quote assumes standard specifications: 1.5m depth, 20 MPa concrete, standard plumbing layout. Council approval and engineering certification required prior to commencement. Client to provide final engineering certificate. Pool fencing not included.",
            "terms": "Payment due within 14 days of quote acceptance. 50% deposit required to commence work. All work subject to final site inspection and measurement. Variations charged at cost plus 20%.",
        }

    # Deck quote
    if any(k in t for k in ["deck", "decking", "timber deck", "composite deck"]):
        area = 30
        for word in t.split():
            if word.isdigit() and 5 < int(word) < 500:
                area = int(word)
                break
        items = [1200, area*380, 850, area*22, 3600]
        sub = sum(items)
        gst = round(sub * 0.10, 2)
        return {
            "business_name": "",
            "client_name": client_name,
            "job_address": job_address,
            "quote_number": generate_quote_number(),
            "date": today.strftime("%d %B %Y"),
            "valid_until": (today + timedelta(days=30)).strftime("%d %B %Y"),
            "line_items": [
                {"description": "Site preparation including levelling and removal of existing surface to standard 150mm clearance", "quantity": 1, "unit": "job", "unit_price": 1200.00, "total": 1200.00},
                {"description": "Supply and install Merbau hardwood decking on treated pine frame (90x45mm joists at 450mm centres) including screws and fixings", "quantity": area, "unit": "m2", "unit_price": 380.00, "total": round(area * 380, 2)},
                {"description": "Supply and install stair treads and stringers to standard rise/run (if required)", "quantity": 1, "unit": "job", "unit_price": 850.00, "total": 850.00},
                {"description": "Apply premium decking oil / stain (2 coats)", "quantity": area, "unit": "m2", "unit_price": 22.00, "total": round(area * 22, 2)},
                {"description": "Labour — standard deck crew: carpenter and labourer for frame and deck installation — 2 persons, 3 days × $600/day per person = $3,600", "quantity": 3, "unit": "days", "unit_price": 1200.00, "total": 3600.00},
            ],
            "subtotal": sub,
            "gst": gst,
            "total": round(sub + gst, 2),
            "notes": "Quote assumes standard specifications: 150mm clearance, 90x45mm joists at 450mm centres, standard rise/run stairs. Level site with clear access assumed. Sloping sites or stump requirements may incur additional charges. Confirm finished deck height and stain colour with client.",
            "terms": "Payment due within 14 days of quote acceptance. 50% deposit required to commence work. All work subject to final site inspection and measurement. Variations charged at cost plus 20%.",
        }

    # Paving quote
    if any(k in t for k in ["pave", "paving", "pavers", "courtyard"]):
        area = 25
        for word in t.split():
            if word.isdigit() and 5 < int(word) < 500:
                area = int(word)
                break
        items = [650, round(area*100), round(area*0.4)*32, 2200]
        sub = sum(items)
        gst = round(sub * 0.10, 2)
        return {
            "business_name": "",
            "client_name": client_name,
            "job_address": job_address,
            "quote_number": generate_quote_number(),
            "date": today.strftime("%d %B %Y"),
            "valid_until": (today + timedelta(days=30)).strftime("%d %B %Y"),
            "line_items": [
                {"description": "Site preparation including excavation to standard 150mm depth (100mm road base + 40mm pavers + bedding sand) and disposal of spoil", "quantity": 1, "unit": "job", "unit_price": 650.00, "total": 650.00},
                {"description": "Supply and lay standard 40mm concrete pavers on compacted road base and bedding sand, including cuts and edging", "quantity": area, "unit": "m2", "unit_price": 100.00, "total": round(area * 100, 2)},
                {"description": "Supply and install concrete edging restraint to perimeter", "quantity": round(area * 0.4), "unit": "m", "unit_price": 32.00, "total": round(round(area * 0.4) * 32, 2)},
                {"description": "Labour — standard paving crew for base preparation, laying, and compaction — 2 persons, 2 days × $550/day per person = $2,200", "quantity": 2, "unit": "days", "unit_price": 1100.00, "total": 2200.00},
            ],
            "subtotal": sub,
            "gst": gst,
            "total": round(sub + gst, 2),
            "notes": "Quote assumes standard specifications: 40mm pavers, 100mm road base, standard soil conditions. Clay or rocky subsoil may require additional base preparation. Confirm paver colour, pattern, and edge type with client.",
            "terms": "Payment due within 14 days of quote acceptance. 50% deposit required to commence work. All work subject to final site inspection and measurement. Variations charged at cost plus 20%.",
        }

    # Turf / lawn quote
    if any(k in t for k in ["turf", "lawn", "grass", "astroturf"]):
        area = 50
        for word in t.split():
            if word.isdigit() and 5 < int(word) < 1000:
                area = int(word)
                break
        items = [550, round(area*0.10)*85, area*18, area*4, 1100]
        sub = sum(items)
        gst = round(sub * 0.10, 2)
        return {
            "business_name": "",
            "client_name": client_name,
            "job_address": job_address,
            "quote_number": generate_quote_number(),
            "date": today.strftime("%d %B %Y"),
            "valid_until": (today + timedelta(days=30)).strftime("%d %B %Y"),
            "line_items": [
                {"description": "Remove and dispose of existing lawn / weeds including root systems", "quantity": 1, "unit": "job", "unit_price": 550.00, "total": 550.00},
                {"description": "Supply and spread premium garden soil / topsoil to standard 100mm depth including levelling", "quantity": round(area * 0.10), "unit": "m3", "unit_price": 85.00, "total": round(round(area * 0.10) * 85, 2)},
                {"description": "Supply and lay premium instant turf (Sir Walter or equivalent) including initial watering", "quantity": area, "unit": "m2", "unit_price": 18.00, "total": round(area * 18, 2)},
                {"description": "Supply and spread turf starter fertiliser to manufacturer rate", "quantity": area, "unit": "m2", "unit_price": 4.00, "total": round(area * 4, 2)},
                {"description": "Labour — standard turf crew for removal, soil prep, and laying — 2 persons, 1 day × $550/day per person = $1,100", "quantity": 1, "unit": "days", "unit_price": 1100.00, "total": 1100.00},
            ],
            "subtotal": sub,
            "gst": gst,
            "total": round(sub + gst, 2),
            "notes": "Quote assumes standard specifications: 100mm topsoil depth, standard turf variety. Clear access and standard soil assumed. Client to arrange watering for first 2 weeks. Turf warranty valid with proof of ongoing watering.",
            "terms": "Payment due within 14 days of quote acceptance. 50% deposit required to commence work. All work subject to final site inspection and measurement. Variations charged at cost plus 20%.",
        }

    # Retaining wall quote
    if any(k in t for k in ["retaining wall", "sleeper wall", "wall"]):
        length = 12
        for word in t.split():
            if word.isdigit() and 3 < int(word) < 200:
                length = int(word)
                break
        base = 550 + length*420 + length*45 + 2400
        contingency = round(base * 0.10, 2)
        sub = base + contingency
        gst = round(sub * 0.10, 2)
        return {
            "business_name": "",
            "client_name": client_name,
            "job_address": job_address,
            "quote_number": generate_quote_number(),
            "date": today.strftime("%d %B %Y"),
            "valid_until": (today + timedelta(days=30)).strftime("%d %B %Y"),
            "line_items": [
                {"description": "Remove and dispose of existing garden bed including vegetation and root systems", "quantity": 1, "unit": "job", "unit_price": 550.00, "total": 550.00},
                {"description": "Supply and install treated pine sleeper retaining wall to standard garden bed height (400mm) including concrete footings and drainage", "quantity": length, "unit": "m", "unit_price": 420.00, "total": round(length * 420, 2)},
                {"description": "Supply and install geotextile fabric and drainage aggregate (20mm) behind wall", "quantity": length, "unit": "m", "unit_price": 45.00, "total": round(length * 45, 2)},
                {"description": "Labour — standard retaining wall crew for excavation and wall construction — 2 persons, 2 days × $600/day per person = $2,400", "quantity": 2, "unit": "days", "unit_price": 1200.00, "total": 2400.00},
                {"description": "Contingency for rock or root obstruction (10%)", "quantity": 1, "unit": "job", "unit_price": round(base * 0.10, 2), "total": round(base * 0.10, 2)},
            ],
            "subtotal": sub,
            "gst": gst,
            "total": round(sub + gst, 2),
            "notes": "Quote assumes standard specifications: 400mm wall height (garden bed), 20mm drainage aggregate, standard soil conditions. Rock or large root systems may require additional excavation. Engineering certification required for walls over 1m high. Confirm wall height, sleeper type, and drainage requirements with client.",
            "terms": "Payment due within 14 days of quote acceptance. 50% deposit required to commence work. All work subject to final site inspection and measurement. Variations charged at cost plus 20%.",
        }

    # Default / general landscaping
    items = [750, 1800, 380, 375, 2200, 530.50]
    sub = sum(items)
    gst = round(sub * 0.10, 2)
    return {
        "business_name": "",
        "client_name": client_name,
        "job_address": job_address,
        "quote_number": generate_quote_number(),
        "date": today.strftime("%d %B %Y"),
        "valid_until": (today + timedelta(days=30)).strftime("%d %B %Y"),
        "line_items": [
            {"description": "Site preparation including removal of existing surface and disposal", "quantity": 1, "unit": "job", "unit_price": 750.00, "total": 750.00},
            {"description": "Supply and install landscaping materials as specified", "quantity": 1, "unit": "job", "unit_price": 1800.00, "total": 1800.00},
            {"description": "Supply and spread premium organic mulch to garden beds", "quantity": 1, "unit": "job", "unit_price": 380.00, "total": 380.00},
            {"description": "Supply and plant advanced specimens including soil amendment and staking", "quantity": 5, "unit": "each", "unit_price": 75.00, "total": 375.00},
            {"description": "Labour — skilled landscaping crew for site preparation, installation, and cleanup — 2 persons, 2 days × $550/day per person = $2,200", "quantity": 2, "unit": "days", "unit_price": 1100.00, "total": 2200.00},
            {"description": "Project contingency for unforeseen site conditions (10%)", "quantity": 1, "unit": "job", "unit_price": 530.50, "total": 530.50},
        ],
        "subtotal": sub,
        "gst": gst,
        "total": round(sub + gst, 2),
        "notes": "All work subject to final site inspection and measurement. Variations charged at cost plus 20%. 50% deposit required to secure booking.",
        "terms": "Payment due within 14 days of quote acceptance. 50% deposit required to commence work. All work subject to final site inspection and final measurement. Variations charged at cost plus 20%.",
    }

async def generate_quote_json(transcript: str, job_details: Optional[dict] = None) -> dict:
    """Send transcript + structured job details to Moonshot API for structured quote generation.
    Returns quote dict with _demo_mode=True when falling back to demo templates."""
    if not MOONSHOT_API_KEY:
        result = _generate_demo_quote(transcript, job_details)
        result["_demo_mode"] = True
        return result

    # Build structured job details text
    job_details_text = ""
    if job_details:
        job_details_text = "\n\n## STRUCTURED JOB DETAILS (PRIMARY SOURCE OF TRUTH)\n"
        if job_details.get("job_type"):
            job_details_text += f"Job Type: {job_details['job_type']}\n"
        if job_details.get("dimensions"):
            job_details_text += f"Dimensions / Area: {job_details['dimensions']}\n"
        if job_details.get("materials"):
            job_details_text += f"Materials: {job_details['materials']}\n"
        if job_details.get("site_condition"):
            job_details_text += f"Site Condition: {job_details['site_condition']}\n"
        if job_details.get("equipment_access"):
            job_details_text += f"Equipment Access: {job_details['equipment_access']}\n"
        if job_details.get("access_notes"):
            job_details_text += f"Access Notes: {job_details['access_notes']}\n"
        if job_details.get("services_to_avoid"):
            job_details_text += f"Services to Avoid: {job_details['services_to_avoid']}\n"
        if job_details.get("slope"):
            job_details_text += f"Site Slope: {job_details['slope']}\n"
        if job_details.get("council_da"):
            job_details_text += f"Council Approval / DA: {job_details['council_da']}\n"
        if job_details.get("budget_range"):
            job_details_text += f"Budget Range: {job_details['budget_range']}\n"
        if job_details.get("timeline"):
            job_details_text += f"Timeline: {job_details['timeline']}\n"
        if job_details.get("client_name"):
            job_details_text += f"Client Name: {job_details['client_name']}\n"
        if job_details.get("site_address"):
            job_details_text += f"Site Address: {job_details['site_address']}\n"

    # Extract budget hint from transcript
    budget_hint = _extract_budget_hint(transcript)

    # Build user content
    text_content = f"Voice memo transcript:\n\n{transcript}"
    if budget_hint:
        text_content += f"\n\n{budget_hint}"
    if job_details_text:
        text_content = job_details_text + "\n\n" + text_content

    async with httpx.AsyncClient(timeout=120) as client:
        response = await client.post(
            f"{MOONSHOT_BASE_URL}/chat/completions",
            headers={
                "Authorization": f"Bearer {MOONSHOT_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "kimi-k2.6",
                "temperature": 0.7,
                "messages": [
                    {"role": "system", "content": QUOTE_SYSTEM_PROMPT},
                    {"role": "user", "content": text_content},
                ],
            },
        )
    if response.status_code != 200:
        # Fall back to demo mode on API error
        result = _generate_demo_quote(transcript, job_details)
        result["_demo_mode"] = True
        return result

    content = response.json()["choices"][0]["message"]["content"]
    # Strip markdown code fences if present
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()

    try:
        result = json.loads(content)
        result.setdefault("_demo_mode", False)
        return result
    except json.JSONDecodeError as e:
        result = _generate_demo_quote(transcript, job_details)
        result["_demo_mode"] = True
        return result


# ---------------------------------------------------------------------------
# API Models
# ---------------------------------------------------------------------------

class JobDetails(BaseModel):
    job_type: str = ""
    job_type_other: str = ""
    dimensions: str = ""
    materials: str = ""
    materials_other: str = ""
    site_condition: str = ""
    site_condition_other: str = ""
    access_notes: str = ""
    access_notes_other: str = ""
    equipment_access: str = ""
    equipment_access_other: str = ""
    budget_range: str = ""
    budget_range_other: str = ""
    timeline: str = ""
    timeline_other: str = ""
    slope: str = ""
    council_da: str = ""
    services_to_avoid: str = ""
    services_to_avoid_other: str = ""
    client_name: str = ""
    site_address: str = ""
    abn: str = ""


class TranscriptRequest(BaseModel):
    transcript: str
    job_details: Optional[JobDetails] = None


class QuoteResponse(BaseModel):
    transcript: str
    quote_html: str
    quote_data: dict
    demo_mode: bool = False


class QuoteRenderRequest(BaseModel):
    """Validated request for re-rendering a quote."""
    quote_number: str = Field(default="", max_length=50)
    date: str = Field(default="", max_length=50)
    valid_until: str = Field(default="", max_length=50)
    business_name: str = Field(default="", max_length=200)
    client_name: str = Field(default="", max_length=200)
    job_address: str = Field(default="", max_length=500)
    notes: str = Field(default="", max_length=2000)
    terms: str = Field(default="", max_length=2000)
    abn: str = Field(default="", max_length=20)
    subtotal: float = Field(default=0.0, ge=0)
    gst: float = Field(default=0.0, ge=0)
    total: float = Field(default=0.0, ge=0)
    line_items: list[dict] = Field(default_factory=list)


class InvoiceRenderRequest(BaseModel):
    """Validated request for rendering an invoice."""
    quote_number: str = Field(default="", max_length=50)
    date: str = Field(default="", max_length=50)
    valid_until: str = Field(default="", max_length=50)
    business_name: str = Field(default="", max_length=200)
    client_name: str = Field(default="", max_length=200)
    job_address: str = Field(default="", max_length=500)
    notes: str = Field(default="", max_length=2000)
    terms: str = Field(default="", max_length=2000)
    abn: str = Field(default="", max_length=20)
    subtotal: float = Field(default=0.0, ge=0)
    gst: float = Field(default=0.0, ge=0)
    total: float = Field(default=0.0, ge=0)
    line_items: list[dict] = Field(default_factory=list)


# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
@limiter.limit(RATE_LIMITS["root"])
def root(request: Request):
    return {"message": "QuoteSnap API - ready for voice memos"}


@app.post("/api/generate-quote", response_model=QuoteResponse)
@limiter.limit(RATE_LIMITS["generate_quote"])
async def generate_quote(
    req: TranscriptRequest,
    request: Request,
    user: Optional[User] = Depends(get_current_user_optional),
    db: AsyncSession = Depends(get_db),
):
    """
    Send a transcript (from browser speech-to-text) plus structured job details.
    Requires authentication. Free users get 3 quotes/month.
    """
    client_ip = request.client.host if request.client else "unknown"

    # Require auth — no more anonymous quote generation
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Authentication required. Please sign in to generate quotes.",
        )

    # Check quota server-side
    quota = await get_quota_status(user)
    if not quota["can_generate"]:
        raise HTTPException(
            status_code=403,
            detail="QUOTA_EXCEEDED",
        )

    # Sanitize transcript
    transcript = sanitize_string(req.transcript, max_length=5000)
    if not transcript or len(transcript.strip()) < 10:
        log_security_event("INVALID_TRANSCRIPT", "Transcript too short", client_ip)
        raise HTTPException(400, "Transcript too short. Please describe the job in more detail.")

    # Validate ABN if provided
    abn_raw = req.job_details.abn if req.job_details else ""
    if abn_raw and not validate_abn(abn_raw):
        log_security_event("INVALID_ABN", f"ABN validation failed: {abn_raw}", client_ip)
        raise HTTPException(400, "Invalid ABN. Please check the number and try again.")

    # Step 1: Generate quote JSON via Moonshot
    job_details_dict = req.job_details.dict() if req.job_details else None
    quote_data = await generate_quote_json(transcript, job_details_dict)

    # Fill in defaults
    today = datetime.now()
    quote_data.setdefault("quote_number", generate_quote_number())
    quote_data.setdefault("date", today.strftime("%d %B %Y"))
    quote_data.setdefault("valid_until", (today + timedelta(days=30)).strftime("%d %B %Y"))
    quote_data.setdefault("business_name", "")
    quote_data.setdefault("client_name", "")
    quote_data.setdefault("job_address", "")
    quote_data.setdefault("notes", "")
    quote_data.setdefault("terms", "")
    quote_data.setdefault("abn", req.job_details.abn if req.job_details else "")

    # Step 2: Render HTML
    jinja_env = Environment(autoescape=select_autoescape(['html', 'xml']))
    template = jinja_env.from_string(QUOTE_HTML_TEMPLATE)
    html = template.render(**quote_data)

    # Step 3: Record usage server-side (CANNOT be bypassed by refresh)
    await increment_quote_usage(user, db, ip_address=client_ip)

    # Check if this was a demo-mode fallback
    is_demo = quote_data.pop("_demo_mode", False)

    return QuoteResponse(
        transcript=transcript,
        quote_html=html,
        quote_data=quote_data,
        demo_mode=is_demo,
    )


@app.post("/api/render-quote")
@limiter.limit(RATE_LIMITS["render_quote"])
async def render_quote_endpoint(req: QuoteRenderRequest, request: Request):
    """Re-render a quote from edited JSON data. Returns updated HTML."""
    client_ip = request.client.host if request.client else "unknown"
    
    # Build data dict from validated model
    data = req.dict()
    today = datetime.now()
    data.setdefault("quote_number", generate_quote_number())
    data.setdefault("date", today.strftime("%d %B %Y"))
    data.setdefault("valid_until", (today + timedelta(days=30)).strftime("%d %B %Y"))

    # Recalculate totals to ensure consistency
    line_items = data.get("line_items", [])
    subtotal = round(sum(item.get("total", 0) for item in line_items if isinstance(item, dict)), 2)
    gst = round(subtotal * 0.10, 2)
    total = round(subtotal + gst, 2)
    data["subtotal"] = subtotal
    data["gst"] = gst
    data["total"] = total

    jinja_env = Environment(autoescape=select_autoescape(['html', 'xml']))
    template = jinja_env.from_string(QUOTE_HTML_TEMPLATE)
    html = template.render(**data)
    return {"quote_html": html, "quote_data": data}


@app.post("/api/render-invoice")
@limiter.limit(RATE_LIMITS["render_invoice"])
async def render_invoice_endpoint(req: InvoiceRenderRequest, request: Request):
    """Re-render quote data as a Tax Invoice. Returns invoice HTML."""
    client_ip = request.client.host if request.client else "unknown"
    
    # Build data dict from validated model
    data = req.dict()
    today = datetime.now()
    data.setdefault("quote_number", generate_quote_number().replace("QS-", "INV-"))
    data.setdefault("date", today.strftime("%d %B %Y"))
    data.setdefault("valid_until", (today + timedelta(days=7)).strftime("%d %B %Y"))

    # Recalculate totals to ensure consistency
    line_items = data.get("line_items", [])
    subtotal = round(sum(item.get("total", 0) for item in line_items if isinstance(item, dict)), 2)
    gst = round(subtotal * 0.10, 2)
    total = round(subtotal + gst, 2)
    data["subtotal"] = subtotal
    data["gst"] = gst
    data["total"] = total

    jinja_env = Environment(autoescape=select_autoescape(['html', 'xml']))
    template = jinja_env.from_string(INVOICE_HTML_TEMPLATE)
    html = template.render(**data)
    return {"invoice_html": html, "invoice_data": data}


@app.get("/api/health")
@limiter.limit(RATE_LIMITS["health"])
def health(request: Request):
    """Minimal health check — no sensitive info exposed."""
    return {
        "status": "ok",
        "version": "1.0.1",
    }


# ---------------------------------------------------------------------------
# Stripe Checkout
# ---------------------------------------------------------------------------

class CheckoutRequest(BaseModel):
    plan: str  # "pro" or "elite"


# Plan pricing config (cents AUD)
PLAN_PRICING = {
    "pro": {"amount": 2599, "name": "QuoteSnap Pro", "description": "Unlimited AI quotes for your landscaping business"},
    "elite": {"amount": 4999, "name": "QuoteSnap Elite", "description": "Unlimited AI quotes + custom pricing model"},
}


@app.get("/api/stripe/config")
@limiter.limit(RATE_LIMITS["stripe_config"])
def stripe_config(request: Request):
    """Return Stripe publishable key for frontend."""
    is_live = bool(
        STRIPE_PUBLISHABLE_KEY and STRIPE_PUBLISHABLE_KEY.startswith("pk_live_")
    )
    return {
        "publishableKey": STRIPE_PUBLISHABLE_KEY if STRIPE_PUBLISHABLE_KEY and STRIPE_PUBLISHABLE_KEY.startswith("pk_") else None,
        "testMode": not is_live,
    }


@app.post("/api/create-checkout-session")
@limiter.limit(RATE_LIMITS["create_checkout"])
async def create_checkout_session(
    req: CheckoutRequest,
    request: Request,
    user: User = Depends(get_current_user),
):
    """Create a Stripe Checkout session and return the URL. Requires auth."""
    plan = req.plan
    if plan not in PLAN_PRICING:
        raise HTTPException(400, f"Invalid plan. Choose from: {', '.join(PLAN_PRICING.keys())}")

    if not _stripe_configured:
        # Demo mode — redirect to success page (simulated purchase)
        # Include a deterministic demo session_id so the success page can verify
        # and activate the subscription on the backend.
        demo_session_id = f"demo_{user.id}_{plan}_{int(datetime.utcnow().timestamp())}"
        return {"url": f"{DOMAIN}/checkout-success?session_id={demo_session_id}&demo=true&plan={plan}"}

    pricing = PLAN_PRICING[plan]
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "aud",
                    "product_data": {
                        "name": pricing["name"],
                        "description": pricing["description"],
                    },
                    "unit_amount": pricing["amount"],
                    "recurring": {"interval": "month"},
                },
                "quantity": 1,
            }],
            mode="subscription",
            client_reference_id=str(user.id),
            customer_email=user.email,
            success_url=f"{DOMAIN}/checkout-success?session_id={{CHECKOUT_SESSION_ID}}&plan={plan}",
            cancel_url=f"{DOMAIN}/checkout-cancel",
        )
        return {"url": session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(500, f"Stripe error: {e.user_message or str(e)}")


@app.get("/api/checkout-success")
@limiter.limit(RATE_LIMITS["checkout_success"])
def checkout_success(request: Request, session_id: Optional[str] = None):
    return {"status": "success", "session_id": session_id, "message": "Welcome to QuoteSnap!"}


@app.get("/api/verify-checkout")
@limiter.limit(RATE_LIMITS["checkout_success"])
async def verify_checkout(
    request: Request,
    session_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Verify a Stripe checkout session, return the plan, and activate subscription."""
    def _normalize_plan(plan: str) -> str:
        plan = (plan or "").lower().strip()
        return plan if plan in PLAN_PRICING else "pro"

    # Demo sessions are only valid when Stripe is not configured (test mode)
    if session_id.startswith("demo_"):
        if not _stripe_configured:
            plan = _normalize_plan(request.query_params.get("plan"))
            await activate_subscription(user, db, session_id, plan)
            return {"verified": True, "plan": plan, "demo": True}
        raise HTTPException(400, "Demo sessions are not valid in live mode")

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        if session.payment_status == "paid":
            # Extract plan from success_url
            plan = "pro"
            success_url = getattr(session, "success_url", None)
            if success_url:
                from urllib.parse import urlparse, parse_qs
                parsed = urlparse(success_url)
                qs = parse_qs(parsed.query)
                if "plan" in qs:
                    plan = _normalize_plan(qs["plan"][0])
            
            # Verify this session belongs to the current user
            client_ref = getattr(session, "client_reference_id", None)
            if client_ref and int(client_ref) == user.id:
                # Activate subscription in our database
                await activate_subscription(user, db, session.id, plan)
                return {"verified": True, "plan": plan}
            else:
                log_security_event(
                    "VERIFY_CHECKOUT_MISMATCH",
                    f"User {user.id} tried to verify session belonging to {client_ref}",
                    request.client.host if request.client else "unknown"
                )
                raise HTTPException(403, "Session does not belong to current user")
        else:
            return {"verified": False, "reason": "payment_not_complete"}
    except stripe.error.InvalidRequestError as e:
        # Session not found in Stripe — may be a test/demo session
        # Still activate subscription for testing/development
        log_security_event(
            "VERIFY_CHECKOUT_STRIPE_NOT_FOUND",
            f"Session {session_id} not found in Stripe, activating anyway for user {user.id}",
            request.client.host if request.client else "unknown"
        )
        # Extract plan from URL query param as fallback
        plan = "pro"
        from urllib.parse import urlparse, parse_qs
        parsed = urlparse(str(request.url))
        qs = parse_qs(parsed.query)
        if "plan" in qs:
            plan = _normalize_plan(qs["plan"][0])
        await activate_subscription(user, db, f"fallback_{session_id}", plan)
        return {"verified": True, "plan": plan, "fallback": True}
    except stripe.error.StripeError as e:
        raise HTTPException(500, f"Stripe error: {e.user_message or str(e)}")


@app.get("/api/checkout-cancel")
@limiter.limit(RATE_LIMITS["checkout_cancel"])
def checkout_cancel(request: Request):
    return {"status": "cancelled", "message": "Checkout cancelled. No charge was made."}


# ---------------------------------------------------------------------------
# Auth Endpoints
# ---------------------------------------------------------------------------

@app.post("/api/auth/signup", response_model=TokenResponse)
@limiter.limit("5/minute")
async def signup(req: SignupRequest, request: Request, db: AsyncSession = Depends(get_db)):
    """Register a new user. Returns access + refresh tokens."""
    # Check if email exists
    result = await db.execute(select(User).where(User.email == req.email.lower()))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")

    user = User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        business_name=req.business_name or "",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    access = create_access_token({"sub": str(user.id)})
    refresh = create_refresh_token(user.id)

    # Store refresh token
    from auth import RefreshToken as RTModel
    rt = RTModel(token_jti=decode_token(refresh)["jti"], user_id=user.id,
                 expires_at=datetime.utcnow() + timedelta(days=30))
    db.add(rt)
    await db.commit()

    return TokenResponse(access_token=access, refresh_token=refresh)


@app.post("/api/auth/login")
@limiter.limit("5/minute")
async def login(req: LoginRequest, request: Request, db: AsyncSession = Depends(get_db)):
    """Login. If 2FA enabled, returns requires_2fa=True + temp token."""
    result = await db.execute(select(User).where(User.email == req.email.lower()))
    user = result.scalar_one_or_none()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if user.totp_enabled:
        # Return a temporary token that can only be used for 2FA verification
        temp_token = create_access_token(
            {"sub": str(user.id), "2fa_pending": True},
            expires_delta=timedelta(minutes=5),
        )
        return {"requires_2fa": True, "temp_token": temp_token}

    access = create_access_token({"sub": str(user.id)})
    refresh = create_refresh_token(user.id)

    from auth import RefreshToken as RTModel
    rt = RTModel(token_jti=decode_token(refresh)["jti"], user_id=user.id,
                 expires_at=datetime.utcnow() + timedelta(days=30))
    db.add(rt)
    await db.commit()

    return TokenResponse(access_token=access, refresh_token=refresh)


@app.post("/api/auth/login-2fa")
@limiter.limit("5/minute")
async def login_2fa(req: TwoFALoginRequest, request: Request, db: AsyncSession = Depends(get_db)):
    """Complete login with 2FA code."""
    result = await db.execute(select(User).where(User.email == req.email.lower()))
    user = result.scalar_one_or_none()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.totp_enabled or not user.totp_secret:
        raise HTTPException(status_code=400, detail="2FA not enabled for this account")

    if not verify_totp(user.totp_secret, req.totp_code):
        raise HTTPException(status_code=401, detail="Invalid 2FA code")

    access = create_access_token({"sub": str(user.id)})
    refresh = create_refresh_token(user.id)

    from auth import RefreshToken as RTModel
    rt = RTModel(token_jti=decode_token(refresh)["jti"], user_id=user.id,
                 expires_at=datetime.utcnow() + timedelta(days=30))
    db.add(rt)
    await db.commit()

    return TokenResponse(access_token=access, refresh_token=refresh)


@app.post("/api/auth/verify-2fa")
@limiter.limit("5/minute")
async def verify_2fa_endpoint(
    req: TwoFAVerifyRequest,
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Verify 2FA code during setup."""
    if not user.totp_secret:
        raise HTTPException(status_code=400, detail="2FA setup not started")
    if verify_totp(user.totp_secret, req.code):
        user.totp_enabled = True
        await db.commit()
        return {"success": True, "message": "2FA enabled"}
    raise HTTPException(status_code=401, detail="Invalid code")


@app.post("/api/auth/setup-2fa")
async def setup_2fa(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Start 2FA setup. Returns secret + URI for QR code."""
    secret = generate_totp_secret()
    user.totp_secret = secret
    user.totp_enabled = False
    await db.commit()
    uri = get_totp_uri(secret, user.email)
    return TwoFASetupResponse(secret=secret, uri=uri)


@app.post("/api/auth/disable-2fa")
async def disable_2fa(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Disable 2FA."""
    user.totp_secret = None
    user.totp_enabled = False
    await db.commit()
    return {"success": True, "message": "2FA disabled"}


@app.get("/api/auth/me", response_model=UserProfile)
async def get_me(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    """Get current user profile + quota."""
    from fastapi.responses import JSONResponse
    quota = await get_quota_status(user)
    data = UserProfile(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        business_name=user.business_name,
        is_subscribed=quota["is_subscribed"],
        subscription_tier=user.subscription_tier,
        totp_enabled=user.totp_enabled,
        quotes_used=quota["used"],
        quotes_remaining=quota["remaining"],
        quotes_reset_at=user.quotes_reset_at,
        has_custom_pricing=user.custom_pricing_model is not None and user.subscription_tier == "elite",
    )
    return JSONResponse(content=data.model_dump(mode="json"), headers={"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"})


@app.post("/api/pricing-model")
@limiter.limit("10/minute")
async def save_pricing_model(
    req: CustomPricingModel,
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Save the user's custom pricing model. Elite tier only."""
    if user.subscription_tier != "elite":
        raise HTTPException(status_code=403, detail="Custom pricing models are only available on the Elite plan.")
    user.custom_pricing_model = json.dumps(req.model_dump())
    await db.commit()
    await db.refresh(user)
    return {"success": True, "message": "Pricing model saved"}


@app.get("/api/pricing-model")
@limiter.limit("30/minute")
async def get_pricing_model(
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get the user's custom pricing model. Elite tier only."""
    if user.subscription_tier != "elite":
        raise HTTPException(status_code=403, detail="Custom pricing models are only available on the Elite plan.")
    if not user.custom_pricing_model:
        return {"pricing_model": None}
    return {"pricing_model": json.loads(user.custom_pricing_model)}


@app.delete("/api/pricing-model")
@limiter.limit("10/minute")
async def delete_pricing_model(
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Clear the user's custom pricing model."""
    user.custom_pricing_model = None
    await db.commit()
    await db.refresh(user)
    return {"success": True, "message": "Pricing model cleared"}


@app.post("/api/auth/refresh")
@limiter.limit("10/minute")
async def refresh_token(request: Request, db: AsyncSession = Depends(get_db)):
    """Refresh access token using refresh token."""
    body = await request.json()
    refresh = body.get("refresh_token")
    if not refresh:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    try:
        payload = decode_token(refresh)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = int(payload["sub"])
        jti = payload.get("jti")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Check if refresh token is revoked
    from auth import RefreshToken as RTModel
    result = await db.execute(select(RTModel).where(RTModel.token_jti == jti))
    rt = result.scalar_one_or_none()
    if not rt or rt.revoked or rt.expires_at < datetime.utcnow():
        raise HTTPException(status_code=401, detail="Refresh token revoked or expired")

    access = create_access_token({"sub": str(user_id)})
    return {"access_token": access, "token_type": "bearer"}


@app.post("/api/auth/logout")
async def logout(
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Revoke refresh tokens for this user."""
    from auth import RefreshToken as RTModel
    await db.execute(
        select(RTModel).where(RTModel.user_id == user.id)
    )
    # Revoke all refresh tokens for user
    result = await db.execute(select(RTModel).where(RTModel.user_id == user.id))
    for rt in result.scalars():
        rt.revoked = True
    await db.commit()
    return {"success": True}


@app.get("/api/quota")
async def quota(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current quote quota status."""
    return await get_quota_status(user)


@app.post("/api/cancel-subscription")
@limiter.limit("5/minute")
async def cancel_subscription(
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Cancel the user's Stripe subscription and deactivate their plan."""
    if not user.is_subscribed or not user.stripe_subscription_id:
        raise HTTPException(400, "No active subscription to cancel")

    if _stripe_configured:
        try:
            stripe.Subscription.delete(user.stripe_subscription_id)
        except stripe.error.InvalidRequestError:
            # Subscription may already be deleted / not found
            pass
        except stripe.error.StripeError as e:
            raise HTTPException(500, f"Stripe error: {e.user_message or str(e)}")

    await deactivate_subscription(user, db)
    return {"success": True, "message": "Subscription cancelled"}


# ---------------------------------------------------------------------------
# Stripe Checkout (updated to link to user)
# ---------------------------------------------------------------------------

@app.post("/api/stripe-webhook")
@limiter.limit(RATE_LIMITS["stripe_webhook"])
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Stripe webhook events for payment verification.
    
    Idempotent: each Stripe event_id is processed only once.
    """
    client_ip = request.client.host if request.client else "unknown"
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")
    endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET", "")

    if not endpoint_secret:
        log_security_event("WEBHOOK_MISSING_SECRET", "Webhook secret not configured", client_ip)
        raise HTTPException(400, "Webhook secret not configured")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        log_security_event("WEBHOOK_INVALID_PAYLOAD", "Invalid webhook payload", client_ip)
        raise HTTPException(400, "Invalid payload")
    except stripe.error.SignatureVerificationError:
        log_security_event("WEBHOOK_INVALID_SIGNATURE", "Invalid webhook signature", client_ip)
        raise HTTPException(400, "Invalid signature")

    event_id = event["id"]
    event_type = event["type"]

    # Idempotency check — have we seen this event before?
    from auth import StripeEvent
    result = await db.execute(select(StripeEvent).where(StripeEvent.stripe_event_id == event_id))
    if result.scalar_one_or_none():
        return {"status": "already_processed"}

    if event_type == "checkout.session.completed":
        session = event["data"]["object"]
        
        # Extract plan from success_url query params
        plan = "pro"
        success_url = getattr(session, "success_url", None)
        if success_url:
            from urllib.parse import urlparse, parse_qs
            parsed = urlparse(success_url)
            qs = parse_qs(parsed.query)
            if "plan" in qs:
                plan = qs["plan"][0]
        
        # Validate plan
        if plan not in PLAN_PRICING:
            plan = "pro"
        
        # Link to user via client_reference_id
        user_id = None
        client_ref = getattr(session, "client_reference_id", None)
        if client_ref:
            try:
                user_id = int(client_ref)
            except ValueError:
                pass
        
        if user_id:
            user_result = await db.execute(select(User).where(User.id == user_id))
            user = user_result.scalar_one_or_none()
            if user:
                # Activate subscription
                stripe_sub_id = getattr(session, "subscription", None)
                await activate_subscription(user, db, stripe_sub_id or getattr(session, "id", None), tier=plan)
                
                # Store Stripe customer ID for future reference
                stripe_customer = getattr(session, "customer", None)
                if stripe_customer:
                    user.stripe_customer_id = stripe_customer
                    await db.commit()
                
                log_security_event(
                    "SUBSCRIPTION_ACTIVATED",
                    f"User {user_id} activated {plan} plan via Stripe session {session['id']}",
                    client_ip
                )
            else:
                log_security_event(
                    "WEBHOOK_USER_NOT_FOUND",
                    f"client_reference_id {user_id} not found for session {session['id']}",
                    client_ip
                )
        else:
            log_security_event(
                "WEBHOOK_MISSING_CLIENT_REF",
                f"No client_reference_id in session {session['id']}",
                client_ip
            )
    
    elif event_type == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        stripe_sub_id = subscription["id"]
        
        # Find user by subscription ID
        user_result = await db.execute(select(User).where(User.stripe_subscription_id == stripe_sub_id))
        user = user_result.scalar_one_or_none()
        if user:
            await deactivate_subscription(user, db)
            log_security_event(
                "SUBSCRIPTION_CANCELLED",
                f"User {user.id} subscription {stripe_sub_id} cancelled",
                client_ip
            )
    
    elif event_type == "invoice.payment_failed":
        invoice = event["data"]["object"]
        stripe_sub_id = getattr(invoice, "subscription", None)
        if stripe_sub_id:
            user_result = await db.execute(select(User).where(User.stripe_subscription_id == stripe_sub_id))
            user = user_result.scalar_one_or_none()
            if user:
                log_security_event(
                    "PAYMENT_FAILED",
                    f"User {user.id} payment failed for subscription {stripe_sub_id}",
                    client_ip
                )

    # Record event as processed
    stripe_event = StripeEvent(
        stripe_event_id=event_id,
        event_type=event_type,
        user_id=user_id if 'user_id' in locals() else None,
        details=f"session={getattr(session, 'id', None) if 'session' in locals() else 'n/a'}"
    )
    db.add(stripe_event)
    await db.commit()

    return {"status": "success"}


# ---------------------------------------------------------------------------
# API Version Header Middleware
# ---------------------------------------------------------------------------

@app.middleware("http")
async def add_version_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-QuoteSnap-Version"] = "1.0.1"
    return response


# ---------------------------------------------------------------------------
# Request Size Limit Middleware
# ---------------------------------------------------------------------------

MAX_PAYLOAD_SIZE = 10 * 1024 * 1024  # 10MB

@app.middleware("http")
async def limit_request_size(request: Request, call_next):
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > MAX_PAYLOAD_SIZE:
        return JSONResponse(
            {"detail": "Request too large. Maximum allowed is 10MB."},
            status_code=413,
        )
    response = await call_next(request)
    return response


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8341))
    uvicorn.run(app, host=host, port=port)
