import { setRequestLocale } from "next-intl/server";
import { getAllPosts } from "@/lib/mdx";
import { HomeClient } from "@/components/home-client";
import type { Locale } from "@/i18n/routing";

const RECENT_COUNT = 5;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allPosts = await getAllPosts();

  const pinnedPosts = allPosts
    .filter((post) => post.frontmatter.pinned)
    .sort((a, b) => {
      const aDate = a.frontmatter.update ?? a.frontmatter.date;
      const bDate = b.frontmatter.update ?? b.frontmatter.date;
      return aDate < bDate ? 1 : -1;
    });

  const recentPosts = allPosts
    .filter((post) => !post.frontmatter.pinned)
    .slice(0, RECENT_COUNT);

  return <HomeClient pinnedPosts={pinnedPosts} recentPosts={recentPosts} />;
}
