import Link from "next/link";
import type { ReactNode } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import { requirePlatformAdmin } from "@/lib/auth";
import { listAcademies } from "@/lib/data/platform";
import { adminDict } from "@/lib/admin-dictionary";
import { PageHeader, EmptyState, Panel } from "@/components/dashboard/ui";
import { AcademyFilters } from "@/components/admin/academies/AcademyFilters";
import { AcademyRowActions } from "@/components/admin/academies/AcademyRowActions";

/* ---------------------------------------------------------------------------
   PLATFORM SUPER-ADMIN · ACADEMIES

   Cross-tenant roster of EVERY academy on the platform (active + suspended).
   Search by ?q (name/slug), filter by ?status (active|suspended), paginate by
   ?offset. Each row: name, slug, owner email, member + course counts, created,
   a status pill, and actions — Inspect (read-only deep link), plus
   Suspend (typed-confirm) / Reinstate via the platform server actions.

   Defense in depth: the route is already gated by the admin layout, but we
   re-assert requirePlatformAdmin(locale) here FIRST. Reads go through
   listAcademies, which runs AS the admin user under the *_admin_all RLS bypass
   (auditable). Distinct STEEL accent marks this as the platform surface.
--------------------------------------------------------------------------- */

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

function fmtDate(locale: Locale, iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat(locale === "he" ? "he-IL" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function parseStatus(v: string | undefined): "all" | "active" | "suspended" {
  return v === "active" || v === "suspended" ? v : "all";
}

function parseOffset(v: string | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export default async function AdminAcademiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; status?: string; offset?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "he";

  // GATE — re-assert (never trust the route gate alone). Redirects non-admins.
  await requirePlatformAdmin(locale);

  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const status = parseStatus(sp.status);
  const offset = parseOffset(sp.offset);
  const t = adminDict[locale];
  const a = t.academies;
  const nf = locale === "he" ? "he-IL" : "en-US";

  const { rows, total } = await listAcademies({
    q,
    status,
    limit: PAGE_SIZE,
    offset,
  });

  const from = total === 0 ? 0 : offset + 1;
  const to = offset + rows.length;
  const hasPrev = offset > 0;
  const hasNext = to < total;

  const pageHref = (nextOffset: number) => {
    const params_ = new URLSearchParams();
    if (q) params_.set("q", q);
    if (status !== "all") params_.set("status", status);
    if (nextOffset > 0) params_.set("offset", String(nextOffset));
    const qs = params_.toString();
    return qs ? `?${qs}` : "?";
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={t.shell.platform}
        title={a.title}
        subtitle={t.overview.subtitle}
        actions={
          <span className="rounded-full px-3 py-1 text-xs font-semibold tabular-nums text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
            {total.toLocaleString(nf)}
          </span>
        }
      />

      <AcademyFilters
        locale={locale}
        q={q}
        status={status}
        labels={{
          search: a.search,
          status: a.status,
          all: locale === "he" ? "הכול" : "All",
          active: a.active,
          suspended: a.suspended,
        }}
      />

      {rows.length === 0 ? (
        <EmptyState icon={<AcademiesGlyph />} title={a.none} body={a.search} />
      ) : (
        <Panel className="p-0">
          {/* Column header — hidden on small screens, logical alignment. */}
          <div className="hidden grid-cols-[2fr_1.2fr_0.7fr_0.7fr_0.9fr_auto] items-center gap-4 border-b border-line/50 px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted lg:grid">
            <span>{a.title}</span>
            <span>{a.owner}</span>
            <span className="text-center">{a.members}</span>
            <span className="text-center">{a.courses}</span>
            <span>{a.created}</span>
            <span className="text-end">{a.status}</span>
          </div>

          <ul className="divide-y divide-line/50">
            {rows.map((row) => (
              <li
                key={row.id}
                className="grid grid-cols-1 items-center gap-4 px-6 py-4 lg:grid-cols-[2fr_1.2fr_0.7fr_0.7fr_0.9fr_auto]"
              >
                {/* Identity: name + slug + (mobile) status pill */}
                <div className="flex min-w-0 items-start justify-between gap-3 lg:block">
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={row.name} suspended={row.status === "suspended"} />
                    <div className="min-w-0">
                      <Link
                        href={`/${locale}/admin/academies/${row.id}`}
                        className="block truncate text-sm font-semibold text-ink transition-colors hover:text-[oklch(0.78_0.13_255)]"
                      >
                        {row.name}
                      </Link>
                      <p
                        className="truncate text-xs text-muted"
                        dir="ltr"
                        style={{ textAlign: "start" }}
                      >
                        /{row.slug}
                      </p>
                    </div>
                  </div>
                  <div className="lg:hidden">
                    <StatusPill status={row.status} labels={a} />
                  </div>
                </div>

                {/* Owner email */}
                <Meta label={a.owner}>
                  <span
                    className="truncate"
                    dir="ltr"
                    style={{ textAlign: "start" }}
                  >
                    {row.ownerEmail ?? "—"}
                  </span>
                </Meta>

                {/* Members */}
                <Meta label={a.members} className="lg:items-center">
                  <span className="tabular-nums">
                    {row.memberCount.toLocaleString(nf)}
                  </span>
                </Meta>

                {/* Courses */}
                <Meta label={a.courses} className="lg:items-center">
                  <span className="tabular-nums">
                    {row.courseCount.toLocaleString(nf)}
                  </span>
                </Meta>

                {/* Created */}
                <Meta label={a.created}>{fmtDate(locale, row.createdAt)}</Meta>

                {/* Status (desktop) + actions */}
                <div className="flex flex-col items-stretch gap-2 lg:items-end">
                  <div className="hidden lg:flex lg:justify-end">
                    <StatusPill status={row.status} labels={a} />
                  </div>
                  <AcademyRowActions
                    locale={locale}
                    academyId={row.id}
                    slug={row.slug}
                    status={row.status}
                    labels={{
                      inspect: a.inspect,
                      suspend: a.suspend,
                      reinstate: a.reinstate,
                      confirmSuspend: a.confirmSuspend,
                      confirm: t.common.confirm,
                      cancel: t.common.cancel,
                      loading: t.common.loading,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>

          {/* Footer: range + pagination */}
          <div className="flex items-center justify-between gap-4 border-t border-line/50 px-6 py-3 text-xs text-muted">
            <span className="tabular-nums">
              {from.toLocaleString(nf)}–{to.toLocaleString(nf)} ·{" "}
              {total.toLocaleString(nf)}
            </span>
            {(hasPrev || hasNext) && (
              <div className="flex items-center gap-2">
                <PagerLink
                  href={pageHref(Math.max(0, offset - PAGE_SIZE))}
                  disabled={!hasPrev}
                  label={t.common.back}
                />
                <PagerLink
                  href={pageHref(offset + PAGE_SIZE)}
                  disabled={!hasNext}
                  label={locale === "he" ? "הבא" : "Next"}
                />
              </div>
            )}
          </div>
        </Panel>
      )}
    </div>
  );
}

/* ----------------------------- presentational ---------------------------- */

function Meta({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex min-w-0 flex-col gap-0.5 ${className ?? ""}`}>
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted lg:hidden">
        {label}
      </span>
      <span className="min-w-0 truncate text-sm text-ink-soft">{children}</span>
    </div>
  );
}

function Avatar({ name, suspended }: { name: string; suspended: boolean }) {
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <span
      aria-hidden
      className={
        suspended
          ? "grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2/70 text-sm font-semibold text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]"
          : "grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2/70 text-sm font-semibold text-[oklch(0.72_0.13_255)] [box-shadow:inset_0_0_0_1px_oklch(0.62_0.16_255_/_0.3)]"
      }
    >
      {initial}
    </span>
  );
}

function StatusPill({
  status,
  labels,
}: {
  status: "active" | "suspended";
  labels: { active: string; suspended: string };
}) {
  if (status === "suspended") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold text-[oklch(0.78_0.16_22)] [box-shadow:inset_0_0_0_1px_oklch(0.78_0.16_22_/_0.4)]">
        <span aria-hidden className="size-1.5 rounded-full bg-[oklch(0.7_0.18_22)]" />
        {labels.suspended}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold text-[oklch(0.78_0.14_155)] [box-shadow:inset_0_0_0_1px_oklch(0.7_0.15_155_/_0.4)]">
      <span aria-hidden className="size-1.5 rounded-full bg-[oklch(0.72_0.16_155)]" />
      {labels.active}
    </span>
  );
}

function PagerLink({
  href,
  disabled,
  label,
}: {
  href: string;
  disabled: boolean;
  label: string;
}) {
  if (disabled) {
    return (
      <span className="inline-flex cursor-not-allowed items-center rounded-lg px-3 py-1 font-semibold text-muted/40 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      scroll={false}
      className="inline-flex items-center rounded-lg px-3 py-1 font-semibold text-ink-soft transition-colors hover:text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]"
    >
      {label}
    </Link>
  );
}

function AcademiesGlyph() {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3 2 8l10 5 10-5-10-5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M5 11v5c0 1.5 3.1 3 7 3s7-1.5 7-3v-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
