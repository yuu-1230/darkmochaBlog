import Link from "next/link";
import Image from "next/image";
import { getAllPosts, PostData } from "@/lib/mdx";
import { getAllNotes } from "@/lib/notes";
import { NoteTimeline } from "@/components/note-timeline";
import { ChevronRight } from "lucide-react";

type Post = PostData;

export default async function Home() {
  const allPosts = await getAllPosts();
  const notes = getAllNotes();

  const techPosts = allPosts.filter((p) => p.frontmatter.category === "Tech");
  const unityPosts = allPosts.filter((p) => p.frontmatter.category === "Unity");
  const lifePosts = allPosts.filter((p) => p.frontmatter.category === "Life");

  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <header className="border-b pb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-foreground">
          Darkmocha Blog
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed mb-6">
          長野を拠点に活動する大学生の技術ブログです。
          <br />
          主にWebフロントエンド（Next.js・React）やUnityを使ったゲーム開発の知見、旅行した思い出を記録しています。
        </p>

        <div className="flex flex-wrap gap-6 text-sm">
          <Link
            href="/about"
            className="text-primary hover:underline underline-offset-4 transition-colors"
          >
            About
          </Link>
          <Link
            href="/projects"
            className="text-primary hover:underline underline-offset-4 transition-colors"
          >
            Projects
          </Link>
        </div>
      </header>

      {/* Notes Timeline */}
      <NoteTimeline notes={notes} mode="preview" />

      {/* Category sections */}
      <div className="space-y-16">
        <CategorySection title="Web / Tech Notes" posts={techPosts} categorySlug="tech" />
        <CategorySection title="Game Dev (Unity)" posts={unityPosts} categorySlug="unity" />
        <CategorySection title="Life & Travel" posts={lifePosts} categorySlug="life" />

        {allPosts.length === 0 && (
          <div className="text-muted-foreground text-center italic py-8 bg-muted rounded-lg border">
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
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 border-b pb-2 flex items-center gap-2">
        {title}
        <span className="text-muted-foreground text-sm font-normal">
          ({posts.length})
        </span>
      </h2>

      <ul className="space-y-4">
        {displayPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>

      {hasMore && (
        <div className="mt-6 text-right">
          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            Show more
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </section>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <li className="block">
      <Link href={`/blog/${post.slug}`} className="group block outline-none">
        <article className="flex flex-col md:flex-row bg-card hover:bg-accent border border-border hover:border-primary/30 rounded-xl p-3 transition-all duration-300 hover:shadow-md gap-4 items-stretch">
          {/* Thumbnail */}
          <div className="w-full md:w-48 aspect-video shrink-0 relative rounded-lg overflow-hidden bg-muted border border-border self-center md:self-auto">
            {post.frontmatter.image ? (
              <Image
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                aria-hidden="true"
                className="w-full h-full flex items-center justify-center text-muted-foreground text-3xl font-bold select-none"
              >
                📝
              </div>
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <div className="flex flex-col-reverse md:flex-row md:items-baseline justify-between w-full mb-1.5 gap-1">
                <h3 className="text-primary group-hover:text-primary/80 text-base md:text-lg font-semibold leading-tight transition-colors line-clamp-2">
                  {post.frontmatter.title}
                </h3>
                <time
                  dateTime={post.frontmatter.date}
                  className="text-[10px] text-muted-foreground shrink-0 font-mono bg-muted px-1.5 py-0.5 rounded self-start md:self-auto border border-border"
                >
                  {post.frontmatter.date}
                </time>
              </div>

              {post.frontmatter.description && (
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.frontmatter.description}
                </p>
              )}
            </div>

            {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
              <footer className="flex items-center gap-2 mt-2 flex-wrap">
                {post.frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] md:text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </footer>
            )}
          </div>
        </article>
      </Link>
    </li>
  );
}
