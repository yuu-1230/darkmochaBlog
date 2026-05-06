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
import { TableOfContents } from "@/components/TableOfContents";

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
      title: `${title} | Darkmocha`,
      description: description || "Darkmocha Blog",
      openGraph: {
        title: title,
        description: description,
        type: "article",
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

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

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
    <div className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Hero image */}
      {frontmatter.image && (
        <div className="w-full h-56 md:h-72 relative rounded-xl overflow-hidden mb-8 -mx-4 md:mx-0" style={{ width: "calc(100% + 2rem)" }}>
          <Image
            src={frontmatter.image}
            alt={frontmatter.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      )}

      <article className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Article header */}
        <div className="mb-8 border-b pb-8">
          <div className="flex flex-wrap gap-3 text-xs font-mono text-muted-foreground mb-4">
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
                {frontmatter.readTime}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-foreground tracking-tight leading-tight mb-4">
            {frontmatter.title}
          </h1>

          {frontmatter.description && (
            <p className="text-base text-muted-foreground leading-relaxed">
              {frontmatter.description}
            </p>
          )}
        </div>

        {/* Table of Contents (記事上部に表示) */}
        {toc.length > 0 && (
          <TableOfContents toc={toc} className="mb-10" />
        )}

        {/* MDX content */}
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

        {/* Prev / Next navigation */}
        <nav
          aria-label="Post navigation"
          className="mt-20 pt-10 border-t flex flex-col md:flex-row justify-between gap-4"
        >
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="group flex-1 flex flex-col p-4 border border-border hover:border-primary/40 rounded-xl bg-card hover:bg-accent transition-all outline-none"
            >
              <span className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Previous Post
              </span>
              <span className="text-sm text-primary font-medium line-clamp-2 transition-colors">
                {prevPost.frontmatter.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="group flex-1 flex flex-col items-end text-right p-4 border border-border hover:border-primary/40 rounded-xl bg-card hover:bg-accent transition-all outline-none"
            >
              <span className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                Next Post
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="text-sm text-primary font-medium line-clamp-2 transition-colors">
                {nextPost.frontmatter.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>

        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Thanks for reading.</span>
          <div className="flex gap-4" />
        </div>
      </article>
    </div>
  );
}
