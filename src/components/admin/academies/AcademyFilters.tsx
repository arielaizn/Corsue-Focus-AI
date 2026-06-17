"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------------------
   PLATFORM ADMIN · Academies — URL-driven search (?q) + status (?status).

   Pure URL state: this thin client shell mutates the search params (search is
   debounced) and the RSC page re-queries `listAcademies({ q, status })`
   server-side — no client data fetching. Any change resets ?offset to page 1.
   STEEL platform accent on the active status tab (distinct from gold). RTL-safe
   (logical props).
--------------------------------------------------------------------------- */

type StatusFilter = "all" | "active" | "suspended";

const inputCls =
  "w-full rounded-xl bg-surface-2/60 ps-10 pe-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.62_0.16_255_/_0.55)]";

export function AcademyFilters({
  locale,
  q,
  status,
  labels,
}: {
  locale: Locale;
  q: string;
  status: StatusFilter;
  labels: {
    search: string;
    status: string;
    all: string;
    active: string;
    suspended: string;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(q);
  const [, startTransition] = useTransition();
  const firstRun = useRef(true);

  const push = (mutate: (sp: URLSearchParams) => void) => {
    const sp = new URLSearchParams(searchParams.toString());
    mutate(sp);
    sp.delete("offset"); // any filter change returns to page 1
    const qs = sp.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  // Debounced search → ?q. Skips the initial mount so load doesn't re-navigate.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    const id = setTimeout(() => {
      const next = value.trim();
      push((sp) => (next ? sp.set("q", next) : sp.delete("q")));
    }, 280);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const tabs: [StatusFilter, string][] = [
    ["all", labels.all],
    ["active", labels.active],
    ["suspended", labels.suspended],
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-md">
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
          aria-label={labels.search}
          placeholder={labels.search}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={inputCls}
        />
      </div>

      <nav
        role="tablist"
        aria-label={labels.status}
        className="flex shrink-0 flex-wrap items-center gap-2"
      >
        {tabs.map(([value_, label]) => {
          const isActive = status === value_;
          return (
            <button
              key={value_}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() =>
                push((sp) =>
                  value_ === "all"
                    ? sp.delete("status")
                    : sp.set("status", value_),
                )
              }
              className={cn(
                "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold transition-[color,box-shadow,background-color] duration-200",
                isActive
                  ? "bg-surface-2/70 text-ink [box-shadow:inset_0_0_0_1px_oklch(0.62_0.13_250_/_0.55)]"
                  : "text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)] hover:text-ink hover:[box-shadow:inset_0_0_0_1px_oklch(0.5_0.06_250_/_0.45)]",
              )}
            >
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
