"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { LearnDict } from "@/components/learn/dictionary";
import { IconSpark } from "@/components/ai/icons";

/* ---------------------------------------------------------------------------
   TutorPanel — an AI tutor chat grounded in the current lesson.

   Streams replies from POST /api/ai/chat (SSE of StreamChunk JSON) — the same
   gateway the marketing surface uses, with task:"tutor". The lesson is injected
   as a `system` prompt (title + summary/body) so answers stay on-topic. The
   conversation lives in client state; nothing is persisted.

   Visual: the credible dark chat surface from ChatPanel (gilt assistant badge,
   logical bubble alignment for RTL/LTR).
--------------------------------------------------------------------------- */

interface Turn {
  role: "user" | "assistant";
  content: string;
}

type StreamChunk =
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

export interface TutorPanelProps {
  dict: LearnDict["player"];
  errorText: string;
  academyId: string;
  lessonTitle: string;
  /** Lesson ai_summary or body excerpt — grounds the tutor. */
  lessonContext: string;
}

export function TutorPanel({
  dict,
  errorText,
  academyId,
  lessonTitle,
  lessonContext,
}: TutorPanelProps) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [errored, setErrored] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const system = buildSystem(lessonTitle, lessonContext);

  // Keep the latest message in view as it streams.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, streaming]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const text = input.trim();
      if (!text || streaming) return;

      setErrored(false);
      setInput("");

      const nextTurns: Turn[] = [...turns, { role: "user", content: text }];
      // Append an empty assistant turn we stream into.
      setTurns([...nextTurns, { role: "assistant", content: "" }]);
      setStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            task: "tutor",
            academyId,
            system,
            messages: nextTurns.map((t) => ({
              role: t.role,
              content: t.content,
            })),
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error("request_failed");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let got = false;

        // Parse the SSE stream: lines of `data: {json}\n\n`.
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            const payload = line.slice(5).trim();
            if (!payload) continue;
            let chunk: StreamChunk;
            try {
              chunk = JSON.parse(payload) as StreamChunk;
            } catch {
              continue;
            }
            if (chunk.type === "delta" && chunk.text) {
              got = true;
              setTurns((prev) => appendToLast(prev, chunk.text));
            } else if (chunk.type === "error") {
              throw new Error(chunk.message || "stream_error");
            }
          }
        }

        if (!got) throw new Error("empty");
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        setErrored(true);
        // Drop the empty/failed assistant bubble.
        setTurns((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === "assistant" && last.content === "") {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } finally {
        setStreaming(false);
        abortRef.current = null;
      }
    },
    [input, streaming, turns, academyId, system],
  );

  return (
    <div className="panel-couture flex h-[28rem] flex-col overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-line/70 bg-bg-deep/50 px-4 py-3.5">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-surface-2 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]">
          <IconSpark width={16} height={16} />
        </span>
        <p className="truncate text-sm font-semibold text-ink">
          {dict.aiTutor}
        </p>
      </div>

      {/* conversation */}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-5"
      >
        {turns.length === 0 && (
          <p className="m-auto max-w-xs text-center text-sm text-muted">
            {dict.tutorPlaceholder}
          </p>
        )}
        {turns.map((t, i) =>
          t.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-[82%] rounded-lg rounded-ee-sm bg-surface-2 px-3.5 py-2.5 text-sm whitespace-pre-wrap text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]">
                {t.content}
              </p>
            </div>
          ) : (
            <div key={i} className="flex justify-start">
              <p className="max-w-[88%] rounded-lg rounded-ss-sm bg-[oklch(0.55_0.11_250_/_0.12)] px-3.5 py-2.5 text-sm whitespace-pre-wrap text-ink [box-shadow:inset_0_0_0_1px_oklch(0.55_0.11_250_/_0.3)]">
                {t.content || (streaming ? <Dots /> : "")}
              </p>
            </div>
          ),
        )}
        {errored && (
          <p className="text-center text-xs text-rose-300/80">{errorText}</p>
        )}
      </div>

      {/* composer */}
      <form
        onSubmit={send}
        className="mt-auto border-t border-line/70 px-4 pt-3 pb-4 sm:px-5"
      >
        <div className="flex items-center gap-2 rounded-lg bg-bg-deep/70 px-3 py-2 [box-shadow:inset_0_0_0_1px_var(--color-line)] focus-within:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.45)]">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={dict.tutorPlaceholder}
            aria-label={dict.aiTutor}
            disabled={streaming}
            className="flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            aria-label={dict.tutorSend}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-surface-2 text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)] transition-opacity disabled:opacity-40"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className="rtl:-scale-x-100"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}

function appendToLast(turns: Turn[], text: string): Turn[] {
  const next = turns.slice();
  const last = next[next.length - 1];
  if (last && last.role === "assistant") {
    next[next.length - 1] = { ...last, content: last.content + text };
  }
  return next;
}

function buildSystem(title: string, context: string): string {
  const grounding = context.trim()
    ? `\n\nLesson material:\n"""\n${context.slice(0, 4000)}\n"""`
    : "";
  return (
    `You are a warm, encouraging tutor helping a student understand the lesson "${title}". ` +
    `Answer concisely and only about this lesson's material; if a question is outside it, gently steer back. ` +
    `Reply in the student's language (Hebrew or English) matching their message.` +
    grounding
  );
}

function Dots() {
  return (
    <span className="inline-flex gap-1 align-middle">
      <span className="size-1.5 animate-pulse rounded-full bg-ink-soft/70" />
      <span className="size-1.5 animate-pulse rounded-full bg-ink-soft/70 [animation-delay:150ms]" />
      <span className="size-1.5 animate-pulse rounded-full bg-ink-soft/70 [animation-delay:300ms]" />
    </span>
  );
}

export default TutorPanel;
