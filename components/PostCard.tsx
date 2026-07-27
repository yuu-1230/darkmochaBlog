import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { PostData } from "@/lib/mdx";
import { getTagStyle } from "@/lib/utils";

export function PostCard({ post }: { post: PostData }) {
  return (
    <li className="bg-card border border-border rounded-lg overflow-hidden">
      <Link href={`/blog/${post.slug}`} className="group flex items-start gap-4 py-4 px-4 hover:bg-accent/40 transition-colors">
        {/* Thumbnail */}
        {post.frontmatter.image ? (
          <div className="w-16 h-12 shrink-0 relative rounded-md overflow-hidden border border-border bg-muted">
            <Image
              src={post.frontmatter.image}
              alt={post.frontmatter.title}
              fill
              sizes="64px"
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
                  style={getTagStyle(post.frontmatter.category)}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}
