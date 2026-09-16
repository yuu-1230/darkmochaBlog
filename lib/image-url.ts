import { SITE_URL } from "@/lib/constants";

const DEFAULT_ARTICLE_IMAGE_BASE_URL = "https://images.darkmocha.dev";
const ARTICLE_IMAGE_PATH_PREFIX = "/images/Articles/";

function articleImageBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? DEFAULT_ARTICLE_IMAGE_BASE_URL
  ).replace(/\/+$/, "");
}

/**
 * MDXでは従来の /images/Articles/... を維持し、表示時だけR2へ向ける。
 * アイコン、既定OG画像、プロフィール、Projects、Notesはローカルのままにする。
 */
export function resolveImageUrl(src: string): string {
  if (!src.startsWith(ARTICLE_IMAGE_PATH_PREFIX)) {
    return src;
  }

  return `${articleImageBaseUrl()}${src}`;
}

/** JSON-LDなど、絶対URLが必要な箇所向け。 */
export function resolveAbsoluteImageUrl(src: string): string {
  const resolved = resolveImageUrl(src);
  if (/^https?:\/\//i.test(resolved)) {
    return resolved;
  }

  return new URL(resolved, SITE_URL).toString();
}
