"use client";

import Link from "next/link";
import { motion } from "motion/react";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
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

// テキスト内の特定ワードをリンクに変換
const inlineLinks: { word: string; href: string }[] = [
  { word: "blog", href: "/blog" },
  { word: "notes", href: "/notes-timeline" },
  { word: "travel", href: "/travel" },
  { word: "project", href: "/projects" },
];

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

export default function Home() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto px-4 py-24 space-y-10"
    >
      {/* Greeting */}
      <motion.div variants={item}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground leading-tight">
          Hi, I&apos;m Yuto Nagata
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p variants={item} className="text-lg text-muted-foreground font-light -mt-6">
        Welcome to my digital sandbox.
      </motion.p>

      {/* Paragraph 1 */}
      <motion.p
        variants={item}
        className="text-[15px] md:text-base text-foreground/85 leading-[1.9] -mt-2"
      >
        長野県で活動する学生エンジニア兼、個人事業主です。この場所は、私の技術的なアウトプット（
        <InlineLink word="blog" href="/blog" />
        ）、日々の短い思考の記録（
        <InlineLink word="notes" href="/notes-timeline" />
        ）、趣味の旅行記（
        <InlineLink word="travel" href="/travel" />
        ）、そしてこれまで開発してきたポートフォリオ（
        <InlineLink word="project" href="/projects" />
        ）をまとめたデジタルな遊び場です。
      </motion.p>

      {/* Paragraph 2 */}
      <motion.p
        variants={item}
        className="text-[15px] md:text-base text-foreground/85 leading-[1.9]"
      >
        普段はNext.js/Reactを用いたWebフロントエンド開発や、Unityでのゲーム開発、LLMを組み込んだアプリケーション制作を行っています。小中学生向けのプログラミング講師としての顔も持っています。
      </motion.p>

      {/* Quick nav */}
      <motion.nav
        variants={item}
        className="flex flex-wrap gap-x-5 gap-y-2 pt-2"
        aria-label="Quick navigation"
      >
        {inlineLinks.concat([{ word: "about", href: "/about" }]).map((link) => (
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
    </motion.div>
  );
}
