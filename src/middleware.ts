import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { defaultLocale, isLocale } from "@/lib/i18n";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  // 1) Locale routing: redirect any locale-less path to the default locale.
  if (!isLocale(first)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // 2) Keep the Supabase auth session fresh so expired tokens refresh into
  //    cookies. Ready for future authed/app routes. We only do the network
  //    round-trip when a Supabase session cookie is actually present, so
  //    anonymous marketing visitors stay fast.
  let response = NextResponse.next({ request: { headers: request.headers } });

  if (supabaseUrl && supabaseKey) {
    const hasSession = request.cookies
      .getAll()
      .some((c) => c.name.startsWith("sb-"));

    if (hasSession) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      });
      await supabase.auth.getUser();
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|.*\\..*|api).*)"],
};
