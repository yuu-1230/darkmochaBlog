import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/mdx";
import { Coffee } from "lucide-react";

export default function Home() {
  const posts = getAllPosts();

  return (
    // 親の MainLayout ですでに <main> が使われているため、ここでは <div> でOKです
    <div className="relative h-full w-full bg-[#1f1f1f] text-[#cccccc] font-sans overflow-x-hidden p-4 md:p-12 select-none">
      {/* Background Watermark (装飾なのでAIに無視させる aria-hidden) */}
      <div
        aria-hidden="true"
        className="fixed bottom-[-50px] right-[-50px] opacity-[0.04] pointer-events-none rotate-[-15deg] z-0"
      >
        <Coffee size={300} className="md:w-[400px] md:h-[400px]" />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto z-10 relative">
        {/* Header (ページのヘッダーであることを明示) */}
        <header className="mb-8 px-2">
          <h1 className="text-3xl md:text-4xl font-light mb-2 tracking-tight text-[#cccccc]">
            Darkmocha Blog
          </h1>
          <p className="text-sm md:text-xl text-[#858585] font-light flex items-center gap-2">
            Code, Travel, and Creative Engineering.
          </p>
          <p className="text-xs md:text-base text-[#a0a0a0] max-w-2xl leading-relaxed font-light">
            長野を拠点に活動する大学生の技術ブログです。
            <br />
            主にWebフロントエンド（Next.js・React）や
            <br />
            Unityを使ったゲーム開発の知見、旅行した思い出を記録しています。
          </p>
        </header>

        {/* Latest Posts List (セクションの意味をaria-labelで明示) */}
        <section aria-label="Latest blog posts">
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.slug} className="block">
                {/* リンク全体を包む */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block outline-none"
                >
                  <article className="flex flex-col md:flex-row bg-[#252526]/40 hover:bg-[#252526]/80 backdrop-blur-sm border border-white/5 hover:border-white/10 rounded-2xl p-3 transition-all duration-300 hover:shadow-lg gap-4 items-stretch">
                    {/* --- 写真エリア (Compact) --- */}
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
                          {/* 記事のタイトルなので <h2> を維持 */}
                          <h2 className="text-[#3794ff] group-hover:text-[#4daafc] text-lg md:text-xl font-bold leading-tight transition-colors line-clamp-1">
                            {post.frontmatter.title}
                          </h2>

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
                      <footer className="flex items-center gap-2 text-[10px] md:text-xs text-[#858585] font-mono opacity-60 group-hover:opacity-100 mt-2 transition-opacity">
                        <span className="truncate">~/blog/{post.slug}.mdx</span>
                        {post.frontmatter.tags &&
                          post.frontmatter.tags.length > 0 && (
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
            ))}

            {posts.length === 0 && (
              <li className="text-[#858585] text-center italic py-8 bg-[#252526]/40 rounded-2xl border border-white/5">
                No posts found.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
