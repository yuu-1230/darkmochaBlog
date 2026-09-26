import { getAllPosts } from "@/lib/mdx";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticleCoverCard } from "@/components/magazine/ArticleCoverCard";
import { EditorialPageHeader } from "@/components/magazine/EditorialPageHeader";
import { localeUrl, localeAlternates } from "@/lib/locale-url";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const canonical = localeUrl(locale, "/blog");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical, languages: localeAlternates("/blog") },
    openGraph: {
      title: `${t("metaTitle")} | Darkmocha`,
      description: t("metaDescription"),
      url: canonical,
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const allPosts = await getAllPosts(locale);
  return (
    <div className="editorial-index">
      <EditorialPageHeader
        title={locale === "ja" ? "記事一覧" : "Journal"}
        description={locale === "ja" ? "つくること、学ぶこと、ときどき旅のこと。" : "Making, learning, and a little travel."}
        meta={t("postCount", { count: allPosts.length })}
      />

      {allPosts.length === 0 && (
        <p className="editorial-empty">
          {t("empty")}
        </p>
      )}

      <section className="journal-grid editorial-article-grid" aria-label={locale === "ja" ? "すべての記事" : "All articles"}>
        {allPosts.map((post, index) => (
          <ArticleCoverCard key={post.slug} post={post} priority={index < 2} />
        ))}
      </section>
    </div>
  );
}
