"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { PostData } from "@/lib/mdx";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

function InlineLink({ word, href }: { word: string; href: string }) {
  return (
    <Link
      href={href}
      className="underline underline-offset-4 decoration-primary/40 hover:decoration-primary hover:text-primary transition-colors"
    >
      {word}
    </Link>
  );
}

function categoryLabel(category?: string): string {
  const map: Record<string, string> = {
    Tech: "Tech",
    Unity: "Game Dev",
    Life: "Life & Travel",
  };
  return category ? (map[category] ?? category) : "Article";
}

type Props = { recentPosts: PostData[] };

export function HomeClient({ recentPosts }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto px-4 py-24"
    >
      <div className="space-y-8">
        <motion.h1
          variants={item}
          className="font-serif italic text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight"
        >
          Hi, I&apos;m Yuto Nagata
        </motion.h1>

        <motion.p variants={item} className="text-lg text-muted-foreground font-light -mt-4">
          Welcome to my digital sandbox.
        </motion.p>

        <motion.p
          variants={item}
          className="text-[15px] md:text-base text-foreground/85 leading-[1.9]"
        >
          長野県でプログラミングを勉強している大学生です。この場所は、私の技術的なアウトプット（
          <InlineLink word="blog" href="/blog" />
          ）、日々の記録（
          <InlineLink word="notes" href="/notes-timeline" />
          ）、趣味の旅行記（
          <InlineLink word="travel" href="/travel" />
          ）、そしてこれまで開発してきたポートフォリオ（
          <InlineLink word="project" href="/projects" />
          ）をまとめた遊び場です。
        </motion.p>

        <motion.p
          variants={item}
          className="text-[15px] md:text-base text-foreground/85 leading-[1.9]"
        >
          普段はNext.js/Reactを用いたWebフロントエンド開発や、Unityでのゲーム開発、LLMを組み込んだアプリケーション制作を行っています。
        </motion.p>

        <motion.nav
          variants={item}
          className="flex flex-wrap gap-x-5 gap-y-2 pt-2"
          aria-label="Quick navigation"
        >
          {[
            { word: "blog", href: "/blog" },
            { word: "notes", href: "/notes-timeline" },
            { word: "travel", href: "/travel" },
            { word: "project", href: "/projects" },
            { word: "about", href: "/about" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span className="text-primary/60 group-hover:text-primary transition-colors">[</span>
              {link.word}
              <span className="text-primary/60 group-hover:text-primary transition-colors">]</span>
            </Link>
          ))}
        </motion.nav>
      </div>

      {recentPosts.length > 0 && (
        <motion.div
          variants={item}
          className="mt-20 flex items-center justify-center gap-3"
          aria-hidden
        >
          <div className="h-px flex-1 bg-border/50" />
          <span className="text-xs text-muted-foreground/40 tracking-[0.3em] select-none">· · ·</span>
          <div className="h-px flex-1 bg-border/50" />
        </motion.div>
      )}

      {recentPosts.length > 0 && (
        <div className="mt-12">
          <motion.p
            variants={item}
            className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-8"
          >
            Recent Writing
          </motion.p>

          <ul className="flex flex-col gap-6">
            {recentPosts.map((post) => (
              <motion.li key={post.slug} variants={item}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4"
                >
                  <span className="w-28 shrink-0 text-sm text-muted-foreground font-mono">
                    {post.frontmatter.date}
                  </span>
                  <span className="flex-1 text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                    {post.frontmatter.title}
                  </span>
                  <span className="hidden sm:block ml-auto text-xs text-muted-foreground shrink-0 pl-4">
                    {categoryLabel(post.frontmatter.category)}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.div variants={item} className="mt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4 transition-all group"
            >
              View all posts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
