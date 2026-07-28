import { NextResponse, type NextRequest } from "next/server";
import { hasLocale } from "next-intl";
import { getAllPosts } from "@/lib/mdx";
import { getAllNotes } from "@/lib/notes";
import { projects } from "@/lib/projects";
import { parseSections, stripMdx, type Section } from "@/lib/search-utils";
import { routing } from "@/i18n/routing";

export type SearchItem = {
  type: "blog" | "note" | "project";
  title: string;
  description: string;
  href: string;
  tags: string[];
  category?: string;
  body?: string;
  /** ブログ記事のみ: 見出し単位で分割したセクション */
  sections?: Section[];
};

export async function GET(request: NextRequest) {
  // ?locale=en で英語インデックスを返す。未指定・不正値は日本語にフォールバック
  const requested = request.nextUrl.searchParams.get("locale");
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // notes と projects は日本語のみのコンテンツなので、両ロケールで同じものを返す（Phase 5）
  const [posts, notes] = await Promise.all([
    getAllPosts(locale),
    Promise.resolve(getAllNotes()),
  ]);

  const blogItems: SearchItem[] = posts.map((p) => {
    const sections = parseSections(p.content);
    return {
      type: "blog",
      title: p.frontmatter.title,
      description: p.frontmatter.description ?? "",
      href: `/blog/${p.slug}`,
      tags: p.frontmatter.tags ?? [],
      category: p.frontmatter.category,
      body: stripMdx(p.content),
      sections,
    };
  });

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
