# QuoteSnap — Handoff (23 Apr 2025)

## What Works Right Now
- **Backend**: FastAPI on `127.0.0.1:8341`, Moonshot AI connected, generating realistic quotes
- **Frontend**: Next.js 14, builds clean, all features rendering
- **AI Quotes**: Adelaide 2025-2026 pricing benchmarks baked into prompt (verified rates)
- **Quote → Invoice**: One-click Tax Invoice conversion
- **Follow-up system**: Auto flags old quotes, copy templates, SMS/WhatsApp buttons
- **Material Calculator**: Turf, pavers, concrete, mulch, retaining walls, fencing — wired into demo
- **Security**: Rate limiting, CORS locked, input size caps, secrets gitignored

## To Run Tomorrow
```bash
# Terminal 1 — Backend
cd /Users/viankruger/quotesnap/backend
source .venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8341 --reload

# Terminal 2 — Frontend
cd /Users/viankruger/quotesnap/frontend
npm run dev
# Open http://localhost:3000
```

## Tomorrow's Priority Stack
1. **Stripe test keys** → Dashboard → copy sk_test_... / pk_test_... → paste into `backend/.env` → restart backend
2. **Test checkout end-to-end** → hit "Get QuoteSnap" → should redirect to Stripe checkout
3. **Record a Loom** → generate a pool quote → convert to invoice → show follow-up badge
4. **Post or DM** → Adelaide landscapers on Instagram/Facebook with the Loom
5. **Launch** → Vercel deploy + Stripe live mode (needs ABN + guardian)

## Files Touched Recently
- `backend/main.py` — pricing benchmarks, invoice endpoint, security
- `frontend/src/components/sections/InteractiveDemo.tsx` — demo, history, follow-ups, invoice
- `frontend/src/components/MaterialCalculator.tsx` — material calculators
- `frontend/src/components/sections/Pricing.tsx` — $19/mo founder pricing
- `backend/.env` — API keys (Moonshot live, Stripe placeholders)

## Known Issues
- Stripe in test/demo mode (placeholder keys)
- No live payment processing yet
- No Xero/MYOB integration (v2)

## Revenue Angle
QuoteSnap at $19/mo is the cheapest quote tool for tradies. ServiceM8 starts at $9 but caps features. Tradify is ~$75/user. QuoteSnap is flat rate, AI-powered, Adelaide-focused.
