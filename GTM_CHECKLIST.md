# QuoteSnap — 4-Week Go-To-Market Checklist

> Rule: If a task does not end with an Adelaide landscaper entering a credit card, it does not exist.

---

## Week 1: Product Surgery + First Content

### Product (Mon–Wed)
- [x] Pricing.tsx: Remove lifetime, set $29/mo, $19 founder tier
- [x] InteractiveDemo.tsx: Collapse form to 4 fields, mic button hero, send buttons
- [x] ProgressIndicator.tsx: Kill fake steps, single honest spinner
- [x] MediaUpload.tsx: Client-side image compression
- [ ] Record 3x 15-sec demo videos with ElevenLabs voiceover
  - [ ] Video 1: Tap mic → talk 5 sec
  - [ ] Video 2: Quote generates in iframe
  - [ ] Video 3: Tap "Copy SMS" → show pre-written message
- [ ] Post all 3 to TikTok, Instagram Reels, Facebook Page "QuoteSnap"
  - Caption template: "Adelaide landscapers: stop writing quotes at 10pm. Link in bio."

### Legal (Do This Tonight)
- [ ] Parent applies for ABN at abr.gov.au (sole trader, "QuoteSnap Software Services")
- [ ] Parent opens Stripe account, connects their bank
- [ ] Add standard SaaS Terms of Service to landing page footer

---

## Week 2: Infiltration

### Daily (Mon–Fri)
- [ ] DM 20 Adelaide landscapers on Instagram per day = 100 total
  - Search: "landscaper Adelaide", "gardening Adelaide", "concreting Adelaide"
  - Target: profiles with phone number or email in bio (real business owners)
  - DM template: see DM_TEMPLATES.txt

### Facebook Groups
- [ ] Join 5 groups:
  1. Adelaide Landscaping & Gardening
  2. SA Tradies
  3. Adelaide Construction & Renovation
  4. Australian Landscaping Network
  5. Adelaide Small Business
- [ ] Do NOT post links in groups
- [ ] Reply to every quote-related post with genuine advice + soft pitch
- [ ] Reply template: see DM_TEMPLATES.txt

### Targets
- [ ] 100 DMs sent
- [ ] 20 replies
- [ ] 10 trial signups

---

## Week 3: Trial Conversion

### Follow-Up (Daily)
- [ ] Personal follow-up every trial user after 24 hours
  - "Did you try it? What job did you quote?"
  - If no: offer to generate their first quote FOR them using their voice memo
- [ ] For anyone who generated a quote: ask "How long would that have taken by hand?"
  - Record answer. This is testimonial gold.

### Handling Objections
- [ ] If someone says "I couldn't get it working" → do not fix the product for them
  - If a 50-year-old cannot figure out a big red mic button + "Write My Quote" button, move on
- [ ] If someone says "$19 is too much" → ask what they pay for one tank of petrol for their ute

### Targets
- [ ] 8 active users who have generated at least 2 quotes

---

## Week 4: The Ask

### Monday–Tuesday
- [ ] Message every active trial user:
  - "Your free week is up. If it saved you time, founder pricing is $19/month. Takes 2 minutes."
  - Include Stripe checkout link

### Wednesday
- [ ] For the 3 who say no, ask:
  - "What would it need to do for you to pay $19 a month?"
  - Their answer = your ONLY product roadmap for the next month

### Thursday–Friday
- [ ] For the 2 who say yes immediately, ask for a 20-sec video testimonial
  - Offer 1 free month in exchange
  - Use these videos to replace ElevenLabs voiceover ads with real tradie faces

### Targets
- [ ] 10 customers at $19/month = $190 MRR
- [ ] Proof that tradies will pay

---

## DO NOT BUILD (Until 10 Paying Customers)

- [ ] Xero/MYOB/QuickBooks integration
- [ ] Custom logo upload or branding editor
- [ ] Database migration (PostgreSQL, Supabase, etc.)
- [ ] Mobile app (iOS/Android)
- [ ] Affiliate/referral program
- [ ] AI concept renders (Stability AI)
- [ ] Meta/TikTok paid ad campaigns
- [ ] Quote templates library
- [ ] Multi-user/team accounts
- [ ] Advanced analytics dashboard
- [ ] OAuth, auth systems, or user roles
- [ ] Any feature that takes >2 hours to implement
