import fs from "fs";
import path from "path";
import matter from "gray-matter";

const docsDirectory = path.join(process.cwd(), "docs");
const supportedExtensions = new Set([".md", ".mdx"]);
const safeSlugPattern = /^[a-z0-9][a-z0-9-]*$/i;

export type LocalDoc = {
  slug: string;
  title: string;
  content: string;
};

/** ブログ記事のdraftと同じく、productionではローカル資料を無効にする。 */
export function isLocalDocsEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}

function extractTitle(content: string, fallback: string): string {
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading || fallback;
}

async function findDocPath(slug: string): Promise<string | null> {
  if (!safeSlugPattern.test(slug)) return null;

  for (const extension of supportedExtensions) {
    const filePath = path.join(docsDirectory, `${slug}${extension}`);
    try {
      const stat = await fs.promises.stat(filePath);
      if (stat.isFile()) return filePath;
    } catch {
      // 次の対応拡張子を試す。
    }
  }

  return null;
}

export async function getLocalDoc(slug: string): Promise<LocalDoc | null> {
  if (!isLocalDocsEnabled()) return null;

  const filePath = await findDocPath(slug);
  if (!filePath) return null;

  const source = await fs.promises.readFile(filePath, "utf8");
  const parsed = matter(source);

  return {
    slug,
    title:
      typeof parsed.data.title === "string"
        ? parsed.data.title
        : extractTitle(parsed.content, slug),
    content: parsed.content,
  };
}

export async function getAllLocalDocs(): Promise<LocalDoc[]> {
  if (!isLocalDocsEnabled()) return [];

  let fileNames: string[];
  try {
    fileNames = await fs.promises.readdir(docsDirectory);
  } catch {
    return [];
  }

  const docs = await Promise.all(
    fileNames
      .filter((fileName) => supportedExtensions.has(path.extname(fileName)))
      .map((fileName) => getLocalDoc(path.parse(fileName).name)),
  );

  return docs
    .filter((doc): doc is LocalDoc => doc !== null)
    .sort((a, b) => a.title.localeCompare(b.title, "ja"));
}
