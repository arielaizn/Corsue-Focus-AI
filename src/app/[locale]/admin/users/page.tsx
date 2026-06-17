import type { ReactNode } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import { requirePlatformAdmin } from "@/lib/auth";
import { listUsers } from "@/lib/data/platform";
import { adminDict } from "@/lib/admin-dictionary";
import { PageHeader, EmptyState, Panel } from "@/components/dashboard/ui";
import { UserSearch } from "@/components/admin/users/UserSearch";
import { AdminToggle } from "@/components/admin/users/AdminToggle";

/* ---------------------------------------------------------------------------
   PLATFORM SUPER-ADMIN · USERS

   Cross-tenant user roster for the platform owner. Lists every profile with
   email (auth.users, service-role enriched inside listUsers — itself guarded),
   join date, academy-membership count, a platform-admin badge, and an inline
   Grant/Revoke platform-admin control (confirm + last-admin guard surfaced).

   Defense in depth: the route is already gated by the admin layout, but we
   re-assert requirePlatformAdmin(locale) here FIRST and pass the resulting
   user id down so the viewer's own row reads "you".

   Distinct STEEL accent (not academy gold) marks this as the platform surface.
--------------------------------------------------------------------------- */

export const dynamic = "force-dynamic";

/** Server-safe short date (mirrors the dashboard feature convention). */
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

export default async function AdminUsersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "he";

  // GATE — re-assert (never trust the route gate alone). Redirects non-admins.
  const viewer = await requirePlatformAdmin(locale);

  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const t = adminDict[locale];

  const { rows, total } = await listUsers({ q: query, limit: 200 });
  const adminCount = rows.filter((r) => r.isPlatformAdmin).length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={t.shell.platform}
        title={t.users.title}
        subtitle={t.overview.subtitle}
        actions={
          <span className="rounded-full px-3 py-1 text-xs font-semibold tabular-nums text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
            {total.toLocaleString(locale === "he" ? "he-IL" : "en-US")}
          </span>
        }
      />

      <UserSearch
        locale={locale}
        label={t.users.search}
        placeholder={t.users.search}
        initialQuery={query}
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<UsersGlyph />}
          title={t.users.none}
          body={t.users.search}
        />
      ) : (
        <Panel className="p-0">
          {/* Column header — hidden on small screens, logical alignment. */}
          <div className="hidden grid-cols-[1.6fr_0.9fr_0.7fr_auto] items-center gap-4 border-b border-line/50 px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted sm:grid">
            <span>{t.users.title}</span>
            <span>{t.users.joined}</span>
            <span className="text-center">{t.users.academies}</span>
            <span className="text-end">{t.users.admin}</span>
          </div>

          <ul className="divide-y divide-line/50">
            {rows.map((u) => {
              const isSelf = u.id === viewer.id;
              const name =
                u.displayName.trim() ||
                u.email?.split("@")[0] ||
                u.id.slice(0, 8);
              return (
                <li
                  key={u.id}
                  className="grid grid-cols-1 items-center gap-4 px-6 py-4 sm:grid-cols-[1.6fr_0.9fr_0.7fr_auto]"
                >
                  {/* Identity */}
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar name={name} />
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate text-sm font-semibold text-ink">
                        <span className="truncate">{name}</span>
                        {isSelf && <SelfBadge label={t.users.you} />}
                        {u.isPlatformAdmin && (
                          <AdminBadge label={t.users.admin} />
                        )}
                      </p>
                      <p
                        className="truncate text-xs text-muted"
                        dir="ltr"
                        style={{ textAlign: "start" }}
                      >
                        {u.email ?? "—"}
                      </p>
                    </div>
                  </div>

                  {/* Joined */}
                  <Meta label={t.users.joined}>
                    {fmtDate(locale, u.createdAt)}
                  </Meta>

                  {/* Academies */}
                  <Meta label={t.users.academies} className="sm:items-center">
                    <span className="tabular-nums">{u.academies}</span>
                  </Meta>

                  {/* Grant / Revoke */}
                  <div className="flex sm:justify-end">
                    <AdminToggle
                      locale={locale}
                      userId={u.id}
                      isAdmin={u.isPlatformAdmin}
                      labels={{
                        grant: t.users.grantAdmin,
                        revoke: t.users.revokeAdmin,
                        confirm: t.common.confirm,
                        cancel: t.common.cancel,
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-line/50 px-6 py-3 text-xs text-muted">
            <span className="tabular-nums">{adminCount}</span> ·{" "}
            {t.overview.admins}
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
    <div className={`flex flex-col gap-0.5 ${className ?? ""}`}>
      <span className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted sm:hidden">
        {label}
      </span>
      <span className="text-sm text-ink-soft">{children}</span>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <span
      aria-hidden
      className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2/70 text-sm font-semibold text-[oklch(0.72_0.13_255)] [box-shadow:inset_0_0_0_1px_oklch(0.62_0.16_255_/_0.3)]"
    >
      {initial}
    </span>
  );
}

function SelfBadge({ label }: { label: string }) {
  return (
    <span className="shrink-0 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]">
      {label}
    </span>
  );
}

/** Platform-admin badge — STEEL, deliberately NOT academy gold. */
function AdminBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold text-[oklch(0.72_0.13_255)] [box-shadow:inset_0_0_0_1px_oklch(0.62_0.16_255_/_0.45)]">
      <svg width={9} height={9} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2 3 6v6c0 5 3.8 8.5 9 10 5.2-1.5 9-5 9-10V6l-9-4Z" />
      </svg>
      {label}
    </span>
  );
}

function UsersGlyph() {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M16 5.2A3.2 3.2 0 0 1 16 11M17 14c2.5.3 4 2.4 4 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
