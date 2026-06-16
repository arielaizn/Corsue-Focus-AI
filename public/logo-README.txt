CourseFocus AI — logo assets
============================

Drop your two brand PNGs here so the site uses your real mark:

  public/logo.png      → the transparent-background logo (graduation cap +
                         star wand). Used in the Nav, Footer, hero, and CTA.
                         Recommended: square-ish, >= 160px tall, transparent PNG.

  public/logo-bg.png   → the same logo on the deep-navy background. Used as the
                         Open Graph / social-share image (1200x630 looks best,
                         but any ratio works).

Until these files exist, the code degrades gracefully:
  - <Logo /> falls back to the built SVG wordmark (public/wordmark.svg / inline).
  - Open Graph falls back to /favicon.svg.

Nothing breaks if the PNGs are missing — the build always passes.
