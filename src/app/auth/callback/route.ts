import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { defaultLocale } from "@/lib/i18n";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * OAuth + magic-link + email-confirmation callback. Exchanges the `code` for a
 * session and redirects to the intended `next` path (or the default-locale
 * dashboard).
 *
 * Hardened so it can NEVER take down the server:
 *  - the whole exchange is wrapped in try/catch — a thrown error (e.g. a missing
 *    PKCE code-verifier cookie) redirects to login instead of crashing the route;
 *  - the refreshed session cookies are written DIRECTLY onto the redirect
 *    response (not only the next/headers store), so the session reliably
 *    survives the redirect in Next 16 — otherwise the session silently drops and
 *    the dashboard bounces back to login.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const fallback = `/${defaultLocale}/dashboard`;
  const dest =
    next && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
  const loginUrl = `${origin}/${defaultLocale}/login`;

  if (!code) return NextResponse.redirect(loginUrl);
  if (!supabaseUrl || !supabaseKey) {
    console.error("[auth/callback] Supabase env not configured");
    return NextResponse.redirect(`${loginUrl}?error=config`);
  }

  // Build the success redirect up front; the Supabase client writes the new
  // session cookies onto THIS response so they persist across the redirect.
  const success = NextResponse.redirect(`${origin}${dest}`);

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          for (const { name, value, options } of cookiesToSet) {
            try {
              cookieStore.set(name, value, options);
            } catch {
              /* store can be read-only mid-request — the response cookie below
                 is the one that actually ships to the browser */
            }
            success.cookies.set(name, value, options);
          }
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback] exchange error:", error.message);
      return NextResponse.redirect(`${loginUrl}?error=callback`);
    }
    return success;
  } catch (err) {
    // Never let the callback throw — an uncaught throw here is what takes the
    // (dev) server down on OAuth / magic-link sign-in.
    console.error("[auth/callback] unexpected failure:", err);
    return NextResponse.redirect(`${loginUrl}?error=callback`);
  }
}
