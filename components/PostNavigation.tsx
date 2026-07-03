import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { PostData } from "@/lib/mdx";

export function PostNavigation({
  prevPost,
  nextPost,
}: {
  prevPost: PostData | null;
  nextPost: PostData | null;
}) {
  return (
    <nav
      aria-label="Post navigation"
      className="mt-20 pt-10 border-t flex flex-col md:flex-row justify-between gap-4"
    >
      {prevPost ? (
        <Link
          href={`/blog/${prevPost.slug}`}
          className="group flex-1 flex flex-col p-4 border border-border hover:border-primary/40 rounded-xl bg-card hover:bg-accent transition-all"
        >
          <span className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Previous Post
          </span>
          <span className="text-sm text-primary font-medium line-clamp-2 transition-colors">
            {prevPost.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {nextPost ? (
        <Link
          href={`/blog/${nextPost.slug}`}
          className="group flex-1 flex flex-col items-end text-right p-4 border border-border hover:border-primary/40 rounded-xl bg-card hover:bg-accent transition-all"
        >
          <span className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            Next Post
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="text-sm text-primary font-medium line-clamp-2 transition-colors">
            {nextPost.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
