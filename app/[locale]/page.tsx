import { CoverEditor } from "@/components/magazine/CoverEditor";
import { headers } from "next/headers";
import { localEditorHost, localEditorEnabled } from "@/lib/cover-editor";
import { setRequestLocale } from "next-intl/server";
import { getAllPosts } from "@/lib/mdx";
import { homePosts } from "@/lib/magazine";
import { ArticleCoverCard } from "@/components/magazine/ArticleCoverCard";
import type { Locale } from "@/i18n/routing";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = homePosts(await getAllPosts(locale));
  const editor = localEditorEnabled() && localEditorHost((await headers()).get("host"));
  return (
    <section className="magazine-home" aria-label={locale === "ja" ? "記事を読む" : "The journal"}>
      {editor ? <CoverEditor posts={posts} locale={locale} /> : <>
      <h1 className="sr-only">Darkmocha Journal</h1>
      <div className="journal-grid">
        {posts.map((post, index) => <ArticleCoverCard key={post.slug} post={post} priority={index === 0} />)}
      </div>
      </>}
    </section>
  );
}
