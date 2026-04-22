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

  // MDXテキストの中から ## と ### を抽出
  const headings = Array.from(content.matchAll(/^(##|###)\s+(.*)$/gm)).map(
    (match) => {
      const level = match[1].length; // 2 or 3
      const rawText = match[2].trim();
      const id = slugger.slug(rawText);

      // 1, 1-1 の番号を生成
      let numberLabel = "";
      if (level === 2) {
        h2Count++;
        h3Count = 0; // h2が変わったらh3のカウントをリセット
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

// --- 1. 文字色変更用コンポーネント <C c="red">... ---
export const C = ({ c, children }: { c: string; children: React.ReactNode }) => {
  const colorMap: Record<string, string> = {
    red: "text-[#f4b1a2]",
    blue: "text-[#acdaff]",
    green: "text-[#b9ffdc]",
    orange: "text-[#ce9178]",
    yellow: "text-[#dcdcaa]",
    purple: "text-[#c586c0]",
    comment: "text-[#6a9955]",
    gray: "text-[#808080]",
  };

  const className = colorMap[c];

  return className ?
      <span className={className}>{children}</span>
    : <span style={{ color: c }}>{children}</span>;
};

// --- Custom MDX Components ---
export const mdxComponents = {
  // Linkコンポーネントをカスタマイズ（VS Code風の青色）
  Link: ({
    href,
    children,
    ...props
  }: ComponentPropsWithoutRef<typeof Link>) => (
    <Link
      href={href}
      className="text-[#3794ff] hover:underline decoration-[#c08457] underline-offset-4 cursor-pointer"
      {...props}
    >
      {children}
    </Link>
  ),

  C,
  h1: (props: ComponentPropsWithoutRef<"h1">) => (
    <h1
      className="text-3xl font-bold text-white mt-12 mb-6 border-b border-[#f5e6d3] pb-2"
      {...props}
    />
  ),
  // rehype-slug が付与した id は ...props に含まれるため、ジャンプ機能がそのまま動きます！
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="text-2xl font-semibold text-[#d4a373] mt-4 mb-4 flex items-center gap-2 pt-4 -mt-4"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="text-xl font-medium text-[#a47148] mt-4 mb-3 pt-0"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <div className="text-[#ffffffdb] leading-8 mb-6 text-[16px]" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="overflow-x-auto mb-8">
      <table
        className="w-full text-left border-collapse border border-[#333]"
        {...props}
      />
    </div>
  ),
  thead: (props: ComponentPropsWithoutRef<"thead">) => (
    <thead className="bg-[#252526]" {...props} />
  ),
  tbody: (props: ComponentPropsWithoutRef<"tbody">) => (
    <tbody className="divide-y divide-[#333]" {...props} />
  ),
  tr: (props: ComponentPropsWithoutRef<"tr">) => (
    <tr className="hover:bg-[#2a2d2e] transition-colors" {...props} />
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="px-4 py-3 font-bold text-[#cccccc] border border-[#333] whitespace-nowrap"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="px-4 py-3 text-[#a0a0a0] border border-[#333]" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="list-disc list-inside mb-6 text-[#cccccc] space-y-2 ml-4"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="list-decimal list-inside mb-6 text-[#cccccc] space-y-2 ml-4"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => (
    <li className="leading-7" {...props} />
  ),
  // 通常のリンク(aタグ)も青色のLinkに置き換える設定（自動最適化）
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    // ページ内リンク（#から始まるもの）の対応を追加
    if (href?.startsWith("#")) {
      return (
        <a
          href={href}
          className="text-[#3794ff] hover:underline decoration-[#3794ff] underline-offset-4 cursor-pointer"
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
          className="text-[#3794ff] hover:underline decoration-[#3794ff] underline-offset-4 cursor-pointer"
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        className="text-[#3794ff] hover:underline decoration-[#3794ff] underline-offset-4 cursor-pointer"
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
      className="border-l-4 border-[#3794ff] bg-[#252526] px-4 py-3 mb-6 text-[#a0a0a0] italic rounded-r"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="font-mono text-[#ce9178] bg-[#2d2d2d] px-1.5 py-0.5 rounded text-sm mx-1"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre
      className="bg-[#1e1e1e] border border-[#333] rounded-lg p-4 overflow-x-auto mb-8 text-sm font-mono leading-relaxed"
      {...props}
    />
  ),
  ImageSlider,
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <ImageSlider images={typeof props.src === "string" ? props.src : ""} />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="border-[#333] my-10" {...props} />
  ),
  InstagramLink: ({ href, title }: { href: string; title?: string }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="my-8 flex items-center gap-4 p-4 rounded-xl border border-[#333] bg-[#252526] hover:bg-[#2a2d2e] hover:border-[#569cd6] transition-all group no-underline shadow-sm"
    >
      {/* インスタ風のグラデーションアイコン */}
      <div className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] p-2 rounded-full shrink-0">
        <Instagram className="w-5 h-5 text-white" />
      </div>

      {/* テキスト部分 */}
      <div className="flex-1 min-w-0">
        <div className="text-sm md:text-base font-medium text-[#cccccc] group-hover:text-white transition-colors truncate">
          {title || "Instagramで動画を見る"}
        </div>
        <div className="text-[10px] md:text-xs text-[#858585] truncate mt-1 font-mono">
          {href}
        </div>
      </div>

      {/* 矢印アイコン */}
      <ExternalLink className="w-4 h-4 text-[#858585] group-hover:text-white transition-colors shrink-0" />
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
    // タイプに合わせて色とアイコンを切り替える
    const config = {
      tip: {
        color: "text-[#dcdcaa]",
        border: "border-[#dcdcaa]",
        bg: "bg-[#dcdcaa]/10",
        icon: <Lightbulb className="w-5 h-5 shrink-0" />,
        defaultTitle: "TIPS",
      },
      warning: {
        color: "text-[#ce9178]",
        border: "border-[#ce9178]",
        bg: "bg-[#ce9178]/10",
        icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
        defaultTitle: "WARNING",
      },
      info: {
        color: "text-[#569cd6]",
        border: "border-[#569cd6]",
        bg: "bg-[#569cd6]/10",
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
          {/* 👇 ここがポイント！開いた時に90度回転（▶ から ▼ になる）アニメーション */}
          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-open:rotate-90 shrink-0" />

          {style.icon}
          <span>{title || style.defaultTitle}</span>
        </summary>

        {/* 中身の文章 */}
        <div className="text-[#cccccc] text-sm md:text-base leading-relaxed px-4 pb-4 md:px-5 md:pb-5 pt-0 mt-2">
          {children}
        </div>
      </details>
    );
  },
};
