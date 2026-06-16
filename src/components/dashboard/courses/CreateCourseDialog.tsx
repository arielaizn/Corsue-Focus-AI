"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import { createCourse, type CourseActionState } from "@/app/[locale]/dashboard/courses/actions";
import { COURSE_TYPES } from "@/lib/data/courses.shared";
import { coursesDict } from "./dictionary";
import { auroraBtn, ghostBtn, inputCls, labelCls, dangerText } from "./styles";
import { PlusIcon } from "@/components/dashboard/icons";

const initial: CourseActionState = {};

function SubmitButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  const t = coursesDict[locale].create;
  return (
    <button type="submit" disabled={pending} className={auroraBtn}>
      {pending ? t.submitting : t.submit}
    </button>
  );
}

export function CreateCourseDialog({
  locale,
  academyId,
}: {
  locale: Locale;
  academyId: string;
}) {
  const t = coursesDict[locale];
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(createCourse, initial);
  const [type, setType] = useState<string>("free");
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    // Remember the trigger so we can restore focus when the dialog closes.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Lock background scroll while the modal is open.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = dialogRef.current;
    const focusableSel =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      // Trap Tab / Shift+Tab inside the dialog panel.
      const nodes = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSel),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const activeEl = document.activeElement;
      if (e.shiftKey) {
        if (activeEl === first || !panel.contains(activeEl)) {
          e.preventDefault();
          last.focus();
        }
      } else if (activeEl === last || !panel.contains(activeEl)) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open]);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={auroraBtn}>
        <PlusIcon width={16} height={16} />
        {t.index.newCourse}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t.create.title}
        >
          <div
            className="absolute inset-0 bg-bg-deep/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            ref={dialogRef}
            className="panel-premium glow-aurora relative z-10 w-full max-w-lg p-6"
          >
            <h2 className="font-[family-name:var(--font-display)] text-h3 font-bold text-ink">
              {t.create.title}
            </h2>

            <form action={formAction} className="mt-5 flex flex-col gap-4">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="academyId" value={academyId} />

              <Field label={t.create.titleLabel}>
                <input
                  name="title"
                  required
                  autoFocus
                  placeholder={t.create.titlePlaceholder}
                  className={inputCls}
                />
              </Field>

              <Field label={t.create.descLabel}>
                <textarea
                  name="description"
                  rows={2}
                  placeholder={t.create.descPlaceholder}
                  className={`${inputCls} resize-y`}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t.create.typeLabel}>
                  <select
                    name="courseType"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={inputCls}
                  >
                    {COURSE_TYPES.map((ct) => (
                      <option key={ct} value={ct}>
                        {t.courseType[ct]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label={t.create.priceLabel}>
                  <input
                    name="price"
                    type="number"
                    min={0}
                    step="0.01"
                    disabled={type === "free"}
                    placeholder={t.create.pricePlaceholder}
                    className={`${inputCls} disabled:opacity-40`}
                  />
                </Field>
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
                  {t.create.cancel}
                </button>
                <SubmitButton locale={locale} />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}
