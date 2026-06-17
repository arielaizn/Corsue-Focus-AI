"use client";

import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useFormStatus } from "react-dom";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/cn";
import {
  CURRENCY_OPTIONS,
  LOCALE_OPTIONS,
  TIMEZONE_OPTIONS,
  slugify,
  type AcademyFormValues,
  type FieldErrors,
} from "@/lib/data/academies.shared";
import {
  createAcademyAction,
  updateAcademyAction,
  checkSlugAction,
} from "./actions";
import { initialAcademyState, type AcademyActionState } from "./types";
import { academyDict, type AcademyDict } from "./dict";

type Mode = "create" | "settings";

export interface AcademyFormProps {
  mode: Mode;
  locale: Locale;
  academyId?: string;
  initialValues: AcademyFormValues;
}

const inputCls =
  "w-full rounded-xl bg-surface-2/60 px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none transition-shadow [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.55)]";
const inputErrCls =
  "[box-shadow:inset_0_0_0_1px_oklch(0.66_0.2_12_/_0.5)] focus:[box-shadow:inset_0_0_0_1px_oklch(0.66_0.2_12_/_0.7)]";
const labelCls =
  "mb-1.5 block text-xs font-semibold tracking-[0.04em] text-ink-soft";
const fieldErrCls = "mt-1.5 text-xs text-[oklch(0.78_0.16_18)]";
const hintCls = "mt-1.5 text-xs text-muted";

function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className={fieldErrCls}>
      {children}
    </p>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className="panel-premium p-6">
      <div className="mb-5">
        <h2 className="font-[family-name:var(--font-display)] text-h3 font-semibold text-ink">
          {title}
        </h2>
        <p className="mt-1 text-sm text-ink-soft">{hint}</p>
      </div>
      <div className="gilt-rule mb-5" />
      {children}
    </section>
  );
}

