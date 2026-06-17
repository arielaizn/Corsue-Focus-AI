import Link from "next/link";
import { isLocale, defaultLocale, dir, type Locale } from "@/lib/i18n";
import { requireStudent } from "@/lib/auth";
import { learnDict } from "@/components/learn/dictionary";
import { getQuizForTaker } from "@/lib/data/quiz-taker";
import { EmptyState } from "@/components/dashboard/ui";
import { QuizTaker } from "@/components/learn/QuizTaker";

export const dynamic = "force-dynamic";

/**
 * Quiz taker entry. RSC: guards the learner, loads the quiz (with answer keys
 * stripped) and renders the client taker. If the quiz can't be loaded — wrong
 * course, not enrolled, or unreadable — show a calm empty state back into the
 * course.
 */
export default async function QuizTakerPage({
  params,
}: {
  params: Promise<{ locale: string; courseId: string; quizId: string }>;
}) {
  const { locale: raw, courseId, quizId } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;

  await requireStudent(
    locale,
    `/${locale}/learn/c/${courseId}/quiz/${quizId}`,
  );

  const t = learnDict[locale];
  const data = await getQuizForTaker(courseId, quizId);

  if (!data || data.questions.length === 0) {
    return (
      <div dir={dir(locale)} className="mx-auto max-w-2xl px-4 py-12">
        <EmptyState
          title={t.quiz.title}
          body={t.errors.loadFailed}
          cta={{
            label: t.quiz.backToCourse,
            href: `/${locale}/learn/c/${courseId}`,
          }}
        />
      </div>
    );
  }

  return (
    <div dir={dir(locale)} className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <div className="mb-6">
        <Link
          href={`/${locale}/learn/c/${courseId}`}
          className="text-xs font-semibold text-muted transition-colors hover:text-ink"
        >
          ← {t.quiz.backToCourse}
        </Link>
      </div>
      <QuizTaker
        locale={locale}
        courseId={courseId}
        quiz={data.quiz}
        questions={data.questions}
        attemptsUsed={data.attemptsUsed}
        maxAttempts={data.maxAttempts}
      />
    </div>
  );
}
