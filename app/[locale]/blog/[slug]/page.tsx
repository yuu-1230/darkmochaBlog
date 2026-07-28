import { getPost, getAllPosts, hasTranslation } from "@/lib/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
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
import { localeUrl, localeAlternates } from "@/lib/locale-url";
import { TranslationUnavailable } from "@/components/translation-unavailable";
import { routing, type Locale } from "@/i18n/routing";

const prettyCodeOptions: Options = {
  theme: { light: "solarized-light", dark: "everforest-dark" },
  keepBackground: false,
  defaultLang: "plaintext",
};

type Props = { params: Promise<{ slug: string; locale: Locale }> };

/** slug の記事が存在するロケールをすべて返す（hreflang 用） */
async function localesWithPost(slug: string): Promise<Locale[]> {
  const available: Locale[] = [];
  for (const candidate of routing.locales) {
    if (await hasTranslation(slug, candidate)) available.push(candidate);
  }
  return available;
}

/** slug の記事が存在する他ロケールを返す（未訳フォールバック用） */
async function findAvailableLocale(
  slug: string,
  exclude: Locale,
): Promise<Locale | null> {
  const available = await localesWithPost(slug);
  return available.find((candidate) => candidate !== exclude) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;

  const post = await getPost(slug, locale);
  if (!post) {
    const availableLocale = await findAvailableLocale(slug, locale);
    if (!availableLocale) {
      return { title: "Not Found" };
    }
    // 未訳の案内ページは実質ソフト404なので、検索エンジンには拾わせない
    const other = await getPost(slug, availableLocale);
    return {
      title: other?.frontmatter.title ?? "Not Found",
      robots: { index: false, follow: true },
      alternates: { canonical: localeUrl(availableLocale, `/blog/${slug}`) },
    };
  }

  const { title, description, image, date } = post.frontmatter;
  const path = `/blog/${slug}`;
  const canonical = localeUrl(locale, path);
  const ogImage = image
    ? [{ url: image, width: 1200, height: 630, alt: title }]
    : [{ url: "/images/OG.jpg", width: 1200, height: 630 }];

  // 翻訳が存在するロケールにだけ hreflang を張る（未訳に張ると翻訳漏れ扱いになる）
  const available = await localesWithPost(slug);

  return {
    title,
    description: description || "Darkmocha Blog",
    alternates: { canonical, languages: localeAlternates(path, available) },
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
  // ロケールごとに、そのロケールに実在する記事だけを事前生成する。
  // 未訳の /en/blog/{slug} は事前生成せず、オンデマンドで案内ページを返す。
  const params: { locale: Locale; slug: string }[] = [];
  for (const locale of routing.locales) {
    const posts = await getAllPosts(locale);
    params.push(...posts.map((post) => ({ locale, slug: post.slug })));
  }
  return params;
}

export default async function BlogPost({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("post");
  const allPosts = await getAllPosts(locale);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);

  if (currentIndex === -1) {
    // このロケールには無いが他ロケールにはある → 404 にせず案内を出す
    const availableLocale = await findAvailableLocale(slug, locale);
    const other = availableLocale
      ? await getPost(slug, availableLocale)
      : null;

    if (!availableLocale || !other) {
      notFound();
    }

    return (
      <TranslationUnavailable
        availableLocale={availableLocale}
        slug={slug}
        title={other.frontmatter.title}
      />
    );
  }

  const post = allPosts[currentIndex];
  const { frontmatter, content } = post;

  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const toc = generateTOC(content);
  const relatedPosts = getRelatedPosts(allPosts, post);
  const jsonLd = getBlogPostJsonLd(frontmatter, slug, locale);
  const breadcrumbJsonLd = getBreadcrumbJsonLd(frontmatter.title, slug, locale);

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
          {t("backToHome")}
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
                {t("updated")} {frontmatter.update}
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
          <span className="text-sm text-muted-foreground">{t("thanks")}</span>
          <ShareButtons
            url={localeUrl(locale, `/blog/${slug}`)}
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
