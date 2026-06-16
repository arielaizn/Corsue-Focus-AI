import type { Database } from "@/types/database.types";

/* ---------------------------------------------------------------------------
   ACADEMIES — pure, isomorphic helpers, types, and constants.
   Safe to import from BOTH client and server components (no "server-only",
   no next/headers). The server-only data reads/writes live in `academies.ts`,
   which re-exports everything here for backwards-compatible server imports.
--------------------------------------------------------------------------- */

export type Academy = Database["public"]["Tables"]["academies"]["Row"];
export type AcademyInsert = Database["public"]["Tables"]["academies"]["Insert"];
export type AcademyUpdate = Database["public"]["Tables"]["academies"]["Update"];

/** The shape an owner edits/creates. brand_colors carries primary + accent. */
export interface AcademyFormValues {
  name: string;
  slug: string;
  description: string;
  locale: string;
  currency: string;
  timezone: string;
  white_label: boolean;
  brandPrimary: string;
  brandAccent: string;
}

/** Reasonable, premium defaults for a brand-new academy. */
export const DEFAULT_BRAND_PRIMARY = "#7C5CFC";
export const DEFAULT_BRAND_ACCENT = "#E7C66B";

export const CURRENCY_OPTIONS = ["ILS", "USD", "EUR", "GBP"] as const;
export const LOCALE_OPTIONS = ["he", "en"] as const;
/** A compact, curated timezone list — covers the common academy regions. */
export const TIMEZONE_OPTIONS = [
  "Asia/Jerusalem",
  "UTC",
  "Europe/London",
  "Europe/Berlin",
  "Europe/Paris",
  "America/New_York",
  "America/Los_Angeles",
  "America/Sao_Paulo",
  "Asia/Dubai",
  "Asia/Singapore",
  "Australia/Sydney",
] as const;

export const HEX_RE = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/;

/** Normalize free text into a valid slug fragment (lowercase, dash-joined). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9֐-׿\s-]/g, "")
    // transliterate-free: drop Hebrew, keep ascii word chars
    .replace(/[֐-׿]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export interface FieldErrors {
  name?: "required";
  slug?: "required" | "format" | "taken";
  brandPrimary?: "format";
  brandAccent?: "format";
  locale?: "format";
  currency?: "format";
  timezone?: "format";
}

/** Pure, synchronous validation. Returns a (possibly empty) error map. */
export function validateAcademy(v: AcademyFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!v.name.trim()) errors.name = "required";
  if (!v.slug.trim()) errors.slug = "required";
  else if (!SLUG_RE.test(v.slug)) errors.slug = "format";
  if (!HEX_RE.test(v.brandPrimary)) errors.brandPrimary = "format";
  if (!HEX_RE.test(v.brandAccent)) errors.brandAccent = "format";
  if (!(LOCALE_OPTIONS as readonly string[]).includes(v.locale))
    errors.locale = "format";
  if (!(CURRENCY_OPTIONS as readonly string[]).includes(v.currency))
    errors.currency = "format";
  if (!(TIMEZONE_OPTIONS as readonly string[]).includes(v.timezone))
    errors.timezone = "format";
  return errors;
}

export function hasErrors(e: FieldErrors): boolean {
  return Object.keys(e).length > 0;
}

export interface MutationResult {
  ok: boolean;
  academyId?: string;
  /** Coarse machine code so the UI can localize. */
  code?: "slug_taken" | "denied" | "unknown";
}

export function mapError(message?: string): MutationResult["code"] {
  if (!message) return "unknown";
  if (/slug/i.test(message) && /duplicate|unique/i.test(message))
    return "slug_taken";
  if (/duplicate|unique/i.test(message)) return "slug_taken";
  if (/row-level security|denied|policy/i.test(message)) return "denied";
  return "unknown";
}

/** Pull primary/accent hex out of the stored brand_colors json, with defaults. */
export function readBrandColors(brand: Academy["brand_colors"]): {
  primary: string;
  accent: string;
} {
  const obj =
    brand && typeof brand === "object" && !Array.isArray(brand)
      ? (brand as Record<string, unknown>)
      : {};
  const primary =
    typeof obj.primary === "string" && HEX_RE.test(obj.primary)
      ? obj.primary
      : DEFAULT_BRAND_PRIMARY;
  const accent =
    typeof obj.accent === "string" && HEX_RE.test(obj.accent)
      ? obj.accent
      : DEFAULT_BRAND_ACCENT;
  return { primary, accent };
}
