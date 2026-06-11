import type { PostData } from "@/lib/mdx";

export function getAllTags(posts: PostData[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => post.frontmatter.tags?.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}

export function getPostsByTag(posts: PostData[], tag: string): PostData[] {
  return posts.filter((post) => post.frontmatter.tags?.includes(tag));
}

export function tagHref(tag: string): string {
  return `/blog/tags/${encodeURIComponent(tag)}`;
}
