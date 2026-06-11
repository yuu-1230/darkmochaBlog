import { getAllPosts } from "@/lib/mdx";
import { getAllTags, getPostsByTag } from "@/lib/tags";
import { PostCard } from "@/components/PostCard";
import { SITE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag as TagIcon } from "lucide-react";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return getAllTags(posts).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const canonical = `${SITE_URL}/blog/tags/${encodeURIComponent(decoded)}`;

  return {
    title: `#${decoded} の記事一覧`,
    description: `タグ「${decoded}」が付いた記事の一覧`,
    alternates: { canonical },
    openGraph: {
      title: `#${decoded} の記事一覧 | Darkmocha`,
      description: `タグ「${decoded}」が付いた記事の一覧`,
      url: canonical,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const allPosts = await getAllPosts();
  const posts = getPostsByTag(allPosts, decoded);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-10">
      <header className="space-y-2 border-b border-border pb-8">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {"// tag"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <TagIcon className="w-6 h-6 text-primary" />
          {decoded}
        </h1>
        <p className="text-sm text-muted-foreground">{posts.length}件の記事</p>
      </header>

      <ul className="space-y-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>

      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Blog
      </Link>
    </div>
  );
}
