# Design — CourseFocus AI

> Visual system for the brand site. Color strategy: **Drenched dark** — the surface IS deep planetarium-navy; blue→violet is the singing color; gold is the spotlight rim. Identity-preserving: anchored on the existing logo (graduation cap + star wand on deep navy), so logo colors win over any generated seed.

## Scene sentence

A planetarium at midnight: a deep navy dome, a single gold constellation tracing a graduation cap and a wand-star, violet–blue nebula light breathing behind it. Premium, calm, awake. The viewer is the operator at the center of the room.

## Theme

Dark, always. Not "dark because tools look cool" — dark because the brand is literally deep space + gold starlight (the logo). There is no light mode; the drench is the identity.

## Color — OKLCH tokens

Define these as CSS custom properties in `globals.css` and map into Tailwind theme. **Use OKLCH literally.** Contrast verified against `--bg`.

```
/* Surfaces (deep-space navy ramp) */
--bg:          oklch(0.16 0.045 264);   /* page void */
--bg-deep:     oklch(0.12 0.040 264);   /* darkest pockets, footer */
--surface:     oklch(0.21 0.050 265);   /* raised panels */
--surface-2:   oklch(0.26 0.055 266);   /* hover / nested raise */
--line:        oklch(0.34 0.045 266);   /* hairline borders (full borders only) */

/* Ink */
--ink:         oklch(0.97 0.012 250);   /* primary text — cream-white, ~16:1 on bg */
--ink-soft:    oklch(0.86 0.018 255);   /* secondary text, ~10:1 */
--muted:       oklch(0.74 0.030 260);   /* muted captions — KEEP ≥0.72 L, ~5:1 on bg */

/* Brand — blue→violet (the "AI" gradient) */
--primary:     oklch(0.62 0.20 264);    /* royal blue */
--primary-bright: oklch(0.70 0.18 262);
--violet:      oklch(0.60 0.25 300);    /* AI violet */
--violet-bright: oklch(0.68 0.22 302);

/* Accent — gold (cap trim, star, tassel): the spotlight rim */
--gold:        oklch(0.82 0.135 84);
--gold-soft:   oklch(0.88 0.09 88);
--gold-deep:   oklch(0.70 0.14 70);

/* Brand gradient (USE ON FILLS/BORDERS/GLOW — NEVER on text) */
--grad-aurora: linear-gradient(135deg, oklch(0.62 0.20 264), oklch(0.60 0.25 300));
--grad-gold:   linear-gradient(120deg, oklch(0.70 0.14 70), oklch(0.88 0.09 88));
```

Contrast rules (hard): body `--ink`/`--ink-soft` on `--bg`/`--surface` only. `--muted` is for ≥16px or short captions, never long paragraphs. Gold text only at large/bold sizes on dark (gold on navy is high-contrast and on-brand for emphasis numbers, kickers-used-sparingly, the wordmark accent).

## Typography

Two real systems, one per language. Distinctive on a contrast axis; not reflex-list fonts.

- **English display:** **Clash Display** (Fontshare) — geometric grotesque with character. Weights 600/700. Hero + section headings.
- **English body/UI:** **General Sans** (Fontshare) — clean neutral humanist-grotesque. Weights 400/500/600.
- **Hebrew (display + body):** **Rubik** (Google Fonts) — chosen deliberately (not by reflex) for first-class Hebrew glyphs, full weight range, and slightly rounded terminals that echo the logo's soft 3D forms. Display 700/800/900, body 400/500.
- **Mono — scoped ONLY to the Developer/API/Automation section:** **Geist Mono** (or JetBrains Mono). Justified by the literal API/webhook/code content; do not use mono elsewhere (brand ban: mono-as-costume).

Load Fontshare via `<link>` to `https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=general-sans@400,500,600&display=swap`. Rubik + Geist Mono via Google Fonts (or next/font).

Scale: fluid `clamp()`, ≥1.25 ratio. **Hero display clamp max ≤ 6rem (96px). Display letter-spacing floor −0.04em** (do not go tighter). `text-wrap: balance` on h1–h3, `pretty` on prose. Light-on-dark: +0.06 line-height. Body measure 60–72ch.

In RTL, set `direction: rtl` and use logical properties throughout; Rubik for all Hebrew text. The locale toggle swaps the active family + dir.

## Layout

