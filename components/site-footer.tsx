import Link from "next/link";
import { SiInstagram, SiBluesky, SiX, SiGithub } from "react-icons/si";

export const SiteFooter = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 mx-auto px-6 max-w-5xl">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Yuto Nagata. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/yuu-1230"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <SiGithub className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://www.instagram.com/darkmocha_jp"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <SiInstagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link
            href="https://x.com/DarkmochaJP"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <SiX className="h-5 w-5" />
            <span className="sr-only">X (Twitter)</span>
          </Link>

          <Link
            href="https://bsky.app/profile/darkmochajapan.bsky.social"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <SiBluesky className="h-5 w-5" />
            <span className="sr-only">Bluesky</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
