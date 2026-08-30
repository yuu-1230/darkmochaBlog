import "server-only";

import { getAllPosts } from "@/lib/mdx";
import { routing } from "@/i18n/routing";

const POST_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidPostId(postId: string): boolean {
  return postId.length <= 100 && POST_ID_PATTERN.test(postId);
}

export async function isPublishedPostId(postId: string): Promise<boolean> {
  if (!isValidPostId(postId)) return false;

  const postsByLocale = await Promise.all(
    routing.locales.map((locale) => getAllPosts(locale)),
  );

  return postsByLocale.some((posts) =>
    posts.some((post) => post.slug === postId),
  );
}
