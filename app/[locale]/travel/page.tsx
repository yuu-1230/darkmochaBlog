import { getAllPosts } from "@/lib/mdx";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { localeUrl } from "@/lib/locale-url";
import type { Locale } from "@/i18n/routing";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "travel" });
  const canonical = localeUrl(locale, "/travel");

  return {
    title: "Travel",
    description: t("metaDescription"),
    alternates: { canonical },
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
  const allPosts = await getAllPosts();
  const travelPosts = allPosts.filter((p) => p.frontmatter.category === "Life");

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-16">
      {/* Page header */}
      <header className="space-y-2 border-b border-border pb-8">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
          {"// travel"}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Travel</h1>
        <p className="text-sm text-muted-foreground">
          {travelPosts.length > 0
            ? t("descriptionWithCount", { count: travelPosts.length })
            : t("description")}
        </p>
      </header>

      {travelPosts.length === 0 ? (
        <div className="py-16 text-center space-y-3">
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
        <ul className="space-y-0 divide-y divide-border">
          {travelPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex items-start gap-4 py-4 hover:bg-accent/40 -mx-2 px-2 rounded-lg transition-colors"
              >
                {/* Thumbnail */}
                {post.frontmatter.image ? (
                  <div className="w-20 h-14 shrink-0 relative rounded-md overflow-hidden border border-border bg-muted">
                    <Image
                      src={post.frontmatter.image}
                      alt={post.frontmatter.title}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-14 shrink-0 rounded-md border border-border bg-muted flex items-center justify-center text-2xl">
                    🗺️
                  </div>
                )}

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {post.frontmatter.title}
                    </h2>
                    <time
                      dateTime={post.frontmatter.date}
                      className="text-[11px] text-muted-foreground font-mono shrink-0"
                    >
                      {post.frontmatter.date}
                    </time>
                  </div>
                  {post.frontmatter.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                      {post.frontmatter.description}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
