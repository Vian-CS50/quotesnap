# QuoteSnap — Deploy to Production

## Quick Overview
- **Frontend:** Vercel (Next.js)
- **Backend:** Render (Python/FastAPI)
- **Payments:** Stripe live keys

---

## 1. Backend on Render

### Option A — Render Dashboard (easiest)
1. Push this repo to GitHub.
2. Go to https://dashboard.render.com/ → **New +** → **Web Service**.
3. Connect your GitHub repo.
4. Use these settings:
   - **Name:** `quotesnap-api`
   - **Runtime:** Python 3
   - **Build command:** `pip install -r requirements.txt`
   - **Start command:** `./start.sh`
   - **Plan:** Free
5. Add environment variables (from `backend/.env`):
   - `ENVIRONMENT=production`
   - `DOMAIN=https://<your-vercel-domain>` (set after Vercel deploy)
   - `MOONSHOT_API_KEY=sk-...`
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `STRIPE_PUBLISHABLE_KEY=pk_live_...`
   - `STRIPE_WEBHOOK_SECRET=whsec_...`
   - `API_KEY=<a random 32+ char secret>`
6. Click **Deploy Web Service**.
7. Copy the Render URL (e.g. `https://quotesnap-api.onrender.com`).

### Option B — Render Blueprint
1. Push repo to GitHub.
2. In Render dashboard, click **New +** → **Blueprint**.
3. Connect repo. Render will read `render.yaml`.
4. Fill in the `sync: false` env vars when prompted.

---

## 2. Frontend on Vercel

### Using Vercel CLI
```bash
cd quotesnap/frontend
npx vercel login
npx vercel --prod
```
Then set the API URL:
```bash
npx vercel env add NEXT_PUBLIC_API_URL
# Enter your Render backend URL, e.g. https://quotesnap-api.onrender.com
npx vercel --prod
```

### Using Vercel Dashboard
1. Push repo to GitHub.
2. Go to https://vercel.com/new and import the repo.
3. Set **Root Directory** to `frontend`.
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://<your-render-url>`
5. Deploy.

---

## 3. Stripe Live Mode

1. In Stripe Dashboard, activate your account.
2. Get live keys:
   - `STRIPE_PUBLISHABLE_KEY` (starts with `pk_live_`)
   - `STRIPE_SECRET_KEY` (starts with `sk_live_`)
3. Update Render env vars with live keys and restart.
4. Create Stripe webhook endpoint:
   - URL: `https://<your-render-url>/api/stripe-webhook`
   - Events: `checkout.session.completed`, `invoice.payment_succeeded`
   - Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.
5. In Stripe settings, add your website URL (`https://<your-vercel-domain>`) and links to:
   - `/terms`
   - `/privacy`
   - `/pricing-model`

---

## 4. Update Backend DOMAIN

After Vercel deploy, go back to Render and set:
```
DOMAIN=https://<your-vercel-domain>
```
Redeploy the backend so checkout success/cancel URLs point to the frontend.

---

## Temporary Tunnel (for Stripe verification right now)

If you just need a public URL immediately:
```bash
# Terminal 1 — backend already running on 8341
# Terminal 2 — frontend on 3000
cloudflared tunnel --url http://localhost:3000
```
Use the `https://*.trycloudflare.com` URL in Stripe. **This URL dies when the tunnel stops.**
