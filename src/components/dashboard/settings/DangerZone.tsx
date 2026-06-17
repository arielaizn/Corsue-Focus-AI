"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { deleteAcademy } from "@/app/[locale]/dashboard/settings/actions";
import { initialDeleteState, type DeleteAcademyState } from "./types";
import { settingsDict } from "./dict";

const inputCls =
  "w-full rounded-xl bg-surface-2/60 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.66_0.2_12_/_0.55)]";

function DeleteButton({
  label,
  pendingLabel,
  disabled,
}: {
  label: string;
  pendingLabel: string;
  disabled: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="inline-flex items-center justify-center rounded-[6px] bg-[oklch(0.55_0.21_18)] px-6 py-3 text-sm font-semibold text-white transition-[transform,background-color,opacity] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.18)] hover:bg-[oklch(0.5_0.21_18)] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export interface DangerZoneProps {
  locale: Locale;
  academyId: string;
  academyName: string;
}

export function DangerZone({ locale, academyId, academyName }: DangerZoneProps) {
  const d = settingsDict[locale].danger;
  const errors = settingsDict[locale].errors;
  const [state, formAction] = useActionState<DeleteAcademyState, FormData>(
    deleteAcademy,
    initialDeleteState,
  );

  const confirmId = useId();
  const [typed, setTyped] = useState("");
  const matches = typed.trim() === academyName;

  return (
    <section className="panel-premium p-6 [box-shadow:inset_0_0_0_1px_oklch(0.55_0.21_18_/_0.35)]">
      <div className="mb-5">
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-[oklch(0.78_0.16_18)]">
          {d.title}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{d.hint}</p>
      </div>

      <p className="mb-5 rounded-xl bg-[oklch(0.55_0.21_18_/_0.1)] px-4 py-3 text-sm text-ink-soft [box-shadow:inset_0_0_0_1px_oklch(0.55_0.21_18_/_0.28)]">
        {d.warning}
      </p>

      {state.status === "error" && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-[oklch(0.66_0.2_12_/_0.12)] px-4 py-2.5 text-sm text-[oklch(0.78_0.16_18)] [box-shadow:inset_0_0_0_1px_oklch(0.66_0.2_12_/_0.32)]"
        >
          {errors[state.error ?? "generic"]}
        </p>
      )}

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="academyId" value={academyId} />
        <input type="hidden" name="academyName" value={academyName} />

        <div>
          <label
            htmlFor={confirmId}
            className="mb-1.5 block text-xs font-semibold tracking-[0.04em] text-ink-soft"
          >
            {d.confirmLabel}
          </label>
          <input
            id={confirmId}
            name="confirmName"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            placeholder={d.confirmPlaceholder(academyName)}
            className={cn(inputCls, matches && "[box-shadow:inset_0_0_0_1px_oklch(0.55_0.21_18_/_0.6)]")}
            aria-describedby={`${confirmId}-hint`}
          />
          <p id={`${confirmId}-hint`} className="mt-1.5 text-xs text-muted">
            {d.note}
          </p>
        </div>

        <div className="flex items-center justify-end">
          <DeleteButton
            label={d.delete}
            pendingLabel={d.deleting}
            disabled={!matches}
          />
        </div>
      </form>
    </section>
  );
}
