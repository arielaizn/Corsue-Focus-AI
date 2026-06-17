# OBSIDIAN COUTURE — marketing re-skin (supersedes PREMIUM.md for the marketing look)

> The user found the previous "Midnight Atelier" look (deep navy + glowing blue/violet/magenta nebula + particles) to be **AI-slop** — and they are right: a glowing purple-blue haze on dark is THE saturated AI tell of 2026. This re-skin replaces it with genuine **couture luxury**: true neutral black, warm bone ink, a single thread of gold foil, **editorial typography**, and **vast restraint**. Reference houses: **Saint Laurent · A24 · MUBI · couture print**.
>
> NON-NEGOTIABLE: **NO nebula. NO glow. NO gradient blobs. NO particles. NO glassmorphism. NO gradient text. NO aurora gradients on chrome.** The animated glowing background is DELETED. Luxury here = space + type + foil + material, never effects. If a section looks like it could be "AI premium," it has failed — it must look like a couture house's printed prospectus.

Apply with impeccable discipline — first READ `.agents/skills/impeccable/reference/quieter.md`, `typeset.md`, and `brand.md`. This is a QUIETER + TYPESET pass, not a louder one.

## 1. Palette — Obsidian Couture (OKLCH)

True neutral black (chroma 0 — NOT navy, NOT purple-tinted). Warm bone ink. Gold is the ONLY accent and it is RARE (thin foil lines, small marks, one or two emphases per view). Blue-ink survives ONLY inside product-UI mockups as a tiny brand nod — never on page chrome/background.

```
/* Surfaces — true neutral black, depth via lightness only (chroma ~0) */
--bg:        oklch(0.145 0.000 0);    /* #0B0B0C page — true black, no hue */
--bg-deep:   oklch(0.110 0.000 0);    /* #060607 footer/pockets */
--surface:   oklch(0.190 0.002 60);   /* raised panel — barely-warm charcoal */
--surface-2: oklch(0.240 0.003 60);   /* nested / hover */
--surface-3: oklch(0.300 0.004 60);   /* top elevation */
--line:      oklch(0.320 0.004 70);   /* neutral hairline (full borders only) */

/* Ink — warm bone (NOT pure white; couture warmth) */
--ink:       oklch(0.945 0.012 80);   /* #EDE8DE primary, ~16:1 on bg */
--ink-soft:  oklch(0.820 0.012 75);   /* secondary, ~9:1 */
--muted:     oklch(0.660 0.010 75);   /* labels/captions only, short lines, ~4.6:1 */

/* Gold — the single precious accent. Thin foil. RARE (~5% of the surface). */
--gold:      oklch(0.760 0.105 80);   /* #C9A24A foil */
--gold-bright:oklch(0.860 0.085 85);  /* #E3C07A highlight on the foil line */
--gold-deep: oklch(0.640 0.100 72);   /* #A07C32 */
--grad-gold: linear-gradient(100deg, oklch(0.64 0.10 72), oklch(0.80 0.10 82) 45%, oklch(0.90 0.07 88) 60%, oklch(0.64 0.10 72)); /* foil sheen for 1px rules ONLY */

/* Ink-blue — product-mockup accent ONLY (never page chrome). Keep restrained. */
--ink-blue:  oklch(0.55 0.11 250);
```
Contrast is law: body uses `--ink`/`--ink-soft`. `--muted` for short labels only. Gold text only large/bold (gold-on-black is high contrast — fine for a few display emphases and the wordmark accent). **Remove every --grad-aurora / violet / magenta usage from page chrome.**

## 2. Typography — editorial couture

