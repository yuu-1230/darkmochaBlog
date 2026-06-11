import { getAllPosts } from "@/lib/mdx";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Travel",
  description: "旅行記録・日常の記録",
  alternates: { canonical: `${SITE_URL}/travel` },
  openGraph: {
    title: "Travel | Darkmocha",
    description: "旅行記録・日常の記録",
    url: `${SITE_URL}/travel`,
  },
};

export default async function TravelPage() {
  const allPosts = await getAllPosts();
  const travelPosts = allPosts.filter((p) => p.frontmatter.category === "Life");

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-16">
      {/* Page header */}
      <header className="space-y-2 border-b border-border pb-8">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {"// travel"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Travel</h1>
        <p className="text-sm text-muted-foreground">
          旅行記録と日常の記録。{travelPosts.length > 0 ? `${travelPosts.length}件` : ""}
        </p>
      </header>

      {travelPosts.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <p className="text-4xl">✈️</p>
          <p className="text-muted-foreground text-sm">旅行記事は準備中です。</p>
          <Link
            href="/blog"
            className="text-xs font-mono text-primary hover:underline underline-offset-4"
          >
            ← すべての記事を見る
          </Link>
        </div>
      ) : (
        <ul className="space-y-0 divide-y divide-border">
          {travelPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-4 py-4 hover:bg-accent/40 -mx-2 px-2 rounded-lg transition-colors"
              >
                {/* Thumbnail */}
                {post.frontmatter.image ? (
                  <div className="w-20 h-14 shrink-0 relative rounded-md overflow-hidden border border-border bg-muted">
                    <Image
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-14 shrink-0 rounded-md border border-border bg-muted flex items-center justify-center text-2xl">
                    🗺️
                  </div>
                )}

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {post.frontmatter.title}
                    </h2>
                    <time
                      dateTime={post.frontmatter.date}
                      className="text-[11px] text-muted-foreground font-mono shrink-0"
                    >
                      {post.frontmatter.date}
                    </time>
                  </div>
                  {post.frontmatter.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                      {post.frontmatter.description}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
