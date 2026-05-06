import Link from "next/link";
import Image from "next/image";
import { getAllPosts, PostData } from "@/lib/mdx";
import { ChevronRight } from "lucide-react";
import { HomeContent } from "@/components/home-content";

type Post = PostData;

export default async function Home() {
  const allPosts = await getAllPosts();

  const techPosts = allPosts.filter((p) => p.frontmatter.category === "Tech");
  const unityPosts = allPosts.filter((p) => p.frontmatter.category === "Unity");
  const lifePosts = allPosts.filter((p) => p.frontmatter.category === "Life");

  return (
    <div className="space-y-16 pb-20">
      {/* Animated Hero Section */}
      <HomeContent />

      {/* Recent Posts by Category */}
      <div className="space-y-16">
        <CategorySection title="Web / Tech" posts={techPosts} categorySlug="tech" />
        <CategorySection title="Game Dev (Unity)" posts={unityPosts} categorySlug="unity" />
        <CategorySection title="Life & Travel" posts={lifePosts} categorySlug="life" />

        {allPosts.length === 0 && (
          <div className="text-muted-foreground text-center italic py-8 bg-muted rounded-lg border border-border">
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
}

function CategorySection({
  title,
  posts,
  categorySlug,
}: {
  title: string;
  posts: Post[];
  categorySlug: string;
}) {
  if (posts.length === 0) return null;

  const displayPosts = posts.slice(0, 5);
  const hasMore = posts.length > 5;

  return (
    <section aria-label={title}>
      <h2 className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
        <span className="text-primary/60">//</span>
        {title}
        <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">
          ({posts.length})
        </span>
      </h2>

      <ul className="space-y-3">
        {displayPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>

      {hasMore && (
        <div className="mt-5 text-right">
          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors group"
          >
            Show more
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </section>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <li>
      <Link href={`/blog/${post.slug}`} className="group block outline-none">
        <article className="flex gap-4 items-start py-3 px-1 rounded-lg hover:bg-accent/50 transition-colors -mx-1">
          {/* Thumbnail */}
          {post.frontmatter.image && (
            <div className="w-16 h-12 shrink-0 relative rounded-md overflow-hidden bg-muted border border-border">
              <Image
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-4">
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
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 leading-relaxed">
                {post.frontmatter.description}
              </p>
            )}
          </div>
        </article>
      </Link>
    </li>
  );
}
