import type { Frontmatter } from "@/lib/mdx";
import { SITE_URL, AUTHOR_NAME, AUTHOR_URL } from "@/lib/constants";
import { localeUrl } from "@/lib/locale-url";
import { BCP47, type Locale } from "@/i18n/routing";

export function getBlogPostJsonLd(
  frontmatter: Frontmatter,
  slug: string,
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.image ? [`${SITE_URL}${frontmatter.image}`] : [],
    datePublished: frontmatter.date,
    dateModified: frontmatter.update ?? frontmatter.date,
    mainEntityOfPage: localeUrl(locale, `/blog/${slug}`),
    inLanguage: BCP47[locale],
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    keywords: frontmatter.tags,
  };
}

export function getBreadcrumbJsonLd(
  title: string,
  slug: string,
  locale: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: localeUrl(locale),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: localeUrl(locale, "/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: localeUrl(locale, `/blog/${slug}`),
      },
    ],
  };
}
