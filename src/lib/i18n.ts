export const locales = ["he", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "he";

export const dir = (l: Locale): "rtl" | "ltr" => (l === "he" ? "rtl" : "ltr");

export const isLocale = (s: string): s is Locale =>
  (locales as readonly string[]).includes(s);

/**
 * Swap the leading locale segment of a pathname for `next`.
 * `/he/pricing` + 'en' -> `/en/pricing`. Falls back to `/<next>` if no
 * recognizable locale segment is present.
 */
export function swapLocaleInPath(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  // parts[0] is '' because pathname starts with '/'
  if (parts.length > 1 && isLocale(parts[1])) {
    parts[1] = next;
    return parts.join("/") || `/${next}`;
  }
  return `/${next}${pathname === "/" ? "" : pathname}`;
}

export const localeLabel: Record<Locale, string> = {
  he: "עברית",
  en: "English",
};
