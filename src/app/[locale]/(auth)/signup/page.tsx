import { redirect } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";
import { appDictionary } from "@/lib/app-dictionary";
import { getUser } from "@/lib/auth";
import { AuthShell } from "../AuthShell";
import { AuthForm } from "../AuthForm";

export default async function SignupPage({
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

  const user = await getUser();
  if (user) redirect(next);

  return (
    <AuthShell
      locale={locale}
      t={t}
      heading={t.signupLead}
      sub={t.signupSub}
      switchPrompt={t.haveAccount}
      switchHref={`/${locale}/login${
        nextRaw ? `?next=${encodeURIComponent(next)}` : ""
      }`}
      switchLabel={t.toLogin}
    >
      <AuthForm mode="signup" locale={locale} next={next} t={t} />
    </AuthShell>
  );
}
