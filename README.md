# 🛒 SmartEssentials Hub

**India's #1 Weekly Product Discovery Platform for Students**

A production-ready Next.js 14 affiliate marketing site with Wirecutter-style editorial design, Firebase backend, full admin panel, blog, and SEO optimization.

---

## ✨ Features

| Feature | Detail |
|---|---|
| **Design** | Clean editorial — white background, accent purple, Cabinet Grotesk + Satoshi fonts |
| **Responsive** | 1→2→4 column grid, mobile hamburger menu, large tap targets |
| **Product System** | 20 curated Indian products across 4 categories |
| **Admin Panel** | Full CRUD with password auth, analytics tab, export JSON |
| **Search** | Full-text search with category filter + sort (⌘K shortcut) |
| **Blog** | 3 long-form SEO articles with related products |
| **API Routes** | `/api/subscribe`, `/api/track`, `/api/products` |
| **Firebase Ready** | Firestore CRUD + Auth wired in `lib/firebase.ts` |
| **SEO** | Dynamic metadata, sitemap, robots.txt, JSON-LD schemas |
| **PWA** | manifest.json, icons, `Add to Home Screen` support |
| **Analytics** | Local click tracking + GA4 slot + Vercel Function logs |
| **Legal** | Cookie banner, affiliate disclaimer, privacy policy |
| **Performance** | Lazy images, Next.js Image optimization, edge OG image |

---

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Environment
cp .env.example .env.local
# Edit .env.local with your values

# 3. Dev server
npm run dev
# → http://localhost:3000

# 4. Type check
npm run type-check

