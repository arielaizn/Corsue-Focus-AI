"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  createModule,
  renameModule,
  deleteModule,
  moveModule,
  createLesson,
  updateLesson,
  deleteLesson,
  moveLesson,
} from "@/app/[locale]/dashboard/courses/actions";
import {
  CONTENT_TYPES,
  type ModuleWithLessons,
  type Lesson,
} from "@/lib/data/courses.shared";
import { coursesDict } from "./dictionary";
import { inputCls, labelCls, auroraBtn, ghostBtn, dangerText } from "./styles";
import { PlusIcon, ChevronIcon } from "@/components/dashboard/icons";

interface Ctx {
  locale: Locale;
  academyId: string;
  courseId: string;
}

export function CurriculumBuilder({
  locale,
  academyId,
  courseId,
  modules,
}: Ctx & { modules: ModuleWithLessons[] }) {
  const t = coursesDict[locale].builder;
  const [adding, setAdding] = useState(false);
  const ctx: Ctx = { locale, academyId, courseId };

  return (
    <section className="panel-premium p-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
            {t.curriculum}
          </h2>
          <p className="mt-1 text-sm text-ink-soft">{t.curriculumSub}</p>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className={auroraBtn}
          >
            <PlusIcon width={16} height={16} />
            {t.addModule}
          </button>
        )}
      </header>

      {adding && (
        <form
          action={createModule}
          onSubmit={() => setAdding(false)}
          className="mb-5 flex items-center gap-2 rounded-xl bg-surface-2/40 p-3 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
        >
          <HiddenCtx ctx={ctx} />
          <input
            name="title"
            required
            autoFocus
            placeholder={t.moduleNamePlaceholder}
            className={inputCls}
          />
          <button type="submit" className={auroraBtn}>
            {t.addModule}
          </button>
          <button
            type="button"
            onClick={() => setAdding(false)}
            className={ghostBtn}
            aria-label={t.cancel}
            title={t.cancel}
          >
            <span aria-hidden>✕</span>
          </button>
        </form>
      )}

      {modules.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line/70 px-6 py-12 text-center">
          <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-ink">
            {t.emptyModules.title}
          </h3>
          <p className="mt-1 text-sm text-ink-soft">{t.emptyModules.body}</p>
        </div>
      ) : (
        <ol className="flex flex-col gap-4">
          {modules.map((m, i) => (
            <ModuleCard
              key={m.id}
              ctx={ctx}
              module={m}
              isFirst={i === 0}
              isLast={i === modules.length - 1}
            />
          ))}
        </ol>
      )}
    </section>
  );
}

function HiddenCtx({ ctx }: { ctx: Ctx }) {
  return (
    <>
      <input type="hidden" name="locale" value={ctx.locale} />
      <input type="hidden" name="academyId" value={ctx.academyId} />
      <input type="hidden" name="courseId" value={ctx.courseId} />
    </>
  );
}

