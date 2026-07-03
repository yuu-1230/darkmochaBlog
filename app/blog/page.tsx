import { getAllPosts } from "@/lib/mdx";
import type { Metadata } from "next";
import { buildBlogSections } from "@/lib/blog-sections";
import { PostCard } from "@/components/PostCard";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description: "技術記事・Web開発・Unity・旅行記録",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Blog | Darkmocha",
    description: "技術記事・Web開発・Unity・旅行記録",
    url: `${SITE_URL}/blog`,
  },
};

export default async function BlogPage() {
  const allPosts = await getAllPosts();
  const sections = buildBlogSections(allPosts);

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-16">
      {/* Page header */}
      <header className="space-y-2 border-b border-border pb-8">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {"// blog"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog</h1>
        <p className="text-sm text-muted-foreground">
          {allPosts.length}件の記事
        </p>
      </header>

      {allPosts.length === 0 && (
        <p className="text-muted-foreground text-sm italic py-8 text-center">
          No posts yet.
        </p>
      )}

      {/* Sections */}
      {sections.map((section) => (
        <section key={section.title} aria-label={section.title}>
          <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="text-primary/60">{"//"}</span>
            {section.title}
            <span className="text-muted-foreground font-normal normal-case tracking-normal">
              ({section.posts.length})
            </span>
          </h2>

          <ul className="space-y-3">
            {section.posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
