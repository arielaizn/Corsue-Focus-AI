# Product — CourseFocus AI

## Register

brand

## Product

**CourseFocus AI — "Academy OS for Creators."** Not a course platform; an *operating system* that lets any creator, expert, or business stand up a fully branded digital academy — courses, community, subscriptions, gamification, a personal AI layer, mobile app, CRM, automations, analytics, and a marketplace — in minutes, all governed by a central AI that manages, analyzes, advises, and assists both the academy owner and every individual student.

Think: Udemy × Kajabi × Skool × Circle × Thinkific × Teachable × Notion AI × ChatGPT, collapsed into one AI-run control plane.

This repository is the **marketing/brand website** (multi-page): Home, Features, AI, Pricing, Community. Bilingual — Hebrew (RTL, default) and English (LTR) with a live toggle. The deliverable IS the design: a visitor's first impression must read as a category-defining, venture-backed product, not a template.

## Users

- **Primary — Creator-operators:** course creators, coaches, lecturers, agencies, and subject experts (Ariel's world: AI educators, studios, lecturers) who want to monetize knowledge and run a community without stitching 8 SaaS tools together. They are sophisticated, design-literate, time-poor, and allergic to "another generic SaaS."
- **Secondary — Businesses & academies:** companies running internal training, certification academies, or paid communities at scale who need white-label, analytics (MRR/Churn/LTV), CRM, and an API.
- **Tertiary — Students:** end-learners who experience the academies (relevant for the Community page and the AI Tutor narrative).

Context of use: evaluating whether to bet their business on this platform. They arrive skeptical, scroll fast, and decide in seconds whether this feels *real and powerful* or *vaporware*.

## Emotional goal

Awe, then trust. The page should feel like opening a door into a calm, intelligent, slightly magical control room — "this thing is alive and it runs everything for me." Confidence over hype. The magic is *earned* by showing the depth (50 capabilities) without overwhelming.

## Brand personality

**Intelligent · Magical · Sovereign.**
- *Intelligent* — the AI isn't a feature, it's the operating system. Quiet competence, never gimmicky.
- *Magical* — the logo is a graduation cap + a star-tipped wand. Education meets wizardry. Deep-space wonder, gold constellation light.
- *Sovereign* — you own your academy, your brand, your data, your students (white-label, your domain, your AI). Empowerment, not dependency.

Voice: assured, declarative, generous. Hebrew copy is human and warm (not AI-translated stiffness); English copy is crisp and global. Short, confident sentences. No exclamation-mark hype, no "revolutionary game-changer" filler.

## Anti-references

- **Generic SaaS-cream / purple-gradient-on-white landing pages** (the Linear/Stripe knockoff monoculture). We are dark, drenched, cinematic — not a light minimal dev-tool clone.
- **Course-platform clichés** — stock photos of smiling people at laptops, "Start learning today" hero, teal-and-orange. Avoid entirely.
- **AI-slop maximalism** — gradient text everywhere, glassmorphism on every card, rainbow blur blobs, 01/02/03 numbered eyebrows, identical icon-card grids repeated 10×. impeccable's absolute bans are hard rules here.
- **Crypto/Web3 neon-on-black** — we are premium and warm-gold, not cold cyber.
- **Childish edu-gamification** (Duolingo green, cartoon mascots). Gamification here is elegant and aspirational, not playground.

## Design principles

1. **Show the OS, don't list features.** 50 capabilities is the proof of an operating system — but present them as living systems with varied, art-directed layouts, never as one endless card grid. Each cluster gets its own visual world.
2. **The AI is the protagonist.** Every section should make the central AI feel present and intelligent — it builds, reviews, tutors, advises. The narrative thread is "an AI runs all of this."
3. **Earned magic.** Deep-space wonder and gold-constellation motion are the brand's signature, but motion is intentional and choreographed — never decoration for its own sake. Performance and reduced-motion are non-negotiable.
4. **Sovereignty made visible.** White-label, your-domain, your-AI: the design should make the owner feel like the monarch of their own academy, not a tenant.
5. **Bilingual with equal dignity.** Hebrew RTL is a first-class citizen, not a mirrored afterthought. Typography, line-breaks, and rhythm must feel native in both directions.

## Accessibility & Inclusion

- WCAG 2.1 AA. Body text ≥ 4.5:1, large text ≥ 3:1, verified against the dark surfaces (this is the #1 risk in a drenched-dark design — muted blue-gray text must stay light enough).
- Full keyboard navigation, visible focus-visible rings, semantic landmarks/headings, accessible names on icon buttons and the locale toggle.
- `prefers-reduced-motion`: every GSAP/Three.js/Framer animation has a static or crossfade fallback; the Three.js starfield degrades to a CSS gradient.
- RTL/LTR correctness: logical properties, `dir` on `<html>`, mirrored iconography only where directional meaning requires it.
- Color is never the sole carrier of meaning (XP/levels/status also use labels/icons).
