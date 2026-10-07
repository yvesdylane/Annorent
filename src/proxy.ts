import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales, type Locale } from "@/lib/i18n";

/**
 * Request proxy — Next.js 16's replacement for the deprecated `middleware.ts`
 * convention (see `context/file-structure.md` §3).
 *
 * Owns locale selection only: it redirects an unprefixed request to its
 * `/[locale]/...` equivalent, preferring an explicit `locale` cookie, then the
 * default locale (English). `Accept-Language` is deliberately not sniffed —
 * the whole site defaults to English for unprefixed visitors. RBAC guards are
 * a separate concern (rule 12) and are not implemented here yet.
 */

const COOKIE = "locale";

function preferredLocale(request: NextRequest): Locale {
  const fromCookie = request.cookies.get(COOKIE)?.value;
  if (fromCookie && (locales as readonly string[]).includes(fromCookie)) {
    return fromCookie as Locale;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Everything except Next internals, API routes, and files with an extension.
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
