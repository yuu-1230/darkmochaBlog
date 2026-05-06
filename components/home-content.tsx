"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// テキスト内のキーワードをリンク化するための設定
const inlineLinks: { word: string; href: string }[] = [
  { word: "blog", href: "/blog" },
  { word: "notes", href: "/notes" },
  { word: "travel", href: "/travel" },
  { word: "project", href: "/projects" },
  { word: "portfolio", href: "/projects" },
];

// 親コンテナ: staggerChildren でリストを順番に表示
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// 子要素: 下から上にフワッと浮かび上がる
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

// テキスト中のキーワードをLinkに変換するコンポーネント
function LinkedText({ text }: { text: string }) {
  // キーワードを（）で囲んだ形でマッチ
  const pattern = new RegExp(
    `(${inlineLinks.map((l) => l.word).join("|")})`,
    "g",
  );
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        const link = inlineLinks.find((l) => l.word === part);
        if (link) {
          return (
            <Link
              key={i}
              href={link.href}
              className="underline underline-offset-4 decoration-muted-foreground/40 hover:decoration-primary hover:text-primary transition-colors"
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function HomeContent() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 py-8"
    >
      {/* Hero Section */}
      <section className="space-y-8 max-w-3xl">
        {/* Greeting */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Hi, I&apos;m Yuto Nagata
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Welcome to my digital sandbox.
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          variants={itemVariants}
          className="space-y-4 text-foreground/80 leading-relaxed text-[15px] md:text-base"
        >
          <p>
            長野県で活動する学生エンジニア兼、個人事業主です。この場所は、私の技術的なアウトプット（
            <LinkedText text="blog" />
            ）、日々の短い思考の記録（
            <LinkedText text="notes" />
            ）、趣味の旅行記（
            <LinkedText text="travel" />
            ）、そしてこれまで開発してきたポートフォリオ（
            <LinkedText text="project" />
            ）をまとめたデジタルな遊び場です。
          </p>
          <p>
            普段はNext.js/Reactを用いたWebフロントエンド開発や、Unityでのゲーム開発、LLMを組み込んだアプリケーション制作を行っています。小中学生向けのプログラミング講師としての顔も持っています。
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.nav
          variants={itemVariants}
          className="flex flex-wrap gap-x-6 gap-y-2"
          aria-label="Quick navigation"
        >
          {[
            { label: "blog", href: "/blog" },
            { label: "notes", href: "/notes" },
            { label: "travel", href: "/travel" },
            { label: "project", href: "/projects" },
            { label: "about", href: "/about" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span className="text-primary/60 group-hover:text-primary transition-colors">
                [
              </span>
              {item.label}
              <span className="text-primary/60 group-hover:text-primary transition-colors">
                ]
              </span>
            </Link>
          ))}
        </motion.nav>
      </section>

      {/* Divider */}
      <motion.hr variants={itemVariants} className="border-border" />
    </motion.div>
  );
}
