"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ContentType } from "@/lib/data/courses.shared";
import { defaultLocale, type Locale } from "@/lib/i18n";
import { renderMarkdown } from "./markdown";

/* ---------------------------------------------------------------------------
   VideoStage — the lesson content stage. Renders per content_type:

   • video / audio → native <video>/<audio>, resumes from initialPositionS,
     and reports watch progress to /api/learn/progress on a ~10s throttle plus
     on pause / tab-hide (sendBeacon, so it survives navigation/unload).
   • text          → rendered lesson markdown body.
   • pdf / embed   → sandboxed <iframe>.
   • image         → the image.
   • link          → a prominent outbound link card.

   The stage is flat true-black with gilt accents (Obsidian Couture), echoing
   the LessonPlayerMock: no glow, hairline rims, chapter ticks under the bar.
--------------------------------------------------------------------------- */

const HEARTBEAT_MS = 10_000;

export interface Chapter {
  t: number;
  label?: string;
}

export interface MediaMeta {
  duration_s?: number;
  chapters?: Chapter[];
  captions_url?: string;
  transcript_url?: string;
}

export interface VideoStageProps {
  lessonId: string;
  contentType: ContentType;
  mediaUrl: string | null;
  body: string | null;
  initialPositionS: number;
  mediaMeta: MediaMeta | null;
  /** Localized fallback for lessons with no content yet. */
  emptyLabel: string;
  /**
   * Page locale — drives the captions <track> srcLang (he/en) instead of a
   * hardcoded "he". Optional so existing call sites keep working; defaults to
   * the app default locale when omitted.
   */
  locale?: Locale;
  /**
   * Localized captions <track> label (learnDict.player.captions). Optional;
   * when omitted, a locale-appropriate fallback is used instead of the literal
   * "captions" so the label is never an untranslated hardcoded string.
   */
  captionsLabel?: string;
}

/** Best-effort progress POST. Uses sendBeacon when leaving, fetch otherwise. */
function reportProgress(
  lessonId: string,
  positionS: number,
  watchPercent: number,
  leaving: boolean,
): void {
  const payload = JSON.stringify({
    lessonId,
    positionS: Math.max(0, Math.round(positionS)),
    watchPercent: Math.min(100, Math.max(0, Math.round(watchPercent))),
  });

  try {
    if (leaving && typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/learn/progress", blob);
      return;
    }
    void fetch("/api/learn/progress", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    });
  } catch {
    // Heartbeat is best-effort — never surface failures to the learner.
  }
}

export function VideoStage({
  lessonId,
  contentType,
  mediaUrl,
  body,
  initialPositionS,
  mediaMeta,
  emptyLabel,
  locale,
  captionsLabel,
}: VideoStageProps) {
  const isTimed = contentType === "video" || contentType === "audio";

  // Resolve the captions locale/label once, with safe fallbacks so the
  // <track> is never hardcoded to "he"/"captions" even if a caller omits them.
  const captionsLocale: Locale = locale ?? defaultLocale;
  const resolvedCaptionsLabel =
    captionsLabel ?? (captionsLocale === "he" ? "כתוביות" : "Captions");

  if (isTimed && mediaUrl) {
    return (
      <TimedMedia
        lessonId={lessonId}
        contentType={contentType}
        mediaUrl={mediaUrl}
        initialPositionS={initialPositionS}
        mediaMeta={mediaMeta}
        locale={captionsLocale}
        captionsLabel={resolvedCaptionsLabel}
      />
    );
  }

  if (contentType === "image" && mediaUrl) {
    return (
      <StageShell>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={mediaUrl}
          alt=""
          className="h-full w-full object-contain"
        />
      </StageShell>
    );
  }

  if ((contentType === "pdf" || contentType === "embed") && mediaUrl) {
    return (
      <StageShell>
        <iframe
          src={mediaUrl}
          title="lesson-content"
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          allow="fullscreen"
        />
      </StageShell>
    );
  }

  if (contentType === "link" && mediaUrl) {
    return (
      <a
        href={mediaUrl}
        target="_blank"
        rel="noreferrer noopener"
        className="panel-couture flex items-center justify-between gap-4 px-5 py-4 text-sm font-medium text-ink transition-colors hover:text-gold"
      >
        <span className="truncate">{mediaUrl}</span>
        <span aria-hidden className="text-gold rtl:-scale-x-100">
          ↗
        </span>
      </a>
    );
  }

  // text / markdown — or any type with only a body.
  if (body && body.trim()) {
    return (
      <article className="panel-couture px-5 py-6 sm:px-7">
        <div className="text-sm leading-relaxed text-ink-soft">
          {renderMarkdown(body)}
        </div>
      </article>
    );
  }

  return (
    <StageShell>
      <p className="text-sm text-muted">{emptyLabel}</p>
    </StageShell>
  );
}

/** Flat black 16:9 stage frame with a hairline rim — no glow. */
function StageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[8px] bg-bg-deep [background-image:linear-gradient(180deg,oklch(0.16_0_0),oklch(0.11_0_0))] [box-shadow:inset_0_0_0_1px_var(--color-line)]">
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

