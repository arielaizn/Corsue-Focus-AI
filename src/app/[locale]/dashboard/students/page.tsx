import type { ReactNode } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import { getUserAndAcademies } from "@/lib/auth";
import {
  listAcademyMembers,
  listEnrolledStudents,
  pendingInvites,
  countsForAcademy,
  enrollableCourses,
  type TeamMember,
  type PendingInvite,
} from "@/lib/data/members";
import { studentsDict } from "@/components/dashboard/students/dict";
import {
  PageHeader,
  StatCard,
  EmptyState,
  Panel,
  Pill,
} from "@/components/dashboard/ui";
import {
  StudentsIcon,
  CommunityIcon,
  AcademyIcon,
} from "@/components/dashboard/icons";
import { InviteMemberDialog } from "@/components/dashboard/students/InviteMemberDialog";
import { ManualEnrollDialog } from "@/components/dashboard/students/ManualEnrollDialog";
import { MemberRowActions } from "@/components/dashboard/students/MemberRowActions";

export const dynamic = "force-dynamic";

/* Server-safe short date (mirrors the grading feature convention). */
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

export default async function StudentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ academy?: string }>;
}) {
  const { locale: raw } = await params;
  const { academy: academyParam } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const t = studentsDict[locale];

  const { memberships } = await getUserAndAcademies();

  // No academy yet -> prompt to create one first.
  if (memberships.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader kicker={t.index.title} title={t.index.title} />
        <EmptyState
          icon={<AcademyIcon width={26} height={26} />}
          title={t.index.noAcademyTitle}
          body={t.index.noAcademyBody}
          cta={{
            label: t.index.noAcademyCta,
            href: `/${locale}/dashboard/academy`,
          }}
        />
      </div>
    );
  }

  const active =
    memberships.find((m) => m.academy.id === academyParam) ?? memberships[0];
  const academyId = active.academy.id;
  const canWrite = active.role === "owner" || active.role === "admin";

  const [team, students, invites, counts, courses] = await Promise.all([
    listAcademyMembers(academyId),
    listEnrolledStudents(academyId),
    pendingInvites(academyId),
    countsForAcademy(academyId),
    canWrite ? enrollableCourses(academyId) : Promise.resolve([]),
  ]);

  // How many owners — used to lock the final owner against demotion/removal.
  const ownerCount = team.filter((m) => m.role === "owner").length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={active.academy.name}
        title={t.index.title}
        subtitle={t.index.subtitle}
        actions={
          canWrite ? (
            <>
              <ManualEnrollDialog
                locale={locale}
                academyId={academyId}
                courses={courses}
              />
              <InviteMemberDialog
                locale={locale}
                academyId={academyId}
                viewerRole={active.role}
              />
            </>
          ) : undefined
        }
      />

      <section
        aria-label={t.index.title}
        className="grid gap-4 sm:grid-cols-3"
      >
        <StatCard
          label={t.stats.team}
          value={counts.team}
          icon={<CommunityIcon width={18} height={18} />}
        />
        <StatCard
          label={t.stats.students}
          value={counts.students}
          accent
          icon={<StudentsIcon width={18} height={18} />}
        />
        <StatCard
          label={t.stats.pending}
          value={counts.pending}
          icon={<CommunityIcon width={18} height={18} />}
        />
      </section>

      {/* ----------------------------- TEAM ----------------------------- */}
      <Panel className="p-0">
        <SectionHead title={t.team.heading} sub={t.team.sub} />
        {team.length === 0 ? (
          <div className="p-6 pt-0">
            <EmptyState
              icon={<CommunityIcon width={26} height={26} />}
              title={t.team.empty.title}
              body={t.team.empty.body}
            />
          </div>
        ) : (
          <ul className="divide-y divide-line/50">
            {team.map((m) => {
              const lastOwner = m.role === "owner" && ownerCount <= 1;
              return (
                <li
                  key={m.membershipId}
                  className="flex flex-wrap items-center gap-4 px-6 py-4"
                >
                  <PersonCell
                    name={m.displayName || fallbackName(m, locale)}
                    avatarUrl={m.avatarUrl}
                    badge={m.isSelf ? t.team.you : undefined}
                  />
                  <div className="flex flex-1 flex-wrap items-center justify-end gap-x-6 gap-y-2">
                    <Meta
                      label={t.team.joined}
                      value={fmtDate(locale, m.joinedAt)}
                    />
                    {canWrite ? (
                      <MemberRowActions
                        locale={locale}
                        academyId={academyId}
                        membershipId={m.membershipId}
                        role={m.role}
                        locked={lastOwner}
                        isSelf={m.isSelf}
                        viewerRole={active.role}
                      />
                    ) : (
                      <Pill tone="neutral">{t.roles[m.role]}</Pill>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>

      {/* --------------------------- STUDENTS --------------------------- */}
      <Panel className="p-0">
        <SectionHead title={t.students.heading} sub={t.students.sub} />
        {students.length === 0 ? (
          <div className="p-6 pt-0">
            <EmptyState
              icon={<StudentsIcon width={26} height={26} />}
              title={t.students.empty.title}
              body={t.students.empty.body}
            />
          </div>
        ) : (
          <ul className="divide-y divide-line/50">
            {students.map((s) => (
              <li
                key={s.userId}
                className="flex flex-wrap items-center gap-4 px-6 py-4"
              >
                <PersonCell
                  name={s.displayName || shortId(s.userId)}
                  avatarUrl={s.avatarUrl}
                />
                <div className="flex flex-1 flex-wrap items-center justify-end gap-x-6 gap-y-2">
                  <Meta
                    label={t.students.progress}
                    value={
                      s.avgProgress == null
                        ? t.students.noProgress
                        : `${s.avgProgress}%`
                    }
                  />
                  <Meta
                    label={t.students.courses}
                    value={String(s.courseCount)}
                  />
                  <Meta
                    label={t.students.enrolled}
                    value={fmtDate(locale, s.enrolledAt)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* ------------------------- PENDING INVITES ---------------------- */}
      {canWrite && (
        <Panel className="p-0">
          <SectionHead title={t.pending.heading} sub={t.pending.sub} />
          {invites.length === 0 ? (
            <p className="px-6 pb-6 text-sm text-ink-soft">{t.pending.none}</p>
          ) : (
            <ul className="divide-y divide-line/50">
              {invites.map((inv) => (
                <PendingRow
                  key={inv.id}
                  invite={inv}
                  locale={locale}
                  roleLabel={t.roles[inv.role]}
                  expiresLabel={t.pending.expires}
                  expiredLabel={t.pending.expired}
                />
              ))}
            </ul>
          )}
        </Panel>
      )}
    </div>
  );
}

/* ------------------------- presentational bits ------------------------- */

function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line/50 px-6 py-5">
      <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
        {title}
      </h2>
      <p className="text-sm text-muted">{sub}</p>
    </div>
  );
}

function PersonCell({
  name,
  avatarUrl,
  badge,
}: {
  name: string;
  avatarUrl: string | null;
  badge?: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar name={name} url={avatarUrl} />
      <div className="min-w-0">
        <p className="flex items-center gap-2 truncate text-sm font-semibold text-ink">
          <span className="truncate">{name}</span>
          {badge && (
            <span className="shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)]">
              {badge}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}

function Avatar({ name, url }: { name: string; url: string | null }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className="size-10 shrink-0 rounded-full object-cover [box-shadow:inset_0_0_0_1px_var(--color-line)]"
      />
    );
  }
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <span
      aria-hidden
      className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2/70 text-sm font-semibold text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]"
    >
      {initial}
    </span>
  );
}

function Meta({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col items-end">
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-muted">
        {label}
      </span>
      <span className="text-sm tabular-nums text-ink-soft">{value}</span>
    </div>
  );
}

function PendingRow({
  invite,
  locale,
  roleLabel,
  expiresLabel,
  expiredLabel,
}: {
  invite: PendingInvite;
  locale: Locale;
  roleLabel: string;
  expiresLabel: string;
  expiredLabel: string;
}) {
  const isExpired = new Date(invite.expiresAt).getTime() < Date.now();
  return (
    <li className="flex flex-wrap items-center gap-4 px-6 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2/70 text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
        >
          <CommunityIcon width={16} height={16} />
        </span>
        <p className="truncate text-sm font-semibold text-ink" dir="ltr">
          {invite.email}
        </p>
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-end gap-x-6 gap-y-2">
        <Pill tone="neutral">{roleLabel}</Pill>
        <Meta
          label={isExpired ? expiredLabel : expiresLabel}
          value={fmtDate(locale, invite.expiresAt)}
        />
      </div>
    </li>
  );
}

/* ------------------------------ helpers -------------------------------- */

function shortId(id: string): string {
  return id.slice(0, 8);
}

/** Name fallback when a profile has no display_name. */
function fallbackName(m: TeamMember, locale: Locale): string {
  return studentsDict[locale].roles[m.role];
}
