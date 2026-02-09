import Link from "next/link";
import { SiGithub, SiX } from "react-icons/si";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto px-6 max-w-5xl">
        <div className="mr-4 flex">
          <Link
            href="/"
            className="group mr-6 flex items-center space-x-2 font-bold text-lg tracking-tight"
          >
            <span className="font-mono text-xl font-bold text-primary flex items-center">
              Darkmocha
              <span className="ml-0.5 group-hover:animate-blink">_</span>
            </span>
          </Link>
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
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center gap-1">
            <Link
              href="https://github.com/yuu-1230"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
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
            <Link
              href="https://x.com/DarkmochaJP"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
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
                <SiX className="h-4 w-4" />
                <span className="sr-only">X</span>
              </div>
            </Link>
            <div
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                }),
                "h-8 w-8 px-0",
              )}
            >
              <Search className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
              <span className="sr-only">Search</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
