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
} from "lucide-react";
import React from "react";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents, generateTOC } from "@/components/mdx-components";
import { TocPortal } from "@/components/TocPortal";
import { TableOfContents } from "@/components/TableOfContents";
// 動的にメタデータを生成する関数
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPost(slug);
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


// --- Static Params ---
export async function generateStaticParams() {
  const posts = await getAllPosts();
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

  const allPosts = await getAllPosts();
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
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

        {/* --- スマホ用: 記事内の目次 (PCサイズでは非表示) --- */}
        <div className="block md:hidden">
          <TableOfContents toc={toc} />
        </div>

        {/* --- PC用: どこでもドアでサイドバーへ目次をワープ --- */}
        <TocPortal toc={toc} />

        {/* MDXレンダリングエリア */}
        {/* options に rehypeSlug を追加 */}
        <div className="min-h-[200px]">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
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
