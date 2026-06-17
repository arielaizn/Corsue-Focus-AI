"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { Panel } from "@/components/dashboard/ui";
import type { ModuleWithLessons } from "@/lib/data/courses.shared";

/* ---------------------------------------------------------------------------
   AI Video Studio panel (#5/#7). Enqueues a video-generation job for a lesson
   and polls its status. Heavy work runs in the separate engine worker — this
   panel only enqueues (202) and polls; it never blocks on the render.
--------------------------------------------------------------------------- */

const COPY = {
  he: {
    title: "סטודיו וידאו ב-AI",
    desc: "הפוך שיעור לסרטון מנחה בעברית — תסריט, שקופיות RTL, קריינות ואווטאר. העבודה רצה ברקע במנוע הנפרד; הסטטוס מתעדכן כאן.",
    topic: "נושא הסרטון",
    topicPh: "לדוגמה: השקיה נכונה של צמחי בית",
    lesson: "שיעור יעד",
    noLessons: "אין שיעורים — הוסף שיעור כדי לחבר אליו סרטון.",
    submit: "צור סרטון",
    pending: "מתזמן…",
    statusLabel: "סטטוס",
    watch: "צפה בסרטון",
    badge: "AI",
    status: {
      queued: "בתור",
      running: "מייצר תוכן…",
      awaiting_approval: "ממתין לאישור",
      rendering: "מרנדר…",
      done: "מוכן",
      failed: "נכשל",
    } as Record<string, string>,
  },
  en: {
    title: "AI Video Studio",
    desc: "Turn a lesson into a Hebrew presenter video — script, RTL slides, narration and an avatar. Work runs in the separate engine worker; status updates here.",
    topic: "Video topic",
    topicPh: "e.g. How to water houseplants",
    lesson: "Target lesson",
    noLessons: "No lessons yet — add one to attach a video to it.",
    submit: "Generate video",
    pending: "Queuing…",
    statusLabel: "Status",
    watch: "Watch video",
    badge: "AI",
    status: {
      queued: "Queued",
      running: "Generating…",
      awaiting_approval: "Awaiting approval",
      rendering: "Rendering…",
      done: "Ready",
      failed: "Failed",
    } as Record<string, string>,
  },
} as const;

const field =
  "w-full rounded-lg bg-surface-2/50 px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.5)]";

interface JobView {
  status: string;
  outputUrl: string | null;
  error: string | null;
}

export function VideoStudioPanel({
  locale,
  academyId,
  courseId,
  modules,
}: {
  locale: Locale;
  academyId: string;
  courseId: string;
  modules: ModuleWithLessons[];
}) {
  const t = COPY[locale];
  const lessons = modules.flatMap((m) =>
    m.lessons.map((l) => ({ id: l.id, label: `${m.title} / ${l.title}` })),
  );

  const [topic, setTopic] = useState("");
  const [lessonId, setLessonId] = useState(lessons[0]?.id ?? "");
  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<JobView | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // poll the job until it reaches a terminal state
  useEffect(() => {
    if (!jobId) return;
    const tick = async () => {
      try {
        const res = await fetch(`/api/pipeline/jobs/${jobId}`);
        if (!res.ok) return;
        const data = (await res.json()) as JobView;
        setJob(data);
        if (data.status === "done" || data.status === "failed") {
          if (timer.current) clearInterval(timer.current);
        }
      } catch {
        /* transient — keep polling */
      }
    };
    void tick();
    timer.current = setInterval(tick, 4000);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [jobId]);

  async function submit() {
    setError(null);
    if (!topic.trim() || !lessonId) return;
    setBusy(true);
    try {
      const res = await fetch("/api/pipeline/jobs", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ academyId, courseId, lessonId, topicHe: topic.trim() }),
      });
      const data = (await res.json()) as { jobId?: string; error?: string };
      if (!res.ok || !data.jobId) {
        setError(data.error ?? "failed to enqueue");
        return;
      }
      setJob({ status: "queued", outputUrl: null, error: null });
      setJobId(data.jobId);
    } catch {
      setError("network error");
    } finally {
      setBusy(false);
    }
  }

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

      {lessons.length === 0 ? (
        <p className="text-sm text-muted">{t.noLessons}</p>
      ) : (
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted">{t.topic}</span>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t.topicPh}
              className={field}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-muted">{t.lesson}</span>
            <select
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              className={field}
            >
              {lessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          {job && (
            <div className="flex flex-col gap-2 rounded-lg bg-surface-2/40 px-3 py-2.5 text-sm">
              <span className="text-ink-soft">
                {t.statusLabel}:{" "}
                <span className="font-semibold text-ink">
                  {t.status[job.status] ?? job.status}
                </span>
              </span>
              {job.status === "failed" && job.error && (
                <span className="text-red-400">{job.error}</span>
              )}
              {job.status === "done" && job.outputUrl && (
                <a
                  href={job.outputUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-gold hover:underline"
                >
                  {t.watch} →
                </a>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={submit}
            disabled={busy || !topic.trim()}
            className="bg-ink text-bg-deep inline-flex w-fit items-center justify-center rounded-[6px] px-6 py-2.5 text-sm font-semibold transition-[transform,opacity] duration-300 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? t.pending : t.submit}
          </button>
        </div>
      )}
    </Panel>
  );
}
