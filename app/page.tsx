import React from "react";
import { getAllPosts, PostData } from "@/lib/mdx";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

const Home = () => {
  const posts: PostData[] = getAllPosts();

  return (
    <main className="container mx-auto py-10 px-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 tracking-tight text-foreground">
        Latest Posts
      </h1>
      <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <Card className="flex flex-row overflow-hidden hover:shadow-lg hover:transition-all duration-300 cursor-pointer h-32 items-center rounded-lg bg-card">
              {post.frontmatter.image ?
                <div className="relative w-40 h-full shrink-0 overflow-hidden rounded-r-lg">
                  <Image
                    src={post.frontmatter.image}
                    alt={post.frontmatter.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              : <div className="w-32 h-full bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden rounded-r-lg">
                  <span className="text-muted-foreground/50 text-xs font-mono">
                    No Image
                  </span>
                </div>
              }
              <div className="flex flex-col justify-center p-4 w-full">
                <div className="flex items-center gap-2 mb-1">
                  {post.frontmatter.tags && (
                    <span className="text-[10px] text-primary font-bold uppercase tracking-widest border border-primary/20 px-1.5 py-0.5 rounded-sm">
                      {post.frontmatter.tags[0]}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold leading-tight mb-1 text-foreground group-hover:text-primary transition-colors duration-300">
                  {post.frontmatter.title}
                </h3>
                <div className="flex justify-between items-center mt-auto">
                  <p className="text-xs text-muted-foreground font-mono">
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
