import type { SVGProps } from "react";

// Small, crisp line/solid glyphs for the community mock UIs.
// Stroke-based, geometric — never hand-drawn/sketchy.

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size = 18) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
  };
}

export function HeartIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M12 20s-7-4.35-9.33-8.5C1.2 8.86 2.5 5.5 5.7 5.5c1.9 0 3.1 1.1 3.8 2.2.7-1.1 1.9-2.2 3.8-2.2 3.2 0 4.5 3.36 3.03 6C19 15.65 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CommentIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M4 5h16v11H9l-4 3v-3H4V5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ShareIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M4 12v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M12 15V4m0 0L8 8m4-4 4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PinIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M9 3h6l-1 6 3 3H7l3-3-1-6ZM12 15v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GlobeIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function LockIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CrownIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M4 8l3 3 5-6 5 6 3-3-2 11H6L4 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PaperclipIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M19 11.5 12 18.5a4 4 0 0 1-5.66-5.66l7.07-7.07a2.5 2.5 0 0 1 3.54 3.54l-7.07 7.07a1 1 0 0 1-1.42-1.42L14.5 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MicIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PhoneCallIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V18a2 2 0 0 1-2 2A14 14 0 0 1 3 6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VideoIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="6" width="13" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m16 10 5-3v10l-5-3v-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function SendIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M4 12 20 4l-6 16-2-7-8-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FlameIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M12 3c1 3-1.5 4-1.5 6.5C10.5 11 11 12 12 12s2-1 2-2.5C14 8 13 7 13 7s4 2.5 4 7a5 5 0 1 1-10 0c0-3 2-5 2-5 0 1.5 1 2 1.5 2C12 11 9 9 12 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function FileIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M14 3v5h5M6 3h8l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="m5 12 4.5 4.5L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrophyIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M7 4h10v3a5 5 0 0 1-10 0V4ZM7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M9 14h6l1 6H8l1-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BellIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M6 9a6 6 0 0 1 12 0c0 4.5 1.8 5.5 1.8 5.5H4.2S6 13.5 6 9ZM10 21a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClockIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function UsersIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3 20a6 6 0 0 1 12 0M16 5.2a3.2 3.2 0 0 1 0 6.1M17.5 20a6 6 0 0 0-2.2-4.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PinpointIcon({ size, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden>
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.6_0.13_25)] opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[oklch(0.62_0.16_25)]" />
      </span>
    </span>
  );
}

// Badge glyphs keyed by name, rendered in gold or muted.
export function BadgeGlyph({ glyph, size = 24 }: { glyph: string; size?: number }) {
  const common = base(size);
  switch (glyph) {
    case "star":
      return (
        <svg {...common}>
          <path
            d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.8 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3Z"
            fill="currentColor"
          />
        </svg>
      );
    case "flame":
      return <FlameIcon size={size} fill="currentColor" stroke="none" />;
    case "hands":
      return (
        <svg {...common}>
          <path
            d="M7 11V6a1.5 1.5 0 0 1 3 0v4m0-1V5a1.5 1.5 0 0 1 3 0v5m0-1V6a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-6 6h-1a5 5 0 0 1-4.3-2.5L3.5 13a1.4 1.4 0 0 1 2.2-1.7L7 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "trophy":
      return (
        <svg {...common}>
          <path
            d="M7 4h10v3a5 5 0 0 1-10 0V4ZM7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M9 14h6l1 6H8l1-6Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "crown":
      return <CrownIcon size={size} fill="currentColor" stroke="none" />;
    case "diamond":
      return (
        <svg {...common}>
          <path
            d="M6 3h12l3 5-9 13L3 8l3-5ZM3 8h18M9 3 6 8l6 13M15 3l3 5-6 13"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
  }
}
