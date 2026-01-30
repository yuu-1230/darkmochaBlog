import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Frontmatter = {
  title: string;
  date: string;
  tags?: string[];
};
type PostData = {
  content: string;
  frontmatter: Frontmatter;
};
//ブログを表示するために、サーバーの中にあるファイルを読み込んで、プログラムで扱えるデータに変換する
export const getPost = (slug: string): PostData => {
  const postsDirectry = path.join(process.cwd(), "content/posts");
  const fullPath = path.join(postsDirectry, slug + ".mdx");
  const fileContents = fs.readFileSync(fullPath, "utf-8");
  const matterResult = matter(fileContents);
  return {
    content: matterResult.content,
    frontmatter: matterResult.data as Frontmatter,
  };
};
