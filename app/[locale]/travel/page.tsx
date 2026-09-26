import { getAllPosts } from "@/lib/mdx";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeUrl, localeAlternates } from "@/lib/locale-url";
import type { Locale } from "@/i18n/routing";
import { ArticleCoverCard } from "@/components/magazine/ArticleCoverCard";
import { EditorialPageHeader } from "@/components/magazine/EditorialPageHeader";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "travel" });
  const canonical = localeUrl(locale, "/travel");

  return {
    title: "Travel",
    description: t("metaDescription"),
    alternates: { canonical, languages: localeAlternates("/travel") },
    openGraph: {
      title: "Travel | Darkmocha",
      description: t("metaDescription"),
      url: canonical,
    },
  };
}

export default async function TravelPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("travel");
  const allPosts = await getAllPosts(locale);
  const travelPosts = allPosts.filter((p) => p.frontmatter.category === "Life");

  return (
    <div className="editorial-index">
      <EditorialPageHeader
        title="Travel"
        description={t("description")}
        meta={travelPosts.length > 0 ? t("descriptionWithCount", { count: travelPosts.length }) : undefined}
      />

      {travelPosts.length === 0 ? (
        <div className="editorial-empty">
          <p className="text-4xl">✈️</p>
          <p className="text-muted-foreground text-sm">{t("empty")}</p>
          <Link
            href="/blog"
            className="text-xs font-mono text-primary hover:underline underline-offset-4"
          >
            {t("backToAll")}
          </Link>
        </div>
      ) : (
        <section className="journal-grid editorial-article-grid" aria-label="Travel articles">
          {travelPosts.map((post, index) => (
            <ArticleCoverCard key={post.slug} post={post} priority={index < 2} />
          ))}
        </section>
      )}
    </div>
  );
}
