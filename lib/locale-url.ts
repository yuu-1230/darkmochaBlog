import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/lib/constants";

/** localePrefix: "as-needed" に合わせたパスを組み立てる（ja はプレフィックス無し） */
export function localePath(locale: Locale, path = ""): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${prefix}${path}` || "/";
}

/** canonical / og:url 用の絶対URL */
export function localeUrl(locale: Locale, path = ""): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}
