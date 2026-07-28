import { MetadataRoute } from "next";
import { getAllPosts, type PostData } from "@/lib/mdx";
import { routing, type Locale } from "@/i18n/routing";
import { localeUrl, localeAlternates } from "@/lib/locale-url";

const STATIC_ROUTES = [
  { route: "",                priority: 1.0 },
  { route: "/blog",           priority: 0.9 },
  { route: "/about",          priority: 0.8 },
  { route: "/projects",       priority: 0.8 },
  { route: "/travel",         priority: 0.8 },
  { route: "/notes-timeline", priority: 0.75 },
];

const lastModifiedOf = (post: PostData) =>
  new Date(post.frontmatter.update ?? post.frontmatter.date).toISOString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const postsByLocale = Object.fromEntries(
    await Promise.all(
      routing.locales.map(async (locale) => [
        locale,
        await getAllPosts(locale),
      ] as const),
    ),
  ) as Record<Locale, PostData[]>;

  const allPosts = Object.values(postsByLocale).flat();
  const siteLastModified =
    allPosts.map(lastModifiedOf).sort().at(-1) ?? new Date().toISOString();

  // 固定ページは全ロケールに存在するので、常に相互に hreflang を張る
  const staticEntries = STATIC_ROUTES.flatMap(({ route, priority }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, route),
      lastModified: siteLastModified,
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages: localeAlternates(route) },
    })),
  );

  // 記事は「翻訳が存在するロケール」だけを相互に張る
  const postEntries = routing.locales.flatMap((locale) =>
    postsByLocale[locale].map((post) => {
      const path = `/blog/${post.slug}`;
      const availableLocales = routing.locales.filter((candidate) =>
        postsByLocale[candidate].some((p) => p.slug === post.slug),
      );
      return {
        url: localeUrl(locale, path),
        lastModified: lastModifiedOf(post),
        changeFrequency: "monthly" as const,
        priority: 0.6,
        alternates: { languages: localeAlternates(path, availableLocales) },
      };
    }),
  );

  return [...staticEntries, ...postEntries];
}
