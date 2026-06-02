"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { PostData } from "@/lib/mdx";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

function categoryLabel(category?: string): string {
  const map: Record<string, string> = {
    Tech:  "tech",
    Unity: "game",
    Life:  "life",
  };
  return category ? (map[category] ?? category.toLowerCase()) : "misc";
}

const socialLinks = [
  { label: "github",  href: "https://github.com/yuu-1230" },
  { label: "twitter", href: "https://x.com/DarkmochaJP" },
  { label: "zenn",    href: "https://zenn.dev/darkmocha" },
  { label: "qiita",  href: "https://qiita.com/darkmocha" },
];

type Props = { recentPosts: PostData[] };

export function HomeClient({ recentPosts }: Props) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto px-4 py-12"
    >
      {/* ── Bio section ── */}
      <motion.section variants={item} className="mb-12">
        {/* whoami prompt */}
        <div className="flex items-center gap-2 font-mono text-sm text-primary mb-5 select-none">
          <span>$</span>
          <span>whoami</span>
        </div>

        <p className="text-[15px] text-foreground/90 leading-relaxed mb-8">
          I&apos;m a university student based in Japan, studying web application development.
          My hobbies include travelling, tennis, and running.
          I also work with local government on digital transformation initiatives.
          Here, I write about programming, tech, and everyday life.
        </p>

        {/* Social quick links */}
        <div className="flex flex-wrap gap-4 font-mono text-sm text-muted-foreground">
          {socialLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors group"
            >
              <span className="text-primary/50 group-hover:text-primary transition-colors">[</span>
              {label}
              <span className="text-primary/50 group-hover:text-primary transition-colors">]</span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* ── Terminal divider ── */}
      <motion.div
        variants={item}
        className="relative flex items-center justify-center my-12"
      >
        <div className="w-full h-px bg-border" />
        <span className="absolute bg-background px-4 font-mono text-[11px] text-muted-foreground/50 tracking-[0.25em] select-none">
          ~ / ROOT / DATA
        </span>
      </motion.div>

      {/* ── Recent Writing ── */}
      {recentPosts.length > 0 && (
        <motion.section variants={item}>
          {/* Section header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-sm text-foreground flex items-center gap-1.5">
              <span className="text-primary">./</span>
              recent_writing
            </h2>
            <Link
              href="/blog"
              className="font-mono text-xs text-primary border border-primary/30 px-3 py-1 rounded-sm hover:bg-primary/10 transition-colors"
            >
              view_all --force
            </Link>
          </div>

          {/* Terminal table */}
          <div className="border border-border bg-card rounded-sm overflow-hidden font-mono">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-2.5 border-b border-border bg-black/10 dark:bg-black/40 text-[11px] text-muted-foreground uppercase tracking-wider">
              <div className="col-span-3 md:col-span-2">TIMESTAMP</div>
              <div className="col-span-9 md:col-span-8">FILE_NAME</div>
              <div className="hidden md:block col-span-2 text-right">TAG</div>
            </div>

            {/* Post rows */}
            {recentPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`grid grid-cols-12 gap-4 px-5 py-3.5 border-l-2 border-l-transparent hover:bg-accent hover:border-l-primary group transition-all duration-150 ${
                  index < recentPosts.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="col-span-3 md:col-span-2 text-xs text-muted-foreground group-hover:text-primary transition-colors self-center">
                  {post.frontmatter.date}
                </div>
                <div className="col-span-9 md:col-span-8 text-sm text-foreground group-hover:text-primary transition-colors truncate self-center">
                  {post.frontmatter.title}
                </div>
                <div className="hidden md:block col-span-2 text-right text-xs text-primary/60 self-center">
                  [{categoryLabel(post.frontmatter.category)}]
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}
    </motion.div>
  );
}
