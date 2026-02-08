import { getPost, getAllPosts } from "@/lib/mdx";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote-client/rsc";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post;
  try {
    post = getPost(slug);
  } catch {
    notFound();
  }

  return (
    <article className="prose dark:prose-invert mx-auto py-10 px-4 max-w-3xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{post.frontmatter.title}</h1>
        <p className="text-gray-500">{post.frontmatter.date}</p>
      </div>
      <hr className="my-8" />
      <MDXRemote source={post.content} />
    </article>
  );
}
