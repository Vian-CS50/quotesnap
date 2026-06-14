# Prompt for Kimi Web Design Agent

## Project: QuoteSnap Landing Page

### What is QuoteSnap?
QuoteSnap is an AI-powered quote writing tool for Australian landscapers. A tradie records a 30-second voice memo describing a job (materials, labour, pricing) and QuoteSnap generates a professional, itemised PDF quote with GST, terms, and branding.

### Target Audience
- Australian landscapers, plumbers, electricians, painters
- Sole traders and small crews (1-5 people)
- Age 25-55, not tech-savvy, use phones for everything
- Hate paperwork, love tools that save time
- Visually driven — they judge quality by how slick something looks

### Design Vibe
- **Modern, bold, confident** — not corporate, not startup-cliche
- **Dark mode primary** — tradies are on job sites, bright screens in sun
- **High contrast, large typography** — readable on phones with dirty hands
- **Motion and interactivity** — subtle animations, scroll effects, hover states
- **Australian feel** — not American SaaS sterile. Warm, direct, no bullshit
- **No em dashes** in copy — use short, punchy sentences. No corporate filler

### Sections Required

1. **Hero**
   - Headline: "Write quotes in 30 seconds"
   - Subhead: "Turn your voice memo into a professional landscaping quote"
   - Two CTAs: "Try Free" (primary) + "Watch Demo" (secondary, opens video/lightbox)
   - Background: Animated gradient or particles, not a stock photo
   - Optional: A floating phone mockup showing the app interface

2. **Social Proof / Trust Bar**
   - "Trusted by 100+ Aussie tradies" (or similar)
   - Simple logos or icons: Landscapers, Plumbers, Electricians, Painters
   - Keep minimal, don't overwhelm

3. **How It Works** (3 steps)
   - Step 1: Record voice memo on site
   - Step 2: AI writes the quote with line items and GST
   - Step 3: Send professional PDF to client
   - Use illustrations or simple iconography, not stock photos of people

4. **Interactive Demo**
   - A playable mockup or embedded video showing the actual product
   - Voice waveform animation, quote appearing in real-time
   - This is the conversion moment — make it engaging

5. **Features Grid** (6 features)
   - Voice to Quote
   - GST Auto-Calculated
   - Professional PDF Output
   - Custom Branding
   - Works Offline (voice recording)
   - Australian Built
   - Use icons + short descriptions, card-based layout

6. **Testimonials** (2-3)
   - Fake but realistic quotes from tradies
   - "Saved me 2 hours every night" — Dave, Landscaper, Adelaide
   - Use avatars or simple initials, not stock photos

7. **Pricing**
   - Two tiers: Pro Monthly $29 AUD / Lifetime $69 AUD
   - Highlight "Most Popular" on monthly
   - Simple, clean cards with clear feature lists
   - CTA buttons per tier

8. **FAQ** (4-5 questions)
   - "Do I need to type everything?" 
   - "Does it work with my logo?"
   - "Can I edit the quote before sending?"
   - "Is my data safe?"
   - Accordion style, clean expand/collapse

9. **Final CTA**
   - "Stop writing quotes at 10pm"
   - Big button: "Start Free"
   - Simple, no clutter

10. **Footer**
    - Logo, links, "Built in Adelaide, Australia"
    - Minimal, clean

### Technical Constraints
- **Build ONLY the frontend shell. The backend is complete and separate.**
- Backend runs at `http://localhost:8341` with 3 API endpoints (see API.md for full contract)
- Must be buildable in **Next.js 14 + Tailwind CSS + shadcn/ui**
- Must work on mobile first (most tradies will find this via Instagram/TikTok on phones)
- Must use **no external image assets** — pure CSS/SVG illustrations, gradients, shapes
- Performance matters — no heavy JS libraries
- Keep existing API calls intact: `POST /api/generate-quote`, `POST /api/create-checkout-session`, `GET /api/health`

### Color Direction
- Primary: Emerald green (#10b981 or similar) — represents growth, landscaping, money
- Background: Very dark slate (#0f172a or deeper) — easy on eyes, professional
- Accents: Warm amber or gold for CTAs — tradies respond to "action" colours
- Text: White/off-white for headings, slate-400 for body

### What NOT to do
- No stock photos of people in suits
- No generic SaaS illustrations (purple blobs, floating 3D shapes)
- No long paragraphs of text
- No em dashes or corporate speak
- No cluttered navigation — max 4 links + CTA
- No cookie banners or popups

### Reference Sites (vibe only, don't copy)
- linear.app (dark, bold typography, smooth)
- gumroad.com (direct, no bullshit, converts)
- stripe.com (clean sections, great spacing)

### Deliverable
A complete, production-ready landing page design as:
1. Single HTML file with inline CSS/JS (for preview), OR
2. React/Next.js component files I can drop into my project

Include animations, hover states, and responsive breakpoints.
