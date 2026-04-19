import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/mdx";
import { getAllNotes } from "@/lib/notes";
import { NoteTimeline } from "@/components/note-timeline";
import { Coffee, ChevronRight } from "lucide-react";

// --- 型定義 ---
type Post = ReturnType<typeof getAllPosts>[0];

export default function Home() {
  const allPosts = getAllPosts();
  const notes = getAllNotes();

  // 記事をカテゴリごとにフィルタリング
  const techPosts = allPosts.filter((p) => p.frontmatter.category === "Tech");
  const unityPosts = allPosts.filter((p) => p.frontmatter.category === "Unity");
  const lifePosts = allPosts.filter((p) => p.frontmatter.category === "Life");

  return (
    <div className="relative h-full w-full bg-[#1f1f1f] text-[#cccccc] font-sans overflow-y-auto p-4 md:p-12 select-none scrollbar-thin scrollbar-thumb-[#424242] scrollbar-track-transparent">
      {/* Background Watermark */}
      <div
        aria-hidden="true"
        className="fixed bottom-[-50px] right-[-50px] opacity-[0.04] pointer-events-none rotate-[-15deg] z-0"
      >
        <Coffee size={300} className="md:w-[400px] md:h-[400px]" />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto z-10 relative pb-20">
        {/* --- 1. ヒーローセクション --- */}
        <header className="mb-12 px-2 border-b border-[#333] pb-8">
          <h1 className="text-3xl md:text-4xl font-light mb-4 tracking-tight text-[#cccccc]">
            Darkmocha Blog
          </h1>
          <p className="text-sm md:text-base text-[#a0a0a0] max-w-2xl leading-relaxed font-light mb-6">
            長野を拠点に活動する大学生の技術ブログです。
            <br />
            主にWebフロントエンド（Next.js・React）やUnityを使ったゲーム開発の知見、旅行した思い出を記録しています。
          </p>

          {/* About / Projects への重要な導線 */}
          <div className="flex flex-wrap gap-6 text-sm md:text-base font-mono">
            <Link
              href="/about"
              className="text-[#3794ff] hover:text-[#4daafc] hover:underline underline-offset-4 transition-colors flex items-center gap-1.5"
            >
              <span className="text-[#858585]">~/</span>about.md
            </Link>
            <Link
              href="/projects"
              className="text-[#3794ff] hover:text-[#4daafc] hover:underline underline-offset-4 transition-colors flex items-center gap-1.5"
            >
              <span className="text-[#858585]">~/</span>projects.json
            </Link>
          </div>
        </header>

        <NoteTimeline notes={notes} mode="preview" />

        {/* --- 2. カテゴリ別 記事リスト --- */}
        <div className="space-y-16">
          <CategorySection
            title="Web / Tech Notes"
            posts={techPosts}
            categorySlug="tech"
          />
          <CategorySection
            title="Game Dev (Unity)"
            posts={unityPosts}
            categorySlug="unity"
          />
          <CategorySection
            title="Life & Travel"
            posts={lifePosts}
            categorySlug="life"
          />

          {/* 記事が1件もない場合のフォールバック */}
          {allPosts.length === 0 && (
            <div className="text-[#858585] text-center italic py-8 bg-[#252526]/40 rounded-2xl border border-white/5">
              No posts found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- ヘルパーコンポーネント: カテゴリごとのリスト ---
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

  // 最新の5件だけを取得
  const displayPosts = posts.slice(0, 5);
  const hasMore = posts.length > 5;

  return (
    <section aria-label={title}>
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-6 border-b border-[#333] pb-2 flex items-center gap-2">
        {title}
        <span className="text-[#858585] text-sm font-normal">
          ({posts.length})
        </span>
      </h2>

      <ul className="space-y-4">
        {displayPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>

      {/* もっと見るボタン (6件以上ある場合のみ表示) */}
      {hasMore && (
        <div className="mt-6 text-right px-2">
          <Link
            href={`/category/${categorySlug}`}
            className="inline-flex items-center gap-1 text-sm font-mono text-[#858585] hover:text-[#cccccc] transition-colors group"
          >
            Show more{" "}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </section>
  );
}

// --- ヘルパーコンポーネント: 記事のカードデザイン (既存のUIをそのまま利用) ---
function PostCard({ post }: { post: Post }) {
  return (
    <li className="block">
      <Link href={`/blog/${post.slug}`} className="group block outline-none">
        <article className="flex flex-col md:flex-row bg-[#252526]/40 hover:bg-[#252526]/80 backdrop-blur-sm border border-white/5 hover:border-white/10 rounded-2xl p-3 transition-all duration-300 hover:shadow-lg gap-4 items-stretch">
          {/* --- 写真エリア --- */}
          <div className="w-full md:w-52 aspect-video shrink-0 relative rounded-xl overflow-hidden bg-[#1e1e1e]/50 border border-white/5 self-center md:self-auto">
            {post.frontmatter.image ?
              <Image
                src={post.frontmatter.image}
                alt={post.frontmatter.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            : <div
                aria-hidden="true"
                className="w-full h-full flex items-center justify-center text-[#333]"
              >
                <Coffee className="w-8 h-8 opacity-50" />
              </div>
            }
          </div>

          {/* --- テキスト情報エリア --- */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              {/* Title & Date */}
              <div className="flex flex-col-reverse md:flex-row md:items-baseline justify-between w-full mb-1.5 gap-1">
                <h3 className="text-[#3794ff] group-hover:text-[#4daafc] text-lg md:text-xl font-bold leading-tight transition-colors line-clamp-1">
                  {post.frontmatter.title}
                </h3>
                <time
                  dateTime={post.frontmatter.date}
                  className="text-[10px] text-[#858585] shrink-0 font-mono bg-white/5 px-1.5 py-0.5 rounded self-start md:self-auto border border-white/5"
                >
                  {post.frontmatter.date}
                </time>
              </div>

              {/* Description */}
              {post.frontmatter.description && (
                <p className="text-xs md:text-sm text-[#a0a0a0] line-clamp-2 leading-relaxed font-light opacity-90">
                  {post.frontmatter.description}
                </p>
              )}
            </div>

            {/* Footer: Path & Tags */}
            <footer className="flex items-center gap-2 text-[10px] md:text-xs text-[#858585] font-mono opacity-60 group-hover:opacity-100 mt-2 transition-opacity">
              <span className="truncate">~/blog/{post.slug}.mdx</span>
              {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                <>
                  <span
                    aria-hidden="true"
                    className="w-1 h-1 rounded-full bg-[#565656]"
                  />
                  <span
                    className="text-[#ce9178] truncate"
                    aria-label={`Tags: ${post.frontmatter.tags.join(", ")}`}
                  >
                    {post.frontmatter.tags.join(", ")}
                  </span>
                </>
              )}
            </footer>
          </div>
        </article>
      </Link>
    </li>
  );
}
