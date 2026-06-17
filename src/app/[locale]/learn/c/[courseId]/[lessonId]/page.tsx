import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import {
  getCoursePlayer,
  getLessonForPlayer,
  getLessonNotes,
  type CoursePlayer,
} from "@/lib/data/learn";
import { learnDict } from "@/components/learn/dictionary";
import { completeLessonAction } from "@/app/[locale]/learn/actions";
import { VideoStage, type MediaMeta } from "@/components/learn/player/VideoStage";
import { NotesPanel } from "@/components/learn/player/NotesPanel";
import { TutorPanel } from "@/components/learn/player/TutorPanel";
import { PlayerTabs } from "@/components/learn/player/PlayerTabs";
import { renderMarkdown } from "@/components/learn/player/markdown";

export const dynamic = "force-dynamic";

/* ---------------------------------------------------------------------------
   COURSE PLAYER — the centerpiece of the learner surface.

   RSC: guards the learner, loads the player + the single lesson, and lays out a
   two-column, RTL-aware stage (content) + lesson sidebar (module→lesson tree).
   Beneath the stage sit the tabs (Overview / Notes / AI Tutor / Resources),
   prev/next nav, a "mark complete" server-action form, and a quiz CTA. Heavy
   work stays on the server; only the interactive bits (video heartbeat, tabs,
   notes composer, tutor stream) are client components.
--------------------------------------------------------------------------- */

type LessonRow = Awaited<ReturnType<typeof getLessonForPlayer>>;

/** Flatten the published tree to an ordered lesson list for prev/next. */
function flatLessons(player: CoursePlayer) {
  const out: {
    id: string;
    title: string;
    moduleTitle: string;
    moduleId: string;
  }[] = [];
  for (const m of player.modules) {
    for (const l of m.lessons) {
      out.push({
        id: l.id,
        title: l.title,
        moduleTitle: m.title,
        moduleId: m.id,
      });
    }
  }
  return out;
}

