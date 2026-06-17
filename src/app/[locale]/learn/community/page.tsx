import { cookies } from "next/headers";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { learnDict } from "@/components/learn/dictionary";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import { CommunityIcon } from "@/components/dashboard/icons";
import { CommunityFeed } from "@/components/learn/CommunityFeed";
import {
  getPrimaryAcademyId,
  getAcademyHeader,
  getFeed,
} from "@/lib/data/community-learn";

export const dynamic = "force-dynamic";

export default async function LearnCommunity({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = learnDict[locale];
  const t = dict.community;

  const user = await requireStudent(locale, `/${locale}/learn/community`);

  // Resolve the learner's primary academy from their memberships (server-side).
  const academyId = await getPrimaryAcademyId();

  // No academy membership yet → the learner hasn't enrolled anywhere.
  if (!academyId) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader kicker={t.feed} title={t.title} />
        <EmptyState
          icon={<CommunityIcon width={26} height={26} />}
          title={dict.overview.noCourses}
          body={dict.courses.subtitle}
          cta={{ label: dict.overview.browseCourses, href: `/${locale}` }}
        />
      </div>
    );
  }

  const supabase = createClient(await cookies());
  const [profileRes, header, posts] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle(),
    getAcademyHeader(academyId),
    getFeed(academyId, { limit: 40 }),
  ]);

  const selfName =
    profileRes.data?.display_name ||
    (typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : user.email?.split("@")[0]) ||
    "";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={t.feed}
        title={t.title}
        subtitle={header?.name ?? undefined}
      />

      <CommunityFeed
        locale={locale}
        dict={dict}
        academyId={academyId}
        selfName={selfName}
        initialPosts={posts}
      />
    </div>
  );
}
