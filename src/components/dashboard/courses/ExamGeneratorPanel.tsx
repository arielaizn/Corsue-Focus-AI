"use client";

import { useActionState } from "react";
import type { Locale } from "@/lib/i18n";
import { Panel } from "@/components/dashboard/ui";
import {
  generateExamAction,
  type ExamGenState,
} from "@/app/[locale]/dashboard/courses/exam-actions";

/* ---------------------------------------------------------------------------
   AI Exam Generator panel (#13). Sits under the course builder; turns a topic
   into a saved quiz via the LLM gateway. The first user-facing AI feature.
--------------------------------------------------------------------------- */

const COPY = {
  he: {
    title: "מחולל מבחנים ב-AI",
    desc: "הפוך נושא למבחן מלא עם שאלות, תשובות והסברים — בעברית טבעית. המבחן נשמר כטיוטה לעריכה.",
    topic: "נושא המבחן",
    topicPh: "לדוגמה: יסודות עריכת וידאו ב-AI",
    count: "מספר שאלות",
    difficulty: "רמת קושי",
    beginner: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדם",
    submit: "צור מבחן",
    pending: "יוצר מבחן…",
    badge: "AI",
  },
  en: {
    title: "AI Exam Generator",
    desc: "Turn a topic into a full quiz — questions, answers and explanations. Saved as a draft you can edit.",
    topic: "Exam topic",
    topicPh: "e.g. Fundamentals of AI video editing",
    count: "Questions",
    difficulty: "Difficulty",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    submit: "Generate exam",
    pending: "Generating…",
    badge: "AI",
  },
} as const;

const field =
  "w-full rounded-lg bg-surface-2/50 px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.5)]";

export function ExamGeneratorPanel({
  locale,
  academyId,
  courseId,
}: {
  locale: Locale;
  academyId: string;
  courseId: string;
}) {
  const t = COPY[locale];
  const [state, action, pending] = useActionState<ExamGenState, FormData>(
    generateExamAction,
    {},
  );

  return (
    <Panel className="lg:col-span-2">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold tracking-wide text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.45)]">
          {t.badge}
        </span>
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
          {t.title}
        </h2>
      </div>
      <p className="mb-5 max-w-2xl text-sm text-ink-soft">{t.desc}</p>

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="academyId" value={academyId} />
        <input type="hidden" name="courseId" value={courseId} />

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-muted">{t.topic}</span>
          <input
            name="topic"
            required
            placeholder={t.topicPh}
            className={field}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted">{t.count}</span>
            <input
              name="count"
              type="number"
              min={1}
              max={20}
              defaultValue={5}
              className={field}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted">
              {t.difficulty}
            </span>
            <select name="difficulty" defaultValue="intermediate" className={field}>
              <option value="beginner">{t.beginner}</option>
              <option value="intermediate">{t.intermediate}</option>
              <option value="advanced">{t.advanced}</option>
            </select>
          </label>
        </div>

        {state.error && (
          <p className="text-sm text-red-400" role="alert">
            {state.error}
          </p>
        )}
        {state.notice && (
          <p className="text-sm text-gold" role="status">
            {state.notice}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-ink text-bg-deep inline-flex w-fit items-center justify-center rounded-[6px] px-6 py-2.5 text-sm font-semibold transition-[transform,opacity] duration-300 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? t.pending : t.submit}
        </button>
      </form>
    </Panel>
  );
}
