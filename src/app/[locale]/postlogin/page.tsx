import { redirect } from "next/navigation";
import { isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import {
  requireUser,
  resolveLandingSurface,
  landingPath,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * Post-login role router. The auth flows redirect here when there's no explicit
 * `next` deep-link; it resolves the user's highest-privilege surface and sends
 * them on: platform-admin → /admin, manager → /dashboard, student → /learn.
 */
export default async function PostLogin({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  await requireUser(locale, `/${locale}/postlogin`);
  const surface = await resolveLandingSurface();
  redirect(landingPath(surface, locale));
}
