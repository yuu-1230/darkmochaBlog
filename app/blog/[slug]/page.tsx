import { getPost, getAllPosts } from "@/lib/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Clock, RefreshCw } from "lucide-react";
import React from "react";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdx";
import { generateTOC } from "@/lib/toc";
import { TableOfContents } from "@/components/TableOfContents";
import { AnchorScroll } from "@/components/anchor-scroll";
import { GiscusComments } from "@/components/giscus-comments";
import { CategoryThemeApplier } from "@/components/category-theme-applier";
import { MacWindowBar } from "@/components/MacWindowBar";
import { HeroImage } from "@/components/HeroImage";
import { PostNavigation } from "@/components/PostNavigation";
import { getTagStyle } from "@/lib/utils";
import { getBlogPostJsonLd, getBreadcrumbJsonLd } from "@/lib/jsonld";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedPosts } from "@/components/RelatedPosts";
import { getRelatedPosts } from "@/lib/related-posts";
import { tagHref } from "@/lib/tags";
import { SITE_URL } from "@/lib/constants";

const prettyCodeOptions: Options = {
  theme: { light: "solarized-light", dark: "everforest-dark" },
  keepBackground: false,
  defaultLang: "plaintext",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPost(slug);
  if (!post) {
    return { title: "Not Found" };
  }

  const { title, description, image, date } = post.frontmatter;
  const canonical = `${SITE_URL}/blog/${slug}`;
  const ogImage = image
    ? [{ url: image, width: 1200, height: 630, alt: title }]
    : [{ url: "/images/OG.jpg", width: 1200, height: 630 }];

  return {
    title,
    description: description || "Darkmocha Blog",
    alternates: { canonical },
    openGraph: {
      title,
      description: description ?? "",
      type: "article",
      url: canonical,
      publishedTime: date,
      images: ogImage,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description ?? "",
      images: ogImage.map((img) => img.url),
    },
  };
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
  const relatedPosts = getRelatedPosts(allPosts, post);
  const jsonLd = getBlogPostJsonLd(frontmatter, slug);
  const breadcrumbJsonLd = getBreadcrumbJsonLd(frontmatter.title, slug);

  return (
    <div className="pb-20">
      <CategoryThemeApplier category={frontmatter.category} />
      <AnchorScroll />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c') }}
      />

      {frontmatter.image && (
        <HeroImage src={frontmatter.image} alt={frontmatter.title} />
      )}

      <div className="relative">
        {toc.length > 0 && (
          <aside className="hidden min-[1440px]:block absolute inset-y-0 left-[calc(50%+26rem)] w-64">
            <div className="sticky top-32 max-h-[70vh] overflow-y-auto">
              <TableOfContents toc={toc} />
            </div>
          </aside>
        )}

        <article
        className="max-w-3xl mx-auto bg-card border border-border rounded-xl overflow-hidden"
        data-category={frontmatter.category?.toLowerCase()}
      >
        <MacWindowBar title={frontmatter.title} />

        <div className="p-6 md:p-10">
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
            {frontmatter.update && frontmatter.update !== frontmatter.date && (
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                更新 {frontmatter.update}
              </span>
            )}
            {frontmatter.tags && (
              <span className="flex items-center gap-1.5 flex-wrap">
                <Tag className="w-3.5 h-3.5 shrink-0" />
                {frontmatter.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={tagHref(tag)}
                    className="px-1.5 py-0.5 rounded text-[10px] font-mono hover:opacity-75 transition-opacity"
                    style={getTagStyle(frontmatter.category)}
                  >
                    {tag}
                  </Link>
                ))}
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

        {/* Table of Contents (記事上部に表示、ワイド画面ではサイドバーに切替) */}
        {toc.length > 0 && (
          <TableOfContents toc={toc} className="mb-10 min-[1440px]:hidden" />
        )}

        {/* MDX content */}
        <div className="min-h-[200px]">
          <MDXRemote
            source={content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [rehypePrettyCode, prettyCodeOptions],
                ],
              },
            }}
          />
        </div>

        <PostNavigation prevPost={prevPost} nextPost={nextPost} />

        <RelatedPosts posts={relatedPosts} />

        <div className="mt-8 pt-6 border-t flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Thanks for reading.</span>
          <ShareButtons
            url={`${SITE_URL}/blog/${slug}`}
            title={frontmatter.title}
          />
        </div>

        <div className="mt-12">
          <GiscusComments />
        </div>
        </div>
        </article>
      </div>
    </div>
  );
}
