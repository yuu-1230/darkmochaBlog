import { getPost, getAllPosts } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";
import React, { ComponentPropsWithoutRef } from "react";

// --- Custom MDX Components (VS Code High Contrast Style) ---
const components = {
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="text-3xl font-bold text-white mt-12 mb-6 border-b border-[#333] pb-2"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="text-2xl font-semibold text-[#569cd6] mt-10 mb-4 flex items-center gap-2"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="text-xl font-medium text-[#4ec9b0] mt-8 mb-3" {...props} />
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
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="text-[#3794ff] hover:underline decoration-[#3794ff] underline-offset-4"
      {...props}
    />
  ),
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
  let post;
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = post;

  return (
    <div className="min-h-full w-full bg-[#1f1f1f] text-[#cccccc] font-sans selection:bg-[#264f78] selection:text-white pb-20">
      {/* 記事ヘッダー画像 (あれば) */}
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
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Reading time: 5 min
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            {frontmatter.title}
          </h1>

          {frontmatter.description && (
            <p className="text-lg text-[#a0a0a0] leading-relaxed">
              {frontmatter.description}
            </p>
          )}
        </div>

        {/* MDXレンダリングエリア */}
        <div className="min-h-[200px]">
          <MDXRemote source={content} components={components} />
        </div>

        {/* フッター */}
        <div className="mt-20 pt-10 border-t border-[#333] flex justify-between items-center">
          <span className="text-sm text-[#565656]">Thanks for reading.</span>
          <div className="flex gap-4">{/* Share Buttons if needed */}</div>
        </div>
      </article>
    </div>
  );
}
