import { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { Instagram, Youtube, ExternalLink } from "lucide-react";

export const linkComponents = {
  Link: ({
    href,
    children,
    ...props
  }: ComponentPropsWithoutRef<typeof Link>) => (
    <Link
      href={href}
      className="text-primary hover:underline underline-offset-4 cursor-pointer"
      {...props}
    >
      {children}
    </Link>
  ),

  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    if (href?.startsWith("#")) {
      return (
        <a
          href={href}
          className="text-primary hover:underline underline-offset-4 cursor-pointer"
          {...props}
        >
          {children}
        </a>
      );
    }
    if (href?.startsWith("/")) {
      return (
        <Link
          href={href}
          className="text-primary hover:underline underline-offset-4 cursor-pointer"
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        className="text-primary hover:underline underline-offset-4 cursor-pointer"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },

  InstagramLink: ({ href, title }: { href: string; title?: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="my-8 flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all group no-underline shadow-sm"
    >
      <div className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-2 rounded-full shrink-0">
        <Instagram className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm md:text-base font-medium text-foreground group-hover:text-foreground transition-colors truncate">
          {title || "Instagramで動画を見る"}
        </div>
        <div className="text-[10px] md:text-xs text-muted-foreground truncate mt-1 font-mono">
          {href}
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
    </a>
  ),

  YoutubeLink: ({ href, title }: { href: string; title?: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="my-8 flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent hover:border-primary/40 transition-all group no-underline shadow-sm"
    >
      <div className="bg-[#FF0000] p-2 rounded-full shrink-0">
        <Youtube className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm md:text-base font-medium text-foreground group-hover:text-foreground transition-colors truncate">
          {title || "YouTubeで動画を見る"}
        </div>
        <div className="text-[10px] md:text-xs text-muted-foreground truncate mt-1 font-mono">
          {href}
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
    </a>
  ),
};
