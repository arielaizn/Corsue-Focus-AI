import type { ReactNode } from "react";

/** Small, crisp stroked icons (currentColor). NOT hand-drawn/sketchy. */
const s = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const wrap = (children: ReactNode, size = 16) => (
  <svg {...s} width={size} height={size} aria-hidden>
    {children}
  </svg>
);

export const IconSpark = (p?: { size?: number }) =>
  wrap(<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />, p?.size);
export const IconBuild = (p?: { size?: number }) =>
  wrap(<><path d="M3 21h18" /><rect x="5" y="9" width="6" height="12" rx="1" /><rect x="13" y="4" width="6" height="17" rx="1" /></>, p?.size);
export const IconBook = (p?: { size?: number }) =>
  wrap(<path d="M4 5a2 2 0 0 1 2-2h10v16H6a2 2 0 0 0-2 2zM16 3h2a2 2 0 0 1 2 2v14" />, p?.size);
export const IconCheck = (p?: { size?: number }) =>
  wrap(<path d="M5 12l4 4L19 6" />, p?.size);
export const IconChat = (p?: { size?: number }) =>
  wrap(<path d="M21 12a8 8 0 0 1-8 8H5l-2 2V9a8 8 0 0 1 16 3z" />, p?.size);
export const IconTrophy = (p?: { size?: number }) =>
  wrap(<><path d="M8 4h8v4a4 4 0 0 1-8 0z" /><path d="M5 4h3v3a3 3 0 0 1-3-3M19 4h-3v3a3 3 0 0 0 3-3M12 12v4M9 20h6M10 16h4l1 4H9z" /></>, p?.size);
export const IconChart = (p?: { size?: number }) =>
  wrap(<><path d="M4 4v16h16" /><path d="M8 14l3-3 3 2 4-5" /></>, p?.size);
export const IconCard = (p?: { size?: number }) =>
  wrap(<><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18" /></>, p?.size);
export const IconCalendar = (p?: { size?: number }) =>
  wrap(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>, p?.size);
export const IconCode = (p?: { size?: number }) =>
  wrap(<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" />, p?.size);
export const IconFlame = (p?: { size?: number }) =>
  wrap(<path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-1 .5-2 1-2.5C9 10 8 8.5 8 7c2 1 3-1 4-4z" />, p?.size);
export const IconBolt = (p?: { size?: number }) =>
  wrap(<path d="M13 3 4 14h6l-1 7 9-11h-6z" />, p?.size);
export const IconPhone = (p?: { size?: number }) =>
  wrap(<><rect x="7" y="2" width="10" height="20" rx="2" /><path d="M11 18h2" /></>, p?.size);
export const IconUsers = (p?: { size?: number }) =>
  wrap(<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5.5a3 3 0 0 1 0 5.5M21 20a6 6 0 0 0-4-5.6" /></>, p?.size);
export const IconShield = (p?: { size?: number }) =>
  wrap(<path d="M12 3l8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" />, p?.size);
export const IconLink = (p?: { size?: number }) =>
  wrap(<><path d="M10 14a4 4 0 0 0 6 .5l2-2a4 4 0 0 0-6-6l-1 1" /><path d="M14 10a4 4 0 0 0-6-.5l-2 2a4 4 0 0 0 6 6l1-1" /></>, p?.size);
export const IconArrowR = (p?: { size?: number }) =>
  wrap(<path d="M5 12h14M13 6l6 6-6 6" />, p?.size);