function ModuleCard({
  ctx,
  module,
  isFirst,
  isLast,
}: {
  ctx: Ctx;
  module: ModuleWithLessons;
  isFirst: boolean;
  isLast: boolean;
}) {
  const t = coursesDict[ctx.locale].builder;
  const [renaming, setRenaming] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);

  return (
    <li className="rounded-2xl bg-surface-2/30 p-4 [box-shadow:inset_0_0_0_1px_var(--color-line)]">
      <div className="flex items-center gap-3">
        {/* reorder arrows */}
        <div className="flex flex-col gap-1">
          <ReorderButton
            ctx={ctx}
            action={moveModule}
            id={module.id}
            idName="moduleId"
            direction="up"
            disabled={isFirst}
            label={t.moveUp}
          />
          <ReorderButton
            ctx={ctx}
            action={moveModule}
            id={module.id}
            idName="moduleId"
            direction="down"
            disabled={isLast}
            label={t.moveDown}
          />
        </div>

        {renaming ? (
          <form
            action={renameModule}
            onSubmit={() => setRenaming(false)}
            className="flex flex-1 items-center gap-2"
          >
            <HiddenCtx ctx={ctx} />
            <input type="hidden" name="moduleId" value={module.id} />
            <input
              name="title"
              required
              autoFocus
              defaultValue={module.title}
              className={inputCls}
            />
            <button type="submit" className={auroraBtn}>
              {t.rename}
            </button>
            <button
              type="button"
              onClick={() => setRenaming(false)}
              className={ghostBtn}
              aria-label={t.cancel}
              title={t.cancel}
            >
              <span aria-hidden>✕</span>
            </button>
          </form>
        ) : (
          <>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-ink">
                {module.title}
              </h3>
              <p className="text-xs text-muted">
                {module.lessons.length === 1
                  ? `1 ${t.lessonCountOne}`
                  : `${module.lessons.length} ${t.lessonCountMany}`}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setRenaming(true)}
                className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:text-ink hover:bg-surface-3/50"
              >
                {t.rename}
              </button>
              <DeleteForm
                ctx={ctx}
                action={deleteModule}
                idName="moduleId"
                id={module.id}
                confirmText={t.deleteModuleConfirm}
                label={t.deleteModule}
              />
            </div>
          </>
        )}
      </div>

      {/* lessons */}
      {module.lessons.length > 0 && (
        <ol className="mt-3 flex flex-col gap-2 border-t border-line/40 pt-3">
          {module.lessons.map((l, i) => (
            <LessonRow
              key={l.id}
              ctx={ctx}
              moduleId={module.id}
              lesson={l}
              isFirst={i === 0}
              isLast={i === module.lessons.length - 1}
            />
          ))}
        </ol>
      )}

      {module.lessons.length === 0 && !addingLesson && (
        <p className="mt-3 border-t border-line/40 pt-3 text-xs text-muted">
          {t.emptyLessons}
        </p>
      )}

      {/* add lesson */}
      <div className="mt-3">
        {addingLesson ? (
          <LessonForm
            ctx={ctx}
            moduleId={module.id}
            onDone={() => setAddingLesson(false)}
            heading={t.addLessonHeading}
          />
        ) : (
          <button
            type="button"
            onClick={() => setAddingLesson(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold transition-colors hover:text-gold-bright"
          >
            <PlusIcon width={14} height={14} />
            {t.addLesson}
          </button>
        )}
      </div>
    </li>
  );
}

function LessonRow({
  ctx,
  moduleId,
  lesson,
  isFirst,
  isLast,
}: {
  ctx: Ctx;
  moduleId: string;
  lesson: Lesson;
  isFirst: boolean;
  isLast: boolean;
}) {
  const t = coursesDict[ctx.locale].builder;
  const ct = coursesDict[ctx.locale].contentType;
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li>
        <LessonForm
          ctx={ctx}
          moduleId={moduleId}
          lesson={lesson}
          onDone={() => setEditing(false)}
          heading={t.editLesson}
        />
      </li>
    );
  }

  return (
    <li className="flex items-center gap-2 rounded-xl bg-surface-2/40 px-3 py-2">
      <div className="flex flex-col gap-0.5">
        <ReorderButton
          ctx={ctx}
          action={moveLesson}
          id={lesson.id}
          idName="lessonId"
          direction="up"
          disabled={isFirst}
          label={t.moveUp}
          moduleId={moduleId}
          small
        />
        <ReorderButton
          ctx={ctx}
          action={moveLesson}
          id={lesson.id}
          idName="lessonId"
          direction="down"
          disabled={isLast}
          label={t.moveDown}
          moduleId={moduleId}
          small
        />
      </div>
      <span className="inline-flex items-center rounded-md bg-surface-3/60 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-ink-soft">
        {ct[lesson.content_type]}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-ink">
        {lesson.title}
      </span>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="rounded-lg px-2 py-1 text-xs font-semibold text-ink-soft transition-colors hover:text-ink hover:bg-surface-3/50"
      >
        {t.rename}
      </button>
      <DeleteForm
        ctx={ctx}
        action={deleteLesson}
        idName="lessonId"
        id={lesson.id}
        confirmText={t.deleteLessonConfirm}
        label={t.deleteLesson}
        iconOnly
      />
    </li>
  );
}

