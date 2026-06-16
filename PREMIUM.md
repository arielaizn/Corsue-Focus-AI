# PREMIUM ELEVATION — "Midnight Atelier"

> The brief for elevating the existing CourseFocus AI site to a **crazy-premium, luxury, anti-AI-slop** feel. This is an ELEVATION pass, not a rebuild. **Preserve the scroll choreography, the nebula, the section structure, and the page content the user already loves.** Change the *materials, color, type, space, and motion-timing* — not the architecture. All primitive component APIs (BUILD_CONTRACT §5) stay identical so pages keep compiling.

Per impeccable `bolder`/`overdrive`/`colorize`: **premium ≠ more effects.** The biggest "AI made that" tells are flat 2-stop purple→blue gradients, default glassmorphism, gradient text, and a uniform fade-rise on every section. We KILL those and earn luxury through a committed logo-matched palette, decisive typographic contrast, real premium materials (film grain, gilt edges, dramatic soft depth), generous asymmetric space, and restrained, expensive motion.

---

## 1. Palette — Midnight Atelier (logo-exact, OKLCH)

Replace the token values in `globals.css`. Drenched-dark; surfaces carry the brand via lightness steps (dark-mode depth = lightness, not shadow). Neutrals tinted toward indigo (hue ~268). 60-30-10 by visual weight: **navy surfaces 60% · aurora 30% · gold ~10% (the jewel — keep it rare).**

```
/* Surfaces — deep-navy void ramp (lightness = elevation) */
--bg:        oklch(0.15 0.040 268);   /* #0A1124 page void */
--bg-deep:   oklch(0.11 0.035 268);   /* #070B1A footer/pockets */
--surface:   oklch(0.22 0.050 268);   /* #141C38 raised panel */
--surface-2: oklch(0.28 0.058 268);   /* #1E294B nested / hover */
--surface-3: oklch(0.34 0.060 267);   /* #28365E top elevation */
--line:      oklch(0.40 0.040 268);   /* indigo hairline (full borders only) */

/* Ink — warm cream (matches logo lettering) */
--ink:       oklch(0.96 0.012 92);    /* #F4F1EA  ~15:1 on bg */
--ink-soft:  oklch(0.88 0.016 250);   /* secondary, ~10:1 */
--muted:     oklch(0.745 0.030 268);  /* captions only; KEEP ≥0.74 L (~5:1) */

/* Aurora — the living signature (blue → violet → magenta, from the logo halo) */
--blue:      oklch(0.60 0.180 262);   /* #3B6FE0 */
--blue-bright:oklch(0.68 0.160 262);
--violet:    oklch(0.62 0.215 294);   /* #8B5CF6 */
--violet-bright:oklch(0.66 0.235 300);/* #A855F7 */
--magenta:   oklch(0.62 0.230 330);   /* #C44CD9  (the sparkle — use as the aurora's warm end) */

/* Gold — the precious accent (~10% max). The jewel, not the wallpaper. */
--gold:      oklch(0.83 0.130 88);    /* #ECC158 */
--gold-bright:oklch(0.90 0.100 92);   /* #F7E3A1 highlight */
--gold-deep: oklch(0.72 0.130 78);    /* #C9952E */

/* Brand gradients — MULTI-STOP & RICH (never flat 2-stop, never on text) */
--grad-aurora: linear-gradient(125deg, oklch(0.60 0.18 262), oklch(0.62 0.215 294) 52%, oklch(0.62 0.23 330));
--grad-gold:   linear-gradient(100deg, oklch(0.72 0.13 78), oklch(0.83 0.13 88) 38%, oklch(0.92 0.09 93) 60%, oklch(0.74 0.13 80));
--grad-nebula: radial-gradient(120% 90% at 70% 18%, oklch(0.30 0.12 300 / .55), transparent 60%),
               radial-gradient(90% 80% at 18% 8%, oklch(0.28 0.12 262 / .45), transparent 55%);
```

Contrast is HARD law: body copy uses `--ink`/`--ink-soft` only. `--muted` is captions/labels ≤ short lines. Gold text only at large/bold sizes on dark. Verify every change.

## 2. Premium materials (the luxury layer)

