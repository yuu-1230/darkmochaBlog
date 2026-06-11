import type { PostData } from "@/lib/mdx";
import { CATEGORIES, type Category } from "@/lib/constants";

export interface BlogSection {
  title: string;
  posts: PostData[];
}

const SECTION_TITLES: Record<Category, string> = {
  Tech: "Web / Tech",
  Unity: "Game Dev (Unity)",
  Life: "Life & Travel",
};

export function buildBlogSections(allPosts: PostData[]): BlogSection[] {
  const byCategory = CATEGORIES.map((category) => ({
    title: SECTION_TITLES[category],
    posts: allPosts.filter((p) => p.frontmatter.category === category),
  }));

  const uncategorized = allPosts.filter(
    (p) =>
      !p.frontmatter.category ||
      !CATEGORIES.includes(p.frontmatter.category as Category),
  );

  return [
    ...byCategory,
    ...(uncategorized.length > 0
      ? [{ title: "Other", posts: uncategorized }]
      : []),
  ].filter((s) => s.posts.length > 0);
}