Contrast axis (serif display + grotesque body), distinctive, NOT reflex fonts:
- **EN display:** **Bodoni Moda** (Google) — high-contrast fashion serif. Headlines/hero, large sizes only. Use its thin/thick drama. (Optical sizes; weights 400–700.)
- **EN body/UI:** **Hanken Grotesk** (Google) — clean modern grotesque. 400/500/600.
- **HE display:** **Frank Ruhl Libre** (Google) — elegant high-contrast Hebrew serif (editorial, classic). 500/700/900.
- **HE body:** **Assistant** (Google) — clean Hebrew grotesque. 400/500/600.
- Mono (API section only): keep Geist Mono.
Scale: dramatic editorial jumps. Hero display large but ≤ ~5.5rem; serif tracking near 0 (serifs don't want negative tracking like grotesques — use 0 to -0.01em). Generous line-height; light-on-dark +0.06. Measure 62–72ch. `text-wrap: balance` h1–h3. Small-caps gilt labels with letter-spacing for the FEW kicker/label moments (never on every section).

## 3. Background & materials (the part they hated — fixed)

- **Background = flat true-black canvas.** DELETE the Three.js nebula and all glow. The shared NebulaBackground component must be gutted to render a flat `--bg` field with, at most, an **ultra-subtle film grain (≤3%)** and an optional barely-perceptible top-to-bottom vignette toward `--bg-deep`. No WebGL, no color, no animation. Keep the component name/API so layouts don't break.
- **Gold foil hairlines** as section dividers and accents — 1px rules using `--grad-gold` (a thin gilt line is the signature, replacing all the glow).
- **Framed imagery:** product/UI mockups sit in elegant thin-bordered frames (1px `--line` or gilt), gallery-style, with restrained shadow (≤8px) — NOT glowing panels, NOT glass.
- **Material > effect:** depth from surface-lightness steps + fine grain + generous space + sharp framed mockups. No glassmorphism anywhere (the GlowCard primitive becomes a quiet framed panel, used rarely).
- Radii: small and architectural — 4–10px on cards/frames (couture is crisp, not bubbly). Pills only for tiny tags.

## 4. Layout — editorial, vast, asymmetric

- **Vast whitespace.** Vertical rhythm 120–220px between movements; let sections breathe. White space IS the luxury.
- **Asymmetric editorial grid** — break the centered-everything reflex. Large serif headline left/leading, supporting column trailing; full-bleed framed imagery; off-axis emphasis. (Vary per section.)
- Fine gilt rules separate movements. Refined small-caps section labels (sparingly).
- Mockups gallery-framed. Numbers/specs set as elegant editorial figures.

## 5. Motion — quiet & expensive

- Remove the animated glowing background entirely. Keep Lenis smooth scroll. Replace showy motion with **quiet typographic reveals** (fade/scale-in of headlines, gilt rule draw-in, a slow mask-reveal of a framed image) — ease-out-expo, deliberate, subtle. No bounce. No particles. Reduced-motion fallbacks intact. Restraint is the brand; some sections may have no entrance motion at all.

## 6. KILL-LIST (hunt every page, remove on sight)

nebula / Three.js glow background · any --grad-aurora / blue-violet-magenta gradient on chrome · glow/box-shadow ≥16px colored auras · glassmorphism / backdrop-blur decorative panels · gradient TEXT · particles · over-rounded cards (>10px) · uniform fade-rise on every section · eyebrow on every section / 01·02·03 · default purple buttons. Replace with: flat black canvas, gilt hairlines, framed mockups, serif display, vast space, solid bone/gold.

## 7. Scope

Re-skin the MARKETING site (src/app/[locale]/page.tsx + features/ai/pricing/community + src/components/{home,features,ai,pricing,community,shared,ui}). The token change in globals.css also flows to the dashboard — that is GOOD (it becomes a true-black/gold couture control room too); just verify the dashboard still reads well and passes contrast after. The marketing-vs-app structure is unchanged; only the look transforms.

## 8. Definition of done

Reads like a couture house, not "AI premium." Zero KILL-LIST items. WCAG-AA (bone on true-black; gold legibility verified). Both locales native (HE serif = Frank Ruhl Libre). Responsive 360/768/1024/1440, no overflow. Animations the user disliked (glowing background) are GONE; what remains is quiet and expensive. `npm run build` passes clean and the dashboard still works.
