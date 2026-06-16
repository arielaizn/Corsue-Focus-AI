import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { appDictionary } from "@/lib/app-dictionary";
import { getUser } from "@/lib/auth";
import { AuthShell } from "../AuthShell";
import { AuthForm } from "../AuthForm";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
}) {
  const { locale: raw } = await params;
  const { next: nextRaw } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "he";
  const t = appDictionary[locale].auth;
  const next =
    nextRaw && nextRaw.startsWith("/") && !nextRaw.startsWith("//")
      ? nextRaw
      : `/${locale}/dashboard`;

  // Already signed in -> straight to the dashboard.
  const user = await getUser();
  if (user) redirect(next);

  return (
    <AuthShell
      locale={locale}
      t={t}
      heading={t.welcome}
      sub={t.welcomeSub}
      switchPrompt={t.noAccount}
      switchHref={`/${locale}/signup${
        nextRaw ? `?next=${encodeURIComponent(next)}` : ""
      }`}
      switchLabel={t.toSignup}
    >
      <AuthForm mode="login" locale={locale} next={next} t={t} />
    </AuthShell>
  );
}
