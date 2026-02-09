import React from "react";
import { getAllPosts, PostData } from "@/lib/mdx";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Typewriter } from "@/components/typewriter"; // インポート追加

const Home = () => {
  const posts: PostData[] = getAllPosts();

  return (
    // container max-w-4xl を削除し、w-full p-8 に変更
    <main className="w-full p-6 md:p-10">
      {/* Typewriter (前のリクエストにあったもの) */}
      <div className="mb-8">
        <Typewriter />
      </div>

      <h1 className="text-2xl font-bold mb-6 tracking-tight text-foreground">
        Latest Posts
      </h1>

      {/* エディタっぽく、カードの幅も制限せず可変にするか、あるいは一定幅で止めるか */}
      <div className="flex flex-col gap-3 max-w-3xl">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <Card className="flex flex-row overflow-hidden hover:bg-[#2A2D2E] hover:border-[#007ACC] border-border transition-all duration-100 cursor-pointer h-28 items-center rounded-none border bg-card">
              {/* 画像エリア */}
              {post.frontmatter.image ?
                <div className="relative w-32 h-full shrink-0 overflow-hidden">
                  <Image
                    src={post.frontmatter.image}
                    alt={post.frontmatter.title}
                    fill
                    className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              : <div className="w-32 h-full bg-[#252526] flex items-center justify-center shrink-0 border-r border-border">
                  <span className="text-muted-foreground/40 text-xs font-mono">
                    No Image
                  </span>
                </div>
              }

              {/* テキストエリア */}
              <div className="flex flex-col justify-center px-4 py-2 w-full">
                <div className="flex items-center gap-2 mb-1">
                  {post.frontmatter.tags && (
                    <span className="text-[10px] text-[#569CD6] font-mono">
                      #{post.frontmatter.tags[0]}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold leading-tight mb-1 text-[#D4D4D4] group-hover:text-white">
                  {post.frontmatter.title}
                </h3>

                <div className="flex justify-between items-center mt-auto">
                  <p className="text-xs text-[#6A9955] font-mono">
                    {/* 日付の前にアイコンっぽく */}
                    <span className="opacity-50">updated: </span>
                    {post.frontmatter.date}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Home;
