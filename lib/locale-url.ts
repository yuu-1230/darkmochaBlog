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

/**
 * hreflang 用の alternates.languages を組み立てる。
 *
 * `availableLocales` には「そのパスが実在するロケール」だけを渡すこと。
 * 未訳の記事に hreflang を張ると、Google 側で相互参照が成立せず翻訳漏れ扱いになる。
 * x-default は既定ロケール（日本語）に向ける。
 */
export function localeAlternates(
  path: string,
  availableLocales: readonly Locale[] = routing.locales,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of availableLocales) {
    languages[locale] = localeUrl(locale, path);
  }
  if (availableLocales.includes(routing.defaultLocale)) {
    languages["x-default"] = localeUrl(routing.defaultLocale, path);
  }
  return languages;
}
