import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Frontmatter = {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  image?: string;
  readTime?: string;
  category?: string;
  draft?: boolean;
};

export type PostData = {
  slug: string;
  content: string;
  frontmatter: Frontmatter;
};

const postsDirectory = path.join(process.cwd(), "content/posts");

export const getPost = (slug: string): PostData => {
  const safeSlug = path.basename(slug);
  const fullPath = path.join(postsDirectory, safeSlug + ".mdx");
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const matterResult = matter(fileContents);

  return {
    slug,
    content: matterResult.content,
    frontmatter: matterResult.data as Frontmatter,
  };
};

export const getAllPosts = (): PostData[] => {
  const files = fs.readdirSync(postsDirectory);

  // 本番環境かどうかの判定を追加
  const isProd = process.env.NODE_ENV === "production";

  const posts = files.map((fileName) => {
    const slug = path.parse(fileName).name;
    return getPost(slug);
  });

  // draft: true の記事を除外するフィルタリング処理を追加
  const visiblePosts = posts.filter((post) => {
    if (isProd) {
      // 本番環境では、draftがtrueのものは除外（表示しない）
      return !post.frontmatter.draft;
    }
    // ローカル開発環境では、下書きも含めてすべて表示
    return true;
  });

  return visiblePosts.sort((a, b) => {
    if (a.frontmatter.date < b.frontmatter.date) {
      return 1;
    } else {
      return -1;
    }
  });
};
