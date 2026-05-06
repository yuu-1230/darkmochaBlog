import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/mdx";
import { getAllNotes } from "@/lib/notes";
import { projects } from "@/lib/projects";

export type SearchItem = {
  type: "blog" | "note" | "project";
  title: string;
  description: string;
  href: string;
  tags: string[];
  category?: string;
  /** MDX/Markdown を除去したプレーンテキスト本文 */
  body?: string;
};

/** MDX・Markdown 記法を除去してプレーンテキスト化 */
function stripMdx(raw: string): string {
  return raw
    // JSX コンポーネント（<Tip ...>…</Tip> / <C c="…">…</C> など）
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, (m) =>
      m.replace(/<[^>]+>/g, ""),
    )
    // 自己閉じタグ（<Image … /> など）
    .replace(/<[A-Z][^/]*(\/?)>/g, "")
    // コードブロック（```…```）
    .replace(/```[\s\S]*?```/g, "")
    // インラインコード（`code`）
    .replace(/`[^`]+`/g, "")
    // 見出し（## text）
    .replace(/^#{1,6}\s+/gm, "")
    // 太字・斜体（**text** / *text*）
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
    // リンク（[text](url) → text）
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // 残りの HTML タグ
    .replace(/<[^>]+>/g, "")
    // テーブルの区切り行（| --- |）
    .replace(/^\|[-|\s]+\|$/gm, "")
    // 行頭の Markdown 記号（>, -, *, |）
    .replace(/^[\s>|*\-]+/gm, "")
    // 連続空白・改行を整理
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}


export async function GET() {
  const [posts, notes] = await Promise.all([
    getAllPosts(),
    Promise.resolve(getAllNotes()),
  ]);

  const blogItems: SearchItem[] = posts.map((p) => ({
    type: "blog",
    title: p.frontmatter.title,
    description: p.frontmatter.description ?? "",
    href: `/blog/${p.slug}`,
    tags: p.frontmatter.tags ?? [],
    category: p.frontmatter.category,
    body: stripMdx(p.content),
  }));

  const noteItems: SearchItem[] = notes.map((n) => ({
    type: "note",
    title: n.content.split("\n")[0].replace(/#[\wぁ-鿿゠-ヿ]+/g, "").trim().slice(0, 60) || "Note",
    description: n.content.slice(0, 120),
    href: `/notes-timeline`,
    tags: n.tags,
    body: n.content,
  }));

  const projectItems: SearchItem[] = projects.map((p) => ({
    type: "project",
    title: p.title,
    description: p.description,
    href: `/projects`,
    tags: p.techStack,
    body: `${p.description} ${p.learned}`,
  }));

  return NextResponse.json([...blogItems, ...noteItems, ...projectItems]);
}