export default async function CoursePlayerPage({
  params,
}: {
  params: Promise<{ locale: string; courseId: string; lessonId: string }>;
}) {
  const { locale: raw, courseId, lessonId } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = learnDict[locale].player;

  await requireStudent(locale, `/${locale}/learn/c/${courseId}/${lessonId}`);

  const player = await getCoursePlayer(courseId);
  if (!player) {
    await redirectToStorefront(locale, courseId);
    return null;
  }

  const lessonData = await getLessonForPlayer(courseId, lessonId);
  if (!lessonData) {
    // Lesson missing/unpublished → resume into a valid lesson.
    if (player.firstIncompleteLessonId) {
      redirect(`/${locale}/learn/c/${courseId}/${player.firstIncompleteLessonId}`);
    }
    redirect(`/${locale}/learn/courses`);
  }

  const { lesson, resources, quiz } = lessonData as NonNullable<LessonRow>;
  const flat = flatLessons(player);
  const idx = flat.findIndex((l) => l.id === lessonId);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;

  const progress = player.progressByLesson[lessonId];
  const isCompleted = progress?.status === "completed";
  const initialPositionS = progress?.last_position_s ?? 0;

  const notes = await getLessonNotes(lessonId);

  const mediaMeta = parseMediaMeta(lesson.media_meta);

  // Tutor grounding: prefer the AI summary, fall back to the lesson body.
  const tutorContext =
    (lesson.ai_summary && lesson.ai_summary.trim()) ||
    (lesson.body && lesson.body.trim()) ||
    "";

  const courseTitle = player.course.title;

  const tabs = [
    {
      id: "overview",
      label: t.overview,
      content: (
        <article className="text-sm leading-relaxed text-ink-soft">
          {lesson.body && lesson.body.trim() ? (
            renderMarkdown(lesson.body)
          ) : (
            <p className="text-muted">{lesson.title}</p>
          )}
        </article>
      ),
    },
    {
      id: "notes",
      label: t.notes,
      content: (
        <NotesPanel
          locale={locale}
          dict={t}
          courseId={courseId}
          lessonId={lessonId}
          notes={notes.map((n) => ({
            id: n.id,
            body: n.body,
            created_at: n.created_at,
            position_s: n.position_s,
          }))}
        />
      ),
    },
    {
      id: "tutor",
      label: t.aiTutor,
      content: (
        <TutorPanel
          dict={t}
          errorText={learnDict[locale].errors.generic}
          academyId={lesson.academy_id}
          lessonTitle={lesson.title}
          lessonContext={tutorContext}
        />
      ),
    },
    {
      id: "resources",
      label: t.resources,
      content: <ResourcesPanel resources={resources} emptyLabel={t.resources} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* breadcrumb / back */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/${locale}/learn/courses`}
          className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink"
        >
          <span aria-hidden className="rtl:rotate-180">
            ←
          </span>
          {t.backToCourses}
        </Link>
        <span className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {courseTitle}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_19rem] lg:items-start">
        {/* ---- MAIN STAGE ---- */}
        <div className="flex min-w-0 flex-col gap-6">
          <div>
            <h1 className="mb-4 font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
              {lesson.title}
            </h1>
            <VideoStage
              lessonId={lessonId}
              contentType={lesson.content_type}
              mediaUrl={lesson.media_url}
              body={lesson.body}
              initialPositionS={initialPositionS}
              mediaMeta={mediaMeta}
              emptyLabel={lesson.title}
              locale={locale}
              captionsLabel={t.captions}
            />
          </div>

          {/* action row: mark complete + quiz CTA */}
          <div className="flex flex-wrap items-center gap-3 border-line/50 pb-1 [border-block-start:1px_solid_var(--color-line)] pt-5">
            {isCompleted ? (
              <span className="inline-flex items-center gap-2 rounded-[6px] px-5 py-2.5 text-sm font-semibold text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)]">
                <CheckIcon />
                {t.completed}
              </span>
            ) : (
              <form action={completeLessonAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="courseId" value={courseId} />
                <input type="hidden" name="lessonId" value={lessonId} />
                <button
                  type="submit"
                  className="bg-ink text-bg-deep inline-flex items-center gap-2 rounded-[6px] px-5 py-2.5 text-sm font-semibold transition-transform duration-300 hover:-translate-y-px"
                >
                  <CheckIcon />
                  {t.markComplete}
                </button>
              </form>
            )}

            {quiz && (
              <Link
                href={`/${locale}/learn/c/${courseId}/quiz/${quiz.id}`}
                className="inline-flex items-center gap-2 rounded-[6px] px-5 py-2.5 text-sm font-semibold text-ink transition-colors [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.4)] hover:text-gold"
              >
                <span aria-hidden className="text-gold/80">
                  ◇
                </span>
                {t.takeQuiz}
              </Link>
            )}
          </div>

          {/* tabs */}
          <PlayerTabs tabs={tabs} initialId="overview" />

          {/* prev / next */}
          <nav className="flex items-center justify-between gap-3 border-line/50 pt-5 [border-block-start:1px_solid_var(--color-line)]">
            {prev ? (
              <Link
                href={`/${locale}/learn/c/${courseId}/${prev.id}`}
                className="group inline-flex max-w-[45%] flex-col items-start rounded-[8px] px-3 py-2 text-start transition-colors hover:bg-surface/40"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                  <span aria-hidden className="rtl:rotate-180">
                    ←
                  </span>{" "}
                  {t.prevLesson}
                </span>
                <span className="truncate text-sm font-medium text-ink-soft group-hover:text-ink">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/${locale}/learn/c/${courseId}/${next.id}`}
                className="group inline-flex max-w-[45%] flex-col items-end rounded-[8px] px-3 py-2 text-end transition-colors hover:bg-surface/40"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
                  {t.nextLesson}{" "}
                  <span aria-hidden className="rtl:rotate-180">
                    →
                  </span>
                </span>
                <span className="truncate text-sm font-medium text-ink-soft group-hover:text-ink">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        {/* ---- LESSON SIDEBAR (module → lesson tree) ---- */}
        <aside className="panel-couture flex max-h-[78vh] flex-col gap-1 overflow-y-auto p-3 lg:sticky lg:top-24">
          <p className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            {t.lessons}
          </p>
          {player.modules.map((m) => (
            <div key={m.id} className="mb-1">
              <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted/80">
                {m.title}
              </p>
              {m.lessons.map((l) => {
                const active = l.id === lessonId;
                const done =
                  player.progressByLesson[l.id]?.status === "completed";
                return (
                  <Link
                    key={l.id}
                    href={`/${locale}/learn/c/${courseId}/${l.id}`}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                      active
                        ? "bg-surface-2/70 text-ink [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.28)]"
                        : "text-ink-soft hover:bg-surface-2/40 hover:text-ink"
                    }`}
                  >
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-gold"
                      />
                    )}
                    <span
                      aria-hidden
                      className={`grid size-4 shrink-0 place-items-center rounded-full text-[0.6rem] ${
                        done
                          ? "bg-gold text-bg-deep"
                          : "[box-shadow:inset_0_0_0_1px_var(--color-line)]"
                      }`}
                    >
                      {done ? "✓" : ""}
                    </span>
                    <span className="truncate">{l.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

/** Resources list (downloadable lesson attachments). */
function ResourcesPanel({
  resources,
  emptyLabel,
}: {
  resources: { id: string; title: string; url: string; mime_type: string | null }[];
  emptyLabel: string;
}) {
  if (resources.length === 0) {
    return <p className="text-sm text-muted">— {emptyLabel} —</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {resources.map((r) => (
        <li key={r.id}>
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer noopener"
            className="panel-couture flex items-center gap-3 px-4 py-3 text-sm text-ink transition-colors hover:text-gold"
          >
            <span
              aria-hidden
              className="grid size-8 shrink-0 place-items-center rounded-md bg-surface-2 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
              </svg>
            </span>
            <span className="flex-1 truncate font-medium">{r.title}</span>
            <span aria-hidden className="text-gold/70 rtl:-scale-x-100">
              ↓
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/** Parse the lesson's media_meta JSON into a typed MediaMeta (defensive). */
function parseMediaMeta(raw: unknown): MediaMeta | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const chapters = Array.isArray(o.chapters)
    ? o.chapters
        .filter(
          (c): c is { t: number; label?: string } =>
            !!c &&
            typeof c === "object" &&
            typeof (c as { t?: unknown }).t === "number",
        )
        .map((c) => ({
          t: c.t,
          label: typeof c.label === "string" ? c.label : undefined,
        }))
    : undefined;
  return {
    duration_s: typeof o.duration_s === "number" ? o.duration_s : undefined,
    chapters,
    captions_url:
      typeof o.captions_url === "string" ? o.captions_url : undefined,
    transcript_url:
      typeof o.transcript_url === "string" ? o.transcript_url : undefined,
  };
}

/** Resolve the academy slug for a course and redirect to its storefront page. */
async function redirectToStorefront(
  locale: Locale,
  courseId: string,
): Promise<never> {
  let slug: string | null = null;
  try {
    const supabase = createClient(await cookies());
    const { data: course } = await supabase
      .from("courses")
      .select("academy_id")
      .eq("id", courseId)
      .maybeSingle();
    if (course) {
      const { data: academy } = await supabase
        .from("academies")
        .select("slug")
        .eq("id", course.academy_id)
        .maybeSingle();
      slug = academy?.slug ?? null;
    }
  } catch {
    slug = null;
  }

  if (slug) redirect(`/${locale}/a/${slug}/c/${courseId}`);
  redirect(`/${locale}/learn/courses`);
}
