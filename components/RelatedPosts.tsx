import { getTranslations } from "next-intl/server";
import type { PostData } from "@/lib/mdx";
import { PostCard } from "@/components/PostCard";

export async function RelatedPosts({ posts }: { posts: PostData[] }) {
  if (posts.length === 0) return null;
  const t = await getTranslations("relatedPosts");

  return (
    <section aria-label={t("label")} className="mt-12">
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
