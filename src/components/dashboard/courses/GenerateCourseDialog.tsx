"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import {
  generateCourseAction,
  type CourseGenState,
} from "@/app/[locale]/dashboard/courses/ai-actions";
import { ghostBtn, inputCls, labelCls, dangerText } from "./styles";

/* ---------------------------------------------------------------------------
   AI Course Generator dialog (#3). One prompt → a full course (modules +
   lessons), then redirect into the builder. Sits beside the manual "New course".
--------------------------------------------------------------------------- */

const COPY = {
  he: {
    open: "צור קורס ב-AI",
    title: "מחולל קורסים ב-AI",
    desc: "תאר נושא — וה-AI יבנה קורס שלם עם מודולים ושיעורים בעברית טבעית. תועבר לעריכה.",
    topic: "נושא הקורס",
    topicPh: "לדוגמה: עריכת וידאו ב-AI למתחילים — מהרעיון לפרסום",
    audience: "קהל יעד",
    beginners: "מתחילים",
    intermediate: "בינוני",
    advanced: "מתקדם",
    modules: "מודולים",
    lessons: "שיעורים למודול",
    submit: "צור קורס",
    pending: "בונה קורס… זה עשוי לקחת רגע",
    cancel: "ביטול",
    badge: "AI",
  },
  en: {
    open: "Generate with AI",
    title: "AI Course Generator",
    desc: "Describe a topic — AI builds a full course with modules and lessons. You'll be taken to edit it.",
    topic: "Course topic",
    topicPh: "e.g. AI video editing for beginners — idea to publish",
    audience: "Audience",
    beginners: "Beginners",
    intermediate: "Intermediate",
    advanced: "Advanced",
    modules: "Modules",
    lessons: "Lessons / module",
    submit: "Generate course",
    pending: "Building course… this may take a moment",
    cancel: "Cancel",
    badge: "AI",
  },
} as const;

function SubmitButton({ label, pending: p }: { label: string; pending: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink text-bg-deep inline-flex items-center justify-center rounded-[6px] px-6 py-2.5 text-sm font-semibold transition-[transform,opacity] duration-300 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? p : label}
    </button>
  );
}

export function GenerateCourseDialog({
  locale,
  academyId,
}: {
  locale: Locale;
  academyId: string;
}) {
  const t = COPY[locale];
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<CourseGenState, FormData>(
    generateCourseAction,
    {},
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${ghostBtn} gap-2`}
      >
        <span className="inline-flex items-center rounded-full px-1.5 text-[0.6rem] font-bold tracking-wide text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.45)]">
          {t.badge}
        </span>
        {t.open}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.title}
        >
          <div
            className="absolute inset-0 bg-bg-deep/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="panel-premium glow-aurora relative z-10 w-full max-w-lg p-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold tracking-wide text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.45)]">
                {t.badge}
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
                {t.title}
              </h2>
            </div>
            <p className="mt-2 text-sm text-ink-soft">{t.desc}</p>

            <form action={action} className="mt-5 flex flex-col gap-4">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="academyId" value={academyId} />

              <label className="flex flex-col gap-1.5">
                <span className={labelCls}>{t.topic}</span>
                <textarea
                  name="topic"
                  required
                  autoFocus
                  rows={3}
                  placeholder={t.topicPh}
                  className={`${inputCls} resize-y`}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-3">
                <label className="flex flex-col gap-1.5 sm:col-span-1">
                  <span className={labelCls}>{t.audience}</span>
                  <select
                    name="audience"
                    defaultValue="beginners"
                    className={inputCls}
                  >
                    <option value="beginners">{t.beginners}</option>
                    <option value="intermediate">{t.intermediate}</option>
                    <option value="advanced">{t.advanced}</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelCls}>{t.modules}</span>
                  <input
                    name="moduleCount"
                    type="number"
                    min={2}
                    max={10}
                    defaultValue={5}
                    className={inputCls}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className={labelCls}>{t.lessons}</span>
                  <input
                    name="lessonsPerModule"
                    type="number"
                    min={2}
                    max={8}
                    defaultValue={4}
                    className={inputCls}
                  />
                </label>
              </div>

              {state.error && (
                <p className={`text-sm ${dangerText}`} role="alert">
                  {state.error}
                </p>
              )}

              <div className="mt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={ghostBtn}
                >
                  {t.cancel}
                </button>
                <SubmitButton label={t.submit} pending={t.pending} />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
