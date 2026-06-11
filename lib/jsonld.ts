import type { Frontmatter } from "@/lib/mdx";
import { SITE_URL, AUTHOR_NAME, AUTHOR_URL } from "@/lib/constants";

export function getBlogPostJsonLd(frontmatter: Frontmatter, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.image ? [`${SITE_URL}${frontmatter.image}`] : [],
    datePublished: frontmatter.date,
    dateModified: frontmatter.update ?? frontmatter.date,
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    keywords: frontmatter.tags,
  };
}

export function getBreadcrumbJsonLd(title: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };
}
