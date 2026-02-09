import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Frontmatter = {
  title: string;
  date: string;
  tags?: string[];
  description?: string;
  image?: string;
};
export type PostData = {
  slug: string;
  content: string;
  frontmatter: Frontmatter;
};
const postsDirectory = path.join(process.cwd(), "content/posts");
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
  const posts = files.map((fileName) => {
    const slug = path.parse(fileName).name;
    return getPost(slug);
  });
  return posts.sort((a, b) => {
    if (a.frontmatter.date < b.frontmatter.date) {
      return 1;
    } else {
      return -1;
    }
  });
};
