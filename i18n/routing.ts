import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ja", "en"],
  defaultLocale: "ja",
  // 日本語はプレフィックス無し（/blog）、英語のみ /en を付ける
  localePrefix: "as-needed",
  // Accept-Language による自動リダイレクトはしない。
  // 共有された URL が閲覧者ごとに違う言語で開くのを防ぐため、切り替えは明示操作のみ。
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  ja: "JA",
  en: "EN",
};

/** date-fns / toLocaleString 用の BCP 47 タグ */
export const BCP47: Record<Locale, string> = {
  ja: "ja-JP",
  en: "en-US",
};
