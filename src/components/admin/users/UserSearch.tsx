"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
   PLATFORM ADMIN · Users — URL-driven search box.

   Mutates the `?q=` search param (debounced) so the RSC page re-queries
   `listUsers({ q })` server-side. No client data fetching; the server owns the
   roster + emails (emails are service-role/auth.users, never shipped to the
   client beyond what the page already renders). RTL-safe (logical props).
--------------------------------------------------------------------------- */

const inputCls =
  "w-full rounded-xl bg-surface-2/60 ps-10 pe-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.62_0.16_255_/_0.55)]";

export function UserSearch({
  locale,
  placeholder,
  label,
  initialQuery,
}: {
  locale: Locale;
  placeholder: string;
  label: string;
  initialQuery: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const [, startTransition] = useTransition();
  const firstRun = useRef(true);

  // Debounced push of the query into the URL; the server page re-reads `?q`.
  useEffect(() => {
    // Skip the initial mount so we don't immediately re-navigate on load.
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const id = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const next = value.trim();
      if (next) params.set("q", next);
      else params.delete("q");
      const qs = params.toString();
      startTransition(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    }, 280);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative max-w-md">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-inline-start-3 top-1/2 -translate-y-1/2 text-muted"
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path
            d="m20 20-3-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <input
        type="search"
        name="q"
        dir={locale === "he" ? "rtl" : "ltr"}
        aria-label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={inputCls}
      />
    </div>
  );
}
