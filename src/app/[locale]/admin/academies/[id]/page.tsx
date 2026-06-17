import "server-only";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import { requirePlatformAdmin } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { listAcademies, type AdminAcademyRow } from "@/lib/data/platform";
import { adminDict } from "@/lib/admin-dictionary";
import { PageHeader, StatCard, Panel, EmptyState } from "@/components/dashboard/ui";

/* ---------------------------------------------------------------------------
   PLATFORM SUPER-ADMIN · ACADEMY INSPECT  (READ-ONLY)

   A read-only window into ONE tenant's overview, rendered via the platform
   admin's *_admin_all RLS bypass (auditable, AS the admin user). This is the
   sanctioned alternative to impersonation: NO session swap, NO writes — the
   operator sees the tenant's data exactly as stored, never "as" the owner.

   Mutations (suspend/reinstate) live on the list page's row actions; this view
   is observe-only by design. Defense in depth: requirePlatformAdmin re-asserts
   here FIRST (never trust the route gate alone). Distinct STEEL accent.
--------------------------------------------------------------------------- */

export const dynamic = "force-dynamic";

const STEEL = "oklch(0.72 0.13 255)";

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

function money(locale: Locale, amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString()} ${currency}`;
  }
}

/** Scoped tenant detail — read AS the admin via the RLS bypass. Never throws. */
async function loadInspect(academyId: string) {
  const supabase = createClient(await cookies());

  // Canonical academy row (admin bypass reads soft-deleted ones too).
  const { data: academy } = await supabase
    .from("academies")
    .select(
      "id, name, slug, owner_id, description, created_at, deleted_at, currency, logo_url, custom_domain",
    )
    .eq("id", academyId)
    .maybeSingle();

  if (!academy) return null;

  const safe = async <T,>(p: PromiseLike<{ data: T | null; error: unknown }>) => {
    try {
      const { data, error } = await p;
      return error ? null : data;
    } catch {
      return null;
    }
  };

  const [
    memberships,
    memberCount,
    courseCount,
    enrollmentCount,
    postCount,
    succeededPayments,
    recentCourses,
    recentPayments,
  ] = await Promise.all([
    // Membership ROWS — only for the per-role breakdown panel.
    safe(
      supabase
        .from("memberships")
        .select("role")
        .eq("academy_id", academyId),
    ),
    // Exact counts (head:true) — accurate, never capped by the row limit.
    countOf(supabase, "memberships", academyId),
    countOf(supabase, "courses", academyId, true),
    countOf(supabase, "enrollments", academyId),
    countOf(supabase, "posts", academyId, true),
    safe(
      supabase
        .from("payments")
        .select("amount, currency")
        .eq("academy_id", academyId)
        .eq("status", "succeeded"),
    ),
    safe(
      supabase
        .from("courses")
        .select("id, title, slug, is_published, enrolled_count, created_at, deleted_at")
        .eq("academy_id", academyId)
        .order("created_at", { ascending: false })
        .limit(6),
    ),
    safe(
      supabase
        .from("payments")
        .select("id, amount, currency, status, paid_at, created_at")
        .eq("academy_id", academyId)
        .order("created_at", { ascending: false })
        .limit(8),
    ),
  ]);

  const roleCounts = new Map<string, number>();
  for (const m of (memberships ?? []) as { role: string }[]) {
    roleCounts.set(m.role, (roleCounts.get(m.role) ?? 0) + 1);
  }

  const payRows = (succeededPayments ?? []) as {
    amount: number;
    currency: string;
  }[];
  let revenue = 0;
  let currency = academy.currency || "USD";
  for (const p of payRows) {
    revenue += Number(p.amount) || 0;
    if (p.currency) currency = p.currency;
  }

  return {
    academy,
    memberCount,
    roleCounts,
    courseCount,
    enrollmentCount,
    postCount,
    revenue,
    currency,
    recentCourses: (recentCourses ?? []) as RecentCourse[],
    recentPayments: (recentPayments ?? []) as RecentPay[],
  };
}

/** Exact count for a tenant-scoped child table. `liveOnly` filters deleted_at. */
async function countOf(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: "memberships" | "courses" | "enrollments" | "posts",
  academyId: string,
  liveOnly = false,
): Promise<number> {
  try {
    let q = supabase
      .from(table)
      .select("id", { count: "exact", head: true })
      .eq("academy_id", academyId);
    if (liveOnly) q = q.is("deleted_at", null);
    const { count, error } = await q;
    return error ? 0 : count ?? 0;
  } catch {
    return 0;
  }
}

interface RecentCourse {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  enrolled_count: number;
  created_at: string;
  deleted_at: string | null;
}

interface RecentPay {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paid_at: string | null;
  created_at: string;
}

export default async function AdminAcademyInspectPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  const locale: Locale = isLocale(raw) ? raw : "he";

  // GATE — re-assert (never trust the route gate alone). Redirects non-admins.
  await requirePlatformAdmin(locale);

  const t = adminDict[locale];
  const a = t.academies;
  const o = t.overview;
  const nf = locale === "he" ? "he-IL" : "en-US";

  const data = await loadInspect(id);
  if (!data) notFound();

  const {
    academy,
    memberCount,
    roleCounts,
    courseCount,
    enrollmentCount,
    postCount,
    revenue,
    currency,
    recentCourses,
    recentPayments,
  } = data;

  // Owner email + reconciled counts via the shared platform read (service-role
  // guarded inside listAcademies). Match on id; slug search narrows the page.
  let ownerEmail: string | null = null;
  try {
    const { rows } = await listAcademies({
      q: academy.slug,
      status: "all",
      limit: 50,
    });
    const match: AdminAcademyRow | undefined = rows.find((r) => r.id === id);
    ownerEmail = match?.ownerEmail ?? null;
  } catch {
    ownerEmail = null;
  }

  const suspended = !!academy.deleted_at;

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb back to the roster. */}
      <Link
        href={`/${locale}/admin/academies`}
        className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-ink-soft"
      >
        <svg
          width={14}
          height={14}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className="rtl:-scale-x-100"
        >
          <path
            d="M15 18 9 12l6-6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {a.title}
      </Link>

      <PageHeader
        kicker={t.shell.platform}
        title={academy.name}
        subtitle={academy.description ?? undefined}
        actions={
          <span
            className={
              suspended
                ? "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-[oklch(0.78_0.16_22)] [box-shadow:inset_0_0_0_1px_oklch(0.78_0.16_22_/_0.4)]"
                : "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-[oklch(0.78_0.14_155)] [box-shadow:inset_0_0_0_1px_oklch(0.7_0.15_155_/_0.4)]"
            }
          >
            <span
              aria-hidden
              className={`size-1.5 rounded-full ${suspended ? "bg-[oklch(0.7_0.18_22)]" : "bg-[oklch(0.72_0.16_155)]"}`}
            />
            {suspended ? a.suspended : a.active}
          </span>
        }
      />

      {/* Identity strip: slug, owner, created, read-only notice. */}
      <Panel className="p-0">
        <dl className="grid grid-cols-1 divide-y divide-line/50 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          <Field label="/slug">
            <span dir="ltr" style={{ textAlign: "start" }}>
              /{academy.slug}
            </span>
          </Field>
          <Field label={a.owner}>
            <span dir="ltr" style={{ textAlign: "start" }}>
              {ownerEmail ?? "—"}
            </span>
          </Field>
          <Field label={a.created}>{fmtDate(locale, academy.created_at)}</Field>
          <Field label={a.status}>
            {suspended ? a.suspended : a.active}
            {suspended && academy.deleted_at && (
              <span className="block text-xs text-muted">
                {fmtDate(locale, academy.deleted_at)}
              </span>
            )}
          </Field>
        </dl>
      </Panel>

      {/* Read-only notice — sets the operator's expectation explicitly. */}
      <p className="rounded-xl bg-surface-2/40 px-4 py-3 text-xs text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        {locale === "he"
          ? "תצוגת בדיקה לקריאה בלבד — הנתונים מוצגים דרך הרשאות מנהל הפלטפורמה, ללא התחזות וללא עריכה."
          : "Read-only inspect view — data is rendered via the platform-admin bypass. No impersonation, no edits."}
      </p>

      {/* KPI tiles. */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label={o.users}
          value={memberCount.toLocaleString(nf)}
          icon={<MembersGlyph />}
        />
        <StatCard
          label={o.courses}
          value={courseCount.toLocaleString(nf)}
          icon={<CoursesGlyph />}
        />
        <StatCard
          label={o.enrollments}
          value={enrollmentCount.toLocaleString(nf)}
          icon={<EnrollGlyph />}
        />
        <StatCard
          label={t.moderation.post}
          value={postCount.toLocaleString(nf)}
          icon={<PostsGlyph />}
        />
        <StatCard
          label={o.revenue}
          value={money(locale, revenue, currency)}
          icon={<RevenueGlyph />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recent courses. */}
        <div className="lg:col-span-3">
          <Panel title={a.courses} className="h-full">
            {recentCourses.length === 0 ? (
              <p className="text-sm text-muted">{a.none}</p>
            ) : (
              <ul className="divide-y divide-line/50">
                {recentCourses.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {c.title}
                        {c.deleted_at && (
                          <span className="ms-2 text-xs font-normal text-[oklch(0.78_0.16_22)]">
                            ·{" "}
                            {locale === "he" ? "נמחק" : "deleted"}
                          </span>
                        )}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {c.enrolled_count.toLocaleString(nf)} · {o.enrollments}
                      </p>
                    </div>
                    <PublishPill
                      published={c.is_published && !c.deleted_at}
                      labels={{
                        live: locale === "he" ? "מפורסם" : "Published",
                        draft: locale === "he" ? "טיוטה" : "Draft",
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Members by role + recent payments. */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Panel title={a.members}>
            {memberCount === 0 ? (
              <p className="text-sm text-muted">{t.users.none}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {Array.from(roleCounts.entries())
                  .sort((x, y) => y[1] - x[1])
                  .map(([role, n]) => (
                    <li
                      key={role}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="capitalize text-ink-soft">{role}</span>
                      <span className="tabular-nums text-ink">
                        {n.toLocaleString(nf)}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </Panel>

          <Panel title={t.billing.recentPayments}>
            {recentPayments.length === 0 ? (
              <p className="text-sm text-muted">{t.billing.none}</p>
            ) : (
              <ul className="divide-y divide-line/50">
                {recentPayments.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold tabular-nums text-ink">
                        {money(locale, Number(p.amount) || 0, p.currency || currency)}
                      </p>
                      <p className="text-xs text-muted">
                        {fmtDate(locale, p.paid_at ?? p.created_at)}
                      </p>
                    </div>
                    <PaymentPill status={p.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      {/* Defensive empty (shouldn't hit — notFound covers the no-academy case). */}
      {courseCount === 0 && memberCount === 0 && enrollmentCount === 0 && (
        <EmptyState
          icon={<MembersGlyph />}
          title={locale === "he" ? "אקדמיה ריקה" : "Empty academy"}
          body={
            locale === "he"
              ? "לאקדמיה זו עדיין אין חברים, קורסים או הרשמות."
              : "This academy has no members, courses, or enrollments yet."
          }
        />
      )}
    </div>
  );
}

/* ----------------------------- presentational ---------------------------- */

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 px-6 py-4">
      <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted">
        {label}
      </dt>
      <dd className="min-w-0 truncate text-sm font-medium text-ink">{children}</dd>
    </div>
  );
}

function PublishPill({
  published,
  labels,
}: {
  published: boolean;
  labels: { live: string; draft: string };
}) {
  return published ? (
    <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold text-[oklch(0.78_0.14_155)] [box-shadow:inset_0_0_0_1px_oklch(0.7_0.15_155_/_0.4)]">
      {labels.live}
    </span>
  ) : (
    <span className="shrink-0 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]">
      {labels.draft}
    </span>
  );
}

function PaymentPill({ status }: { status: string }) {
  const ok = status === "succeeded";
  return (
    <span
      className={
        ok
          ? "shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold text-[oklch(0.78_0.14_155)] [box-shadow:inset_0_0_0_1px_oklch(0.7_0.15_155_/_0.35)]"
          : "shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)]"
      }
    >
      {status}
    </span>
  );
}

/* --------------------------------- glyphs --------------------------------- */

function MembersGlyph() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: STEEL }}>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16 5.2A3.2 3.2 0 0 1 16 11M17 14c2.5.3 4 2.4 4 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CoursesGlyph() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: STEEL }}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5v-15Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5v-15Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function EnrollGlyph() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: STEEL }}>
      <path d="m4 12 5 5L20 6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PostsGlyph() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: STEEL }}>
      <path d="M5 5h14v9H9l-4 4V5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function RevenueGlyph() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden style={{ color: STEEL }}>
      <path d="M12 3v18M8 7h6a2.5 2.5 0 0 1 0 5H9a2.5 2.5 0 0 0 0 5h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
