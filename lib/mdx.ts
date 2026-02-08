import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Frontmatter = {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
};
export type PostData = {
  slug: string;
  content: string;
  frontmatter: Frontmatter;
};
const postsDirectory = path.join(process.cwd(), "content/posts");
//ブログを表示するために、サーバーの中にあるファイルを読み込んで、プログラムで扱えるデータに変換する
export const getPost = (slug: string): PostData => {
  const fullPath = path.join(postsDirectory, slug + ".mdx");
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
  //拡張子削除
  const posts = files.map((fileName) => {
    const slug = path.parse(fileName).name;
    return getPost(slug);
  });

  // 日付が新しい順に並び替え (降順)
  return posts.sort((a, b) => {
    if (a.frontmatter.date < b.frontmatter.date) {
      return 1;
    } else {
      return -1;
    }
  });
};
