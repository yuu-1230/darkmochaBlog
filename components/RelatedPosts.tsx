import type { PostData } from "@/lib/mdx";
import { PostCard } from "@/components/PostCard";

export function RelatedPosts({ posts }: { posts: PostData[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-label="関連記事" className="mt-12">
      <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
        <span className="text-primary/60">{"//"}</span>
        Related Posts
      </h2>
      <ul className="space-y-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>
    </section>
  );
}