function fieldErrorText(
  d: AcademyDict,
  field: keyof FieldErrors,
  errors?: FieldErrors,
): string | undefined {
  const code = errors?.[field];
  if (!code) return undefined;
  if (field === "name") return d.errors.nameRequired;
  if (field === "slug") {
    if (code === "required") return d.errors.slugRequired;
    if (code === "taken") return d.errors.slug_taken;
    return d.errors.slugFormat;
  }
  if (field === "brandPrimary" || field === "brandAccent")
    return d.errors.colorFormat;
  return d.errors.unknown;
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
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

export function AcademyForm({
  mode,
  locale,
  academyId,
  initialValues,
}: AcademyFormProps) {
  const d = academyDict[locale];
  const action = mode === "create" ? createAcademyAction : updateAcademyAction;
  const [state, formAction] = useActionState<AcademyActionState, FormData>(
    action,
    initialAcademyState,
  );

  // Controlled fields needed for live UX (slug check + brand preview + auto-slug).
  const v = state.values ?? initialValues;
  const [name, setName] = useState(v.name);
  const [slug, setSlug] = useState(v.slug);
  const [slugDirty, setSlugDirty] = useState(mode === "settings");
  const [primary, setPrimary] = useState(v.brandPrimary);
  const [accent, setAccent] = useState(v.brandAccent);

  // Re-sync controlled fields from the server's echoed values after an action
  // round-trip (validation/slug error). Canonical "adjust state during render"
  // pattern: compare the server marker against the last one we applied (kept in
  // state, not a ref) so a new round-trip re-seeds the controlled inputs once.
  const echoKey = `${state.savedAt ?? ""}:${state.formError ?? ""}`;
  const [appliedEcho, setAppliedEcho] = useState<string | null>(null);
  if (state.values && echoKey !== ":" && echoKey !== appliedEcho) {
    setAppliedEcho(echoKey);
    setName(state.values.name);
    setSlug(state.values.slug);
    setPrimary(state.values.brandPrimary);
    setAccent(state.values.brandAccent);
  }

  // Auto-derive slug from the name until the user edits the slug themselves
  // (create mode only). Handled in the name onChange — no effect needed.
  const onNameChange = (next: string) => {
    setName(next);
    if (mode === "create" && !slugDirty) setSlug(slugify(next));
  };

  const ids = {
    name: useId(),
    slug: useId(),
    desc: useId(),
    primary: useId(),
    accent: useId(),
    locale: useId(),
    currency: useId(),
    timezone: useId(),
    wl: useId(),
  };

  const fe = state.fieldErrors;

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="locale" value={locale} />
      {mode === "settings" && academyId && (
        <input type="hidden" name="academyId" value={academyId} />
      )}

      {/* Form-level notice */}
      {state.status === "error" && state.formError && (
        <p
          role="alert"
          className="rounded-xl bg-[oklch(0.66_0.2_12_/_0.12)] px-4 py-2.5 text-sm text-[oklch(0.78_0.16_18)] [box-shadow:inset_0_0_0_1px_oklch(0.66_0.2_12_/_0.32)]"
        >
          {d.errors[state.formError]}
        </p>
      )}
      {state.status === "success" && (
        <p
          role="status"
          className="rounded-xl bg-[oklch(0.78_0.13_165_/_0.12)] px-4 py-2.5 text-sm text-pos [box-shadow:inset_0_0_0_1px_oklch(0.78_0.13_165_/_0.3)]"
        >
          {d.saved}
        </p>
      )}

      {/* Identity */}
      <Section title={d.sectionIdentity} hint={d.sectionIdentityHint}>
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelCls} htmlFor={ids.name}>
              {d.name}
            </label>
            <input
              id={ids.name}
              name="name"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              required
              maxLength={80}
              placeholder={d.namePlaceholder}
              className={cn(inputCls, fe?.name && inputErrCls)}
              aria-invalid={!!fe?.name}
            />
            <FieldError>{fieldErrorText(d, "name", fe)}</FieldError>
          </div>

          <SlugField
            id={ids.slug}
            d={d}
            slug={slug}
            onChange={(next) => {
              setSlugDirty(true);
              setSlug(slugify(next));
            }}
            error={fieldErrorText(d, "slug", fe)}
            invalid={!!fe?.slug}
            mode={mode}
            academyId={academyId}
          />

          <div>
            <label className={labelCls} htmlFor={ids.desc}>
              {d.description}
            </label>
            <textarea
              id={ids.desc}
              name="description"
              defaultValue={v.description}
              rows={2}
              maxLength={280}
              placeholder={d.descriptionPlaceholder}
              className={cn(inputCls, "resize-none")}
            />
          </div>
        </div>
      </Section>

      {/* Branding */}
      <Section title={d.sectionBranding} hint={d.sectionBrandingHint}>
        <div className="grid gap-5 sm:grid-cols-2">
          <ColorField
            id={ids.primary}
            label={d.brandPrimary}
            name="brandPrimary"
            value={primary}
            onChange={setPrimary}
            error={fieldErrorText(d, "brandPrimary", fe)}
          />
          <ColorField
            id={ids.accent}
            label={d.brandAccent}
            name="brandAccent"
            value={accent}
            onChange={setAccent}
            error={fieldErrorText(d, "brandAccent", fe)}
          />
        </div>
        <BrandPreview d={d} primary={primary} accent={accent} name={name} />
      </Section>

      {/* Regional */}
      <Section title={d.sectionRegional} hint={d.sectionRegionalHint}>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={labelCls} htmlFor={ids.locale}>
              {d.locale}
            </label>
            <select
              id={ids.locale}
              name="locale_pref"
              defaultValue={v.locale}
              className={cn(inputCls, "appearance-none")}
            >
              {LOCALE_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {d.localeNames[l]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor={ids.currency}>
              {d.currency}
            </label>
            <select
              id={ids.currency}
              name="currency"
              defaultValue={v.currency}
              className={cn(inputCls, "appearance-none")}
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor={ids.timezone}>
              {d.timezone}
            </label>
            <select
              id={ids.timezone}
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

        <label
          htmlFor={ids.wl}
          className="mt-5 flex items-start gap-3 rounded-xl bg-surface-2/40 p-4 [box-shadow:inset_0_0_0_1px_var(--color-line)]"
        >
          <input
            id={ids.wl}
            name="white_label"
            type="checkbox"
            defaultChecked={v.white_label}
            className="mt-0.5 size-4 shrink-0 accent-[oklch(0.83_0.13_88)]"
          />
          <span>
            <span className="block text-sm font-semibold text-ink">
              {d.whiteLabel}
            </span>
            <span className="mt-0.5 block text-xs text-muted">
              {d.whiteLabelHint}
            </span>
          </span>
        </label>
      </Section>

      <div className="flex items-center justify-end gap-3">
        <SubmitButton
          label={mode === "create" ? d.create : d.save}
          pendingLabel={mode === "create" ? d.creating : d.saving}
        />
      </div>
    </form>
  );
}

/* ----------------------------- Slug field ------------------------------- */

function SlugField({
  id,
  d,
  slug,
  onChange,
  error,
  invalid,
  mode,
  academyId,
}: {
  id: string;
  d: AcademyDict;
  slug: string;
  onChange: (next: string) => void;
  error?: string;
  invalid: boolean;
  mode: Mode;
  academyId?: string;
}) {
  // Result is keyed to the slug it was computed for, so a stale result for a
  // previous slug is ignored during render (no synchronous setState reset).
  const [result, setResult] = useState<{
    slug: string;
    value: "available" | "taken" | "invalid" | "unknown";
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (!slug) return;
    debounce.current = setTimeout(() => {
      startTransition(async () => {
        const value = await checkSlugAction(slug, academyId);
        setResult({ slug, value });
      });
    }, 450);
    return () => {
      if (debounce.current) clearTimeout(debounce.current);
    };
  }, [slug, academyId]);

  // Only trust a result that matches the current slug.
  const status: "idle" | "available" | "taken" | "invalid" | "unknown" =
    !slug ? "idle" : result && result.slug === slug ? result.value : "idle";
  const showChecking =
    !!slug && (isPending || !result || result.slug !== slug);

  const liveText =
    showChecking
      ? d.slugChecking
      : status === "available"
        ? d.slugAvailable
        : status === "taken"
          ? d.slugTaken
          : status === "invalid"
            ? d.slugInvalid
            : status === "unknown"
              ? d.slugUnknown
              : null;

  const liveTone =
    status === "available"
      ? "text-pos"
      : status === "taken" || status === "invalid"
        ? "text-[oklch(0.78_0.16_18)]"
        : "text-muted";

  return (
    <div>
      <label className={labelCls} htmlFor={id}>
        {d.slug}
      </label>
      <div
        className={cn(
          "flex items-stretch overflow-hidden rounded-xl bg-surface-2/60 [box-shadow:inset_0_0_0_1px_var(--color-line)] focus-within:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.55)]",
          invalid && "[box-shadow:inset_0_0_0_1px_oklch(0.66_0.2_12_/_0.5)]",
        )}
      >
        <input
          id={id}
          name="slug"
          value={slug}
          onChange={(e) => onChange(e.target.value)}
          required
          inputMode="url"
          spellCheck={false}
          autoCapitalize="none"
          placeholder="acme-academy"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-muted/70 outline-none"
          aria-invalid={invalid}
        />
        <span
          aria-hidden
          className="flex items-center whitespace-nowrap border-line/80 px-3 text-xs text-muted [border-inline-start-width:1px]"
        >
          .coursefocus.ai
        </span>
      </div>
      {liveText && !error ? (
        <p className={cn("mt-1.5 text-xs", liveTone)} aria-live="polite">
          {liveText}
        </p>
      ) : (
        <FieldError>{error}</FieldError>
      )}
      {!error && !liveText && <p className={hintCls}>{d.slugHint}</p>}
      {/* keep mode referenced for future create-only behaviors */}
      <span className="hidden">{mode}</span>
    </div>
  );
}

