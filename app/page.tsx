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
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      <div className="grid gap-6  ">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow ">
              <CardHeader>
                <CardTitle>{post.frontmatter.title}</CardTitle>
                <CardDescription>
                  <span className="block mb-2">{post.frontmatter.date}</span>
                  {post.frontmatter.tags && (
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded dark:bg-slate-800">
                      {post.frontmatter.tags.join(", ")}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {post.frontmatter.description || "No description"}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Home;
