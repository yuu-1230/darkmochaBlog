import React from "react";
import { getAllPosts, PostData } from "@/lib/mdx";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

const Home = () => {
  const posts: PostData[] = getAllPosts();
  return (
    <main className="container mx-auto py-10 px-6 max-w-5xl">
      <h1 className="test-3xl font-bold mb-8">Latest Posts</h1>
      {posts.map((post) => (
        <Link key={post.slug} href={`./blog/${post.slug}`}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{post.frontmatter.title}</CardTitle>
              <CardDescription>
                {post.frontmatter.date} {post.frontmatter.tags}
              </CardDescription>
            </CardHeader>
            <CardContent>{post.content}</CardContent>
          </Card>
        </Link>
      ))}
    </main>
  );
};

export default Home;
