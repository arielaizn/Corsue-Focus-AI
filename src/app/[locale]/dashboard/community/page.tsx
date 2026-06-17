import { isLocale, type Locale } from "@/lib/i18n";
import { getUserAndAcademies, type MembershipWithAcademy } from "@/lib/auth";
import {
  getModFeed,
  listGroups,
  academyLeaderboard,
  listBadges,
} from "@/lib/data/community-admin";
import { communityDict } from "@/components/dashboard/community/dict";
import { PageHeader, EmptyState, Panel, Pill } from "@/components/dashboard/ui";
import { AcademyIcon } from "@/components/dashboard/icons";
import { ModerationFeed } from "@/components/dashboard/community/ModerationFeed";
import { AnnouncementComposer } from "@/components/dashboard/community/AnnouncementComposer";
import { GroupsPanel } from "@/components/dashboard/community/GroupsPanel";
import { GrantsPanel } from "@/components/dashboard/community/GrantsPanel";
import { Leaderboard } from "@/components/dashboard/community/Leaderboard";

export const dynamic = "force-dynamic";

export default async function CommunityPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ academy?: string }>;
}) {
  const { locale: raw } = await params;
  const { academy: academyParam } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const t = communityDict[locale];

  const { memberships } = await getUserAndAcademies();

  // No academy yet -> prompt to create one first.
  if (memberships.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader kicker={t.index.kicker} title={t.index.title} />
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

  const active: MembershipWithAcademy =
    memberships.find((m) => m.academy.id === academyParam) ?? memberships[0];
  const academyId = active.academy.id;
  const canWrite = active.role === "owner" || active.role === "admin";
  // Manual grants are allowed for instructors too (matches xp_events /
  // user_badges RLS: is_member_of + owner/admin/instructor).
  const canGrant = canWrite || active.role === "instructor";

  const [feed, groups, leaderboard, badges] = await Promise.all([
    getModFeed(academyId),
    listGroups(academyId),
    academyLeaderboard(academyId),
    listBadges(academyId),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={active.academy.name}
        title={t.index.title}
        subtitle={t.index.subtitle}
        actions={!canWrite ? <Pill tone="neutral">{t.index.readOnly}</Pill> : undefined}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Main column — moderation feed (+ announcement composer for writers). */}
        <div className="flex flex-col gap-6 xl:col-span-2">
          {canWrite && (
            <Panel title={t.announce.title}>
              <p className="mb-4 -mt-2 text-sm text-ink-soft">
                {t.announce.subtitle}
              </p>
              <AnnouncementComposer locale={locale} academyId={academyId} />
            </Panel>
          )}

          <Panel title={t.feed.title}>
            <p className="mb-4 -mt-2 text-sm text-ink-soft">{t.feed.subtitle}</p>
            <ModerationFeed
              locale={locale}
              academyId={academyId}
              canWrite={canWrite}
              posts={feed}
            />
          </Panel>
        </div>

        {/* Side column — leaderboard, groups, grants. */}
        <div className="flex flex-col gap-6">
          <Panel title={t.leaderboard.title}>
            <p className="mb-4 -mt-2 text-sm text-ink-soft">
              {t.leaderboard.subtitle}
            </p>
            <Leaderboard locale={locale} rows={leaderboard} />
          </Panel>

          <Panel title={t.groups.title}>
            <p className="mb-4 -mt-2 text-sm text-ink-soft">
              {t.groups.subtitle}
            </p>
            <GroupsPanel
              locale={locale}
              academyId={academyId}
              groups={groups}
              canWrite={canWrite}
            />
          </Panel>

          {canGrant && (
            <Panel title={t.grants.title}>
              <p className="mb-4 -mt-2 text-sm text-ink-soft">
                {t.grants.subtitle}
              </p>
              <GrantsPanel
                locale={locale}
                academyId={academyId}
                badges={badges}
                canWrite={canWrite}
              />
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
