# QuoteSnap — Handoff (19 Jun 2026)

## What Works Right Now
- **Live frontend**: `https://quotesnap-blue.vercel.app` (frontend-v2) — signup, login, dashboard all functional
- **Live backend**: `https://quotesnap-api.onrender.com` — FastAPI, CORS configured for the Vercel origin
- **Auth end-to-end**: signup creates a user, stores tokens, redirects to dashboard
- **Backend builds/deploys** from `main` via Render Blueprint (`render.yaml`)
- **Frontend deploys** from repo root with Vercel project `quotesnap`, root directory `frontend-v2`

## What We Fixed Today
1. **CORS** — `backend/main.py` now allows both `DOMAIN` and `https://quotesnap-blue.vercel.app` in production (plus optional `ALLOWED_ORIGINS`).
2. **Bcrypt crash** — `backend/auth.py` now uses `bcrypt` directly instead of `passlib`, fixing the Render `password cannot be longer than 72 bytes` 500 on signup.
3. **Frontend-v2 auth API mapping** — `frontend-v2/src/lib/api.ts` now reads `access_token` from the backend and sends `full_name`, `business_name`, `age_confirmation`.
4. **AuthGuard unmount bug** — `frontend-v2/src/components/auth/AuthGuard.tsx` no longer unmounts `/login`/`/signup` while auth is loading, so forms don't reset on submit.
5. **Vercel env var** — `NEXT_PUBLIC_API_URL` was incorrectly set; corrected to `https://quotesnap-api.onrender.com` and redeployed.
6. **`.vercelignore`** added at repo root so Vercel only uploads `frontend-v2/`.

## To Run Locally
```bash
# Terminal 1 — Backend
cd /Users/viankruger/quotesnap/backend
source .venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8341 --reload

# Terminal 2 — Frontend v2 (the live app)
cd /Users/viankruger/quotesnap/frontend-v2
npm run dev
# Open http://localhost:3000
```

## Deploying
```bash
# Backend — push to main, Render auto-deploys
git push origin main

# Frontend v2
cd /Users/viankruger/quotesnap
npx vercel --prod --project quotesnap
```

## Tomorrow's Priority Stack
1. **Pre-launch checklist** (from `AGENTS.md`) — generate a test quote → PDF → Stripe checkout with test card `4242 4242 4242 4242`
2. **Stripe checkout** — ensure it redirects to live Render backend success URL
3. **Record Loom** — voice memo → quote → PDF → checkout
4. **Post/DM** — Adelaide landscaping groups with the Loom
5. **Launch** — Stripe live mode (needs ABN + guardian setup)

## Files Touched Recently
- `backend/main.py` — CORS origins
- `backend/auth.py` — bcrypt hashing, removed passlib
- `backend/requirements.txt` — removed passlib
- `frontend-v2/src/lib/api.ts` — auth response/payload mapping
- `frontend-v2/src/context/AuthContext.tsx` — `getMe()` result shape
- `frontend-v2/src/components/auth/AuthGuard.tsx` — keep public routes mounted
- `.vercelignore` — limit uploads to frontend-v2

## Known Issues
- Stripe still in test mode (live needs ABN + guardian)
- No Xero/MYOB integration
- SQLite on Render is ephemeral (free tier), so user data survives restarts but not redeploys

## Revenue Angle
QuoteSnap at $19/mo is the cheapest quote tool for Adelaide landscapers. ServiceM8 starts at $9 but caps features; Tradify is ~$75/user. QuoteSnap is flat-rate, AI-powered, and Adelaide-focused.
