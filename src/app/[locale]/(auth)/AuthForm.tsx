"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import type { AppDict } from "@/lib/app-dictionary";
import {
  signInWithPassword,
  signUpWithPassword,
  signInWithMagicLink,
  signInWithGoogle,
  type AuthState,
} from "./actions";

type Mode = "login" | "signup";

export interface AuthFormProps {
  mode: Mode;
  locale: Locale;
  next: string;
  t: AppDict["auth"];
}

const inputCls =
  "w-full rounded-xl bg-surface-2/60 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.55)]";
const labelCls =
  "mb-1.5 block text-xs font-semibold tracking-[0.04em] text-ink-soft";

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
      className="bg-ink text-bg-deep relative inline-flex w-full items-center justify-center overflow-hidden rounded-[6px] px-5 py-3 text-sm font-semibold tracking-[0.01em] transition-[transform,background-color] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:bg-ink-soft hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

function Notice({ state }: { state: AuthState }) {
  if (state.error) {
    return (
      <p
        role="alert"
        className="rounded-xl bg-[oklch(0.66_0.2_12_/_0.12)] px-4 py-2.5 text-sm text-[oklch(0.78_0.16_18)] [box-shadow:inset_0_0_0_1px_oklch(0.66_0.2_12_/_0.32)]"
      >
        {state.error}
      </p>
    );
  }
  if (state.notice) {
    return (
      <p
        role="status"
        className="rounded-xl bg-[oklch(0.78_0.13_165_/_0.12)] px-4 py-2.5 text-sm text-pos [box-shadow:inset_0_0_0_1px_oklch(0.78_0.13_165_/_0.3)]"
      >
        {state.notice}
      </p>
    );
  }
  return null;
}

export function AuthForm({ mode, locale, next, t }: AuthFormProps) {
  const [useMagic, setUseMagic] = useState(false);

  const passwordAction = mode === "login" ? signInWithPassword : signUpWithPassword;
  const [pwState, pwSubmit] = useActionState<AuthState, FormData>(
    passwordAction,
    {},
  );
  const [magicState, magicSubmit] = useActionState<AuthState, FormData>(
    signInWithMagicLink,
    {},
  );
  const [googleState, googleSubmit] = useActionState<AuthState, FormData>(
    signInWithGoogle,
    {},
  );

  return (
    <div className="flex flex-col gap-5">
      {/* Google OAuth */}
      <form action={googleSubmit}>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="next" value={next} />
        <GoogleButton label={t.google} />
      </form>
      <Notice state={googleState} />

      <div className="flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-line/70" />
        <span className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
          {t.orContinue}
        </span>
        <span className="h-px flex-1 bg-line/70" />
      </div>

      {!useMagic ? (
        <form action={pwSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="next" value={next} />

          {mode === "signup" && (
            <div>
              <label className={labelCls} htmlFor="name">
                {t.name}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder={t.namePlaceholder}
                className={inputCls}
              />
            </div>
          )}

          <div>
            <label className={labelCls} htmlFor="email">
              {t.email}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls} htmlFor="password">
              {t.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={mode === "signup" ? 8 : undefined}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              placeholder={t.passwordPlaceholder}
              className={inputCls}
            />
          </div>

          <Notice state={pwState} />

          <SubmitButton
            label={mode === "login" ? t.signIn : t.signUp}
            pendingLabel={mode === "login" ? t.signingIn : t.creating}
          />
        </form>
      ) : (
        <form action={magicSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="next" value={next} />
          <div>
            <label className={labelCls} htmlFor="magic-email">
              {t.email}
            </label>
            <input
              id="magic-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              className={inputCls}
            />
          </div>
          <Notice state={magicState} />
          <SubmitButton label={t.magicLink} pendingLabel={t.signingIn} />
        </form>
      )}

      <button
        type="button"
        onClick={() => setUseMagic((v) => !v)}
        className="text-sm font-medium text-gold transition-colors hover:text-gold-bright"
      >
        {useMagic ? t.usePassword : t.useMagicLink}
      </button>
    </div>
  );
}

function GoogleButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-surface-2/50 px-5 py-3 text-sm font-semibold text-ink transition-[background-color,box-shadow,transform] duration-300 [box-shadow:inset_0_0_0_1px_var(--color-line),inset_0_1px_0_oklch(1_0_0_/_0.05)] hover:-translate-y-0.5 hover:bg-surface-2 disabled:opacity-60"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
        />
        <path
          fill="#FBBC05"
          d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.96H.96a9 9 0 0 0 0 8.08l3.01-2.32Z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.32C4.68 5.16 6.66 3.58 9 3.58Z"
        />
      </svg>
      {label}
    </button>
  );
}
