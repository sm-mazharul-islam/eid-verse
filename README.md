# 🌙 EidVerse — Atmospheric Cinematic Greeting & Qurbani Storytelling Experience

EidVerse is a premium, cinematic web application that transcends typical greeting tools, creating an emotional and atmospheric journey for users to share blessings, compose relationship-customized 3D greeting cards, and celebrate the sacred season of Eid.

Currently running dynamically in **Eid al-Adha (Qurbani) Mode** or **Eid al-Fitr (Sheer Khurma) Mode** based on local systems calendars and URL search overrides!

---

## 🔗 Live Production Deployment
🚀 **Experience the Atmospheric Cinematic Platform Live:**
👉 **[https://eidverse-six.vercel.app](https://eidverse-six.vercel.app)** 🌙✨

*(Note: Automatically connects dynamically to your live MongoDB Atlas cloud database cluster!)*

---

## 🚀 Tech Stack & Design System
* **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) utilizing optimized server actions, lazy-loaded components, and static layout bindings.
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a custom luxury HSL dark/gold glassmorphic design token system.
* **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with dual-mode adaptability (**MongoDB Production** + **Local JSON Database Fallback**).
* **Animations**: Canvas Particle Starfields, floating SVG vector lanterns, and high-fidelity text-reveals engineered via [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/).
* **3D Graphics**: Procedural vector craters mapped onto a self-rotating canvas lunar mesh utilizing **Vanilla Three.js** (zero external asset requests!).
* **Audio Engine**: Luxury audio deck powered by [Howler.js](https://howlerjs.com/) with a **Web Audio API Oscillator synthesizer fallback** to dynamically generate chime sweeps and backing soundscapes if browser autoplay blocks audio files.
* **Capture Engine**: [html2canvas](https://html2canvas.hertzen.com/) executing pixel-perfect, double-resolution browser card visual rendering to high-res PNG downloads.

---

## 🌟 Core Features

### 1. Dual-Eid Adaptive Campaigns (`lib/eidDetector.ts`)
* Seamlessly detects active Eid seasons (Fitr vs. Adha/Qurbani) and automatically restyles the platform's color palette, minaret silhouettes, calligraphy headers, background music, and contextual assets.
* Support instant quick-toggle query hooks: **`?theme=adha`** and **``?theme=fitr`** for simple preview switches!

### 2. Guided 3D Card Generator Workspace (`components/sections/CardGenerator.tsx`)
* **From/To Twin Inputs**: Styled side-by-side matching inputs for personalized signatures.
* **Relationship Vibe Droplist**: Generates contextually relevant text templates tailored for:
  * *Friend / Close Buddy*
  * *Respectful Parent*
  * *Sibling (Funny & Heartfelt)*
  * *Spouse / Partner*
  * *Beloved Child*
  * *Honorable Teacher*
  * *Bangla Vibe 🐄* (Cattle market haat references & beef biriyani banter)
  * *Spiritual Sunnah 🌙* (Hardship, patience, and Ibrahim's (AS) devotion)
* **Textarea Sparkles shortcut ✨**: Quick-generator button inside the editor that pulls new random templates instantly.
* **Gold Shimmer Signature**: Renders `With Love & Respect: [Sender Name]` visually inside the canvas preview and dynamic shareable URLs.

### 3. Interactive Cattle Market & Share Calculator (Adha Special)
* **Illustrated Haat Map (`CattleMarket.tsx`)**: Interactive vector map of rural livestock markets in Bangladesh. Users click stalls to hear sound effects and read info cards about cattle breeds, market economy, feed, and recipes.
* **Three Shares Infographic (`ThreeShares.tsx`)**: Visual SVG breakdown representing the traditional distribution of Qurbani meat (1/3 Needy & Vulnerable, 1/3 Friends & Neighbors, 1/3 Immediate Family).

### 4. Community Wall & Moderation Desks (`app/admin`)
* **Memory Wall (`MemoryWall.tsx`)**: A Pinterest-style grid where users submit photos and stories about their Qurbani experiences, utilizing inline Base64 encoders to persist image files without requiring external cloud buckets!
* **Global Message Board (`GlobalWall.tsx`)**: Global community bulletin board where visitors write public greetings and flag their locations.
* **Console Moderation Tab**: Approved admins approve or reject stories and public posts, add new system blessings, and toggle their active state from a central administration control desk.

---

## 📂 Folder Architecture

```text
eidverse/
├── app/
│   ├── (main)/
│   │   ├── page.tsx               ← Campaign homepage (loads Intro and Campaign blocks)
│   │   └── layout.tsx             ← Dynamic layouts (Lanterns, parallax star fields, audio decks)
│   ├── admin/
│   │   ├── page.tsx               ← Main Admin Dashboard (Stats, moderation tables, blessings CRUD)
│   │   └── layout.tsx             ← Console Passcode authentication & bypass logic
│   ├── api/
│   │   ├── admin/                 
│   │   │   ├── moderate/          ← Moderate stories, wishes, blessings
│   │   │   └── stats/             ← Dashboard analytics and theme aggregates
│   │   ├── blessings/             ← CRUD endpoint for blessing messages
│   │   ├── cards/                 ← Card generator POST publishing handler
│   │   ├── db-check/              ← Database status checker route
│   │   └── wishes/                ← Personalized greeting endpoints
│   ├── card/
│   │   └── [id]/
│   │       └── page.tsx           ← Dynamic published card page (shows dynamic gold signature)
│   ├── wish/
│   │   └── [slug]/
│   │       └── page.tsx           ← Dynamic personal wish page
│   ├── layout.tsx                 ← Suspense boundaries and site root configurations
│   └── globals.css                ← Premium HSL styling tokens and keyframes
├── components/
│   ├── animation/                 ← Canvas Starfields, GSAP Intro Loader, Sparkles
│   ├── sections/                  ← Hero, CardGenerator, Timeline, CattleMarket, Infographics
│   └── ui/                        ← AudioControl, GoldenButton, Responsive Navbar
├── lib/
│   ├── db-fallback.json           ← Pre-seeded high-fidelity local database file
│   ├── eidDetector.ts             ← Season detection engine (Fitr vs. Adha)
│   ├── prisma.ts                  ← Robust dual-mode Prisma wrapper
│   └── wishTemplates.ts           ← Multi-relationship multilingual message template matrix
├── prisma/
│   └── schema.prisma              ← MongoDB Prisma schema
├── public/                        ← Static SVGs, custom audio MP3 chimes, font subsets
├── .env                           ← Connection settings and database overrides
├── package.json
└── tsconfig.json
```

---

## ⚙️ Quick Start Installation

### 1. Install Project Dependencies
In your root terminal workspace, run:
```bash
npm install
```

### 2. Initialize Prisma Client & Schema
After setting your live `DATABASE_URL` in `.env`, run the database push to configure indices:
```bash
npx prisma db push
```

### 3. Fire Up the Dev Server
Run the local dev compiler loop:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🔍 Database Diagnostics & Health Checks
Need to confirm whether your database configuration is correct? Open your browser and navigate to:
👉 **`http://localhost:3000/api/db-check`**

This dynamic API diagnostics tool will:
1. Identify if the application is running in **Mock Fallback JSON Mode** or **Live MongoDB Mode**.
2. Give you clear, actionable setup advice if your connection is offline.
3. Test-query the Prisma model to guarantee active data stream responses.

---

## 🔑 Administrative Login Info
* **Access Path**: Navigate to **``** in your browser.
* **Authentication**: Administrative passcodes are securely loaded from environment variables in your `.env` file (see `NEXT_PUBLIC_ADMIN_PASSCODE` and `NEXT_PUBLIC_ADMIN_PASSCODE_ALT`). Check your private `.env` file to customize or inspect these credentials.
