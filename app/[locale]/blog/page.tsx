import { getAllPosts } from "@/lib/mdx";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildBlogSections } from "@/lib/blog-sections";
import { PostCard } from "@/components/PostCard";
import { localeUrl } from "@/lib/locale-url";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const canonical = localeUrl(locale, "/blog");

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical },
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
  const allPosts = await getAllPosts();
  const sections = buildBlogSections(allPosts);

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-16">
      {/* Page header */}
      <header className="space-y-2 border-b border-border pb-8">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {"// blog"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Blog</h1>
        <p className="text-sm text-muted-foreground">
          {t("postCount", { count: allPosts.length })}
        </p>
      </header>

      {allPosts.length === 0 && (
        <p className="text-muted-foreground text-sm italic py-8 text-center">
          {t("empty")}
        </p>
      )}

      {/* Sections */}
      {sections.map((section) => (
        <section key={section.title} aria-label={section.title}>
          <h2 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="text-primary/60">{"//"}</span>
            {section.title}
            <span className="text-muted-foreground font-normal normal-case tracking-normal">
              ({section.posts.length})
            </span>
          </h2>

          <ul className="space-y-3">
            {section.posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
