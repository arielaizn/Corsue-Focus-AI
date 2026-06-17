"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import {
  gradeSubmission,
  aiDraftFeedback,
  type GradeActionState,
} from "@/app/[locale]/dashboard/grading/actions";
import { gradingDict } from "./dict";
import {
  inputCls,
  labelCls,
  auroraBtn,
  ghostBtn,
  dangerText,
  noticeText,
} from "./styles";
import { SparkIcon } from "@/components/dashboard/icons";

const initial: GradeActionState = {};

function SaveButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  const t = gradingDict[locale].form;
  return (
    <button type="submit" disabled={pending} className={auroraBtn}>
      {pending ? t.saving : t.save}
    </button>
  );
}

export function GradeForm({
  locale,
  academyId,
  submissionId,
  maxScore,
  aiConfigured,
  initialScore,
  initialFeedback,
}: {
  locale: Locale;
  academyId: string;
  submissionId: string;
  maxScore: number;
  aiConfigured: boolean;
  initialScore?: number | null;
  initialFeedback?: string | null;
}) {
  const t = gradingDict[locale].form;
  const tErr = gradingDict[locale].errors;
  const [state, formAction] = useActionState(gradeSubmission, initial);

  const [feedback, setFeedback] = useState<string>(initialFeedback ?? "");
  const [aiReviewId, setAiReviewId] = useState<string>("");
  const [aiError, setAiError] = useState<string | null>(null);
  const [drafting, startDraft] = useTransition();
  const feedbackRef = useRef<HTMLTextAreaElement>(null);

  function handleDraft() {
    setAiError(null);
    const fd = new FormData();
    fd.set("locale", locale);
    fd.set("academyId", academyId);
    fd.set("submissionId", submissionId);
    startDraft(async () => {
      try {
        const res = await aiDraftFeedback(fd);
        if (res.error) {
          setAiError(res.error);
          return;
        }
        if (!res.configured) {
          setAiError(t.aiUnavailable);
          return;
        }
        if (res.draft) {
          setFeedback(res.draft);
          if (res.aiReviewId) setAiReviewId(res.aiReviewId);
          // Move focus to the textarea so the grader can edit immediately.
          requestAnimationFrame(() => feedbackRef.current?.focus());
        }
      } catch {
        setAiError(tErr.aiFailed);
      }
    });
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="academyId" value={academyId} />
      <input type="hidden" name="submissionId" value={submissionId} />
      <input type="hidden" name="aiReviewId" value={aiReviewId} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`score-${submissionId}`} className={labelCls}>
          {t.scoreLabel}{" "}
          <span className="text-muted/70 normal-case tracking-normal">
            ({t.scoreRangeHint}
            {maxScore})
          </span>
        </label>
        <input
          id={`score-${submissionId}`}
          name="score"
          type="number"
          min={0}
          max={maxScore}
          step="0.5"
          inputMode="decimal"
          required
          defaultValue={initialScore ?? undefined}
          className={`${inputCls} max-w-[10rem] tabular-nums`}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={`feedback-${submissionId}`} className={labelCls}>
            {t.feedbackLabel}
          </label>
          <button
            type="button"
            onClick={handleDraft}
            disabled={drafting || !aiConfigured}
            title={aiConfigured ? t.aiHint : t.aiUnavailable}
            className={ghostBtn}
          >
            <SparkIcon width={15} height={15} />
            {drafting ? t.aiDrafting : t.aiDraft}
          </button>
        </div>
        <textarea
          id={`feedback-${submissionId}`}
          ref={feedbackRef}
          name="feedback"
          rows={5}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={t.feedbackPlaceholder}
          className={`${inputCls} resize-y`}
        />
        {!aiConfigured && (
          <p className="text-xs text-muted">{t.aiUnavailable}</p>
        )}
        {aiError && (
          <p className={`text-xs ${dangerText}`} role="alert">
            {aiError}
          </p>
        )}
      </div>

      {state.error && (
        <p className={`text-sm ${dangerText}`} role="alert">
          {state.error}
        </p>
      )}
      {state.notice && (
        <p className={`text-sm ${noticeText}`} role="status">
          {state.notice}
        </p>
      )}

      <div className="flex items-center justify-end">
        <SaveButton locale={locale} />
      </div>
    </form>
  );
}