/* ----------------------------- Color field ------------------------------ */

function ColorField({
  id,
  label,
  name,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const normalized = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
  return (
    <div>
      <label className={labelCls} htmlFor={id}>
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl bg-surface-2/60 p-2 pe-4 [box-shadow:inset_0_0_0_1px_var(--color-line)] focus-within:[box-shadow:inset_0_0_0_1px_oklch(0.83_0.13_88_/_0.55)]",
          error && inputErrCls,
        )}
      >
        <span className="relative inline-flex size-9 shrink-0 overflow-hidden rounded-lg [box-shadow:inset_0_0_0_1px_oklch(1_0_0_/_0.12)]">
          <span
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundColor: normalized }}
          />
          <input
            type="color"
            aria-label={label}
            value={normalized}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
          />
        </span>
        <input
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
          autoCapitalize="none"
          maxLength={7}
          className="min-w-0 flex-1 bg-transparent text-sm uppercase tabular-nums text-ink outline-none"
        />
      </div>
      <FieldError>{error}</FieldError>
    </div>
  );
}

/* ---------------------------- Brand preview ----------------------------- */

function BrandPreview({
  d,
  primary,
  accent,
  name,
}: {
  d: AcademyDict;
  primary: string;
  accent: string;
  name: string;
}) {
  const p = /^#[0-9a-fA-F]{6}$/.test(primary) ? primary : "#7C5CFC";
  const a = /^#[0-9a-fA-F]{6}$/.test(accent) ? accent : "#E7C66B";
  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-semibold tracking-[0.04em] text-ink-soft">
        {d.brandPreview}
      </p>
      <div
        className="relative flex items-center gap-4 overflow-hidden rounded-2xl p-5 [box-shadow:inset_0_0_0_1px_oklch(1_0_0_/_0.08)]"
        style={{
          backgroundImage: `linear-gradient(135deg, ${p}33, ${a}1f)`,
        }}
      >
        <span
          aria-hidden
          className="grid size-12 shrink-0 place-items-center rounded-xl text-base font-bold text-white"
          style={{
            backgroundImage: `linear-gradient(135deg, ${p}, ${a})`,
          }}
        >
          {(name.trim()[0] ?? "A").toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            {name.trim() || d.brandPreviewBadge}
          </p>
          <span
            className="mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold"
            style={{ color: a, boxShadow: `inset 0 0 0 1px ${a}66` }}
          >
            {d.brandPreviewBadge}
          </span>
        </div>
      </div>
    </div>
  );
}
