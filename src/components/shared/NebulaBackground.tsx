export interface NebulaBackgroundProps {
  /** Kept for API compatibility. Both variants render the same flat canvas. */
  variant?: "global" | "hero";
}

/**
 * Obsidian Couture canvas. The old Three.js nebula / glow / particles are
 * DELETED. This renders a FLAT true-black field (CSS only, no WebGL, no
 * animation) with, at most, a barely-perceptible vignette toward --bg-deep.
 * Film grain is provided separately by <GrainOverlay />.
 *
 * Name + API preserved so layouts/pages that mount <NebulaBackground> keep
 * working unchanged.
 */
export function NebulaBackground(_props: NebulaBackgroundProps) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden bg-bg"
    >
      {/* ultra-subtle vignette toward the deep black — seats content, no color */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(125% 120% at 50% 0%, transparent 58%, oklch(0.11 0 0 / 0.85) 100%)",
        }}
      />
    </div>
  );
}

export default NebulaBackground;
