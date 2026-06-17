import { ImageResponse } from "next/og";

// Branded Open Graph card (1200×630) — Obsidian Couture: true-black + gilt.
// Rendered with next/og's bundled font (Latin); brand is locale-agnostic so
// both /he and /en share one card.

export const alt = "CourseFocus AI — the operating system for your digital academy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GOLD = "#C8A45A";
const INK = "#F3EEE3";
const SOFT = "#B7B0A4";
const MUTED = "#6E6A62";
const BG = "#09090A";

// the cap mark, gilt strokes — same glyph as the in-app Logo
const CAP_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 48' fill='none'>
<path d='M28 7 L53 18 L28 29 L3 18 Z' stroke='${GOLD}' stroke-width='2' stroke-linejoin='round'/>
<path d='M14 22 V33 C14 33 19.5 39 28 39 C36.5 39 42 33 42 33 V22' stroke='${GOLD}' stroke-width='2'/>
<path d='M53 18 V37' stroke='${GOLD}' stroke-width='2' stroke-linecap='round'/>
<path d='M53 35.4 L54.3 38.7 L57.6 40 L54.3 41.3 L53 44.6 L51.7 41.3 L48.4 40 L51.7 38.7 Z' fill='${GOLD}'/>
</svg>`;

export default function Image() {
  const capSrc = `data:image/svg+xml;base64,${Buffer.from(CAP_SVG).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "78px 92px",
          fontFamily: "sans-serif",
        }}
      >
        {/* top: mark + ACADEMY OS */}
        <div style={{ display: "flex", alignItems: "center", gap: "26px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={capSrc} width={116} height={93} alt="" />
          <div style={{ display: "flex", width: "1px", height: "48px", background: GOLD, opacity: 0.55 }} />
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              letterSpacing: "0.34em",
              color: GOLD,
              textTransform: "uppercase",
            }}
          >
            Academy OS
          </div>
        </div>

        {/* center: wordmark + tagline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: "108px", fontWeight: 600, letterSpacing: "-0.02em" }}>
            <span style={{ color: INK }}>CourseFocus</span>
            <span style={{ color: GOLD, marginLeft: "20px" }}>AI</span>
          </div>
          <div style={{ display: "flex", marginTop: "30px", fontSize: "35px", lineHeight: 1.35, color: SOFT, maxWidth: "920px" }}>
            The operating system for your digital academy — community, courses, and business, run by one AI.
          </div>
        </div>

        {/* bottom: url + rule */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontSize: "25px", letterSpacing: "0.05em", color: MUTED }}>coursefocus.ai</div>
          <div style={{ display: "flex", width: "200px", height: "2px", background: GOLD, opacity: 0.5 }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
