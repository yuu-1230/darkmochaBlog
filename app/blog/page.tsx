import { getAllPosts } from "@/lib/mdx";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Blog",
  description: "技術記事・Web開発・Unity・旅行記録",
  alternates: { canonical: "https://www.darkmocha.dev/blog" },
  openGraph: {
    title: "Blog | Darkmocha",
    description: "技術記事・Web開発・Unity・旅行記録",
    url: "https://www.darkmocha.dev/blog",
  },
};

export default async function BlogPage() {
  const allPosts = await getAllPosts();

  const techPosts = allPosts.filter((p) => p.frontmatter.category === "Tech");
  const unityPosts = allPosts.filter((p) => p.frontmatter.category === "Unity");
  const lifePosts = allPosts.filter((p) => p.frontmatter.category === "Life");
  const uncategorized = allPosts.filter(
    (p) => !p.frontmatter.category || !["Tech", "Unity", "Life"].includes(p.frontmatter.category)
  );

  const sections = [
    { title: "Web / Tech", posts: techPosts },
    { title: "Game Dev (Unity)", posts: unityPosts },
    { title: "Life & Travel", posts: lifePosts },
    ...(uncategorized.length > 0 ? [{ title: "Other", posts: uncategorized }] : []),
  ].filter((s) => s.posts.length > 0);

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
            <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">
              ({section.posts.length})
            </span>
          </h2>

          <ul className="space-y-0 divide-y divide-border">
            {section.posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group flex items-start gap-4 py-4 hover:bg-accent/40 -mx-2 px-2 rounded-lg transition-colors">
                  {/* Thumbnail */}
                  {post.frontmatter.image ? (
                    <div className="w-16 h-12 shrink-0 relative rounded-md overflow-hidden border border-border bg-muted">
                      <Image
                        src={post.frontmatter.image}
                        alt={post.frontmatter.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-12 shrink-0 rounded-md border border-border bg-muted flex items-center justify-center text-muted-foreground text-xl">
                      📝
                    </div>
                  )}

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {post.frontmatter.title}
                      </h3>
                      <time
                        dateTime={post.frontmatter.date}
                        className="text-[11px] text-muted-foreground font-mono shrink-0"
                      >
                        {post.frontmatter.date}
                      </time>
                    </div>
                    {post.frontmatter.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {post.frontmatter.description}
                      </p>
                    )}
                    {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {post.frontmatter.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                            style={{ background: "var(--tag-bg)", color: "var(--tag-fg)" }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
