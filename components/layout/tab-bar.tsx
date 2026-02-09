"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { findFileByPath, TSXIcon } from "@/lib/file-tree";

export const TabBar = () => {
  const pathname = usePathname();

  // 現在のパスに基づいてファイル情報を取得
  const activeFile = findFileByPath(pathname);

  // 見つからなかった場合のデフォルト表示 (例: 動的ルートなど)
  const displayFile = activeFile || {
    name: "preview.tsx", // 該当なしの場合の名前
    icon: <TSXIcon color="blue" />,
  };

  return (
    <header className="h-8 bg-[#252526] flex items-center overflow-x-auto select-none scrollbar-hide shrink-0">
      {/* Active Tab */}
      <div className="h-full bg-[#1E1E1E] px-3 flex items-center min-w-fit border-t border-t-transparent border-r border-r-[#252526] pr-2 relative group cursor-pointer border-t-[1px] data-[state=active]:border-t-blue-400">
        <span className="mr-2 shrink-0">{displayFile.icon}</span>
        <span className="text-sm text-[#ffffff] mr-2 italic whitespace-nowrap">
          {displayFile.name}
        </span>
        <div className="opacity-0 group-hover:opacity-100 hover:bg-[#4E4E4E] rounded p-0.5 transition-opacity">
          <X className="w-3 h-3 text-gray-200" />
        </div>
      </div>

      {/* Inactive Tab (Decoration) */}
      <div className="h-full bg-transparent px-3 flex items-center min-w-fit border-r border-r-[#252526] pr-2 text-[#969696] hover:bg-[#2A2D2E] cursor-pointer opacity-70">
        <span className="mr-2 text-[10px] font-bold w-4 text-center">
          <TSXIcon color="blue" />
        </span>
        <span className="text-sm italic">layout.tsx</span>
      </div>
    </header>
  );
};
