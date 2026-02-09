import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import {
  FileText,
  Search,
  User,
  Coffee,
  ArrowRight,
  Github,
  MonitorPlay,
} from "lucide-react";

export default function Home() {
  // 記事を取得 (日付順にソート済み)
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 5); // 最新5件を表示
  const latestPost = posts[0]; // 最新記事（Startセクション用）

  return (
    <div className="relative h-full w-full bg-[#1f1f1f] overflow-x-hidden text-[#cccccc] font-sans overflow-y-auto p-8 md:p-16 select-none">
      <div className="absolute bottom-[-50px] right-[-50px] opacity-[0.04] pointer-events-none rotate-[-15deg]">
        <Coffee size={400} />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto z-10 relative">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-light mb-2 tracking-tight text-[#cccccc]">
            Darkmocha Blog
          </h1>
          <p className="text-xl text-[#858585] font-light flex items-center gap-2">
            Code, Coffee, and Creative Engineering.
          </p>
        </div>

        {/* Two Columns Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left Column: Start */}
          <section>
            <h2 className="text-xl font-normal mb-4 text-[#cccccc]">Start</h2>
            <ul className="space-y-2">
              {/* Action: Read Latest Post */}
              {latestPost && (
                <li>
                  <Link
                    href={`/blog/${latestPost.slug}`}
                    className="group flex items-center gap-3 text-[#3794ff] hover:underline decoration-1 underline-offset-2 cursor-pointer py-1"
                  >
                    <FileText className="w-5 h-5 opacity-80 group-hover:opacity-100" />
                    <div className="flex flex-col leading-tight">
                      <span>Read Latest Post</span>
                      <span className="text-xs text-[#858585] no-underline">
                        {latestPost.frontmatter.title}
                      </span>
                    </div>
                  </Link>
                </li>
              )}

              {/* Action: Search / All Posts */}
              <li>
                <div className="group flex items-center gap-3 text-[#3794ff] hover:underline decoration-1 underline-offset-2 cursor-pointer py-1">
                  <Search className="w-5 h-5 opacity-80 group-hover:opacity-100" />
                  <span className="leading-tight">Search Posts...</span>
                </div>
              </li>

              {/* Action: About Me */}
              <li>
                <Link
                  href="/about"
                  className="group flex items-center gap-3 text-[#3794ff] hover:underline decoration-1 underline-offset-2 cursor-pointer py-1"
                >
                  <User className="w-5 h-5 opacity-80 group-hover:opacity-100" />
                  <span className="leading-tight">About Author</span>
                </Link>
              </li>

              {/* Action: Unity Projects */}
              <li>
                <div className="group flex items-center gap-3 text-[#3794ff] hover:underline decoration-1 underline-offset-2 cursor-pointer py-1">
                  <MonitorPlay className="w-5 h-5 opacity-80 group-hover:opacity-100" />
                  <span className="leading-tight">Play Unity Games</span>
                </div>
              </li>
            </ul>

            {/* Help / Socials Section */}
            <h2 className="text-xl font-normal mt-10 mb-4 text-[#cccccc]">
              Connect
            </h2>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/your-github-id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-[#3794ff] hover:underline decoration-1 underline-offset-2 cursor-pointer py-1"
                >
                  <Github className="w-5 h-5 opacity-80 group-hover:opacity-100" />
                  <span className="leading-tight">GitHub Repository</span>
                </a>
              </li>
            </ul>
          </section>

          {/* Right Column: Recent */}
          <section>
            <h2 className="text-xl font-normal mb-4 text-[#cccccc]">Recent</h2>
            <ul className="space-y-1">
              {recentPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block group py-1 px-2 -mx-2 rounded hover:bg-[#2a2d2e] transition-colors duration-100"
                  >
                    <div className="flex items-baseline justify-between w-full">
                      <span className="text-[#3794ff] group-hover:text-[#4daafc] text-[15px] truncate mr-2">
                        {post.frontmatter.title}
                      </span>
                      <span className="text-xs text-[#858585] shrink-0 font-mono">
                        {post.frontmatter.date}
                      </span>
                    </div>
                    <div className="text-xs text-[#858585] truncate font-mono opacity-70 group-hover:opacity-100">
                      ~/blog/{post.slug}.mdx
                    </div>
                  </Link>
                </li>
              ))}

              {/* もし記事がなければ */}
              {recentPosts.length === 0 && (
                <li className="text-[#858585] text-sm italic py-1">
                  No recent posts found.
                </li>
              )}
            </ul>

            <div className="mt-6">
              <Link
                href="/blog/archive" // アーカイブページを作るならここ
                className="text-xs text-[#3794ff] hover:underline flex items-center gap-1"
              >
                View all posts <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
