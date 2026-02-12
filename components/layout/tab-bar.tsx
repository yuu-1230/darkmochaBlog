"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { findFileByPath, TSXIcon, FileNode } from "@/lib/file-tree";

export const TabBar = ({ tree }: { tree: FileNode[] }) => {
  const pathname = usePathname();

  const activeFile = findFileByPath(tree, pathname);

  const displayFile = activeFile || {
    name: "preview.tsx",
    icon: <TSXIcon color="blue" />,
  };

  return (
    // <header> ではなく、タブのリスト（ul）として定義します
    // role="tablist" を付与することで、AIやリーダーに「これはタブの集まりである」と伝える
    <ul
      role="tablist"
      aria-label="Open Editors"
      className="h-8 w-full bg-[#252526] flex items-center overflow-x-auto select-none scrollbar-hide shrink-0 m-0 p-0"
    >
      {/* --- Active Tab --- */}
      {/* タブの1要素として <li> を使用 */}
      <li
        role="presentation"
        className="h-full bg-[#1E1E1E] flex items-center min-w-fit border-t-[1px] border-t-blue-400 border-r border-r-[#252526] pr-2 pl-3 relative group"
      >
        {/* タブを選択するためのボタン */}
        <button
          type="button"
          role="tab"
          aria-selected="true" // 今開いているタブであることを明示
          aria-label={`${displayFile.name}, active`}
          className="flex items-center h-full outline-none cursor-pointer"
        >
          <span className="mr-2 shrink-0">{displayFile.icon}</span>
          <span className="text-sm text-[#ffffff] mr-2 italic whitespace-nowrap">
            {displayFile.name}
          </span>
        </button>

        {/* 閉じるためのボタン（独立させることでHTMLのエラーを防ぐ） */}
        <button
          type="button"
          aria-label={`Close ${displayFile.name}`}
          className="opacity-0 group-hover:opacity-100 hover:bg-[#4E4E4E] rounded p-0.5 transition-opacity cursor-pointer outline-none"
        >
          <X className="w-3 h-3 text-gray-200" />
        </button>
      </li>

      {/* --- Inactive Tab (layout.tsx) --- */}
      <li
        role="presentation"
        className="h-full bg-transparent flex items-center min-w-fit border-r border-r-[#252526] pr-2 pl-3 text-[#969696] hover:bg-[#2A2D2E] opacity-70"
      >
        <button
          type="button"
          role="tab"
          aria-selected="false" // 選択されていないタブであることを明示
          aria-label="layout.tsx, inactive"
          className="flex items-center h-full outline-none"
        >
          <span className="mr-2 text-[10px] font-bold w-4 text-center">
            <TSXIcon color="blue" />
          </span>
          <span className="text-sm italic">layout.tsx</span>
        </button>
      </li>
    </ul>
  );
};
