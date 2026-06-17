import { isLocale, type Locale } from "@/lib/i18n";
import { getUserAndAcademies, type MembershipWithAcademy } from "@/lib/auth";
import { aiConfigured } from "@/lib/ai/gateway";
import {
  listPendingSubmissions,
  listGradedSubmissions,
  recentQuizAttempts,
} from "@/lib/data/grading";
import { gradingDict } from "@/components/dashboard/grading/dict";
import { PageHeader, EmptyState } from "@/components/dashboard/ui";
import { GradingIcon, AcademyIcon } from "@/components/dashboard/icons";
import { SubmissionCard } from "@/components/dashboard/grading/SubmissionCard";
import { GradedList } from "@/components/dashboard/grading/GradedList";
import { GradingTabs } from "@/components/dashboard/grading/GradingTabs";
import { QuizAttempts } from "@/components/dashboard/grading/QuizAttempts";
import { MyWorkList } from "@/components/dashboard/grading/MyWorkList";

export const dynamic = "force-dynamic";

export default async function GradingPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ academy?: string }>;
}) {
  const { locale: raw } = await params;
  const { academy: academyParam } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const t = gradingDict[locale];

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
  // Graders are owner/admin/instructor; students get a read-only view.
  const canWrite =
    active.role === "owner" ||
    active.role === "admin" ||
    active.role === "instructor";

  const aiReady = aiConfigured();

  const [pending, graded, attempts] = await Promise.all([
    listPendingSubmissions(academyId),
    listGradedSubmissions(academyId),
    recentQuizAttempts(academyId),
  ]);

  // Plain students see ONLY their own work, framed as "my submissions & grades"
  // — no grader language (no review queue, no pending-to-grade, no grade form).
  // RLS already scopes these reads to the signed-in student, so we simply
  // re-label and merge their pending (awaiting grade) + graded rows.
  if (!canWrite) {
    const mine = [...pending, ...graded].sort(
      (a, b) =>
        new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(),
    );

    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          kicker={t.mine.kicker}
          title={t.mine.title}
          subtitle={t.mine.subtitle}
        />

        {mine.length === 0 ? (
          <EmptyState
            icon={<GradingIcon width={26} height={26} />}
            title={t.mine.emptyTitle}
            body={t.mine.emptyBody}
          />
        ) : (
          <MyWorkList locale={locale} submissions={mine} />
        )}
      </div>
    );
  }

  const pendingPanel =
    pending.length === 0 ? (
      <EmptyState
        icon={<GradingIcon width={26} height={26} />}
        title={t.index.emptyPending.title}
        body={t.index.emptyPending.body}
      />
    ) : (
      <ul className="grid gap-4 xl:grid-cols-2">
        {pending.map((s) => (
          <li key={s.id}>
            <SubmissionCard
              locale={locale}
              academyId={academyId}
              submission={s}
              canWrite={canWrite}
              aiConfigured={aiReady}
            />
          </li>
        ))}
      </ul>
    );

  const gradedPanel =
    graded.length === 0 ? (
      <EmptyState
        icon={<GradingIcon width={26} height={26} />}
        title={t.index.emptyGraded.title}
        body={t.index.emptyGraded.body}
      />
    ) : (
      <GradedList
        locale={locale}
        submissions={graded}
        canWrite={canWrite}
        academyId={academyId}
        aiConfigured={aiReady}
      />
    );

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        kicker={active.academy.name}
        title={t.index.title}
        subtitle={t.index.subtitle}
      />

      <GradingTabs
        locale={locale}
        pendingCount={pending.length}
        gradedCount={graded.length}
        pending={pendingPanel}
        graded={gradedPanel}
      />

      <QuizAttempts locale={locale} attempts={attempts} />
    </div>
  );
}
