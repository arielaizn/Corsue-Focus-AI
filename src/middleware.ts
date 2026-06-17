import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { defaultLocale, isLocale } from "@/lib/i18n";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  // 0) Auth route handlers (OAuth / magic-link callback) live at the locale-less
  //    /auth/** path. They must NOT be locale-redirected (that would 404 the
  //    callback and silently break the whole sign-in flow, dropping ?code=) and
  //    they don't need session-refresh here — exchangeCodeForSession sets cookies.
  if (pathname === "/auth/callback" || pathname.startsWith("/auth/")) {
    return NextResponse.next();
  }

  // 1) Locale routing: redirect any locale-less path to the default locale.
  if (!isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  const locale = first;
  const rest = pathname.slice(`/${locale}`.length); // "" | "/dashboard..." | "/login"
  const isDashboard = rest === "/dashboard" || rest.startsWith("/dashboard/");
  const isAdmin = rest === "/admin" || rest.startsWith("/admin/");
  const isLearn = rest === "/learn" || rest.startsWith("/learn/");
  // All authenticated app surfaces. The public storefront (/a/[slug]) is NOT
  // here — it stays reachable anonymously. Platform-admin ROLE enforcement
  // lives in /admin/layout.tsx (requirePlatformAdmin), not in middleware.
  const isProtected = isDashboard || isAdmin || isLearn;

  // Expose the current path to layouts (so the marketing chrome can opt out
  // for the dashboard/auth app shell). Forwarded on the request headers.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // 2) Keep the Supabase auth session fresh + (when relevant) gate the
  //    dashboard. We resolve the user when a session cookie is present OR when
  //    the path is protected (so anonymous dashboard hits redirect correctly).
  if (supabaseUrl && supabaseKey) {
    const hasSession = request.cookies
      .getAll()
      .some((c) => c.name.startsWith("sb-"));

    let user: User | null = null;

    if (hasSession || isProtected) {
      const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request: { headers: requestHeaders },
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      });
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }

    // 3) Protect the dashboard + learner area: no user -> login?next=<path>.
    if (isProtected && !user) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      url.search = "";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
