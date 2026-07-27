import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Next.js 16 で middleware.ts は proxy.ts にリネームされた（シグネチャは同じ）
const handleI18n = createMiddleware(routing);

const LOCALE_COOKIE = "NEXT_LOCALE";

function hasLocalePrefix(pathname: string): boolean {
  return routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // routing.localeDetection は false のまま（Accept-Language による自動振り分けはしない）。
  // ただし next-intl は localeDetection: false だと cookie も読まなくなるため、
  // 「ユーザーが自分でスイッチャーから選んだ結果」だけをここで拾う。
  // 判断材料は cookie のみ。cookie を持たない初回訪問者は必ず日本語のままになる。
  if (
    request.headers.get("sec-fetch-dest") === "document" &&
    !hasLocalePrefix(pathname)
  ) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    if (
      cookieLocale &&
      cookieLocale !== routing.defaultLocale &&
      (routing.locales as readonly string[]).includes(cookieLocale)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = `/${cookieLocale}${pathname === "/" ? "" : pathname}`;
      return NextResponse.redirect(url);
    }
  }

  return handleI18n(request);
}

export const config = {
  // api / _next / _vercel と、ドットを含むパス（feed.xml, robots.txt, *.png など）は除外。
  // タグページの slug にドットは含まれないため、この除外でタグURLが漏れることはない。
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
