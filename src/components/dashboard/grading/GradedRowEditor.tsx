"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { GradingSubmission } from "@/lib/data/grading";
import { gradingDict } from "./dict";
import { ghostBtn } from "./styles";
import { GradeForm } from "./GradeForm";

/* ---------------------------------------------------------------------------
   Edit-grade affordance for an already-graded row. Graders (canWrite) get a
   toggle that re-opens the GradeForm pre-filled with the current score +
   feedback; gradeSubmission overwrites idempotently, so correcting a wrong
   score needs no backend change. Read-only viewers never reach this island.
--------------------------------------------------------------------------- */

export function GradedRowEditor({
  locale,
  academyId,
  submission,
  aiConfigured,
}: {
  locale: Locale;
  academyId: string;
  submission: GradingSubmission;
  aiConfigured: boolean;
}) {
  const t = gradingDict[locale].index;
  const [editing, setEditing] = useState(false);

  return (
    <div className="mt-3 w-full border-t border-line/50 pt-3">
      <button
        type="button"
        onClick={() => setEditing((v) => !v)}
        className={ghostBtn}
        aria-expanded={editing}
      >
        {editing ? t.cancelEdit : t.editGrade}
      </button>

      {editing && (
        <div className="mt-4">
          <GradeForm
            locale={locale}
            academyId={academyId}
            submissionId={submission.id}
            maxScore={submission.assignmentMaxScore}
            aiConfigured={aiConfigured}
            initialScore={submission.score}
            initialFeedback={submission.feedback}
          />
        </div>
      )}
    </div>
  );
}
