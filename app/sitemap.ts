import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.darkmocha.dev";

  const staticRoutes = ["", "/about", "/projects"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const posts = getAllPosts();
  const dynamicRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date).toISOString(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
