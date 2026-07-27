import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { SITE_URL } from "@/lib/constants";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // ロケール対応は Phase 4。現状は日本語版のみを従来どおり出力する
  const posts = await getAllPosts(routing.defaultLocale);

  const lastModifiedOf = (post: (typeof posts)[number]) =>
    new Date(post.frontmatter.update ?? post.frontmatter.date).toISOString();

  const siteLastModified = posts
    .map(lastModifiedOf)
    .sort()
    .at(-1) ?? new Date().toISOString();

  const staticRoutes = [
    { route: "",               priority: 1.0 },
    { route: "/blog",          priority: 0.9 },
    { route: "/about",         priority: 0.8 },
    { route: "/projects",      priority: 0.8 },
    { route: "/travel",        priority: 0.8 },
    { route: "/notes-timeline",priority: 0.75 },
  ].map(({ route, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: siteLastModified,
    changeFrequency: "weekly" as const,
    priority,
  }));

  // MDX記事から動的ページ(ブログ記事)を生成
  const dynamicRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: lastModifiedOf(post),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 全てのルートを結合して返す
  return [...staticRoutes, ...dynamicRoutes];
}
