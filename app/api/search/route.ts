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
};

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
  }));

  const noteItems: SearchItem[] = notes.map((n) => ({
    type: "note",
    title: n.content.split("\n")[0].slice(0, 60) || "Note",
    description: n.content.slice(0, 120),
    href: `/notes-timeline`,
    tags: n.tags,
  }));

  const projectItems: SearchItem[] = projects.map((p) => ({
    type: "project",
    title: p.title,
    description: p.description,
    href: `/projects`,
    tags: p.techStack,
  }));

  return NextResponse.json([...blogItems, ...noteItems, ...projectItems]);
}
