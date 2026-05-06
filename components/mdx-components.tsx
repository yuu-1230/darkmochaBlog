import React, { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import {
  Lightbulb,
  AlertTriangle,
  Info,
  ChevronRight,
  Instagram,
  ExternalLink,
} from "lucide-react";
import GithubSlugger from "github-slugger";
import ImageSlider from "@/components/ImageSlider";

// --- 目次（TOC）を自動生成＆番号付けする関数 ---
export function generateTOC(content: string) {
  const slugger = new GithubSlugger();
  let h2Count = 0;
  let h3Count = 0;

  const headings = Array.from(content.matchAll(/^(##|###)\s+(.*)$/gm)).map(
    (match) => {
      const level = match[1].length; // 2 or 3
      const rawText = match[2].trim();
      const id = slugger.slug(rawText);

      let numberLabel = "";
      if (level === 2) {
        h2Count++;
        h3Count = 0;
        numberLabel = `${h2Count}`;
      } else if (level === 3) {
        h3Count++;
        numberLabel = `${h2Count}-${h3Count}`;
      }

      return { level, text: rawText, id, numberLabel };
    },
  );

  return headings;
}

// --- 文字色変更用コンポーネント <C c="red">...</C> ---
export const C = ({ c, children }: { c: string; children: React.ReactNode }) => {
  const colorMap: Record<string, string> = {
    red: "text-rose-500",
    blue: "text-blue-500",
    green: "text-emerald-500",
    orange: "text-orange-400",
    yellow: "text-yellow-400",
    purple: "text-purple-500",
    comment: "text-slate-400",
    gray: "text-slate-400",
  };

  const className = colorMap[c];

  return className ? (
    <span className={className}>{children}</span>
  ) : (
    <span style={{ color: c }}>{children}</span>
  );
};

// --- Custom MDX Components ---
export const mdxComponents = {
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

  C,

  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="text-3xl font-bold text-foreground mt-12 mb-6 border-b pb-2"
      {...props}
    />
  ),
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="text-2xl font-semibold text-foreground mt-10 mb-4 pt-4 -mt-4"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="text-xl font-medium text-foreground mt-6 mb-3"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <div className="text-foreground/90 leading-8 mb-6 text-base" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto mb-8">
      <table
        className="w-full text-left border-collapse border border-border"
        {...props}
      />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-muted" {...props} />
  ),
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => (
    <tbody className="divide-y divide-border" {...props} />
  ),
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr className="hover:bg-accent transition-colors" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-4 py-3 font-bold text-foreground border border-border whitespace-nowrap"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="px-4 py-3 text-muted-foreground border border-border" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="list-disc list-inside mb-6 text-foreground space-y-2 ml-4"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-decimal list-inside mb-6 text-foreground space-y-2 ml-4"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-7" {...props} />
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
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="border-l-4 border-primary/50 bg-muted px-4 py-3 mb-6 text-muted-foreground italic rounded-r"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="font-mono text-rose-500 bg-muted px-1.5 py-0.5 rounded text-sm mx-1"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="bg-card border border-border rounded-lg p-4 overflow-x-auto mb-8 text-sm font-mono leading-relaxed"
      {...props}
    />
  ),
  ImageSlider,
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <ImageSlider images={typeof props.src === "string" ? props.src : ""} />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="border-border my-10" {...props} />
  ),
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
  Tip: ({
    children,
    type = "tip",
    title,
  }: {
    children: React.ReactNode;
    type?: "tip" | "warning" | "info";
    title?: string;
  }) => {
    const config = {
      tip: {
        color: "text-amber-600 dark:text-amber-400",
        border: "border-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        icon: <Lightbulb className="w-5 h-5 shrink-0" />,
        defaultTitle: "TIPS",
      },
      warning: {
        color: "text-orange-600 dark:text-orange-400",
        border: "border-orange-400",
        bg: "bg-orange-50 dark:bg-orange-950/30",
        icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
        defaultTitle: "WARNING",
      },
      info: {
        color: "text-blue-600 dark:text-blue-400",
        border: "border-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950/30",
        icon: <Info className="w-5 h-5 shrink-0" />,
        defaultTitle: "INFO",
      },
    };

    const style = config[type];

    return (
      <details
        className={`my-8 border-l-4 ${style.border} ${style.bg} rounded-r-lg shadow-sm group cursor-pointer`}
      >
        <summary
          className={`flex items-center gap-2 font-bold ${style.color} p-4 md:p-5 outline-none list-none [&::-webkit-details-marker]:hidden`}
        >
          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-open:rotate-90 shrink-0" />
          {style.icon}
          <span>{title || style.defaultTitle}</span>
        </summary>
        <div className="text-foreground/90 text-sm md:text-base leading-relaxed px-4 pb-4 md:px-5 md:pb-5 pt-0 mt-2">
          {children}
        </div>
      </details>
    );
  },
};
