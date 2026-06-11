import type { PostData } from "@/lib/mdx";

export function getRelatedPosts(
  allPosts: PostData[],
  current: PostData,
  limit = 3,
): PostData[] {
  return allPosts
    .filter((post) => post.slug !== current.slug)
    .map((post) => {
      const sharedTags =
        post.frontmatter.tags?.filter((tag) =>
          current.frontmatter.tags?.includes(tag),
        ).length ?? 0;
      const sameCategory =
        post.frontmatter.category &&
        post.frontmatter.category === current.frontmatter.category
          ? 1
          : 0;
      return { post, score: sharedTags * 2 + sameCategory };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.post);
}
