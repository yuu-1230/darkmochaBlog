import { getAllPosts } from "@/lib/mdx";
import { getAllTags, getPostsByTag } from "@/lib/tags";
import { PostCard } from "@/components/PostCard";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Tag as TagIcon } from "lucide-react";
import { localeUrl, localeAlternates } from "@/lib/locale-url";
import { routing, type Locale } from "@/i18n/routing";

/**
 * そのタグが付いた記事を持つロケールを返す。
 * タグは翻訳しない運用だが、英訳が無い記事しか持たないタグ（例: 機械学習）は
 * 英語側に存在しないため、hreflang は実在するロケールだけに絞る必要がある。
 */
async function localesWithTag(tag: string): Promise<Locale[]> {
  const available: Locale[] = [];
  for (const locale of routing.locales) {
    const posts = await getAllPosts(locale);
    if (getPostsByTag(posts, tag).length > 0) available.push(locale);
  }
  return available;
}

export async function generateStaticParams() {
  const params: { locale: Locale; tag: string }[] = [];
  for (const locale of routing.locales) {
    const posts = await getAllPosts(locale);
    params.push(...getAllTags(posts).map((tag) => ({ locale, tag })));
  }
  return params;
}

type Props = { params: Promise<{ tag: string; locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag, locale } = await params;
  const decoded = decodeURIComponent(tag);
  const t = await getTranslations({ locale, namespace: "tags" });
  const path = `/blog/tags/${encodeURIComponent(decoded)}`;
  const canonical = localeUrl(locale, path);
  const available = await localesWithTag(decoded);

  return {
    title: t("metaTitle", { tag: decoded }),
    description: t("metaDescription", { tag: decoded }),
    alternates: { canonical, languages: localeAlternates(path, available) },
    openGraph: {
      title: `${t("metaTitle", { tag: decoded })} | Darkmocha`,
      description: t("metaDescription", { tag: decoded }),
      url: canonical,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const { tag, locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("tags");
  const decoded = decodeURIComponent(tag);
  const allPosts = await getAllPosts(locale);
  const posts = getPostsByTag(allPosts, decoded);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-10">
      <header className="space-y-2 border-b border-border pb-8">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {"// tag"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
          <TagIcon className="w-6 h-6 text-primary" />
          {decoded}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("postCount", { count: posts.length })}
        </p>
      </header>

      <ul className="space-y-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </ul>

      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        {t("backToBlog")}
      </Link>
    </div>
  );
}
