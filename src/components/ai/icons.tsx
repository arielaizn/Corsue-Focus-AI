import type { SVGProps } from "react";

/**
 * Clean geometric icon set for the AI page mock UIs. Single-stroke,
 * currentColor, never sketchy/hand-drawn. 24x24 viewbox.
 */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconSpark(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8.5 13.4 11 16 12l-2.6 1L12 15.5 10.6 13 8 12l2.6-1L12 8.5Z" />
    </svg>
  );
}

export function IconBuild(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <path d="M17 13.5v7M13.5 17h7" />
    </svg>
  );
}

export function IconBook(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M4 5.5A2 2 0 0 1 6 4h6v15H6a2 2 0 0 0-2 2V5.5Z" />
      <path d="M20 5.5A2 2 0 0 0 18 4h-6v15h6a2 2 0 0 1 2 2V5.5Z" />
    </svg>
  );
}

export function IconTutor(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

export function IconReview(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      <path d="M14 4v5h5M8.5 14l2 2 4-4" />
    </svg>
  );
}

export function IconExam(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

export function IconCommunity(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <circle cx="8.5" cy="9" r="2.5" />
      <circle cx="16" cy="10" r="2" />
      <path d="M3.5 19a5 5 0 0 1 10 0M14 19a4.5 4.5 0 0 1 6.5-4" />
    </svg>
  );
}

export function IconChart(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16l3.5-4 3 2.5L20 8" />
    </svg>
  );
}

export function IconStudio(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="7" cy="9" r="1" />
      <circle cx="16.5" cy="9.5" r="1" />
      <circle cx="14.5" cy="16" r="1" />
    </svg>
  );
}

export function IconTasks(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M9 5h11M9 12h11M9 19h11" />
      <path d="m3.5 5 1.2 1.2L7 4M3.5 12l1.2 1.2L7 11M3.5 19l1.2 1.2L7 18" />
    </svg>
  );
}

export function IconLayers(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
      <path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" />
    </svg>
  );
}

export function IconUpload(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M12 16V5m0 0L8 9m4-4 4 4" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );
}

export function IconMic(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" />
    </svg>
  );
}

export function IconMentor(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M4 5h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-1-2V7a2 2 0 0 1 2-2Z" />
      <path d="M9 10h6M9 13h3" />
    </svg>
  );
}

export function IconArrow(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconPlay(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M8 5.5v13l11-6.5L8 5.5Z" />
    </svg>
  );
}

export function IconDoc(props: IconProps) {
  return (
    <svg {...base} aria-hidden {...props}>
      <path d="M6 3h8l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4" />
    </svg>
  );
}

export function IconTrendUp(props: IconProps) {
  return (
    <svg {...base} width={14} height={14} aria-hidden {...props}>
      <path d="M4 16 10 10l3 3 7-7M16 6h4v4" />
    </svg>
  );
}

export function IconTrendDown(props: IconProps) {
  return (
    <svg {...base} width={14} height={14} aria-hidden {...props}>
      <path d="M4 8 10 14l3-3 7 7M16 18h4v-4" />
    </svg>
  );
}
