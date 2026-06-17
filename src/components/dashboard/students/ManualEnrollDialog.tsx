"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import {
  manualEnroll,
  type MembersActionState,
} from "@/app/[locale]/dashboard/students/actions";
import type { EnrollableCourse } from "@/lib/data/members";
import { studentsDict } from "./dict";
import { auroraBtn, ghostBtn, inputCls, dangerText } from "./styles";
import { Modal, Field } from "./Modal";
import { PlusIcon } from "@/components/dashboard/icons";

const initial: MembersActionState = {};

function SubmitButton({
  locale,
  disabled,
}: {
  locale: Locale;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  const t = studentsDict[locale].enroll;
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className={auroraBtn}
    >
      {pending ? t.submitting : t.submit}
    </button>
  );
}

export function ManualEnrollDialog({
  locale,
  academyId,
  courses,
}: {
  locale: Locale;
  academyId: string;
  courses: EnrollableCourse[];
}) {
  const t = studentsDict[locale];
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(manualEnroll, initial);
  const noCourses = courses.length === 0;

  useEffect(() => {
    if (state.notice) setOpen(false);
  }, [state.notice]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={ghostBtn}
      >
        <PlusIcon width={16} height={16} />
        {t.students.enroll}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} label={t.enroll.title}>
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
          {t.enroll.title}
        </h2>

        {noCourses ? (
          <p className="mt-4 text-sm text-ink-soft">{t.enroll.noCourses}</p>
        ) : (
          <form action={formAction} className="mt-5 flex flex-col gap-4">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="academyId" value={academyId} />

            <Field label={t.enroll.userLabel}>
              <input
                name="userId"
                required
                autoFocus
                placeholder={t.enroll.userPlaceholder}
                className={inputCls}
                dir="ltr"
              />
            </Field>

            <Field label={t.enroll.courseLabel}>
              <select name="courseId" required defaultValue="" className={inputCls}>
                <option value="" disabled>
                  {t.enroll.coursePlaceholder}
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </Field>

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
                {t.enroll.cancel}
              </button>
              <SubmitButton locale={locale} disabled={noCourses} />
            </div>
          </form>
        )}

        {noCourses && (
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className={ghostBtn}
            >
              {t.enroll.cancel}
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
