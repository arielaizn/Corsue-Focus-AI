"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import type { LearnDict } from "@/components/learn/dictionary";
import { addNoteAction, deleteNoteAction } from "@/app/[locale]/learn/actions";

/* ---------------------------------------------------------------------------
   NotesPanel — the learner's private notes for a lesson. Server-rendered list
   (passed as props from the RSC), with add + delete driven by the learn server
   actions (which re-derive the user and revalidate the page). The composer
   clears itself on submit; pending states use useFormStatus.
--------------------------------------------------------------------------- */

export interface NoteItem {
  id: string;
  body: string;
  created_at: string;
  position_s: number | null;
}

export interface NotesPanelProps {
  locale: Locale;
  dict: LearnDict["player"];
  courseId: string;
  lessonId: string;
  notes: NoteItem[];
}

export function NotesPanel({
  locale,
  dict,
  courseId,
  lessonId,
  notes,
}: NotesPanelProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <form
        ref={formRef}
        action={async (fd) => {
          await addNoteAction(fd);
          formRef.current?.reset();
        }}
        className="flex flex-col gap-3"
      >
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="courseId" value={courseId} />
        <input type="hidden" name="lessonId" value={lessonId} />
        <textarea
          name="body"
          required
          rows={3}
          placeholder={dict.notePlaceholder}
          className="w-full resize-y rounded-[8px] bg-bg-deep/70 px-3.5 py-3 text-sm text-ink placeholder:text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:outline-none focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.45)]"
        />
        <SaveButton label={dict.saveNote} />
      </form>

      {notes.length > 0 && (
        <ul className="flex flex-col gap-2">
          {notes.map((n) => (
            <li
              key={n.id}
              className="panel-couture flex items-start gap-3 px-4 py-3"
            >
              <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
                {n.body}
              </p>
              <form action={deleteNoteAction} className="shrink-0">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="courseId" value={courseId} />
                <input type="hidden" name="noteId" value={n.id} />
                <DeleteButton />
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SaveButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink text-bg-deep inline-flex w-fit items-center justify-center rounded-[6px] px-5 py-2.5 text-sm font-semibold transition-transform duration-300 hover:-translate-y-px disabled:opacity-60 disabled:hover:translate-y-0"
    >
      {label}
    </button>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="delete"
      className="grid size-7 place-items-center rounded-md text-muted transition-colors hover:bg-surface/60 hover:text-ink disabled:opacity-50"
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-13M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" />
      </svg>
    </button>
  );
}

export default NotesPanel;
