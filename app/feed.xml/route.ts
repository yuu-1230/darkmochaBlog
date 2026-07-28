import { buildFeed } from "@/lib/feed";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";

/** 日本語フィード。既定ロケールはプレフィックス無しなので /feed.xml のまま */
export async function GET() {
  return buildFeed(routing.defaultLocale);
}
