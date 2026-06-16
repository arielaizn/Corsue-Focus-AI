# BUILD CONTRACT — CourseFocus AI brand site

This is the **single source of truth** that every workflow agent obeys so parallel work never collides. Read PRODUCT.md + DESIGN.md first; this file governs *architecture, file ownership, and content*.

---

## 1. Stack

- **Next.js (App Router, TypeScript)** — scaffolded with `create-next-app` (already present at repo root). `src/` dir, import alias `@/*`, ESLint on.
- **Tailwind CSS v4** (the create-next-app default) — tokens via `@theme` in `globals.css`. Escape hatch: arbitrary values `text-[var(--ink)]` + a few `@layer utilities` classes if v4 mapping fights you.
- **Motion libs:** `gsap` (+ ScrollTrigger), `lenis` (smooth scroll), `three` (+ `@types/three`, nebula only), `motion` (Framer Motion, import from `motion/react`). Utils: `clsx` + `tailwind-merge`.
- Render target: static-export-friendly (`generateStaticParams` for locales). Deploy: Vercel or `next build`.

## 2. Internationalization (HE default RTL, EN LTR)

- Locales: `['he','en']`, **default `he`**. `dir`: `he → rtl`, `en → ltr`.
- Routing: all pages live under `src/app/[locale]/...`. `src/middleware.ts` redirects locale-less paths to `/he`.
- `src/app/layout.tsx` = minimal root: `export default function RootLayout({children}){return children}` (NO html/body here).
- `src/app/[locale]/layout.tsx` renders `<html lang={locale} dir={dir(locale)}>…<body className={locale==='he'?'font-he':'font-en'}>`, `generateStaticParams()` → `[{locale:'he'},{locale:'en'}]`, wraps: `SmoothScroll > NebulaBackground(global, faint) > Nav > {children} > Footer`.
- **Content model (NO central JSON — prevents write races):** each page owns `src/content/<page>.ts` exporting a typed `{ he: {...}, en: {...} }`. The page picks `content[locale]`. Shared chrome strings live in `src/lib/dictionary.ts`.
- Voice: **Hebrew = warm, human, confident** (never AI-translated stiffness). **English = crisp, global, declarative.** Both: short sentences, no hype words ("revolutionary", "game-changer", "!!!").

## 3. Design tokens (foundation builds in `globals.css`)

OKLCH per DESIGN.md. Tailwind utilities that MUST resolve: `bg-bg bg-bg-deep bg-surface bg-surface-2 border-line text-ink text-ink-soft text-muted text-gold text-primary text-violet`. Plus CSS vars `--grad-aurora`, `--grad-gold`, z-scale, and font vars `--font-display` (Clash Display), `--font-en` (General Sans), `--font-he` (Rubik), `--font-mono` (Geist Mono). Fonts: `next/font/google` for Rubik + Geist_Mono; a `<link>` to `https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=general-sans@400,500,600&display=swap` for the English pair.

## 4. File-ownership matrix (DO NOT cross these lines)

