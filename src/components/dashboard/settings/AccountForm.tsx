"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import { TIMEZONE_OPTIONS } from "@/lib/data/academies.shared";
import { BUCKETS, avatarPath } from "@/lib/data/storage";
import { MediaUpload } from "@/components/dashboard/MediaUpload";
import { updateAccount } from "@/app/[locale]/dashboard/settings/actions";
import {
  initialAccountState,
  type AccountValues,
  type AccountActionState,
} from "./types";
import { settingsDict } from "./dict";

const inputCls =
  "w-full rounded-xl bg-surface-2/60 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.55)]";
const inputErrCls =
  "[box-shadow:inset_0_0_0_1px_oklch(0.66_0.2_12_/_0.5)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.66_0.2_12_/_0.7)]";
const labelCls =
  "mb-1.5 block text-xs font-semibold tracking-[0.04em] text-ink-soft";
const hintCls = "mt-1.5 text-xs text-muted";

function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-ink text-bg-deep relative inline-flex items-center justify-center overflow-hidden rounded-[6px] px-7 py-3 text-sm font-semibold tracking-[0.01em] transition-[transform,background-color] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:bg-ink-soft hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export interface AccountFormProps {
  locale: Locale;
  initialValues: AccountValues;
}

export function AccountForm({ locale, initialValues }: AccountFormProps) {
  const d = settingsDict[locale];
  const t = d.account;
  const [state, formAction] = useActionState<AccountActionState, FormData>(
    updateAccount,
    initialAccountState,
  );

  const v = state.values ?? initialValues;

  // Controlled fields needed for live UX (display name → required hint, avatar
  // URL synced from the uploader). Re-seed from the server echo once per
  // round-trip — same "adjust state during render" pattern as AcademyForm.
  const [name, setName] = useState(v.display_name);
  const [avatarUrl, setAvatarUrl] = useState(v.avatar_url);

  const echoKey = `${state.savedAt ?? ""}:${state.error ?? ""}`;
  const [appliedEcho, setAppliedEcho] = useState<string | null>(null);
  if (state.values && echoKey !== ":" && echoKey !== appliedEcho) {
    setAppliedEcho(echoKey);
    setName(state.values.display_name);
    setAvatarUrl(state.values.avatar_url);
  }

  const ids = {
    name: useId(),
    bio: useId(),
    locale: useId(),
    tz: useId(),
    web: useId(),
    pub: useId(),
  };

  const nameError = state.status === "error" && state.error === "nameRequired";

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="locale" value={locale} />
      {/* Avatar URL is owned by the uploader; mirror it into the form payload. */}
      <input type="hidden" name="avatar_url" value={avatarUrl} />

      {/* Form-level notices */}
      {state.status === "error" && state.error !== "nameRequired" && (
        <p
          role="alert"
          className="rounded-xl bg-[oklch(0.66_0.2_12_/_0.12)] px-4 py-2.5 text-sm text-[oklch(0.78_0.16_18)] [box-shadow:inset_0_0_0_1px_oklch(0.66_0.2_12_/_0.32)]"
        >
          {d.errors[state.error ?? "generic"]}
        </p>
      )}
      {state.status === "success" && (
        <p
          role="status"
          className="rounded-xl bg-[oklch(0.78_0.13_165_/_0.12)] px-4 py-2.5 text-sm text-pos [box-shadow:inset_0_0_0_1px_oklch(0.78_0.13_165_/_0.3)]"
        >
          {t.saved}
        </p>
      )}

      {/* Avatar */}
      <div>
        <span className={labelCls}>{t.avatarLabel}</span>
        <MediaUpload
          locale={locale}
          bucket={BUCKETS.avatars}
          buildPath={(filename) => avatarPath(initialValues.avatarKey, filename)}
          currentUrl={avatarUrl || null}
          accept="image/*"
          onUploaded={setAvatarUrl}
        />
        <p className={hintCls}>{t.avatarHint}</p>
      </div>

      {/* Display name */}
      <div>
        <label className={labelCls} htmlFor={ids.name}>
          {t.displayName}
        </label>
        <input
          id={ids.name}
          name="display_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={80}
          placeholder={t.displayNamePlaceholder}
          className={cn(inputCls, nameError && inputErrCls)}
          aria-invalid={nameError}
        />
        {nameError && (
          <p role="alert" className="mt-1.5 text-xs text-[oklch(0.78_0.16_18)]">
            {d.errors.nameRequired}
          </p>
        )}
      </div>

      {/* Bio */}
      <div>
        <label className={labelCls} htmlFor={ids.bio}>
          {t.bio}
        </label>
        <textarea
          id={ids.bio}
          name="bio"
          defaultValue={v.bio}
          rows={3}
          maxLength={500}
          placeholder={t.bioPlaceholder}
          className={cn(inputCls, "resize-none")}
        />
      </div>

      {/* Locale + timezone */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls} htmlFor={ids.locale}>
            {t.locale}
          </label>
          <select
            id={ids.locale}
            name="account_locale"
            defaultValue={v.locale}
            className={cn(inputCls, "appearance-none")}
          >
            <option value="he">{t.localeNames.he}</option>
            <option value="en">{t.localeNames.en}</option>
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor={ids.tz}>
            {t.timezone}
          </label>
          <select
            id={ids.tz}
            name="timezone"
            defaultValue={v.timezone}
            className={cn(inputCls, "appearance-none")}
          >
            {TIMEZONE_OPTIONS.map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Website */}
      <div>
        <label className={labelCls} htmlFor={ids.web}>
          {t.website}
        </label>
        <input
          id={ids.web}
          name="website_url"
          type="url"
          defaultValue={v.website_url}
          inputMode="url"
          spellCheck={false}
          autoCapitalize="none"
          maxLength={200}
          placeholder={t.websitePlaceholder}
          className={inputCls}
        />
      </div>

      {/* Public profile toggle */}
      <label
        htmlFor={ids.pub}
        className="flex items-start gap-3 rounded-xl bg-surface-2/40 p-4 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
      >
        <input
          id={ids.pub}
          name="is_public"
          type="checkbox"
          defaultChecked={v.is_public}
          className="mt-0.5 size-4 shrink-0 accent-[oklch(0.83_0.13_88)]"
        />
        <span>
          <span className="block text-sm font-semibold text-ink">
            {t.publicLabel}
          </span>
          <span className="mt-0.5 block text-xs text-muted">{t.publicHint}</span>
        </span>
      </label>

      <div className="flex items-center justify-end">
        <SubmitButton label={t.save} pendingLabel={t.saving} />
      </div>
    </form>
  );
}
