import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";
import type { Locale } from "@/i18n/routing";

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

/** ロケールごとの記事ディレクトリ（content/posts/ja, content/posts/en） */
function localeDirectory(locale: Locale): string {
  return path.join(postsDirectory, locale);
}

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

export const getPost = cache(
  async (slug: string, locale: Locale): Promise<PostData | null> => {
    const safeSlug = path.basename(slug);
    const fullPath = path.join(localeDirectory(locale), safeSlug + ".mdx");

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
  },
);

export const getAllPosts = cache(
  async (locale: Locale): Promise<PostData[]> => {
    let files: string[];
    try {
      files = await fs.promises.readdir(localeDirectory(locale));
    } catch {
      return [];
    }

    const isProd = process.env.NODE_ENV === "production";

    const posts = await Promise.all(
      files
        .filter((fileName) => fileName.endsWith(".mdx"))
        .map((fileName) => getPost(path.parse(fileName).name, locale)),
    );

    const visiblePosts = posts.filter(
      (post): post is PostData =>
        post !== null && (isProd ? !post.frontmatter.draft : true),
    );

    return visiblePosts.sort((a, b) =>
      a.frontmatter.date < b.frontmatter.date ? 1 : -1,
    );
  },
);

/**
 * 指定ロケールに記事が存在するか。
 * 言語スイッチャーの出し分け（未訳なら一覧へフォールバック）に使う。
 * draft の扱いを getAllPosts と揃えるため、ファイルの有無ではなく一覧から判定する。
 */
export const hasTranslation = cache(
  async (slug: string, locale: Locale): Promise<boolean> => {
    const posts = await getAllPosts(locale);
    return posts.some((post) => post.slug === slug);
  },
);
