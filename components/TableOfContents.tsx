"use client";

import React, { useEffect, useState } from "react";
import { List } from "lucide-react";
import { cn } from "@/lib/utils";

export type TocItem = {
  level: number;
  text: string;
  id: string;
  numberLabel: string;
};

type TableOfContentsProps = {
  toc: TocItem[];
  className?: string;
  isSidebar?: boolean;
};

export const TableOfContents = ({ toc, className, isSidebar = false }: TableOfContentsProps) => {
  // 1. 現在表示中の見出しIDを管理するState
  const [activeId, setActiveId] = useState<string>("");

  // 2. スクロール検知（ハイライト）のロジック
  useEffect(() => {
    // 画面の上部付近（10%〜40%の位置）を見出しが通過した時にアクティブにする設定
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0px -60% 0px" } 
    );

    // 各見出し（h2, h3）を監視対象に追加
    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <div
      className={cn(
        isSidebar ?
          // サイドバー用デザイン：フォントサイズを小さく(text-[13px])、全体を控えめな色(#858585)に
          "w-full h-full text-[#858585] text-[13px] font-sans" 
        : "mb-10 bg-[#1e1e1e] border border-[#333] rounded-lg p-5 md:p-6 shadow-sm",
        className
      )}
    >
      {!isSidebar && (
        <div className="flex items-center gap-2 text-white font-bold mb-4 border-b border-[#333] pb-3 text-lg">
          <List className="w-5 h-5 text-[#569cd6]" />
          目次
        </div>
      )}

      {/* サイドバーの場合は縦の余白を詰める(space-y-1.5) */}
      <ul className={cn("space-y-3", isSidebar && "space-y-1.5")}>
        {toc.map((heading, index) => {
          // 現在の見出しがアクティブかどうか
          const isActive = activeId === heading.id;

          return (
            <li
              key={index}
              className={cn(
                heading.level === 3 ? "ml-4" : "font-medium mt-3 first:mt-0",
                isSidebar && "mt-1.5"
              )}
            >
              <a
                href={`#${heading.id}`}
                className={cn(
                  "flex items-start gap-2 transition-all duration-200",
                  isSidebar ?
                    // サイドバー時: アクティブなら「白文字＋左側に青ライン」でハイライト
                    isActive ? "text-white border-l-2 border-[#3794ff] -ml-[2px] pl-[2px]" : "hover:text-[#cccccc] border-l-2 border-transparent -ml-[2px] pl-[2px]"
                  : // メイン記事内: 通常は青色ホバーのみ
                    "text-[#cccccc] hover:text-[#3794ff] hover:underline underline-offset-4"
                )}
              >
                <span 
                  className={cn(
                    "font-mono shrink-0", 
                    isActive && isSidebar ? "text-[#3794ff]" : "text-[#858585]"
                  )}
                >
                  {heading.numberLabel} |
                </span>
                <span 
                  className={cn(
                    "line-clamp-2 leading-snug", 
                    isActive && isSidebar && "font-bold text-white"
                  )}
                >
                  {heading.text}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};