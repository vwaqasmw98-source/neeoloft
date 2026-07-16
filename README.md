# Neeoloft — AI-first Web & Automation Agency Platform v1.4

> **AI agents + voice AI + marketing automation + agency SaaS in one system.**
> Built with **Next.js 14**, **Tailwind CSS**, **Groq LLM** (FREE), **MongoDB**, **Stripe**, **NextAuth**, **Twilio WhatsApp**, **Vapi**, **Web Speech API**, **Slack/Discord webhooks**.

![stack](https://img.shields.io/badge/Next.js-14-black) ![tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8) ![groq](https://img.shields.io/badge/Groq-Llama_3.1-orange) ![mongo](https://img.shields.io/badge/Mongo-Mongoose-47A248) ![stripe](https://img.shields.io/badge/Stripe-Billing-635bff) ![voice](https://img.shields.io/badge/Voice_AI-Web_Speech_API-22d3ee) ![seo](https://img.shields.io/badge/SEO-JSON--LD_%2B_Sitemap-3a5cff)

---

## ✨ v1.4 — what's new in this update

- 🎙️ **Voice AI in chat widget** — users can now TALK to Aria, not just type. Multilingual: Urdu, Hindi, English, Arabic + 10 more. Powered by browser Web Speech API (free). Replies are spoken back in the detected language.
- 📋 **Native booking form on /book** — Cal.com removed. Custom form with timezone selector, duration picker, topic. Saves to `Booking` model and notifies Slack/Discord/email.
- 🗺️ **SEO foundation** — auto-generated `sitemap.xml` and `robots.txt`, JSON-LD schemas (Organization, WebSite, Service, FAQPage, Breadcrumb, Article/BlogPosting), per-page OpenGraph + Twitter cards, canonical URLs.
- 📝 **Blog / Resources section** — `/blog` index + `/blog/[slug]` posts. 6 SEO-friendly sample articles with meta + Article schema + related posts.
- ❓ **FAQ section on homepage** — 8 questions with FAQPage schema (eligible for Google "People also ask" rich results).
- 🧭 **Breadcrumb schema** on all key pages.
- ⚙️ **Voice settings in chat** — toggle TTS replies on/off, choose mic language.

All v1.3 features still in: Groq LLM, Aria sales agent, lead scoring, MotionWrapper, error boundaries, NextAuth, Stripe, KB training, Vapi voice webhook, Slack/Discord notify.

---

## 🚀 Quick start

```bash
git clone <your-repo> neeoloft
cd neeoloft
npm install

cp .env.example .env.local
# Fill in: MONGODB_URI, GROQ_API_KEY, NEXTAUTH_SECRET,
#          NEXT_PUBLIC_SITE_URL (your prod domain),
#          STRIPE_*, SMTP_*, TWILIO_*, SLACK_WEBHOOK_URL, VAPI_*

npm run dev   # → http://localhost:3000

# Optional: seed the AI agent's knowledge base
MONGODB_URI=... npm run seed
```

### Required env vars (minimum viable)

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | ✅ | Mongo Atlas connection string |
| `GROQ_API_KEY` | ✅ | Powers chatbot (FREE at console.groq.com/keys) |
| `NEXTAUTH_SECRET` | ✅ | `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | ✅ (prod) | Used by sitemap, robots, canonical URLs, OG tags. e.g. `https://neeoloft.com` |

Everything else is **optional** — features gracefully degrade if missing (no crashes).

### Optional integrations

| Variable | Feature |
|---|---|
| `STRIPE_*` | Subscription billing |
| `SMTP_*` + `ADMIN_EMAIL` | Email auto-replies to leads |
| `TWILIO_*` + `ADMIN_WHATSAPP_NUMBER` | WhatsApp auto-replies |
| `SLACK_WEBHOOK_URL` | Slack rich-embed notifications |
| `DISCORD_WEBHOOK_URL` | Discord rich-embed notifications |
| `VAPI_API_KEY` + `VAPI_WEBHOOK_SECRET` | Phone-call based voice agent (separate from widget voice) |
| `OPENAI_API_KEY` | Upgrade widget STT (Whisper) + TTS for higher quality |
| `ELEVENLABS_API_KEY` | Premium TTS voices (deeper, more human) |

The **in-widget voice mode** uses the browser's Web Speech API by default — **free, no key needed**. Works in Chrome, Edge, Opera. Safari has TTS but no STT. Firefox has neither (UI still works in text mode).

---

## 🤖 Aria — your AI sales agent

Aria is configured to be **human, consultative, never pushy**. She:

- Speaks like a real account strategist, not a script reader
- Mirrors the user's language (English / Urdu / Hindi / 10+ more)
- **Knows your current service catalog dynamically** — reads `lib/services.ts` on every deploy
- Asks clarifying questions before pitching
- Captures leads (name, email, phone, service, budget) **only** when ready
- Routes to `/book` (native booking form) for strategy calls
- Auto-scores leads (hot/warm/cold) and notifies your team
- **Voice mode**: users can TALK to Aria (browser STT) and HEAR her reply (browser TTS) — no extra cost

### 🔄 Adding / editing services (bot updates automatically)

The service catalog lives in **one file**: `lib/services.ts`. Edit it and re-deploy — Aria picks it up.

```ts
// lib/services.ts
export const SERVICES: Service[] = [
  {
    id: 'my-new-service',           // unique kebab-case slug
    emoji: '🎯',
    name: 'My New Service',
    short: '1-line punchy description',
    description: '2-3 line detailed description',
    startingPrice: 1000,             // USD
    category: 'ai',                  // see Service type for valid categories
    keywords: ['keyword1', 'keyword2'], // for lead scoring
  },
  // ... existing services
];
```

Once you add a new entry and re-deploy, the bot will:
- Mention it when relevant in conversations
- Recommend it during the MATCH step
- Score leads who mention those keywords
- Show it on `/services` and the home page

**No other file changes needed.** The system prompt, services page, footer, and lead scorer all read from this array.

---

## 🧠 Knowledge-base training

Two ways to train the AI:

**1. Admin UI** → `/admin` → Knowledge base tab → Add source
- Paste text, markdown, FAQ, or URL — we fetch and chunk automatically

**2. Seed script**:
```bash
MONGODB_URI=... npm run seed
```

Retrieval uses simple keyword overlap (fast, free, no embeddings needed). Swap to vector search when you scale — see `lib/kb.ts`.

---

## 💳 Stripe billing

```bash
# Local testing
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy the whsec_... into STRIPE_WEBHOOK_SECRET
```

Plans are in `lib/stripe.ts`. Customize prices, features, and Stripe price IDs in `.env.local`.

---

## 📅 Cal.com embed

Set `NEXT_PUBLIC_CALCOM_EMBED_LINK` to your Cal.com event (e.g. `neeoloft/strategy-call`) and `/book` renders the inline calendar. Manual fallback form also works for non-Cal cases.

---

## 📞 Voice agent (Vapi / Retell)

Point your voice assistant's webhook to:

```
POST https://yourapp.com/api/vapi/webhook
Headers:
  x-vapi-signature: <HMAC of body with VAPI_WEBHOOK_SECRET>
```

The endpoint accepts both call-end (lead) and appointment (booking) events. Set up your voice agent to extract: `name`, `email`, `phone`, `requirement`, `budget`, `scheduledAt`, `durationMinutes`.

---

## 🛡️ Security

- NextAuth JWT sessions (httpOnly cookies)
- bcrypt password hashing (cost 12)
- Zod validation on every API route
- Stripe webhook signature verification
- Vapi webhook HMAC signature verification
- `robots: noindex` on /admin, /login, /signup, /billing
- API keys never exposed to the client

For production, add: Upstash Redis rate limiting, Cloudflare Turnstile captcha, email verification.

---

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add all env vars from `.env.example`
4. Configure Stripe webhook → `/api/stripe/webhook`
5. Configure Vapi webhook → `/api/vapi/webhook`
6. Deploy ✓

---

## 📁 Project structure

```
neeoloft/
├─ app/                       # Next.js 14 App Router
│  ├─ page.tsx                # Home
│  ├─ about/ services/ portfolio/ pricing/ contact/ book/
│  ├─ login/, signup/         # NextAuth
│  ├─ billing/                # Stripe customer view
│  ├─ admin/                  # Tabbed dashboard (auth-protected)
│  ├─ error.tsx global-error.tsx
│  └─ api/
│     ├─ auth/[...nextauth]/  # NextAuth handler
│     ├─ auth/register/       # Signup
│     ├─ leads/ chat/ leads-export/
│     ├─ send-email/  send-whatsapp/
│     ├─ bookings/            # Native booking form
│     ├─ kb/                  # Knowledge base CRUD
│     ├─ stripe/{checkout,portal,webhook}/
│     ├─ billing/             # Subscription read
│     └─ vapi/webhook/        # Voice agent capture
├─ app/
│  ├─ sitemap.ts              # ⭐ Auto-generated XML sitemap
│  ├─ robots.ts               # ⭐ Auto-generated robots.txt
│  └─ blog/                   # ⭐ Blog index + [slug] posts
├─ components/
│  ├─ Navbar, Footer, Hero, CTA, Stats, FeatureGrid, LogoCloud
│  ├─ ThemeProvider, ThemeToggle
│  ├─ MotionWrapper.tsx       # ⭐ Safe framer-motion re-exports
│  ├─ ChatbotWidget.tsx       # ⭐ AI agent UI + voice mode (STT/TTS)
│  ├─ BookingForm.tsx         # ⭐ Native booking form (Cal.com removed)
│  ├─ FaqSection.tsx          # ⭐ Homepage FAQ + FAQPage JSON-LD
│  ├─ JsonLd.tsx              # ⭐ Schema.org structured data helpers
│  ├─ ContactForm.tsx
│  ├─ AdminDashboard.tsx      # ⭐ Tabbed workspace dashboard
│  ├─ AuthProvider.tsx
│  └─ SectionHeader.tsx       # ⭐ Has 'use client' (RSC fix)
├─ lib/
│  ├─ mongodb.ts              # Connection (cached)
│  ├─ llm.ts                  # ⭐ Groq-powered (OpenAI-compatible)
│  ├─ systemPrompt.ts         # ⭐ Aria's brain
│  ├─ services.ts             # ⭐ 12-service catalog
│  ├─ voice.ts                # ⭐ Web Speech API wrapper (STT/TTS, multilingual)
│  ├─ blog.ts                 # ⭐ Blog posts (single source of truth)
│  ├─ faq.ts                  # ⭐ FAQ data
│  ├─ kb.ts                   # Chunking + retrieval
│  ├─ email.ts whatsapp.ts notify.ts
│  ├─ stripe.ts auth.ts leadScore.ts utils.ts
├─ models/                    # Mongoose schemas
├─ scripts/seed.mjs
├─ styles/globals.css
└─ .env.example
```

---

## 🔎 SEO — what's wired

Production-ready SEO foundation out of the box. After deploying:

| Item | Where |
|---|---|
| `sitemap.xml` (auto) | `app/sitemap.ts` — includes static + services + blog posts |
| `robots.txt` (auto) | `app/robots.ts` — disallows `/admin`, `/api`, `/login`, etc. |
| Organization JSON-LD | Rendered on every page (root layout) |
| WebSite JSON-LD (with `SearchAction`) | Rendered on every page (root layout) |
| Service JSON-LD (per service) | `app/services/page.tsx` |
| FAQPage JSON-LD | Homepage `components/FaqSection.tsx` |
| BlogPosting JSON-LD | `app/blog/[slug]/page.tsx` |
| BreadcrumbList JSON-LD | All top-level pages |
| Per-page OpenGraph + Twitter | `app/{about,services,pricing,portfolio,contact,book,blog}/page.tsx` |
| Canonical URLs | Every page sets `alternates.canonical` |
| Google Fonts preconnect | `app/layout.tsx` |

**After deploy:**
1. Submit `https://neeoloft.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console) and Bing Webmaster Tools.
2. Validate schemas with [Schema.org Validator](https://validator.schema.org/) and [Rich Results Test](https://search.google.com/test/rich-results).
3. Replace `/og-default.png` with a real 1200×630 branded image.
4. Add your real social URLs to `components/JsonLd.tsx` (`sameAs` array).

---

## 🗺️ Roadmap

- [ ] OpenAI/Groq embeddings + Mongo `$vectorSearch` (proper RAG)
- [ ] Multi-channel outbound (LinkedIn, email)
- [ ] Stripe Tax support
- [ ] Magic-link / OAuth providers in NextAuth
- [ ] White-label / custom-domain per workspace
- [ ] React Native mobile app (Expo)
- [ ] Webhooks out (so customers can pipe Neeoloft events to their systems)
- [ ] SLA monitoring + alerting

---

## 📜 License

MIT © Neeoloft

> Built by Neeoloft — **AI agents that sell while you sleep.** ⚡
