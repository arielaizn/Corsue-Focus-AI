import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactElement } from "react";
import { isLocale, type Locale } from "@/lib/i18n";
import {
  getUserAndAcademies,
  type MembershipWithAcademy,
} from "@/lib/auth";
import { PageHeader, EmptyState, Panel, Pill } from "@/components/dashboard/ui";
import {
  AcademyIcon,
  StudentsIcon,
  SettingsIcon,
  ChevronIcon,
} from "@/components/dashboard/icons";
import { appDictionary } from "@/lib/app-dictionary";
import { AccountForm } from "@/components/dashboard/settings/AccountForm";
import { DangerZone } from "@/components/dashboard/settings/DangerZone";
import { settingsDict } from "@/components/dashboard/settings/dict";
import type { AccountValues } from "@/components/dashboard/settings/types";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ academy?: string }>;
}) {
  const { locale: raw } = await params;
  const { academy: academyParam } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const d = settingsDict[locale];

  const { user, profile, memberships } = await getUserAndAcademies();
  if (!user) {
    redirect(`/${locale}/login?next=/${locale}/dashboard/settings`);
  }

  // Seed the account form from the profile (own row). Fall back to the auth
  // metadata / email handle so the name field is never blank on first visit.
  const metaName =
    typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : "";
  const accountValues: AccountValues = {
    display_name: profile?.display_name || metaName || user.email?.split("@")[0] || "",
    bio: profile?.bio ?? "",
    locale: profile?.locale === "en" ? "en" : "he",
    timezone: profile?.timezone || "Asia/Jerusalem",
    website_url: profile?.website_url ?? "",
    avatar_url: profile?.avatar_url ?? "",
    is_public: profile?.is_public ?? true,
    avatarKey: user.id,
  };

  // No academies yet — still let the user edit their personal profile, then
  // point them to the create-academy CTA for the academy-scoped sections.
  if (memberships.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          kicker={d.page.kicker}
          title={d.page.title}
          subtitle={d.page.subtitle}
        />
        <Panel title={d.account.title}>
          <p className="mb-6 text-sm text-ink-soft">{d.account.hint}</p>
          <AccountForm locale={locale} initialValues={accountValues} />
        </Panel>
        <EmptyState
          icon={<AcademyIcon width={26} height={26} />}
          title={appDictionary[locale].dashboard.createTitle}
          body={appDictionary[locale].dashboard.createBody}
          cta={{
            label: appDictionary[locale].dashboard.createCta,
            href: `/${locale}/dashboard/academy`,
          }}
        />
      </div>
    );
  }

  const active: MembershipWithAcademy =
    memberships.find((m) => m.academy.id === academyParam) ?? memberships[0];
  const academyId = active.academy.id;
  const isOwner = active.role === "owner";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={active.academy.name}
        title={d.page.title}
        subtitle={d.page.subtitle}
        actions={
          <Pill tone={isOwner ? "gold" : "neutral"}>
            {appRole(locale, active.role)}
          </Pill>
        }
      />

      {/* (a) Account / personal profile — every role edits their own row. */}
      <Panel title={d.account.title}>
        <p className="mb-6 text-sm text-ink-soft">{d.account.hint}</p>
        <AccountForm locale={locale} initialValues={accountValues} />
      </Panel>

      {/* (b) Academy quick-links — branding + team live on dedicated pages. */}
      <Panel title={d.quickLinks.title}>
        <p className="mb-5 text-sm text-ink-soft">{d.quickLinks.hint}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickLink
            href={`/${locale}/dashboard/academy?academy=${academyId}`}
            label={d.quickLinks.branding}
            desc={d.quickLinks.brandingDesc}
            Icon={SettingsIcon}
          />
          <QuickLink
            href={`/${locale}/dashboard/students?academy=${academyId}`}
            label={d.quickLinks.team}
            desc={d.quickLinks.teamDesc}
            Icon={StudentsIcon}
          />
        </div>
      </Panel>

      {/* (c) Danger zone — owner only. No dead control for anyone else. */}
      {isOwner && (
        <DangerZone
          locale={locale}
          academyId={academyId}
          academyName={active.academy.name}
        />
      )}
    </div>
  );
}

/** Role label without reaching into the foundation dictionary directly. */
function appRole(
  locale: Locale,
  role: "owner" | "admin" | "instructor" | "student",
): string {
  const he = { owner: "בעלים", admin: "מנהל", instructor: "מדריך", student: "תלמיד" };
  const en = { owner: "Owner", admin: "Admin", instructor: "Instructor", student: "Student" };
  return (locale === "he" ? he : en)[role];
}

function QuickLink({
  href,
  label,
  desc,
  Icon,
}: {
  href: string;
  label: string;
  desc: string;
  Icon: (p: { width?: number; height?: number }) => ReactElement;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-4 rounded-xl bg-surface-2/40 px-4 py-3.5 transition-colors hover:bg-surface-2/70 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
    >
      <span
        aria-hidden
        className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2/70 text-gold/80 transition-colors group-hover:text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.3)]"
      >
        <Icon width={18} height={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink-soft transition-colors group-hover:text-ink">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted">{desc}</span>
      </span>
      <span
        aria-hidden
        className="text-ink-soft/0 transition-colors group-hover:text-ink-soft/60 rtl:rotate-180"
      >
        <ChevronIcon width={16} height={16} className="-rotate-90" />
      </span>
    </Link>
  );
}
