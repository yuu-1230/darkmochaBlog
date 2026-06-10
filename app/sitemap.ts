import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  const staticRoutes = [
    { route: "",               priority: 1.0 },
    { route: "/blog",          priority: 0.9 },
    { route: "/about",         priority: 0.8 },
    { route: "/projects",      priority: 0.8 },
    { route: "/travel",        priority: 0.8 },
    { route: "/notes-timeline",priority: 0.75 },
  ].map(({ route, priority }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority,
  }));

  // MDX記事から動的ページ(ブログ記事)を生成
  const posts = await getAllPosts();
  const dynamicRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 全てのルートを結合して返す
  return [...staticRoutes, ...dynamicRoutes];
}