# 5. Build
npm run build
```

---

## 🔥 Before Going Live — Checklist

### 1. Replace Your Amazon Affiliate Tag
Open `src/data/products.json` — replace every `YOURTAG-21` with your real tag from [affiliate-program.amazon.in](https://affiliate-program.amazon.in).

### 2. Replace Product Images
Every `placehold.co` image URL should be replaced with a real Amazon product image URL.
Right-click any Amazon product image → Copy image address.

### 3. Enable Google Analytics 4
In `src/app/layout.tsx`, uncomment the two GA4 script lines and replace `G-XXXXXXXXXX` with your Measurement ID from [analytics.google.com](https://analytics.google.com).

### 4. Set Up Firebase (for live product management)
See **Firebase Setup** section below.

### 5. Update Domain References
Search project for `smartessentials.vercel.app` → replace with your real domain.

### 6. Set Admin Password
In `.env.local`: `NEXT_PUBLIC_ADMIN_PASS=your_secure_password`

---

## 🔥 Firebase Setup (5 minutes)

```
1. Go to console.firebase.google.com
2. Create Project → "smart-essentials-hub"
3. Add Web App → copy firebaseConfig values → paste in .env.local
4. Build → Firestore Database → Create database → Start in test mode
5. Authentication → Get started → Email/Password → Enable
6. Create your admin account in Authentication → Users → Add user
```

Once Firebase is configured, in `src/app/admin/page.tsx`:
- Change the login to use `adminSignIn()` from `@/lib/firebase`
- Products will persist in Firestore instead of `localStorage`

In each category/API page, swap the static JSON import for `fetchAllProducts()`.

---

## 💰 Money-Making Guide

### Primary: Amazon Associates (3–12% commission)
- Earphones (₹1,299) → ₹39–156 per sale
- SSDs (₹5,000) → ₹150–600 per sale
- Kindles (₹12,000) → ₹360–1,440 per sale

**Target:** 100 clicks/day → 5% conversion → 5 sales → avg ₹300 commission = **₹1,500/day = ₹45,000/month**

### Amplification Strategies
1. **SEO Blog Posts** — "Best earphones under ₹2000 India 2026" → ranks in 3–6 months → warm buyer traffic
2. **Instagram Reels** — 30-second product showcases → link in bio → free traffic
3. **YouTube Shorts** — "Top 5 gadgets under ₹1000 for hostel" → affiliate links in description
4. **Telegram Channel** — Daily deal drops → highly engaged buyer audience
5. **Google Ads** — ₹50/day ads targeting "best earphones India" → test with ₹500 budget first

### Additional Revenue Streams
| Stream | How | Potential |
|---|---|---|
| Sponsored posts | Charge brands for a featured product slot | ₹5,000–20,000/post |
| Newsletter ads | 5K subscribers → charge ₹2,000/issue | ₹8,000/month |
| Digital products | "Student Budget Toolkit" PDF → Gumroad | Passive |
| Affiliate diversification | Add ShareASale, Cuelinks for non-Amazon | +20–30% revenue |

---

## 🔥 Trending Products Right Now (Add These!)

Products blowing up in India in Q2 2026:

| Product | Category | Why Trending |
|---|---|---|
| Noise ColorFit Ultra 3 | Trending | Best-value smartwatch, viral TikTok reviews |
| Realme Buds Air 6 | Student | ANC at ₹1,999 — previously impossible |
| Samsung T7 Shield SSD | AI Tools | CS/ML students buying for local model storage |
| Portronics Toad 24 Mouse | Budget | Viral on Instagram reels |
| Xiaomi Smart Band 9 | Trending | Replaced Band 8 as the #1 fitness band |
| Ambrane Unbreakable Cable | Budget | "Unbreakable" went viral — ₹199 price point |
| boAt Lunar Fit Smartwatch | Student | Sub-₹2,000 with GPS — students going crazy |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, GA4 slot, providers
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Design system, custom utilities
│   ├── opengraph-image.tsx     # Dynamic OG image (Edge Runtime)
│   ├── sitemap.ts              # Auto-generates /sitemap.xml
│   ├── robots.ts               # Auto-generates /robots.txt
│   ├── not-found.tsx           # Custom 404
│   ├── admin/page.tsx          # Full admin CRUD + analytics
│   ├── search/page.tsx         # Search + filter + sort
│   ├── blog/page.tsx           # Blog index
│   ├── blog/[slug]/page.tsx    # Dynamic article + related products
│   ├── categories/
│   │   ├── trending/page.tsx
│   │   ├── student/page.tsx
│   │   ├── budget/page.tsx
│   │   └── ai-tools/page.tsx
│   └── api/
│       ├── subscribe/route.ts  # Newsletter (Mailchimp/ConvertKit ready)
│       ├── track/route.ts      # Server-side click logging
│       └── products/route.ts   # Products REST API
├── components/
│   ├── Navbar.tsx              # Sticky, search modal, mobile menu
│   ├── ProductCard.tsx         # Star ratings, benefits, badges, CTA
│   ├── Section.tsx             # Reusable section with grid
│   ├── Footer.tsx              # Newsletter form, links, disclaimer
│   └── ui/
│       ├── Toast.tsx           # Toast notification system
│       ├── CookieBanner.tsx    # GDPR cookie consent
│       ├── ScrollToTop.tsx     # Back-to-top button
│       └── SkeletonCard.tsx    # Loading skeleton cards
├── data/
│   ├── products.json           # 20 real Indian products
│   └── blog.json               # 3 full SEO articles
├── hooks/
│   └── useLocalStorage.ts      # SSR-safe localStorage hook
├── lib/
│   ├── firebase.ts             # Full Firebase Firestore + Auth setup
│   └── utils.ts                # trackClick, searchProducts, cn, etc.
└── types/
    └── index.ts                # TypeScript types for all entities
```

---

## 🌐 Deploy to Vercel

```bash
# Option A — Vercel CLI
npm i -g vercel
vercel --prod

# Option B — GitHub Integration (recommended)
# 1. Push to GitHub
# 2. Go to vercel.com → Import Repository
# 3. Add env variables from .env.example
# 4. Deploy
```

---

## 📄 License
MIT — free to use, modify, and deploy for your affiliate site.

Built with ❤️ for Indian students.
