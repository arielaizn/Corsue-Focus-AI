"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { appDictionary } from "@/lib/app-dictionary";

export interface AuthState {
  error?: string;
  notice?: string;
}

function resolveLocale(value: FormDataEntryValue | null): Locale {
  const v = typeof value === "string" ? value : "";
  return isLocale(v) ? v : defaultLocale;
}

function safeNext(value: FormDataEntryValue | null, locale: Locale): string {
  const v = typeof value === "string" ? value : "";
  // only allow same-origin app paths
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  // No explicit deep-link → route through /postlogin, which lands the user on
  // the right surface for their role (admin / dashboard / learn).
  return `/${locale}/postlogin`;
}

/** Canonical production origin — the ONLY trusted host for emailed/OAuth
 *  redirect links when NEXT_PUBLIC_SITE_URL is not set. */
const CANONICAL_ORIGIN = "https://coursefocus.ai";

/**
 * Resolve the absolute site origin used to build emailRedirectTo (signup /
 * magic link) and the OAuth redirectTo. We MUST NOT trust the inbound Host /
 * X-Forwarded-Host header in production: an attacker who controls it could
 * poison the link Supabase emails to the user (host-header injection ->
 * redirect/token leakage). Trust order:
 *   1) NEXT_PUBLIC_SITE_URL  (explicit, set per deploy)        — preferred
 *   2) inbound host, ONLY when it's a localhost dev host       — local dev
 *   3) hardcoded canonical production origin                   — safe fallback
 */
async function getOrigin(): Promise<string> {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  const isLocalhost = /^localhost(:\d+)?$|^127\.0\.0\.1(:\d+)?$/.test(host);
  if (isLocalhost) {
    const proto = h.get("x-forwarded-proto") ?? "http";
    return `${proto}://${host}`;
  }

  // Any other host with no explicit NEXT_PUBLIC_SITE_URL -> never trust the
  // header; fall back to the canonical origin (which must be allowlisted in
  // Supabase Auth -> Redirect URLs).
  return CANONICAL_ORIGIN;
}

export async function signInWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = appDictionary[locale].auth.errors;
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"), locale);

  if (!email) return { error: t.emailRequired };

  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Never leak the raw Supabase error string to the client (it can disclose
    // rate-limit internals / account-existence signals and isn't localized).
    return {
      error: /invalid|credential/i.test(error.message) ? t.invalid : t.generic,
    };
  }
  redirect(next);
}

export async function signUpWithPassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = appDictionary[locale].auth.errors;
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("name") ?? "").trim();
  const next = safeNext(formData.get("next"), locale);

  if (!email) return { error: t.emailRequired };

  const origin = await getOrigin();
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || email.split("@")[0], locale },
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  // Localized + non-leaking: don't return the raw Supabase error string.
  if (error) return { error: t.generic };

  // If email confirmation is required, there's no active session yet.
  if (!data.session) {
    return { notice: appDictionary[locale].auth.magicLinkSent };
  }
  redirect(next);
}

export async function signInWithMagicLink(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = appDictionary[locale].auth.errors;
  const email = String(formData.get("email") ?? "").trim();
  const next = safeNext(formData.get("next"), locale);

  if (!email) return { error: t.emailRequired };

  const origin = await getOrigin();
  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) return { error: t.generic };
  return { notice: appDictionary[locale].auth.magicLinkSent };
}

export async function signInWithGoogle(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = appDictionary[locale].auth.errors;
  const next = safeNext(formData.get("next"), locale);

  const origin = await getOrigin();
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data?.url) {
    // Provider not enabled in the Supabase dashboard yet -> friendly message.
    if (error && /provider|not enabled|unsupported/i.test(error.message)) {
      return { error: t.googleUnconfigured };
    }
    return { error: t.googleUnconfigured };
  }
  redirect(data.url);
}

export async function signInWithApple(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = appDictionary[locale].auth.errors;
  const next = safeNext(formData.get("next"), locale);

  const origin = await getOrigin();
  const supabase = createClient(await cookies());
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data?.url) {
    // Provider not enabled in Supabase yet -> friendly, non-leaking message.
    return { error: t.appleUnconfigured };
  }
  redirect(data.url);
}

/** Send a password-reset email. The link routes through the callback into the
 *  locale /reset page where the user sets a new password. */
export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = appDictionary[locale].auth.errors;
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: t.emailRequired };

  const origin = await getOrigin();
  const supabase = createClient(await cookies());
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(
      `/${locale}/reset`,
    )}`,
  });

  // Always report success-shaped to avoid leaking which emails exist.
  if (error && !/rate|limit/i.test(error.message)) {
    return { notice: appDictionary[locale].auth.magicLinkSent };
  }
  return { notice: appDictionary[locale].auth.magicLinkSent };
}

/** Set a new password for the currently-authenticated (recovery) session. */
export async function updatePassword(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = resolveLocale(formData.get("locale"));
  const t = appDictionary[locale].auth.errors;
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    return {
      error:
        locale === "he"
          ? "הסיסמה חייבת להכיל לפחות 8 תווים."
          : "Password must be at least 8 characters.",
    };
  }

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      error:
        locale === "he"
          ? "פג תוקף קישור האיפוס. בקש קישור חדש."
          : "Reset link expired. Request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: t.generic };
  redirect(`/${locale}/dashboard`);
}

export async function signOut(formData: FormData): Promise<void> {
  const locale = resolveLocale(formData.get("locale"));
  const supabase = createClient(await cookies());
  await supabase.auth.signOut();
  redirect(`/${locale}/login`);
}
