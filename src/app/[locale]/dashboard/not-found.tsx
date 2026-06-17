import Link from "next/link";
import { headers } from "next/headers";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * Dashboard not-found state (e.g. a course id that doesn't exist or isn't
 * visible under the caller's RLS scope -> notFound()). Premium dark fallback
 * rather than the bare Next 404. Locale is derived from the forwarded pathname
 * header set by middleware (not-found has no route params).
 */

const copy: Record<
  Locale,
  { title: string; body: string; cta: string }
> = {
  he: {
    title: "לא נמצא",
    body: "הדף או הקורס שחיפשת לא קיים, או שאין לך גישה אליו.",
    cta: "חזרה לקורסים",
  },
  en: {
    title: "Not found",
    body: "The page or course you're looking for doesn't exist, or you don't have access to it.",
    cta: "Back to courses",
  },
};

export default async function DashboardNotFound() {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const seg = pathname.split("/")[1];
  const locale: Locale = isLocale(seg) ? seg : "he";
  const t = copy[locale];

  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="panel-premium flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
          {t.title}
        </h2>
        <p className="text-sm text-ink-soft">{t.body}</p>
        <Link
          href={`/${locale}/dashboard/courses`}
          className="bg-ink text-bg-deep mt-1 inline-flex items-center justify-center gap-2 rounded-[6px] px-5 py-2.5 text-sm font-semibold tracking-[0.01em] transition-[transform,background-color] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:bg-ink-soft hover:-translate-y-px"
        >
          {t.cta}
        </Link>
      </div>
    </div>
  );
}
