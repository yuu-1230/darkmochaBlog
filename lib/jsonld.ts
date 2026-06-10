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
    mainEntityOfPage: `${SITE_URL}/blog/${slug}`,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    keywords: frontmatter.tags,
  };
}
