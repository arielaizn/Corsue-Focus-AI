import Link from "next/link";
import { cookies } from "next/headers";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { greetingFor } from "@/lib/app-dictionary";
import { learnDict } from "@/components/learn/dictionary";
import {
  PageHeader,
  StatCard,
  Panel,
  EmptyState,
} from "@/components/dashboard/ui";
import { CoursesIcon, SparkIcon } from "@/components/dashboard/icons";
import {
  getContinueLearning,
  getMyEnrollments,
  type EnrolledCourse,
} from "@/lib/data/learn";

export const dynamic = "force-dynamic";

export default async function LearnOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const dict = learnDict[locale];
  const d = dict.overview;

  const user = await requireStudent(locale, `/${locale}/learn`);

  const supabase = createClient(await cookies());
  const [profileRes, xpRes, streakRes, enrollments, resume] = await Promise.all(
    [
      supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("user_xp")
        .select("total_xp, current_level")
        .eq("user_id", user.id)
        .order("total_xp", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", user.id)
        .order("current_streak", { ascending: false })
        .limit(1)
        .maybeSingle(),
      getMyEnrollments(),
      getContinueLearning(),
    ],
  );

  const name =
    profileRes.data?.display_name ||
    (typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : user.email?.split("@")[0]) ||
    "";

  const totalXp = xpRes.data?.total_xp ?? 0;
  const level = xpRes.data?.current_level ?? 1;
  const streak = streakRes.data?.current_streak ?? 0;

  const greeting = greetingFor(locale, new Date().getHours());
  const inProgress = enrollments.filter(
    (e) => e.status !== "completed" && e.progressPct < 100,
  );

  // No enrollments at all → calm browse CTA.
  if (enrollments.length === 0) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          kicker={d.welcome}
          title={`${greeting}${name ? `, ${name}` : ""}`}
          subtitle={dict.courses.subtitle}
        />
        <EmptyState
          icon={<CoursesIcon width={26} height={26} />}
          title={d.noCourses}
          body={dict.courses.subtitle}
          cta={{ label: d.browseCourses, href: `/${locale}` }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={d.welcome}
        title={`${greeting}${name ? `, ${name}` : ""}`}
        subtitle={dict.courses.subtitle}
      />

      {/* XP / level / streak strip */}
      <section
        aria-label={d.title}
        className="grid gap-4 sm:grid-cols-3"
      >
        <StatCard
          label={d.xp}
          value={totalXp.toLocaleString(locale === "he" ? "he-IL" : "en-US")}
          accent
          icon={<SparkIcon width={18} height={18} />}
        />
        <StatCard label={d.level} value={level} />
        <StatCard label={d.streak} value={`${streak} ${d.days}`} />
      </section>

      {/* Continue-learning hero */}
      {resume && <ResumeHero locale={locale} item={resume} dict={dict} />}

      {/* In-progress grid */}
      <Panel title={d.inProgress}>
        {inProgress.length === 0 ? (
          <p className="text-sm text-muted">{dict.courses.empty}</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inProgress.map((e) => (
              <li key={e.course.id}>
                <CourseProgressCard locale={locale} item={e} dict={dict} />
              </li>
            ))}
          </ul>
        )}
        <div className="mt-5">
          <Link
            href={`/${locale}/learn/courses`}
            className="text-sm font-medium text-gold transition-colors hover:text-gilt"
          >
            {dict.courses.myCourses} →
          </Link>
        </div>
      </Panel>
    </div>
  );
}

function ResumeHero({
  locale,
  item,
  dict,
}: {
  locale: Locale;
  item: EnrolledCourse;
  dict: (typeof learnDict)[Locale];
}) {
  const d = dict.overview;
  return (
    <Link
      href={`/${locale}/learn/c/${item.course.id}`}
      className="panel-couture gilt-rim group relative flex flex-col gap-4 overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="min-w-0">
        <p className="text-gilt mb-2 text-xs font-semibold uppercase tracking-[0.12em]">
          {d.continueLearning}
        </p>
        <h2 className="truncate font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
          {item.course.title}
        </h2>
        {item.academy.name && (
          <p className="mt-1 text-xs text-muted">{item.academy.name}</p>
        )}
        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-2 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-500"
              style={{ width: `${item.progressPct}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-ink-soft">
            {item.progressPct}%
          </span>
        </div>
      </div>
      <span className="bg-ink text-bg-deep inline-flex shrink-0 items-center justify-center rounded-[6px] px-6 py-3 text-sm font-semibold transition-colors group-hover:bg-ink-soft">
        {d.resume}
      </span>
    </Link>
  );
}

function CourseProgressCard({
  locale,
  item,
  dict,
}: {
  locale: Locale;
  item: EnrolledCourse;
  dict: (typeof learnDict)[Locale];
}) {
  return (
    <Link
      href={`/${locale}/learn/c/${item.course.id}`}
      className="panel-premium group flex h-full flex-col gap-3 p-5 transition-transform duration-300 hover:-translate-y-0.5"
    >
      <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-ink">
        {item.course.title}
      </h3>
      {item.course.short_desc && (
        <p className="line-clamp-2 text-xs text-ink-soft">
          {item.course.short_desc}
        </p>
      )}
      <div className="mt-auto">
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
          <span>
            {item.completedCount}/{item.lessonCount} {dict.courses.lessons}
          </span>
          <span className="tabular-nums">{item.progressPct}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-500"
            style={{ width: `${item.progressPct}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