- **Film grain** (endorsed by `bolder`: grain/halftone/duotone, NOT glass). A fixed, full-viewport SVG `feTurbulence` noise overlay at **3–5% opacity**, `mix-blend-mode: overlay`, `pointer-events:none`, above the nebula and below content. This single texture is the #1 thing that makes dark UIs read as "shot on film / expensive" instead of "flat CSS." (This is a texture, NOT the banned sketchy-SVG illustration.)
- **Gilt edges**: thin gold hairlines and dividers using `--grad-gold` (1px rules, panel rim-lights, underline swooshes echoing the logo's gold underline). Gold as solid fill for small marks/icons. **Never** gradient *text*.
- **Dramatic depth**: elevation via surface-lightness steps + large, soft, low-alpha colored glows (aurora/gold) behind hero panels — `box-shadow: 0 40px 120px -40px oklch(0.55 0.20 290 / .45)`. Plus a tight ambient `0 1px 0 oklch(1 0 0 / .04)` top inner-light on raised panels (the "lit edge"). Avoid the ghost-card combo (1px border + ≥16px shadow on the SAME element — pick one).
- **Glass**: only via the sanctioned `GlowCard`, used purposefully (floating nav, one AI-chat panel). Not the default card.
- **Refined radii**: cards 12–16px, pills full. Never ≥24px.

## 3. Typography elevation

Keep the families (Clash Display + General Sans for EN, Rubik for HE, Geist Mono scoped to API). Push **contrast**, not new fonts:
- **Dramatic scale jumps** (3–5×, not 1.5×). Hero display clamp ceiling ≤ 6rem; sub-heads clearly smaller; captions small. Weight contrast: display 700 against body 400/500 (Hebrew Rubik 800/900 display vs 400/500 body).
- Display letter-spacing **≥ −0.04em** (floor; use −0.02 to −0.03 for tight grotesque — do not cramp).
- `text-wrap: balance` on h1–h3, `pretty` on prose. Light-on-dark: **+0.06 line-height.** Measure 60–72ch.
- One "precious" detail: a **gilt small-caps label** style for the few named kickers (used sparingly — NOT above every section).

## 4. Motion — expensive & restrained (keep what exists, refine it)

- **Keep** Lenis smooth-scroll, the GSAP/ScrollTrigger choreography, the Three.js nebula, and every existing scroll animation the user loves. **Do NOT remove animations or add a fade-rise to more sections.**
- **Refine timing**: ease-out-expo / quint (no bounce/elastic). Slightly longer, more deliberate hero durations (~700–900ms), tighter purposeful stagger. Expensive = slower & smoother, not faster.
- **Nebula upgrade**: add the **magenta** end to the aurora, drifting gold motes, gentle depth parallax — more cinematic, still calm and 60fps, still reduced-motion → static `--grad-nebula`.
- **One signature moment**: the hero constellation-draw + nebula reveal. Magnetic primary CTAs; a subtle gilt shimmer sweep across the primary button on hover.
- Reduced-motion fallbacks remain mandatory for everything.

## 5. Slop-removal checklist (hunt & KILL on every page)

1. Flat 2-stop purple→blue gradient → rich 3-stop `--grad-aurora` or a solid.
2. Default glass card → solid `--surface` + hairline/soft-depth (or sanctioned `GlowCard`).
3. Gradient text on any heading → solid `--ink`/`--gold`.
4. Uniform fade-rise on every section → vary the reveal to fit the content; remove reflexive ones.
5. Over-rounded cards (>16px) → 12–16px.
6. Ghost-card (1px border + ≥16px shadow together) → pick one.
7. Identical equal card grids → asymmetry, scale variation, bento, or a different device.
8. Muted/thin gray for body copy → `--ink`/`--ink-soft`.
9. Eyebrow kicker above every section / 01·02·03 scaffolding → remove; keep ≤2 named gilt kickers per page.
10. Flat dead areas → add grain, gilt hairline, or depth glow.

## 6. Per-area elevation

- **Hero**: the most cinematic moment — refined nebula (+magenta +grain), constellation draw, gilt wordmark/underline accent echoing the logo, dramatic type scale, one signature reveal. Generous space.
- **Sections**: asymmetric generous rhythm (vary 80–160px), gilt hairline dividers, premium material panels, mock UIs re-skinned darker with gold accents + soft depth + lit edges.
- **Nav**: floating, gilt hairline, refined backdrop on scroll, gold CTA.
- **Footer**: deep `--bg-deep`, gilt top-rule, gold mark.
- **CTA**: aurora panel with gilt rim + grain + soft aurora glow — the closing crescendo.

## 7. Definition of done

Every page reads **expensive at a glance**, passes WCAG-AA on dark, has zero items from §5, preserves the loved animations, both locales native, responsive 360/768/1024/1440 with no overflow, and `npm run build` passes clean. The exit test (`bolder`): if someone says "AI made this premium," it failed — it must read as a designed, branded, luxury product.
