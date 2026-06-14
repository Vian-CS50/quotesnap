# QuoteSnap — Agent Context

## What This Is
AI quote generator for Adelaide landscaping businesses. Voice memo → professional PDF quote in 30 seconds.

## Stack
- **Backend:** FastAPI, Python, uvicorn on `127.0.0.1:8341`
- **Frontend:** Next.js 14, Tailwind, Framer Motion on `localhost:3000`
- **AI:** Moonshot API
- **Payments:** Stripe (test mode active, live needs ABN + guardian)
- **Design:** Dark theme, emerald primary (#10B981), amber accent (#F59E0B)

## How to Run
```bash
# Terminal 1 — Backend
cd /Users/viankruger/quotesnap/backend
source .venv/bin/activate 2>/dev/null || true
uvicorn main:app --host 127.0.0.1 --port 8341 --reload

# Terminal 2 — Frontend
cd /Users/viankruger/quotesnap/frontend
npm run dev
```

## Critical Rules
- **Positioning:** Adelaide landscapers ONLY. Not generic tradies. Not plumbers/electricians/painters.
- **AI Prompt:** Never hallucinate scope. Quote ONLY what was asked for. Labour must show crew size, days, rate breakdown.
- **Pricing:** $19 AUD/mo founder (first 10), then $29/mo. Lifetime $79 founder.
- **Test Card:** 4242 4242 4242 4242, any future date, any CVC.

## File Map
- `backend/main.py` — FastAPI app, AI prompt, invoice HTML template
- `backend/.env` — API keys (Moonshot, Stripe, Stability)
- `frontend/src/app/` — Next.js pages
- `frontend/src/components/sections/` — Landing page sections
- `HANDOFF.md` — Session-to-session status

## Stripe Features to Leverage (May 2025)
1. **Optimized Checkout Suite** — ML personalizes checkout in real-time. Shows right payment methods per customer. Zero code required.
2. **Smart Retries** — AI retries failed payments at optimal time. Recovers 57% of failed subs. Free money.
3. **Agentic Commerce** — AI agents can complete transactions autonomously. Future feature, watch it.
4. **Payment Links via Natural Language** — In Stripe Dashboard, type "Create a $19 monthly sub link" and it builds it. Zero code.

## Current Blockers
- Stripe live mode needs ABN + guardian setup
- No live payment processing yet

## Pre-Launch Checklist (Do Before Video)
Before recording the demo Loom, verify EVERYTHING works end-to-end:
- [ ] Backend starts clean on `8341` with no errors
- [ ] Frontend starts clean on `3000` with no styling issues
- [ ] Generate a test quote (voice memo or typed) → PDF looks professional
- [ ] Material Calculator outputs correct numbers
- [ ] Quote → Invoice conversion works
- [ ] Stripe checkout loads real test page (not demo fallback)
- [ ] Checkout success page shows confetti + welcome message
- [ ] All copy says "landscapers" — no "tradies" / "plumbers" / "electricians" leaks
- [ ] Pricing shows $19/mo founder on both frontend and Stripe checkout
- [ ] Test payment with `4242 4242 4242 4242` succeeds

## Tomorrow's Goal
1. Run Pre-Launch Checklist — fix anything broken FIRST
2. Record 2-min Loom demo showing: voice memo → quote → PDF → Stripe checkout
3. Post Loom to Adelaide landscaping Facebook groups
4. DM 3 landscapers with the Loom link
