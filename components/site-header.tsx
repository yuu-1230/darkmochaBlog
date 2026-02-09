import Link from "next/link";
import { SiGithub, SiX } from "react-icons/si"; // ブランドアイコン
import { Search } from "lucide-react"; // UIアイコン
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* max-w-5xl と px-6 を追加して、記事やフッターと幅を揃える */}
      <div className="container flex h-14 items-center mx-auto px-6 max-w-5xl">
        {/* 左側: ロゴとメインナビゲーション */}
        <div className="mr-4 flex">
          <Link
            href="/"
            className="mr-6 flex items-center space-x-2 font-bold text-lg tracking-tight"
          >
            {/* ロゴを少し大きく、詰まった感じに */}
            <span>Darkmocha</span>
          </Link>

          {/* PCでのみ表示するナビゲーション */}
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/blog"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
            <Link
              href="/projects"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Projects
            </Link>
          </nav>
        </div>

        {/* 右側: ツール類（SNS, 検索など） */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-1">
            {/* GitHubリンク */}
            <Link
              href="https://github.com/your-id"
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "icon",
                  }),
                  "h-8 w-8 px-0",
                )}
              >
                <SiGithub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>

            {/* X (Twitter) リンク */}
            <Link href="https://x.com/your-id" target="_blank" rel="noreferrer">
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "icon",
                  }),
                  "h-8 w-8 px-0",
                )}
              >
                <SiX className="h-4 w-4" />
                <span className="sr-only">X</span>
              </div>
            </Link>

            {/* 将来のための検索ボタン（見た目だけ） */}
            <div
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                }),
                "h-8 w-8 px-0",
              )}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
