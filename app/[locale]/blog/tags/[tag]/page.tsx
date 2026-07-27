import { getAllPosts } from "@/lib/mdx";
import { getAllTags, getPostsByTag } from "@/lib/tags";
import { PostCard } from "@/components/PostCard";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Tag as TagIcon } from "lucide-react";
import { localeUrl } from "@/lib/locale-url";
import type { Locale } from "@/i18n/routing";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return getAllTags(posts).map((tag) => ({ tag }));
}

type Props = { params: Promise<{ tag: string; locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag, locale } = await params;
  const decoded = decodeURIComponent(tag);
  const t = await getTranslations({ locale, namespace: "tags" });
  const canonical = localeUrl(
    locale,
    `/blog/tags/${encodeURIComponent(decoded)}`,
  );

  return {
    title: t("metaTitle", { tag: decoded }),
    description: t("metaDescription", { tag: decoded }),
    alternates: { canonical },
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
  const allPosts = await getAllPosts();
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
