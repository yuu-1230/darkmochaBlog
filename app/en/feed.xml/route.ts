import { buildFeed } from "@/lib/feed";

export const dynamic = "force-static";

/**
 * 英語フィード（/en/feed.xml）。
 * app/[locale] の動的セグメントではなく静的セグメントに置いている。
 * ドットを含むパスは proxy.ts の matcher から除外されており、
 * [locale] へのリライトが走らないため。
 */
export async function GET() {
  return buildFeed("en");
}
