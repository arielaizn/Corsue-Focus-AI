import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { defaultLocale } from "@/lib/i18n";

/**
 * OAuth + magic-link callback. Exchanges the `code` for a session (cookies are
 * written by the SSR client), then redirects to the intended `next` path or the
 * default-locale dashboard.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const fallback = `/${defaultLocale}/dashboard`;
  const dest =
    next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;

  if (code) {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${dest}`);
    }
    return NextResponse.redirect(
      `${origin}/${defaultLocale}/login?error=callback`,
    );
  }

  return NextResponse.redirect(`${origin}/${defaultLocale}/login`);
}
