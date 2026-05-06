import { getAllPosts } from "@/lib/mdx";
import { HomeClient } from "@/components/home-client";

const RECENT_COUNT = 5;

export default async function Home() {
  const allPosts = await getAllPosts();
  const recentPosts = allPosts.slice(0, RECENT_COUNT);

  return <HomeClient recentPosts={recentPosts} />;
}