- Max content width ~1240px; generous fluid vertical rhythm with `clamp()`, varied per section (don't uniform-pad).
- **Vary the feature presentation** — the 50 capabilities must NOT be one repeated card grid. Use a different device per cluster: bento mosaic, horizontal scroll rail, alternating split, orbit/constellation diagram, tabbed deep-dive, marquee, accordion, stat-led panel. Art-direction per section is encouraged (brand permission).
- Cards: radius **12–16px** (never 24/28/32+). Hairline `--line` full borders only — **never side-stripe borders**, never `1px border + box-shadow ≥16px blur` on the same element. Pick one: a single solid border OR a defined shadow ≤8px, plus the brand's soft outer glow when intentional.
- Semantic z-index scale: `--z-base 0 / --z-raised 10 / --z-sticky 100 / --z-nav 200 / --z-backdrop 900 / --z-modal 1000 / --z-toast 1100`. No 9999.
- Responsive: `repeat(auto-fit, minmax(280px,1fr))` for fluid grids; test every heading at 360 / 768 / 1024 / 1440 — no overflow in either direction.

## Signature visual motifs (the brand's distinctive moves)

1. **The Nebula** — a Three.js starfield + soft volumetric blue-violet nebula behind the hero (and as a faint global backdrop), with drifting gold particles. Reduced-motion → static CSS radial-gradient nebula.
2. **The Constellation** — gold lines that draw a graduation-cap / wand-star figure (SVG `stroke-dashoffset` drawn on scroll via GSAP). Used in the hero and as a section divider motif.
3. **Gold spotlight rim** — key panels/buttons get a thin gold or aurora rim-light + soft outer glow (not glass). This is the "spotlight" of the planetarium.
4. **Aurora gradient fills** — blue→violet used on primary buttons, progress/XP bars, orbit rings, and glows. Never as text fill.
5. **Orbit system** — the AI sits at the center; capabilities orbit it (used on Home "Academy OS" section and the AI page) — a literal picture of "central AI runs everything."

## Components (shared, built once by foundation)

`Button` (primary = aurora fill + gold-rim on hover, magnetic; secondary = hairline outline; ghost), `SectionHeading` (kicker used *sparingly* and named, not on every section), `Reveal` (intersection-based, enhances already-visible content — never gates visibility), `Magnetic`, `Stat`/`Counter`, `Tag`/`Pill` (full-pill ok), `NebulaBackground`, `Constellation`, `SmoothScroll` (Lenis), `LocaleToggle`, `Nav` (floating, condenses on scroll), `Footer`, `OrbitDiagram`, `GlowCard` (the one place a faint glass+glow panel is allowed, used purposefully).

## Motion

- **Lenis** smooth scroll. **GSAP + ScrollTrigger** for choreography (hero parallax, constellation draw, counters, horizontal rail, pinned sequences). **Framer Motion** (`motion/react`) for component micro-interactions. **Three.js** for the nebula only.
- Easing: ease-out-expo / quint. No bounce, no elastic.
- Stagger within a list is fine; do NOT apply one identical fade to every section (the uniform reflex). Each reveal fits what it reveals.
- Reveals enhance an already-visible default; never `opacity:0` gated on a JS class that can fail in headless render.
- `prefers-reduced-motion: reduce` → crossfade/instant; Three.js → static gradient; GSAP draws → final state shown.
- Premium materials allowed when they earn it: blur, mask, clip-path, shadow/glow.

## Imagery

Brand site → must ship real imagery, not colored divs. Sources:
1. **The logo** — `public/logo.png` (transparent) + `public/logo-bg.png` (with navy bg). Primary hero/nav mark. (User supplies the two PNGs; a built SVG wordmark is the fallback until then.)
2. **Generated/WebGL scenes** — the nebula + constellation ARE imagery (canvas/WebGL counts).
3. **Product UI mockups** — render *credible in-browser UI mockups* (dashboard, AI chat, course builder, community feed, XP/leaderboard, certificate) as real HTML/SVG components, dark-themed and on-brand — these are the "screenshots" that prove the OS is real. Do NOT use sketchy hand-drawn SVG (banned).
4. Optional Unsplash atmospheric textures (verify URLs) only if needed; prefer WebGL + UI mockups.

## Absolute bans (enforced — refuse-and-rewrite)

Gradient text · default glassmorphism · hero-metric template · identical card grids · uppercase tracked eyebrow on every section · 01/02/03 numbered scaffolding · side-stripe borders · `border:1px + box-shadow≥16px` ghost-cards · radius ≥24px on cards/inputs · hand-drawn/sketchy SVG illustrations · `repeating-linear-gradient` stripe backgrounds · text overflow at any breakpoint · meta-criticism copy · mono as generic "techy" shorthand · rounded-icon-above-every-heading template.

## AI-slop test

If someone could say "an AI made that" with no doubt, it failed. Category-reflex check: an edu/SaaS brief must NOT resolve to the obvious (cream minimal, or purple-gradient-on-white, or teal course-site). We resolve to *deep-space planetarium + gold constellation + central-AI-orbit* — a committed, named, distinctive lane.
