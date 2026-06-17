"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import { Panel } from "@/components/dashboard/ui";
import {
  buildAcademyAction,
  type AcademyBuildState,
} from "@/app/[locale]/dashboard/academy/ai-actions";

/* ---------------------------------------------------------------------------
   AI Academy Builder panel (#2). One prompt → categories + courses + pricing.
   Lives on the Academy page; redirects to the populated course catalog.
--------------------------------------------------------------------------- */

const COPY = {
  he: {
    title: "בנה קטלוג אקדמיה ב-AI",
    desc: "תאר את האקדמיה שלך — וה-AI יבנה קטגוריות, כמה קורסים שלמים (מודולים ושיעורים) והצעות תמחור. תועבר לקטלוג הקורסים.",
    prompt: "תיאור האקדמיה",
    promptPh: "לדוגמה: אקדמיה ללימוד עריכת וידאו ופוסט-פרודקשן ב-AI, ממתחילים ועד מקצוענים",
    submit: "בנה אקדמיה",
    pending: "בונה אקדמיה… זה עשוי לקחת דקה",
    badge: "AI",
    note: "פעולה לבעלים ומנהלים. אפשר לערוך הכל אחר כך.",
  },
  en: {
    title: "Build an academy catalog with AI",
    desc: "Describe your academy — AI builds categories, several full courses (modules + lessons), and pricing suggestions. You'll be taken to the catalog.",
    prompt: "Academy description",
    promptPh: "e.g. An academy for AI video editing and post-production, beginner to pro",
    submit: "Build academy",
    pending: "Building academy… this may take a minute",
    badge: "AI",
    note: "Owners and admins only. You can edit everything afterwards.",
  },
} as const;

const field =
  "w-full rounded-lg bg-surface-2/50 px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 outline-none [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.5)]";

function SubmitButton({ label, pending: p }: { label: string; pending: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink text-bg-deep inline-flex w-fit items-center justify-center rounded-[6px] px-6 py-2.5 text-sm font-semibold transition-[transform,opacity] duration-300 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? p : label}
    </button>
  );
}

export function BuildAcademyPanel({
  locale,
  academyId,
  currency,
}: {
  locale: Locale;
  academyId: string;
  currency: string;
}) {
  const t = COPY[locale];
  const [state, action] = useActionState<AcademyBuildState, FormData>(
    buildAcademyAction,
    {},
  );

  return (
    <Panel className="glow-aurora max-w-2xl">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold tracking-wide text-gold [box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.45)]">
          {t.badge}
        </span>
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
          {t.title}
        </h2>
      </div>
      <p className="mb-5 text-sm text-ink-soft">{t.desc}</p>

      <form action={action} className="flex flex-col gap-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="academyId" value={academyId} />
        <input type="hidden" name="currency" value={currency} />

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-muted">{t.prompt}</span>
          <textarea
            name="prompt"
            required
            rows={3}
            placeholder={t.promptPh}
            className={`${field} resize-y`}
          />
        </label>

        {state.error && (
          <p className="text-sm text-red-400" role="alert">
            {state.error}
          </p>
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted">{t.note}</span>
          <SubmitButton label={t.submit} pending={t.pending} />
        </div>
      </form>
    </Panel>
  );
}
