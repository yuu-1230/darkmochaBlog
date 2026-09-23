import { headers } from "next/headers";
import { localEditorHost, localEditorEnabled } from "@/lib/cover-editor";
import { CompositionProvider } from "@/components/magazine/CompositionContext";
import { LiveLayoutEditor } from "@/components/magazine/LiveLayoutEditor";
import { ArticleLayoutEditor } from "@/components/magazine/ArticleLayoutEditor";
import { hasMagazinePages } from "@/lib/magazine";
import { getPost, getAllPosts, hasTranslation } from "@/lib/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import React from "react";
import { generateTOC } from "@/lib/toc";
import { TableOfContents } from "@/components/TableOfContents";
import { AnchorScroll } from "@/components/anchor-scroll";
import { GiscusComments } from "@/components/giscus-comments";
import { EditorialImage } from "@/components/magazine/EditorialImage";
import { PostNavigation } from "@/components/PostNavigation";
import { getBlogPostJsonLd, getBreadcrumbJsonLd } from "@/lib/jsonld";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedPosts } from "@/components/RelatedPosts";
import { getRelatedPosts } from "@/lib/related-posts";
import { tagHref } from "@/lib/tags";
import { localeUrl, localeAlternates } from "@/lib/locale-url";
import { TranslationUnavailable } from "@/components/translation-unavailable";
import { ArticleEngagement } from "@/components/blog/ArticleEngagement";
import { MagazineReader } from "@/components/magazine/MagazineReader";
import { magazineMdxComponents } from "@/components/magazine/parts";
import { MdxDocument } from "@/components/mdx-document";
import { routing, type Locale } from "@/i18n/routing";
import { resolveImageUrl } from "@/lib/image-url";

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
    ? [{ url: resolveImageUrl(image), width: 1200, height: 630, alt: title }]
    : [
        {
          url: resolveImageUrl("/images/OG.jpg"),
          width: 1200,
          height: 630,
        },
      ];

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

  const layoutEditor = localEditorEnabled() && frontmatter.reader?.pages && localEditorHost((await headers()).get("host"));
  const magazine = frontmatter.reader?.mode === "magazine" || hasMagazinePages(content);
  const engagement = <ArticleEngagement postId={slug} authorBio={t("engagement.authorBio")}
    authorLinkLabel={t("engagement.authorLinkLabel")} likeLabels={{ like: t("engagement.like"), unlike: t("engagement.unlike"), unavailable: t("engagement.unavailable") }} />;

  return (
    <article className={`magazine-article ${magazine ? "magazine-paginated" : "magazine-standard"}`}>
      {!magazine && <AnchorScroll />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      {magazine ? (
        <CompositionProvider>
        <MagazineReader toc={toc} initialMode={frontmatter.reader?.mode ?? "flow"}>
          <MdxDocument source={content} plan={frontmatter.reader?.pages} components={magazineMdxComponents(frontmatter, locale)} />
        </MagazineReader>
        {layoutEditor && <><LiveLayoutEditor locale={locale} slug={slug}/><ArticleLayoutEditor locale={locale} slug={slug}/></>}
        </CompositionProvider>
      ) : (
        <div className="magazine-continuous">
          <header className="continuous-heading">
            <p className="journal-meta">{frontmatter.category} / <time dateTime={frontmatter.date}>{frontmatter.date}</time></p>
            <h1>{frontmatter.title}</h1>
            <p>{frontmatter.description}</p>
            {frontmatter.image && <EditorialImage src={frontmatter.image} alt="" fit="contain" priority />}
          </header>
          {toc.length > 0 && <details className="continuous-toc"><summary>{locale === "ja" ? "目次" : "Contents"}</summary><TableOfContents toc={toc} /></details>}
          <div className="magazine-prose"><MdxDocument source={content} /></div>
        </div>
      )}
      <section id="article-end" className="magazine-end" aria-label={locale === "ja" ? "記事を読み終えて" : "After reading"}>
        <p className="article-formal-title">{frontmatter.title}</p>
        <div className="journal-meta"><time dateTime={frontmatter.date}>{frontmatter.date}</time>
          {frontmatter.update && frontmatter.update !== frontmatter.date && <span>{t("updated")} {frontmatter.update}</span>}
          <span>{frontmatter.readTime}</span>
          {frontmatter.tags?.map(tag => <Link key={tag} href={tagHref(tag)}>{tag}</Link>)}
        </div>
        {engagement}
        <div className="magazine-share"><span>{t("thanks")}</span><ShareButtons url={localeUrl(locale, `/blog/${slug}`)} title={frontmatter.title} /></div>
        <PostNavigation prevPost={prevPost} nextPost={nextPost} />
        <RelatedPosts posts={relatedPosts} />
        <div id="comments"><GiscusComments /></div>
      </section>
    </article>
  );
}
