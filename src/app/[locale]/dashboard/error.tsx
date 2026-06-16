"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

/**
 * Dashboard error boundary — calm premium fallback instead of the raw Next.js
 * error overlay when an RLS-scoped Supabase read throws. Bilingual via the
 * locale segment of the pathname (error boundaries can't receive route params).
 */

const copy: Record<Locale, { title: string; body: string; retry: string }> = {
  he: {
    title: "משהו השתבש",
    body: "לא הצלחנו לטעון את המסך הזה כרגע. נסה שוב — אם הבעיה נמשכת, רענן את העמוד.",
    retry: "נסה שוב",
  },
  en: {
    title: "Something went wrong",
    body: "We couldn't load this screen right now. Try again — if it keeps happening, refresh the page.",
    retry: "Try again",
  },
};

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const seg = pathname.split("/")[1];
  const locale: Locale = isLocale(seg) ? seg : "he";
  const t = copy[locale];

  useEffect(() => {
    // Surface to server logs without leaking details to the UI.
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="panel-premium glow-aurora flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
          {t.title}
        </h2>
        <p className="text-sm text-ink-soft">{t.body}</p>
        <button
          type="button"
          onClick={reset}
          className="bg-aurora text-ink mt-1 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] transition-transform duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.18),0_18px_48px_-18px_oklch(0.6_0.2_290_/_0.6)] hover:-translate-y-0.5"
        >
          {t.retry}
        </button>
      </div>
    </div>
  );
}
