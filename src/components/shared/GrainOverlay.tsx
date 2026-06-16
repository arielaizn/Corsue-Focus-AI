/**
 * GrainOverlay — fixed, full-viewport film-grain texture.
 *
 * The #1 material that makes a dark UI read as "shot on film / expensive"
 * rather than flat CSS. SVG feTurbulence noise at ~4% opacity, mix-blend
 * overlay, pointer-events none, sits ABOVE the nebula and BELOW content.
 * Endorsed by `bolder` as a premium texture (NOT the banned sketchy SVG).
 *
 * Pure CSS/SVG — no JS, no motion, safe under reduced-motion.
 */
export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[var(--z-base)] overflow-hidden"
      style={{ mixBlendMode: "overlay", opacity: 0.04 }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="cf-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cf-grain)" />
      </svg>
    </div>
  );
}

export default GrainOverlay;
