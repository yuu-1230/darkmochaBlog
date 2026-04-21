import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://darkmocha.dev";

  // 存在する静的ページのみをリストアップ
  const staticRoutes = ["", "/about", "/projects", "/notes-timeline"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority:
        route === "" ? 1.0
        : route === "/notes-timeline" ? 0.75
        : 0.8, // /about と /projects
    }),
  );

  // MDX記事から動的ページ(ブログ記事)を生成
  const posts = getAllPosts();
  const dynamicRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // 全てのルートを結合して返す
  return [...staticRoutes, ...dynamicRoutes];
}