| Owner | May create/edit ONLY |
|---|---|
| **Foundation** | scaffold, `package.json`, configs, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/middleware.ts`, `src/lib/**`, `src/components/shared/**`, `src/components/ui/**`, `public/**` (incl. logo fallback), and **stub** `page.tsx` for all 5 routes |
| **Home** | `src/app/[locale]/page.tsx`, `src/content/home.ts`, `src/components/home/**` |
| **Features** | `src/app/[locale]/features/page.tsx`, `src/content/features.ts`, `src/components/features/**` |
| **AI** | `src/app/[locale]/ai/page.tsx`, `src/content/ai.ts`, `src/components/ai/**` |
| **Pricing** | `src/app/[locale]/pricing/page.tsx`, `src/content/pricing.ts`, `src/components/pricing/**` |
| **Community** | `src/app/[locale]/community/page.tsx`, `src/content/community.ts`, `src/components/community/**` |
| **Integrate / Polish** | anything, but only to fix build/type/lint/RTL/contrast defects |

Page agents **import** primitives from `@/components/ui` and `@/components/shared` and **must not modify them**. Need a new visual? Build it as a LOCAL component inside your own `components/<page>/` folder.

## 5. Primitive component API (foundation builds; pages consume)

- `Button({variant:'primary'|'secondary'|'ghost', size:'md'|'lg', href?, magnetic?, iconRight?, children})` — primary = aurora fill, gold rim-glow on hover.
- `Tag({children, tone?})` — full-pill label.
- `SectionHeading({kicker?, title, subtitle?, align?})` — kicker is OPTIONAL and must NOT appear on every section (anti-eyebrow rule).
- `Reveal({children, y?, delay?, as?})` — intersection reveal that ENHANCES already-visible content (no visibility gating; reduced-motion = no transform).
- `Magnetic({children, strength?})`, `Counter({to, prefix?, suffix?, decimals?})`.
- `GlowCard({children})` — the ONE sanctioned glass+glow panel; use purposefully, not as default card.
- `OrbitDiagram({centerLabel, items:[{label,icon?}]})` — central AI with orbiting capabilities (signature motif).
- `Marquee({items, reverse?})`.
- `BrowserFrame({children, url?})`, `PhoneFrame({children})` — dark chrome wrappers for UI mockups.
- `NebulaBackground({variant?})`, `Constellation()`, `SmoothScroll({children})`, `LocaleToggle({current})`, `Nav({locale})`, `Footer({locale})`, `CTASection({locale})`.

Mockups (dashboards, chat, feed, course builder, certificate, XP/leaderboard) are built as **real dark-themed HTML/SVG** inside each page's own folder — never sketchy hand-drawn SVG, never colored-div placeholders.

## 6. Pages → features → bilingual copy seeds

> Agents may expand body copy in-voice, but keep these headline seeds and the feature terminology from the glossary (§8). Every page ends with the shared `<CTASection/>`. Vary layouts per DESIGN.md — never one repeated card grid.

### HOME (`/[locale]`) — cinematic long scroll, the showpiece
1. **Hero** — logo mark + wordmark + tagline. HE title: "מערכת ההפעלה לאקדמיה הדיגיטלית שלך." EN: "The operating system for your digital academy." Sub HE: "אקדמיה, קהילה ועסק מנויים — מנוהלים על ידי AI מרכזי אחד. בדקות, לא בחודשים." EN: "An academy, a community, and a subscription business — run by one central AI. In minutes, not months." CTAs: "בנה את האקדמיה שלך"/"Build your academy" + "סיור במערכת"/"Take the tour". Nebula + constellation behind.
2. **Trust marquee** — integrations + AI models (glossary §8.K). HE eyebrow allowed once: "מחובר לכל מה שאתה כבר משתמש בו" / "Connected to everything you already use".
3. **8→1 reframe** — HE: "במקום שמונה כלים — מערכת הפעלה אחת." EN: "Eight tools become one OS." Short visual of tools collapsing into one orb.
4. **Academy in one click** (#1 + White-Label) — split with a live "create academy" mock panel (name / logo / brand colors / subdomain / language / currency / timezone). HE: "אקדמיה ממותגת בלחיצה." EN: "A fully-branded academy in one click."
5. **The central AI — Academy OS orbit** (#50, #2,#3,#4) — `OrbitDiagram`, AI core center, capabilities orbiting. HE: "AI אחד מנהל הכול." EN: "One AI runs everything." THE signature section.
6. **Six pillars** (bento, links to deep pages) — Build · AI Layer · Community · Gamification · Monetization · Platform.
7. **AI builds your course** (#3,#13) — animated prompt → generated syllabus/modules/lessons/quiz. HE: "מפרומפט אחד — קורס שלם." EN: "One prompt → a full course."
8. **Gamification glimpse** (#19–26) — XP bar, level, streak, badges, mini leaderboard. Elegant, aspirational.
9. **Analytics + AI Business Advisor** (#28,#29) — MRR/ARR/Churn/LTV dashboard mock + an AI advisory line.
10. **Marketplace + Mobile + API teaser** (#41,#42,#43) — three-up varied.
11. **Closing CTA** — HE: "האקדמיה שלך. המותג שלך. ה-AI שלך." EN: "Your academy. Your brand. Your AI." → Build CTA, constellation finale.

### FEATURES (`/[locale]/features`) — the full 50 in 10 art-directed clusters
Hero HE: "כל מה שאקדמיה צריכה. כלום מעבר." EN: "Everything an academy needs. Nothing it doesn't." Clusters (each a DISTINCT layout — see DESIGN.md devices):
- **C1 Academy & White-Label** (#1) — split + create panel
- **C2 The AI Suite** (#2,3,4,8,9,11,13,18,25,29,30,40,46,47,48,49) — dense tabbed/orbit grid + "see the AI page →"
- **C3 Courses · Lessons · Video** (#5,6,7) — feature rail + `BrowserFrame` video-player mock (speed, chapters, captions, AI transcript, AI summary, PiP)
- **C4 Assessments & Certificates** (#10,11,12,13,14) — quiz mock + certificate mock w/ QR verify
- **C5 Community & Messaging** (#15,16,17) — feed + chat mock
- **C6 Gamification** (#19–26) — XP/levels/streaks/badges/leaderboards/challenges panel
- **C7 Analytics** (#27,28,29,30) — student + owner dashboards
- **C8 Monetization** (#31,32,33,34,35,36,37) — payments/subscriptions/coupons/affiliate/CRM/email/push
- **C9 Operations** (#38 calendar, #39 live classes) — calendar + live mock
- **C10 Platform & Developer** (#41 marketplace, #42 mobile, #43 API, #44 webhooks, #45 automation) — API code block (MONO allowed here) + automation node-graph + `PhoneFrame` mock

### AI (`/[locale]/ai`) — deep dive on the central AI
Hero HE: "AI שמנהל את כל האקדמיה — ומלמד כל תלמיד אישית." EN: "An AI that runs the whole academy — and tutors every student personally." Sections (varied two-column narrative + mock chat panels), one per capability: Academy Builder (#2), Course Generator (#3), Curriculum Designer (#4, Beginner→Expert path viz), Lesson Assistant (#8), Personal Tutor (#9), Assignment Reviewer (#11), Exam Generator (#13), Community Manager (#18), Business Advisor (#29) + Growth Coach (#30), Content Studio (#40), Daily AI Tasks (#25), **Multi-AI Layer** (#46 — GPT/Claude/Gemini/Grok/DeepSeek/Mistral/Llama selectable), **Knowledge Base** (#47 — upload PDF/Word/PPT/site → it learns), **Voice Coach** (#48), **Mentor Network** (#49 — multiple named mentors). Reuse `OrbitDiagram` hero.

### PRICING (`/[locale]/pricing`)
Hero HE: "האקדמיה שלך. בבעלותך מהיום הראשון." EN: "Your academy. Yours from day one." Monthly/Annual toggle (annual = 2 months free). Tiers (ILLUSTRATIVE — mark editable):
- **Starter** — HE ₪0 / EN $0: 1 academy, up to 50 students, core courses+community, CourseFocus badge.
- **Pro** — HE ₪199/mo / EN $49/mo: white-label, unlimited courses, full AI suite, gamification, payments.
- **Scale** — HE ₪549/mo / EN $139/mo: multiple academies, advanced analytics, automations, API, affiliate, priority AI models.
- **Enterprise** — "Custom": SSO, dedicated AI, mobile apps, SLA.
Plus: Lifetime mention (#32), feature comparison table (bilingual), coupons (#33) + affiliate (#34) callout, FAQ, payment-provider strip (SUMIT/Stripe/PayPal/Tranzila/Pelecard).

### COMMUNITY (`/[locale]/community`)
Hero HE: "כאן האקדמיה שלך מתעוררת לחיים." EN: "Where your academy comes alive." Sections: Community Feed (#15, feed mock w/ posts/comments/likes/mentions/hashtags), Groups (#16, public/private/VIP), Messaging (#17, 1:1/group/files/voice/video chat mock), AI Community Manager (#18), full Gamification (#19–26: XP, Levels 1–100, Streaks, Badges wall, Leaderboards daily/weekly/monthly/all-time, Challenges, Daily AI tasks, public Profiles #26), Live Classes (#39, Zoom/Meet/Teams) + Calendar (#38). Feed-led with real mock community UI.

## 7. Nav / Footer / CTA (shared, foundation owns)

- **Nav** links: Home / Features / AI / Pricing / Community + `LocaleToggle` + primary `Button` "בנה אקדמיה"/"Build academy". Floating, condenses + gains backdrop on scroll. Logo on the leading side (right in RTL).
- **Footer**: wordmark + one-line mission, columns (Product / AI / Platform / Company), locale toggle, payment + AI-model logos row, copyright "© CourseFocus AI". Deep `bg-bg-deep`.
- **CTASection** (reused at the bottom of every page): big aurora panel, HE "מוכן להקים אקדמיה?" / EN "Ready to build your academy?" + Build CTA + constellation accent.

## 8. Glossary — the 50 features, bilingual terminology (use these exact terms)

A. Academy creation (#1) — "יצירת אקדמיה בלחיצה" / "One-click academy"; White-Label "לייבל לבן מלא" / "Full white-label".
B. AI Academy Builder (#2) — "בונה אקדמיה ב-AI" / "AI Academy Builder".
C. AI Course Generator (#3) — "מחולל קורסים ב-AI" / "AI Course Generator".
D. AI Curriculum Designer (#4) — "מעצב מסלולי למידה" / "AI Curriculum Designer" (Beginner→Intermediate→Advanced→Expert).
E. Courses (#5) — types: חינמי/חד-פעמי/מנוי/VIP/סגור/קבוצתי = Free/One-time/Subscription/VIP/Private/Cohort; drip/date/progress/XP unlocking.
F. Lessons (#6) — Video/Audio/PDF/PPT/Images/Text/Embed/Links; notes, bookmarks, summaries, comments.
G. Advanced video player (#7) — speed, bookmarks, chapters, captions, AI transcript, AI summary, PiP, AirPlay, Chromecast.
H. AI Lesson Assistant (#8); AI Tutor (#9); Assignments (#10); AI Assignment Reviewer (#11); Exams (#12); AI Exam Generator (#13); Certificates (#14, QR verification).
I. Community (#15); Groups (#16); Messaging/Chat (#17); AI Community Manager (#18).
J. Gamification — XP (#19), Levels 1–100 (#20), Streaks (#21), Badges (#22), Leaderboards (#23), Challenges (#24), Daily AI tasks (#25), Profiles (#26).
K. Analytics — student (#27); owner dashboard MRR/ARR/Retention/Churn/LTV/CAC (#28); AI Business Advisor (#29); AI Growth Coach (#30).
L. Monetization — Payments SUMIT/Stripe/PayPal/Tranzila/Pelecard (#31); Subscriptions monthly/annual/lifetime (#32); Coupons (#33); Affiliate (#34); CRM (#35); Email marketing (#36); Push (#37).
M. Ops — Calendar (#38); Live classes Zoom/Google Meet/Teams (#39); AI Content Studio (#40).
N. Platform — Marketplace (#41); Mobile apps iOS/Android, offline, downloads (#42); Developer API (#43); Webhooks (#44); AI Automation Builder à-la Make/Zapier (#45).
O. AI layer — Multi-AI: GPT/Claude/Gemini/Grok/DeepSeek/Mistral/Llama (#46); Knowledge Base PDF/Word/PPT/site (#47); Voice Coach (#48); Mentor Network (#49); **Academy OS** vision (#50).

## 9. Definition of done (every page)

Responsive (360/768/1024/1440, no overflow either dir) · both locales render & read native · WCAG-AA contrast on dark · keyboard + focus-visible · reduced-motion fallbacks · no impeccable banned pattern · imagery is real (WebGL/mock UI, not colored divs) · `npm run build` passes clean.
