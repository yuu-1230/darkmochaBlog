import { getAllPosts } from "@/lib/mdx";
import { SITE_NAME, AUTHOR_NAME } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";
import type { Locale } from "@/i18n/routing";

function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** フィード自身のURL。ja は /feed.xml、en は /en/feed.xml */
export function feedUrl(locale: Locale): string {
  return localeUrl(locale, "/feed.xml");
}

export async function buildFeed(locale: Locale): Promise<Response> {
  const posts = await getAllPosts(locale);

  const items = posts
    .map((post) => {
      const url = localeUrl(locale, `/blog/${post.slug}`);
      return `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>${
        post.frontmatter.description
          ? `\n      <description>${escapeXml(post.frontmatter.description)}</description>`
          : ""
      }${
        post.frontmatter.category
          ? `\n      <category>${escapeXml(post.frontmatter.category)}</category>`
          : ""
      }
    </item>`;
    })
    .join("\n");

  const lastBuildDate = posts[0]
    ? new Date(
        posts[0].frontmatter.update ?? posts[0].frontmatter.date,
      ).toUTCString()
    : new Date().toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${localeUrl(locale)}</link>
    <description>Engineer and Everyday life Blog by ${escapeXml(AUTHOR_NAME)}</description>
    <language>${locale}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl(locale)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
