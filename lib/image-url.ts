import { SITE_URL } from "@/lib/constants";

const DEFAULT_IMAGE_BASE_URL = "https://images.darkmocha.dev";
const IMAGE_PATH_PREFIX = "/images/";
const LOCAL_FAVICON_PATH = "/images/icon.png";

function imageBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? DEFAULT_IMAGE_BASE_URL
  ).replace(/\/+$/, "");
}

/**
 * 既存の /images/... パスを維持し、表示時だけR2へ向ける。
 * faviconだけはデプロイと同時に必ず配信できるようローカルに残す。
 */
export function resolveImageUrl(src: string): string {
  if (!src.startsWith(IMAGE_PATH_PREFIX) || src === LOCAL_FAVICON_PATH) {
    return src;
  }

  return `${imageBaseUrl()}${src}`;
}

/** JSON-LDなど、絶対URLが必要な箇所向け。 */
export function resolveAbsoluteImageUrl(src: string): string {
  const resolved = resolveImageUrl(src);
  if (/^https?:\/\//i.test(resolved)) {
    return resolved;
  }

  return new URL(resolved, SITE_URL).toString();
}
