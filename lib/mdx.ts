import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

export interface Frontmatter {
  title: string;
  date: string;
  update?: string;
  tags?: string[];
  description?: string;
  image?: string;
  readTime?: string;
  category?: string;
  draft?: boolean;
  pinned?: boolean;
}

export interface Progress {
  done: number;
  total: number;
}

export interface PostData {
  slug: string;
  content: string;
  frontmatter: Frontmatter & { readTime: string; progress: Progress | null };
}

const postsDirectory = path.join(process.cwd(), "content/posts");

/** 本文から読了時間を自動計算（日本語: 400文字/分、英語: 200語/分） */
function calcReadTime(content: string): string {
  const japanese = (content.match(/[　-鿿豈-﫿]/g) ?? []).length;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(japanese / 400 + words / 200);
  return `${minutes} min read`;
}

/** 本文中のMarkdownチェックリスト（- [ ] / - [x]）から進捗を自動算出 */
function calcProgress(content: string): Progress | null {
  const matches = [...content.matchAll(/^\s*[-*+]\s+\[([ xX])\]/gm)];
  if (matches.length === 0) return null;
  const done = matches.filter((m) => m[1].toLowerCase() === "x").length;
  return { done, total: matches.length };
}

export const getPost = cache(async (slug: string): Promise<PostData | null> => {
  const safeSlug = path.basename(slug);
  const fullPath = path.join(postsDirectory, safeSlug + ".mdx");

  let fileContents: string;
  try {
    fileContents = await fs.promises.readFile(fullPath, "utf-8");
  } catch {
    return null;
  }

  const matterResult = matter(fileContents);
  const frontmatter = matterResult.data as Frontmatter;

  return {
    slug,
    content: matterResult.content,
    frontmatter: {
      ...frontmatter,
      readTime: frontmatter.readTime ?? calcReadTime(matterResult.content),
      progress: calcProgress(matterResult.content),
    },
  };
});

export const getAllPosts = cache(async (): Promise<PostData[]> => {
  let files: string[];
  try {
    files = await fs.promises.readdir(postsDirectory);
  } catch {
    return [];
  }

  const isProd = process.env.NODE_ENV === "production";

  const posts = await Promise.all(
    files.map((fileName) => getPost(path.parse(fileName).name)),
  );

  const visiblePosts = posts.filter(
    (post): post is PostData =>
      post !== null && (isProd ? !post.frontmatter.draft : true),
  );

  return visiblePosts.sort((a, b) =>
    a.frontmatter.date < b.frontmatter.date ? 1 : -1,
  );
});
