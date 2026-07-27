import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 で middleware.ts は proxy.ts にリネームされた（シグネチャは同じ）
export default createMiddleware(routing);

export const config = {
  // api / _next / _vercel と、ドットを含むパス（feed.xml, robots.txt, *.png など）は除外。
  // タグページの slug にドットは含まれないため、この除外でタグURLが漏れることはない。
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
