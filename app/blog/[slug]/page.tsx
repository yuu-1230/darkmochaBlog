// app/blog/[slug]/page.tsx
import { getPost, getAllPosts } from "@/lib/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Tag,
  Clock,
  List,
} from "lucide-react"; // List を追加
import React, { ComponentPropsWithoutRef } from "react";
import rehypeSlug from "rehype-slug"; // 追加
import GithubSlugger from "github-slugger"; // 追加

// 動的にメタデータを生成する関数
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = getPost(slug);
    const { title, description } = post.frontmatter;

    return {
      title: `${title} | Darkmocha`, // タブや検索結果に表示されるタイトル
      description: description || "VS Code Styled Engineer Blog",
      openGraph: {
        title: title,
        description: description,
        type: "article",
        // images は opengraph-image.tsx が自動で入れてくれるので書かなくてOK！
      },
      twitter: {
        card: "summary_large_image",
        title: title,
        description: description,
      },
    };
  } catch {
    return {
      title: "Not Found",
    };
  }
}

// --- 目次（TOC）を自動生成＆番号付けする関数 ---
function generateTOC(content: string) {
  const slugger = new GithubSlugger();
  let h2Count = 0;
  let h3Count = 0;

  // MDXテキストの中から ## と ### を抽出
  const headings = Array.from(content.matchAll(/^(##|###)\s+(.*)$/gm)).map(
    (match) => {
      const level = match[1].length; // 2 or 3
      const rawText = match[2].trim();
      const id = slugger.slug(rawText);

      // 1, 1-1 の番号を生成
      let numberLabel = "";
      if (level === 2) {
        h2Count++;
        h3Count = 0; // h2が変わったらh3のカウントをリセット
        numberLabel = `${h2Count}`;
      } else if (level === 3) {
        h3Count++;
        numberLabel = `${h2Count}-${h3Count}`;
      }

      return { level, text: rawText, id, numberLabel };
    },
  );

  return headings;
}

// --- 1. 文字色変更用コンポーネント <C c="red">... ---
const C = ({ c, children }: { c: string; children: React.ReactNode }) => {
  const colorMap: Record<string, string> = {
    red: "text-[#f4b1a2]",
    blue: "text-[#acdaff]",
    green: "text-[#b9ffdc]",
    orange: "text-[#ce9178]",
    yellow: "text-[#dcdcaa]",
    purple: "text-[#c586c0]",
    comment: "text-[#6a9955]",
    gray: "text-[#808080]",
  };

  const className = colorMap[c];

  return className ?
      <span className={className}>{children}</span>
    : <span style={{ color: c }}>{children}</span>;
};

// --- Custom MDX Components ---
const components = {
  // Linkコンポーネントをカスタマイズ（VS Code風の青色）
  Link: ({
    href,
    children,
    ...props
  }: ComponentPropsWithoutRef<typeof Link>) => (
    <Link
      href={href}
      className="text-[#3794ff] hover:underline decoration-[#3794ff] underline-offset-4 cursor-pointer"
      {...props}
    >
      {children}
    </Link>
  ),

  C,
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="text-3xl font-bold text-white mt-12 mb-6 border-b border-[#333] pb-2"
      {...props}
    />
  ),
  // rehype-slug が付与した id は ...props に含まれるため、ジャンプ機能がそのまま動きます！
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="text-2xl font-semibold text-[#569cd6] mt-10 mb-4 flex items-center gap-2 pt-16 -mt-16"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="text-xl font-medium text-[#4ec9b0] mt-8 mb-3 pt-16 -mt-16"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="text-[#cccccc] leading-8 mb-6 text-[16px]" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="list-disc list-inside mb-6 text-[#cccccc] space-y-2 ml-4"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-decimal list-inside mb-6 text-[#cccccc] space-y-2 ml-4"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-7" {...props} />
  ),
  // 通常のリンク(aタグ)も青色のLinkに置き換える設定（自動最適化）
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    // ページ内リンク（#から始まるもの）の対応を追加
    if (href?.startsWith("#")) {
      return (
        <a
          href={href}
          className="text-[#3794ff] hover:underline decoration-[#3794ff] underline-offset-4 cursor-pointer"
          {...props}
        >
          {children}
        </a>
      );
    }
    if (href?.startsWith("/")) {
      return (
        <Link
          href={href}
          className="text-[#3794ff] hover:underline decoration-[#3794ff] underline-offset-4 cursor-pointer"
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        className="text-[#3794ff] hover:underline decoration-[#3794ff] underline-offset-4 cursor-pointer"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-4 border-[#3794ff] bg-[#252526] px-4 py-3 mb-6 text-[#a0a0a0] italic rounded-r"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="font-mono text-[#ce9178] bg-[#2d2d2d] px-1.5 py-0.5 rounded text-sm mx-1"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="bg-[#1e1e1e] border border-[#333] rounded-lg p-4 overflow-x-auto mb-8 text-sm font-mono leading-relaxed"
      {...props}
    />
  ),
  img: (props: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="rounded-lg border border-[#333] my-8 w-full h-auto object-contain bg-[#1e1e1e]"
      alt={props.alt || ""}
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="border-[#333] my-10" {...props} />
  ),
};

// --- Static Params ---
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// --- Main Page Component ---
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    notFound();
  }

  const post = allPosts[currentIndex];
  const { frontmatter, content } = post;

  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // コンテンツから目次データを生成
  const toc = generateTOC(content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    image:
      frontmatter.image ? [`https://darkmocha.dev${frontmatter.image}`] : [],
    datePublished: frontmatter.date,
    author: {
      "@type": "Person",
      name: "Yuto Nagata",
      url: "https://darkmocha.dev",
    },
    keywords: frontmatter.tags,
  };

  return (
    <div className="min-h-full w-full bg-[#1f1f1f] text-[#cccccc] font-sans selection:bg-[#264f78] selection:text-white pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 記事ヘッダー画像 */}
      {frontmatter.image && (
        <div className="w-full h-64 md:h-80 relative bg-[#252526]">
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f1f1f] to-transparent" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-6 md:px-10 pt-10">
        {/* ナビゲーション */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#858585] hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* 記事タイトルエリア */}
        <div className="mb-12 border-b border-[#333] pb-8">
          <div className="flex flex-wrap gap-4 text-xs font-mono text-[#858585] mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {frontmatter.date}
            </span>
            {frontmatter.tags && (
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {frontmatter.tags.join(", ")}
              </span>
            )}
            {frontmatter.readTime && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Reading time: {frontmatter.readTime}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            {frontmatter.title}
          </h1>

          {frontmatter.description && (
            <p className="text-lg text-[#a0a0a0] leading-relaxed whitespace-pre-wrap">
              {frontmatter.description}
            </p>
          )}
        </div>

        {/* 目次UI */}
        {toc.length > 0 && (
          <div className="mb-10 bg-[#1e1e1e] border border-[#333] rounded-lg p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-2 text-white font-bold mb-4 border-b border-[#333] pb-3 text-lg">
              <List className="w-5 h-5 text-[#569cd6]" />
              目次
            </div>
            <ul className="space-y-3">
              {toc.map((heading, index) => (
                <li
                  key={index}
                  className={
                    heading.level === 3 ?
                      "ml-6 text-sm text-[#a0a0a0]"
                    : "text-[#cccccc] font-medium mt-4 first:mt-0"
                  }
                >
                  <a
                    href={`#${heading.id}`}
                    className="hover:text-[#3794ff] hover:underline underline-offset-4 transition-colors flex items-start gap-2"
                  >
                    <span className="text-[#858585] font-mono shrink-0">
                      {heading.numberLabel} |
                    </span>
                    <span>{heading.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* MDXレンダリングエリア */}
        {/* options に rehypeSlug を追加 */}
        <div className="min-h-[200px]">
          <MDXRemote
            source={content}
            components={components}
            options={{
              mdxOptions: {
                rehypePlugins: [rehypeSlug],
              },
            }}
          />
        </div>

        <nav
          aria-label="Post navigation"
          className="mt-20 pt-10 border-t border-[#333] flex flex-col md:flex-row justify-between gap-4"
        >
          {/* 前の記事 (古い記事) */}
          {prevPost ?
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex-1 flex flex-col p-4 border border-[#333] hover:border-[#569cd6] rounded-lg bg-[#252526] hover:bg-[#2a2d2e] transition-all outline-none"
            >
              <span className="flex items-center gap-2 text-xs text-[#858585] mb-2 font-mono">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Previous Post
              </span>
              <span className="text-sm text-[#3794ff] group-hover:text-[#569cd6] font-medium line-clamp-2 transition-colors">
                {prevPost.frontmatter.title}
              </span>
            </Link>
          : <div className="flex-1" />}

          {/* 次の記事 (新しい記事) */}
          {nextPost ?
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex-1 flex flex-col items-end text-right p-4 border border-[#333] hover:border-[#569cd6] rounded-lg bg-[#252526] hover:bg-[#2a2d2e] transition-all outline-none"
            >
              <span className="flex items-center gap-2 text-xs text-[#858585] mb-2 font-mono">
                Next Post
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="text-sm text-[#3794ff] group-hover:text-[#569cd6] font-medium line-clamp-2 transition-colors">
                {nextPost.frontmatter.title}
              </span>
            </Link>
          : <div className="flex-1" />}
        </nav>

        {/* フッター */}
        <div className="mt-8 pt-6 border-t border-[#333] flex justify-between items-center">
          <span className="text-sm text-[#565656]">Thanks for reading.</span>
          <div className="flex gap-4">{/* Share Buttons if needed */}</div>
        </div>
      </article>
    </div>
  );
}
