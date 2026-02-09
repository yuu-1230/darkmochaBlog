import React from "react";
import { getAllPosts, PostData } from "@/lib/mdx";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const Home = () => {
  const posts: PostData[] = getAllPosts();

  return (
    <main className="container mx-auto py-10 px-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <Card className="flex flex-row overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-32 items-center">
              {post.frontmatter.image ?
                <div className="relative w-40 h-full shrink-0 overflow-hidden rounded-r-lg">
                  <Image
                    src={post.frontmatter.image}
                    alt={post.frontmatter.title}
                    fill
                    className="object-cover"
                  />
                </div>
              : <div className="w-32 h-full bg-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-gray-300 text-xs">No Image</span>
                </div>
              }
              <div className="flex flex-col justify-center p-4 w-full">
                <div className="flex items-center gap-2 mb-1">
                  {post.frontmatter.tags && (
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      {post.frontmatter.tags[0]}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                  {post.frontmatter.title}
                </h3>
                <div className="flex justify-between items-center mt-auto">
                  <p className="text-xs text-gray-400">
                    {post.frontmatter.date}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default Home;
