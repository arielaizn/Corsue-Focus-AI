"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import {
  askAdvisor,
  type AdvisorState,
} from "@/app/[locale]/dashboard/analytics/actions";
import { analyticsDict } from "./dict";
import { inputCls } from "@/components/dashboard/courses/styles";
import { SparkIcon } from "@/components/dashboard/icons";

/* ---------------------------------------------------------------------------
   AI Business Advisor — a server-action form (useActionState) that submits the
   owner's question; the action attaches the academy's REAL metrics as context
   and returns a recommendation. Mirrors the marketing Analytics advisor mock.
   When the provider key is missing, the parent renders the disabled state, so
   this component assumes the advisor is live.
--------------------------------------------------------------------------- */

function SubmitButton({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink text-bg-deep inline-flex items-center justify-center gap-2 rounded-[6px] px-5 py-2.5 text-sm font-semibold tracking-[0.01em] transition-[transform,opacity] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <span
            aria-hidden
            className="size-3.5 animate-spin rounded-full border-2 border-bg-deep/40 border-t-bg-deep"
          />
          {busy}
        </>
      ) : (
        idle
      )}
    </button>
  );
}

export function AdvisorPanel({
  locale,
  academyId,
}: {
  locale: Locale;
  academyId: string;
}) {
  const t = analyticsDict[locale].advisor;
  const [state, action] = useActionState<AdvisorState, FormData>(askAdvisor, {});

  return (
    <section className="gilt-rim relative flex flex-col overflow-hidden rounded-[12px] bg-surface p-6 sm:p-7">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid size-9 place-items-center rounded-[8px] bg-gold-grad text-bg-deep"
        >
          <SparkIcon width={16} height={16} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{t.label}</p>
          <p className="text-[11px] text-muted">{t.sub}</p>
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t.intro}</p>

      <form action={action} className="mt-5 flex flex-col gap-3">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="academyId" value={academyId} />

        <textarea
          name="question"
          required
          rows={3}
          defaultValue={state.question ?? ""}
          placeholder={t.placeholder}
          className={`${inputCls} resize-y`}
        />

        <div className="flex flex-wrap gap-2">
          {t.presets.map((p) => (
            <button
              key={p}
              type="submit"
              name="question"
              value={p}
              className="rounded-full px-3 py-1 text-xs text-ink-soft transition-colors hover:text-ink [box-shadow:inset_0_0_0_1px_var(--color-line)]"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end">
          <SubmitButton idle={state.answer ? t.again : t.ask} busy={t.asking} />
        </div>
      </form>

      {state.error && (
        <p
          className="mt-4 rounded-[8px] bg-[oklch(0.78_0.16_22_/_0.08)] p-3 text-sm text-[oklch(0.78_0.16_22)] [box-shadow:inset_0_0_0_1px_oklch(0.78_0.16_22_/_0.26)]"
          role="alert"
        >
          {state.error}
        </p>
      )}

      {state.answer && (
        <div className="mt-4 rounded-[8px] bg-[oklch(0.55_0.11_250_/_0.08)] p-4 text-sm leading-relaxed text-ink-soft [box-shadow:inset_0_0_0_1px_oklch(0.55_0.11_250_/_0.26)]">
          <p className="text-gilt mb-2 flex items-center gap-1.5">
            <SparkIcon width={12} height={12} className="text-gold" />
            {t.label}
          </p>
          <div className="whitespace-pre-wrap">{state.answer}</div>
        </div>
      )}

      <p className="mt-auto pt-6 text-[11px] text-muted">{t.footnote}</p>
    </section>
  );
}
