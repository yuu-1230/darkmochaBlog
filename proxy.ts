import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// Next.js 16 で middleware.ts は proxy.ts にリネームされた（シグネチャは同じ）
const handleI18n = createMiddleware(routing);

const LOCALE_COOKIE = "NEXT_LOCALE";

function isLocalDocsPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "docs") return true;
  return (
    segments.length >= 2 &&
    (routing.locales as readonly string[]).includes(segments[0]) &&
    segments[1] === "docs"
  );
}

function hasLocalePrefix(pathname: string): boolean {
  return routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ローカル資料はページ側でもnotFoundにするが、productionではproxyでも遮断する。
  // 既定ロケールの404をnext-intlが正規URLへ戻す際のリダイレクトループも防ぐ。
  if (process.env.NODE_ENV === "production" && isLocalDocsPath(pathname)) {
    return new NextResponse("Not Found", {
      status: 404,
      headers: { "X-Robots-Tag": "noindex, noarchive" },
    });
  }

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
  // 除外するもの:
  // - api / _next / _vercel
  // - ドットを含むパス（feed.xml, robots.txt, *.png など）
  // - Next のメタデータ画像ルート（opengraph-image / twitter-image / icon）。
  //   これらは拡張子を持たない /ja/opengraph-image のような形で og:image に
  //   埋め込まれるため、リライト対象にすると 307 が挟まりクエリも壊れる。
  // タグページの slug にドットは含まれないため、この除外でタグURLが漏れることはない。
  matcher: [
    "/((?!api|_next|_vercel|.*/(?:opengraph-image|twitter-image|icon)|.*\\..*).*)",
  ],
};
