import Image from "next/image";
import { cookies } from "next/headers";
import {
  isLocale,
  defaultLocale,
  locales,
  localeLabel,
  type Locale,
} from "@/lib/i18n";
import { requireStudent } from "@/lib/auth";
import { createClient } from "@/utils/supabase/server";
import { learnDict } from "@/components/learn/dictionary";
import { PageHeader, Panel } from "@/components/dashboard/ui";
import { updateProfileAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const sp = await searchParams;
  const dict = learnDict[locale];
  const d = dict.settings;

  const user = await requireStudent(locale, `/${locale}/learn/settings`);

  const supabase = createClient(await cookies());
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url, locale")
    .eq("id", user.id)
    .maybeSingle();

  const name =
    profile?.display_name?.trim() ||
    (typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : "") ||
    "";
  const avatarUrl = profile?.avatar_url ?? "";
  const validAvatar = /^https?:\/\//.test(avatarUrl);
  const initial = (name || user.email || "—").trim().charAt(0).toUpperCase();
  const savedLocale: Locale =
    profile?.locale && isLocale(profile.locale) ? profile.locale : locale;

  const justSaved = sp.saved === "1";
  const justErrored = sp.error === "1";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader kicker={dict.nav.settings} title={d.title} />

      {/* Save confirmation / error (server-rendered after the action redirect) */}
      {justSaved && (
        <p
          role="status"
          className="rounded-[8px] bg-[oklch(0.76_0.105_80_/_0.1)] px-4 py-3 text-sm font-medium text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]"
        >
          {d.profileUpdated}
        </p>
      )}
      {justErrored && (
        <p
          role="alert"
          className="rounded-[8px] bg-surface-2 px-4 py-3 text-sm font-medium text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)]"
        >
          {dict.errors.generic}
        </p>
      )}

      <Panel title={d.account}>
        <form action={updateProfileAction} className="flex flex-col gap-6">
          <input type="hidden" name="currentLocale" value={locale} />

          {/* Avatar preview + URL */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-surface-2 text-xl font-semibold text-ink [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.4)]">
              {validAvatar ? (
                <Image
                  src={avatarUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                initial
              )}
            </span>
            <label className="flex-1">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                {d.avatar}
              </span>
              <input
                type="url"
                name="avatarUrl"
                defaultValue={avatarUrl}
                inputMode="url"
                dir="ltr"
                placeholder="https://…"
                className="w-full rounded-[8px] bg-bg-deep px-3.5 py-2.5 text-sm text-ink placeholder:text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:outline-none focus-visible:[box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.5)]"
              />
            </label>
          </div>

          {/* Display name */}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">
              {d.displayName}
            </span>
            <input
              type="text"
              name="displayName"
              defaultValue={name}
              required
              maxLength={80}
              autoComplete="name"
              className="w-full rounded-[8px] bg-bg-deep px-3.5 py-2.5 text-sm text-ink placeholder:text-muted [box-shadow:inset_0_0_0_1px_var(--color-line)] focus:outline-none focus-visible:[box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.5)]"
            />
          </label>

          {/* Language */}
          <fieldset className="block">
            <legend className="mb-2 text-sm font-medium text-ink-soft">
              {d.language}
            </legend>
            <div className="flex flex-wrap gap-2">
              {locales.map((l) => {
                const active = l === savedLocale;
                return (
                  <label
                    key={l}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-[8px] px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[oklch(0.76_0.105_80_/_0.1)] text-gold [box-shadow:inset_0_0_0_1px_oklch(0.76_0.105_80_/_0.45)]"
                        : "bg-bg-deep text-ink-soft [box-shadow:inset_0_0_0_1px_var(--color-line)] hover:text-ink"
                    }`}
                  >
                    <input
                      type="radio"
                      name="locale"
                      value={l}
                      defaultChecked={active}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className={`grid h-3.5 w-3.5 place-items-center rounded-full ${
                        active
                          ? "[box-shadow:inset_0_0_0_4px_var(--color-gold)]"
                          : "[box-shadow:inset_0_0_0_1.5px_var(--color-line)]"
                      }`}
                    />
                    {localeLabel[l]}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="flex items-center gap-3 border-t border-line/70 pt-5">
            <button
              type="submit"
              className="bg-ink text-bg-deep inline-flex items-center justify-center rounded-[6px] px-6 py-2.5 text-sm font-semibold transition-[transform,background-color] duration-300 [box-shadow:inset_0_1px_0_oklch(1_0_0_/_0.3)] hover:-translate-y-px hover:bg-ink-soft"
            >
              {d.save}
            </button>
            <span className="text-xs text-muted">{user.email}</span>
          </div>
        </form>
      </Panel>
    </div>
  );
}
