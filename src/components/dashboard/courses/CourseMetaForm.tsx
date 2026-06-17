"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import {
  updateCourse,
  deleteCourse,
  type CourseActionState,
} from "@/app/[locale]/dashboard/courses/actions";
import { COURSE_TYPES, type Course } from "@/lib/data/courses.shared";
import { coursesDict } from "./dictionary";
import { auroraBtn, inputCls, labelCls, dangerText } from "./styles";
import { MediaUpload } from "@/components/dashboard/MediaUpload";
import { brandingPath, BUCKETS } from "@/lib/data/storage";

const initial: CourseActionState = {};

function SaveButton({ locale }: { locale: Locale }) {
  const { pending } = useFormStatus();
  const t = coursesDict[locale].builder;
  return (
    <button type="submit" disabled={pending} className={auroraBtn}>
      {pending ? t.saving : t.save}
    </button>
  );
}

export function CourseMetaForm({
  locale,
  academyId,
  course,
}: {
  locale: Locale;
  academyId: string;
  course: Course;
}) {
  const t = coursesDict[locale];
  const [state, formAction] = useActionState(updateCourse, initial);
  const [type, setType] = useState<string>(course.course_type);
  const [published, setPublished] = useState(course.is_published);
  const [coverUrl, setCoverUrl] = useState<string>(course.cover_url ?? "");

  return (
    <section className="panel-premium p-6">
      <header className="mb-5">
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
          {t.builder.metaTitle}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{t.builder.metaSubtitle}</p>
      </header>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="academyId" value={academyId} />
        <input type="hidden" name="courseId" value={course.id} />
        <input type="hidden" name="coverUrl" value={coverUrl} />

        <div className="flex flex-col gap-1.5">
          <span className={labelCls}>
            {locale === "he" ? "תמונת קאבר" : "Cover image"}
          </span>
          <MediaUpload
            locale={locale}
            bucket={BUCKETS.branding}
            buildPath={(filename) =>
              brandingPath(academyId, "course-cover", filename)
            }
            currentUrl={coverUrl || null}
            accept="image/*"
            onUploaded={setCoverUrl}
          />
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>{t.builder.titleLabel}</span>
          <input
            name="title"
            required
            defaultValue={course.title}
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelCls}>{t.builder.descLabel}</span>
          <textarea
            name="description"
            rows={3}
            defaultValue={course.description ?? course.short_desc ?? ""}
            placeholder={t.builder.descPlaceholder}
            className={`${inputCls} resize-y`}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>{t.builder.typeLabel}</span>
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
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={labelCls}>{t.builder.priceLabel}</span>
            <input
              name="price"
              type="number"
              min={0}
              step="0.01"
              defaultValue={course.price ?? ""}
              disabled={type === "free"}
              placeholder="0"
              className={`${inputCls} disabled:opacity-40`}
            />
          </label>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-surface-2/40 px-4 py-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
          <div className="flex flex-col">
            <span className={labelCls}>{t.builder.publishedLabel}</span>
            <span className="mt-0.5 text-sm text-ink-soft">
              {published ? t.builder.publishedOn : t.builder.publishedOff}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={published}
            aria-label={t.builder.publishedLabel}
            onClick={() => setPublished((p) => !p)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              published
                ? "bg-aurora"
                : "bg-surface-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            }`}
          >
            <span
              className={`inline-block size-4 rounded-full bg-ink transition-transform ${
                published
                  ? "translate-x-6 rtl:-translate-x-6"
                  : "translate-x-1 rtl:-translate-x-1"
              }`}
            />
          </button>
          <input
            type="hidden"
            name="isPublished"
            value={published ? "on" : "off"}
          />
        </div>

        {state.error && (
          <p className={`text-sm ${dangerText}`} role="alert">
            {state.error}
          </p>
        )}
        {state.notice && (
          <p className="text-sm text-pos" role="status">
            {state.notice}
          </p>
        )}

        <div className="mt-1 flex items-center justify-between gap-2">
          <DeleteCourse locale={locale} academyId={academyId} courseId={course.id} />
          <SaveButton locale={locale} />
        </div>
      </form>
    </section>
  );
}

function DeleteCourse({
  locale,
  academyId,
  courseId,
}: {
  locale: Locale;
  academyId: string;
  courseId: string;
}) {
  const t = coursesDict[locale].builder;
  const [confirming, setConfirming] = useState(false);

  // Two-step inline confirmation instead of native window.confirm() — keeps the
  // Midnight Atelier look, honors RTL, and stays themeable. The confirm button
  // is a real submit so the Server Action still commits (works without JS).
  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${dangerText} [box-shadow:inset_0_0_0_1px_oklch(0.78_0.16_22_/_0.35)] hover:bg-[oklch(0.78_0.16_22_/_0.1)]`}
      >
        {t.deleteCourse}
      </button>
    );
  }

  return (
    <form
      action={deleteCourse}
      onSubmit={() => setConfirming(false)}
      className="flex flex-wrap items-center gap-2"
      role="group"
      aria-label={t.deleteCourseConfirm}
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="academyId" value={academyId} />
      <input type="hidden" name="courseId" value={courseId} />
      <span className="text-sm text-ink-soft">{t.deleteCourseConfirm}</span>
      <button
        type="submit"
        autoFocus
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${dangerText} [box-shadow:inset_0_0_0_1px_oklch(0.78_0.16_22_/_0.35)] hover:bg-[oklch(0.78_0.16_22_/_0.1)]`}
      >
        {t.deleteCourse}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors hover:text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]"
      >
        {t.cancel}
      </button>
    </form>
  );
}