function LessonForm({
  ctx,
  moduleId,
  lesson,
  onDone,
  heading,
}: {
  ctx: Ctx;
  moduleId: string;
  lesson?: Lesson;
  onDone: () => void;
  heading: string;
}) {
  const t = coursesDict[ctx.locale].builder;
  const ct = coursesDict[ctx.locale].contentType;
  const action = lesson ? updateLesson : createLesson;

  return (
    <form
      action={action}
      onSubmit={onDone}
      className="flex flex-col gap-3 rounded-xl bg-surface-2/50 p-4 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
    >
      <HiddenCtx ctx={ctx} />
      <input type="hidden" name="moduleId" value={moduleId} />
      {lesson && <input type="hidden" name="lessonId" value={lesson.id} />}

      <p className={labelCls}>{heading}</p>

      <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
        <input
          name="title"
          required
          autoFocus
          defaultValue={lesson?.title ?? ""}
          placeholder={t.lessonTitlePlaceholder}
          className={inputCls}
          aria-label={t.lessonTitle}
        />
        <select
          name="contentType"
          defaultValue={lesson?.content_type ?? "video"}
          className={inputCls}
          aria-label={t.contentTypeLabel}
        >
          {CONTENT_TYPES.map((c) => (
            <option key={c} value={c}>
              {ct[c]}
            </option>
          ))}
        </select>
      </div>

      <input
        name="mediaUrl"
        type="url"
        defaultValue={lesson?.media_url ?? ""}
        placeholder={t.mediaUrlPlaceholder}
        className={inputCls}
        aria-label={t.mediaUrlLabel}
      />
      <textarea
        name="body"
        rows={3}
        defaultValue={lesson?.body ?? ""}
        placeholder={t.bodyPlaceholder}
        className={`${inputCls} resize-y`}
        aria-label={t.bodyLabel}
      />

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className={ghostBtn}
          aria-label={t.cancel}
          title={t.cancel}
        >
          <span aria-hidden>✕</span>
        </button>
        <button type="submit" className={auroraBtn}>
          {t.saveLesson}
        </button>
      </div>
    </form>
  );
}

function ReorderButton({
  ctx,
  action,
  id,
  idName,
  direction,
  disabled,
  label,
  moduleId,
  small,
}: {
  ctx: Ctx;
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  idName: "moduleId" | "lessonId";
  direction: "up" | "down";
  disabled: boolean;
  label: string;
  moduleId?: string;
  small?: boolean;
}) {
  const size = small ? 12 : 14;
  return (
    <form action={action}>
      <HiddenCtx ctx={ctx} />
      <input type="hidden" name={idName} value={id} />
      {moduleId && <input type="hidden" name="moduleId" value={moduleId} />}
      <input type="hidden" name="direction" value={direction} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={label}
        title={label}
        className="grid place-items-center rounded-md p-0.5 text-ink-soft transition-colors hover:text-gold disabled:opacity-25 disabled:hover:text-ink-soft"
      >
        <ChevronIcon
          width={size}
          height={size}
          className={direction === "up" ? "rotate-180" : ""}
        />
      </button>
    </form>
  );
}

function DeleteForm({
  ctx,
  action,
  idName,
  id,
  confirmText,
  label,
  iconOnly,
}: {
  ctx: Ctx;
  action: (formData: FormData) => void | Promise<void>;
  idName: "moduleId" | "lessonId";
  id: string;
  confirmText: string;
  label: string;
  iconOnly?: boolean;
}) {
  const t = coursesDict[ctx.locale].builder;
  const [confirming, setConfirming] = useState(false);

  // Two-step inline confirmation — no native window.confirm() (which breaks the
  // Midnight Atelier look, ignores RTL, and can't be themed). The first click
  // reveals a calm confirm/cancel pair; the confirm button is a real submit so
  // the Server Action still commits (progressive enhancement intact).
  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={label}
        title={label}
        className={`rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${dangerText} hover:bg-[oklch(0.78_0.16_22_/_0.12)]`}
      >
        {iconOnly ? <span aria-hidden>✕</span> : label}
      </button>
    );
  }

  return (
    <form
      action={action}
      onSubmit={() => setConfirming(false)}
      className="flex items-center gap-1.5"
      role="group"
      aria-label={confirmText}
    >
      <HiddenCtx ctx={ctx} />
      <input type="hidden" name={idName} value={id} />
      <span className="text-xs text-ink-soft">{confirmText}</span>
      <button
        type="submit"
        autoFocus
        aria-label={label}
        className={`rounded-lg px-2 py-1 text-xs font-semibold transition-colors ${dangerText} hover:bg-[oklch(0.78_0.16_22_/_0.12)]`}
      >
        {label}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        aria-label={t.cancel}
        title={t.cancel}
        className="rounded-lg px-2 py-1 text-xs font-semibold text-ink-soft transition-colors hover:text-ink hover:bg-surface-3/50"
      >
        <span aria-hidden>✕</span>
      </button>
    </form>
  );
}