function TimedMedia({
  lessonId,
  contentType,
  mediaUrl,
  initialPositionS,
  mediaMeta,
  locale,
  captionsLabel,
}: {
  lessonId: string;
  contentType: ContentType;
  mediaUrl: string;
  initialPositionS: number;
  mediaMeta: MediaMeta | null;
  locale: Locale;
  captionsLabel: string;
}) {
  const ref = useRef<HTMLVideoElement | HTMLAudioElement | null>(null);
  const lastSentAt = useRef(0);
  const [duration, setDuration] = useState(mediaMeta?.duration_s ?? 0);
  const [position, setPosition] = useState(initialPositionS);

  const chapters = useMemo(
    () =>
      (mediaMeta?.chapters ?? [])
        .filter((c) => typeof c.t === "number" && c.t >= 0)
        .sort((a, b) => a.t - b.t),
    [mediaMeta],
  );

  const snapshot = useCallback(
    (leaving: boolean) => {
      const el = ref.current;
      if (!el) return;
      const pos = el.currentTime || 0;
      const dur = el.duration || duration || 0;
      const pct = dur > 0 ? (pos / dur) * 100 : 0;
      reportProgress(lessonId, pos, pct, leaving);
    },
    [lessonId, duration],
  );

  // Resume from last position once metadata is known.
  const handleLoadedMetadata = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (el.duration && Number.isFinite(el.duration)) setDuration(el.duration);
    if (
      initialPositionS > 0 &&
      initialPositionS < (el.duration || Infinity) - 1
    ) {
      try {
        el.currentTime = initialPositionS;
      } catch {
        // some sources reject seeks before fully ready — ignore.
      }
    }
  }, [initialPositionS]);

  const handleTimeUpdate = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setPosition(el.currentTime || 0);
    const now = Date.now();
    if (now - lastSentAt.current >= HEARTBEAT_MS) {
      lastSentAt.current = now;
      snapshot(false);
    }
  }, [snapshot]);

  const handlePause = useCallback(() => snapshot(false), [snapshot]);
  const handleEnded = useCallback(() => snapshot(false), [snapshot]);

  // Keep a ref to the latest snapshot so the flush effect can mount ONCE
  // (its handlers always call the freshest snapshot without re-subscribing).
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  // Flush on tab-hide and on unmount (sendBeacon survives both). Mounts once:
  // both listeners are named so cleanup removes exactly what it added — no
  // leaked pagehide handlers across the snapshot's identity changes.
  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "hidden") snapshotRef.current(true);
    }
    function onPageHide() {
      snapshotRef.current(true);
    }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      snapshotRef.current(true);
    };
  }, []);

  const captions = mediaMeta?.captions_url;
  const playedPct =
    duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  if (contentType === "audio") {
    return (
      <div className="panel-couture flex flex-col gap-3 px-5 py-5">
        <audio
          ref={ref as React.RefObject<HTMLAudioElement>}
          src={mediaUrl}
          controls
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPause={handlePause}
          onEnded={handleEnded}
          className="w-full"
        />
        <ChapterTrack
          chapters={chapters}
          duration={duration}
          playedPct={playedPct}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-[8px] bg-bg-deep [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        <video
          ref={ref as React.RefObject<HTMLVideoElement>}
          src={mediaUrl}
          controls
          playsInline
          preload="metadata"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPause={handlePause}
          onEnded={handleEnded}
          className="h-full w-full bg-black"
        >
          {captions && (
            <track
              kind="captions"
              src={captions}
              srcLang={locale}
              label={captionsLabel}
              default
            />
          )}
        </video>
      </div>
      <ChapterTrack
        chapters={chapters}
        duration={duration}
        playedPct={playedPct}
      />
    </div>
  );
}

/** Gilt progress track with chapter ticks — purely a visual aid (read-only). */
function ChapterTrack({
  chapters,
  duration,
  playedPct,
}: {
  chapters: Chapter[];
  duration: number;
  playedPct: number;
}) {
  if (duration <= 0 && chapters.length === 0) return null;
  return (
    <div className="px-1">
      <div className="relative h-1 rounded-full bg-bg-deep/80 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
        <div
          className="h-full rounded-full bg-gold-grad"
          style={{ inlineSize: `${playedPct}%` }}
        />
        {duration > 0 &&
          chapters.map((c, i) => {
            const left = Math.min(100, Math.max(0, (c.t / duration) * 100));
            return (
              <span
                key={i}
                title={c.label}
                aria-hidden
                className="absolute -top-0.5 h-2 w-0.5 -translate-x-1/2 rounded-full bg-gold/60"
                style={{ insetInlineStart: `${left}%` }}
              />
            );
          })}
      </div>
      {chapters.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {chapters.map(
            (c, i) =>
              c.label && (
                <li key={i} className="text-[11px] text-muted">
                  <span className="text-gold/70 tabular-nums">
                    {formatTime(c.t)}
                  </span>{" "}
                  {c.label}
                </li>
              ),
          )}
        </ul>
      )}
    </div>
  );
}

function formatTime(s: number): string {
  const sec = Math.max(0, Math.round(s));
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export default VideoStage;
