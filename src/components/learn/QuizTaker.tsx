"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";
import { dir, type Locale } from "@/lib/i18n";
import { learnDict } from "@/components/learn/dictionary";
import {
  startAttemptAction,
  submitQuizAction,
  type StartAttemptState,
  type SubmitQuizState,
} from "@/app/[locale]/learn/c/[courseId]/quiz/[quizId]/actions";

/* ---------------------------------------------------------------------------
   QUIZ TAKER (client). Three phases:
     1. intro    — title, pass score, attempts; a Start button.
     2. answering — one card per question; collects answers in local state.
     3. results  — score vs pass_score, per-question correct/incorrect, the
                   correct option highlighted, retry (if attempts remain),
                   and a back-to-course link.

   Answers are serialized to a single JSON field and graded server-side; the
   correct-answer key is only revealed in the results returned by the action.
--------------------------------------------------------------------------- */

type QuestionType =
  | "multiple_choice"
  | "open"
  | "true_false"
  | "match"
  | "fill_blank";

interface TakerOption {
  id: string;
  body: string;
}
interface TakerQuestion {
  id: string;
  body: string;
  question_type: QuestionType;
  points: number;
  options: TakerOption[];
}
interface TakerQuiz {
  id: string;
  title: string;
  description: string | null;
  pass_score: number;
  time_limit_s: number | null;
  max_attempts: number | null;
  course_id: string;
  lesson_id: string | null;
}

const startInitial: StartAttemptState = { ok: false };
const submitInitial: SubmitQuizState = { status: "idle" };

const auroraBtn =
  "bg-ink text-bg-deep inline-flex items-center justify-center rounded-[6px] px-6 py-3 text-sm font-semibold tracking-[0.01em] transition-[transform,background-color] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:bg-ink-soft hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0";

export function QuizTaker({
  locale,
  courseId,
  quiz,
  questions,
  attemptsUsed,
  maxAttempts,
}: {
  locale: Locale;
  courseId: string;
  quiz: TakerQuiz;
  questions: TakerQuestion[];
  attemptsUsed: number;
  maxAttempts: number | null;
}) {
  const t = learnDict[locale].quiz;
  const rtl = dir(locale) === "rtl";

  // Phase machine driven by the two action states.
  const [startState, startFormAction] = useActionState(
    startAttemptAction,
    startInitial,
  );
  const [submitState, submitFormAction] = useActionState(
    submitQuizAction,
    submitInitial,
  );

  // Local answer state: questionId -> { selectedOptionId?, openAnswer? }.
  const [answers, setAnswers] = useState<
    Record<string, { selectedOptionId?: string; openAnswer?: string }>
  >({});

  const attemptId = startState.attemptId ?? null;
  const result = submitState.status === "graded" ? submitState.result : null;

  const attemptsLeft =
    maxAttempts == null ? null : Math.max(0, maxAttempts - attemptsUsed);
  const noAttempts = attemptsLeft != null && attemptsLeft <= 0;

  const answersJson = useMemo(() => {
    return JSON.stringify(
      questions.map((q) => ({
        questionId: q.id,
        selectedOptionId: answers[q.id]?.selectedOptionId ?? null,
        openAnswer: answers[q.id]?.openAnswer ?? null,
      })),
    );
  }, [answers, questions]);

  // ---- RESULTS ------------------------------------------------------------
  if (result) {
    return (
      <ResultsView
        locale={locale}
        courseId={courseId}
        quiz={quiz}
        questions={questions}
        answers={answers}
        result={result}
        attemptsUsed={attemptsUsed}
        maxAttempts={maxAttempts}
        rtl={rtl}
      />
    );
  }

  // ---- INTRO --------------------------------------------------------------
  if (!attemptId) {
    return (
      <section className="panel-premium p-6 sm:p-8">
        <p className="text-gilt mb-2">{t.title}</p>
        <h1 className="font-[family-name:var(--font-display)] text-h2 font-bold text-ink">
          {quiz.title}
        </h1>
        {quiz.description && (
          <p className="mt-2 text-sm text-ink-soft">{quiz.description}</p>
        )}

        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <Meta label={t.passScore} value={`${quiz.pass_score}%`} />
          <Meta
            label={t.attemptsLeft}
            value={attemptsLeft == null ? "∞" : String(attemptsLeft)}
          />
        </dl>

        {startState.code === "max_attempts" || noAttempts ? (
          <p className="mt-6 text-sm font-semibold text-gold">
            {t.noAttempts}
          </p>
        ) : null}
        {startState.code === "denied" && (
          <p className="mt-6 text-sm text-gold">
            {learnDict[locale].errors.generic}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {!noAttempts && (
            <form action={startFormAction}>
              <input type="hidden" name="quizId" value={quiz.id} />
              <StartButton label={t.start} />
            </form>
          )}
          <Link
            href={`/${locale}/learn/c/${courseId}`}
            className="text-sm font-semibold text-muted transition-colors hover:text-ink"
          >
            {t.backToCourse}
          </Link>
        </div>
      </section>
    );
  }

  // ---- ANSWERING ----------------------------------------------------------
  return (
    <form action={submitFormAction} className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="courseId" value={courseId} />
      <input type="hidden" name="attemptId" value={attemptId} />
      <input type="hidden" name="answers" value={answersJson} />

      <header className="panel-premium p-6">
        <p className="text-gilt mb-1">{quiz.title}</p>
        <h1 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
          {t.title}
        </h1>
      </header>

      {submitState.status === "error" && (
        <p className="text-sm font-semibold text-gold">
          {learnDict[locale].errors.generic}
        </p>
      )}

      {questions.map((q, idx) => (
        <QuestionCard
          key={q.id}
          locale={locale}
          index={idx}
          total={questions.length}
          question={q}
          value={answers[q.id]}
          onChange={(patch) =>
            setAnswers((prev) => ({
              ...prev,
              [q.id]: { ...prev[q.id], ...patch },
            }))
          }
          rtl={rtl}
        />
      ))}

      <div className="flex items-center gap-3">
        <SubmitButton submit={t.submit} submitting={t.submitting} />
        <Link
          href={`/${locale}/learn/c/${courseId}`}
          className="text-sm font-semibold text-muted transition-colors hover:text-ink"
        >
          {t.backToCourse}
        </Link>
      </div>
    </form>
  );
}

/* --------------------------------------------------------------------------- */

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] bg-surface-2/60 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </dt>
      <dd className="mt-1 font-[family-name:var(--font-display)] text-xl font-bold tabular-nums text-ink">
        {value}
      </dd>
    </div>
  );
}

function StartButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={auroraBtn}>
      {label}
    </button>
  );
}

function SubmitButton({
  submit,
  submitting,
}: {
  submit: string;
  submitting: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={auroraBtn}>
      {pending ? submitting : submit}
    </button>
  );
}

/* --------------------------------------------------------------------------- */

function QuestionCard({
  locale,
  index,
  total,
  question,
  value,
  onChange,
  rtl,
}: {
  locale: Locale;
  index: number;
  total: number;
  question: TakerQuestion;
  value?: { selectedOptionId?: string; openAnswer?: string };
  onChange: (patch: {
    selectedOptionId?: string;
    openAnswer?: string;
  }) => void;
  rtl: boolean;
}) {
  const t = learnDict[locale].quiz;
  const isOpen = question.question_type === "open";
  // match/fill_blank are not yet auto-graded — render a clearly-marked text
  // input (writing to openAnswer) instead of radios, which have no valid
  // selection model for these types. multiple_choice/true_false stay radios.
  const isTextEntry =
    question.question_type === "match" ||
    question.question_type === "fill_blank";

  return (
    <fieldset className="panel-premium p-6">
      <legend className="sr-only">
        {t.question} {index + 1}
      </legend>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        {t.question} {index + 1} {t.of} {total}
      </p>
      <p className="mt-2 text-base font-medium text-ink">{question.body}</p>

      {isOpen ? (
        <textarea
          name={`open_${question.id}`}
          dir={rtl ? "rtl" : "ltr"}
          value={value?.openAnswer ?? ""}
          onChange={(e) => onChange({ openAnswer: e.target.value })}
          rows={4}
          className="mt-4 w-full resize-y rounded-[8px] bg-surface-2/60 px-4 py-3 text-sm text-ink outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.5)]"
        />
      ) : isTextEntry ? (
        <label className="mt-4 flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {t.yourAnswer}
          </span>
          <input
            type="text"
            name={`text_${question.id}`}
            dir={rtl ? "rtl" : "ltr"}
            value={value?.openAnswer ?? ""}
            onChange={(e) => onChange({ openAnswer: e.target.value })}
            className="w-full rounded-[8px] bg-surface-2/60 px-4 py-3 text-sm text-ink outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.5)]"
          />
        </label>
      ) : (
        <div className="mt-4 flex flex-col gap-2.5">
          {question.options.map((opt) => {
            const checked = value?.selectedOptionId === opt.id;
            return (
              <label
                key={opt.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-[8px] bg-surface-2/40 px-4 py-3 text-sm text-ink transition-[box-shadow,background-color]",
                  checked
                    ? "[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.6)]"
                    : "[box-shadow:inset_0_0_0_1px_var(--color-line)] hover:bg-surface-2/70",
                )}
              >
                <input
                  type="radio"
                  name={`q_${question.id}`}
                  value={opt.id}
                  checked={checked}
                  onChange={() => onChange({ selectedOptionId: opt.id })}
                  className="size-4 shrink-0 accent-[var(--color-gold)]"
                />
                <span>{opt.body}</span>
              </label>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}

/* --------------------------------------------------------------------------- */

function ResultsView({
  locale,
  courseId,
  quiz,
  questions,
  answers,
  result,
  attemptsUsed,
  maxAttempts,
  rtl,
}: {
  locale: Locale;
  courseId: string;
  quiz: TakerQuiz;
  questions: TakerQuestion[];
  answers: Record<string, { selectedOptionId?: string; openAnswer?: string }>;
  result: NonNullable<SubmitQuizState["result"]>;
  attemptsUsed: number;
  maxAttempts: number | null;
  rtl: boolean;
}) {
  const t = learnDict[locale].quiz;
  const pct =
    result.maxScore > 0
      ? Math.round((result.score / result.maxScore) * 100)
      : 0;

  const perQ = new Map(result.perQuestion.map((p) => [p.questionId, p]));
  // attemptsUsed is the page-load count and excludes the attempt just
  // submitted — subtract 1 more so "attempts left" / retry don't overstate by 1.
  const remaining =
    maxAttempts == null ? null : Math.max(0, maxAttempts - attemptsUsed - 1);
  const canRetry = remaining == null || remaining > 0;

  return (
    <div className="flex flex-col gap-5">
      <section
        className={cn(
          "panel-premium p-6 sm:p-8",
          result.passed && "gilt-rim",
        )}
      >
        <p className="text-gilt mb-1">{t.results}</p>
        <h1
          className={cn(
            "font-[family-name:var(--font-display)] text-h2 font-bold",
            result.passed ? "text-gold" : "text-ink",
          )}
        >
          {result.passed ? t.passed : t.failed}
        </h1>
        <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <Meta label={t.score} value={`${pct}%`} />
          <Meta label={t.passScore} value={`${quiz.pass_score}%`} />
          {remaining != null && (
            <Meta label={t.attemptsLeft} value={String(remaining)} />
          )}
        </dl>
      </section>

      <section className="panel-premium p-6">
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
          {t.review}
        </h2>
        <ol className="flex flex-col gap-4">
          {questions.map((q, idx) => {
            const outcome = perQ.get(q.id);
            // open + match/fill_blank are shown as free text (no key/badge):
            // they are not auto-graded, so a correct/incorrect mark would mislead.
            const isFreeText =
              q.question_type === "open" ||
              q.question_type === "match" ||
              q.question_type === "fill_blank";
            const correct = outcome?.correct ?? false;
            const chosenId = answers[q.id]?.selectedOptionId;
            const openText = answers[q.id]?.openAnswer ?? "";

            return (
              <li
                key={q.id}
                className="rounded-[8px] bg-surface-2/40 p-4 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-ink">
                    <span className="text-muted">
                      {t.question} {idx + 1}.{" "}
                    </span>
                    {q.body}
                  </p>
                  {!isFreeText && (
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold",
                        correct
                          ? "text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.5)]"
                          : "text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]",
                      )}
                    >
                      {correct ? t.correct : t.incorrect}
                    </span>
                  )}
                </div>

                {isFreeText ? (
                  <p
                    dir={rtl ? "rtl" : "ltr"}
                    className="mt-3 whitespace-pre-wrap text-sm text-ink-soft"
                  >
                    <span className="text-muted">{t.yourAnswer}: </span>
                    {openText || "—"}
                  </p>
                ) : (
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {q.options.map((opt) => {
                      const isChosen = opt.id === chosenId;
                      const isKey = opt.id === outcome?.correctOptionId;
                      return (
                        <li
                          key={opt.id}
                          className={cn(
                            "flex items-center gap-2 rounded-[6px] px-3 py-2 text-sm",
                            isKey
                              ? "bg-surface-2/70 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)]"
                              : isChosen
                                ? "text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
                                : "text-muted",
                          )}
                        >
                          <span
                            aria-hidden
                            className="inline-flex w-4 shrink-0 justify-center"
                          >
                            {isKey ? "✓" : isChosen ? "•" : ""}
                          </span>
                          <span>{opt.body}</span>
                          {isChosen && !isKey && (
                            <span className="ms-auto text-[0.7rem] text-muted">
                              {t.yourAnswer}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        {!result.passed && canRetry && (
          <Link
            href={`/${locale}/learn/c/${courseId}/quiz/${quiz.id}`}
            className={auroraBtn}
          >
            {t.retry}
          </Link>
        )}
        {!result.passed && !canRetry && (
          <span className="text-sm font-semibold text-gold">
            {t.noAttempts}
          </span>
        )}
        <Link
          href={`/${locale}/learn/c/${courseId}`}
          className={cn(
            "text-sm font-semibold transition-colors",
            result.passed
              ? "text-ink hover:text-gold"
              : "text-muted hover:text-ink",
          )}
        >
          {t.backToCourse}
        </Link>
      </div>
    </div>
  );
}
