"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { findFileByPath, TSXIcon, FileNode } from "@/lib/file-tree"; // 型と関数をインポート

export const TabBar = ({ tree }: { tree: FileNode[] }) => {
  const pathname = usePathname();

  const activeFile = findFileByPath(tree, pathname);

  const displayFile = activeFile || {
    name: "preview.tsx",
    icon: <TSXIcon color="blue" />,
  };

  return (
    <header className="h-8 bg-[#252526] flex items-center overflow-x-auto select-none scrollbar-hide shrink-0">
      <div className="h-full bg-[#1E1E1E] px-3 flex items-center min-w-fit border-t border-t-transparent border-r border-r-[#252526] pr-2 relative group cursor-pointer border-t-[1px] data-[state=active]:border-t-blue-400">
        <span className="mr-2 shrink-0">{displayFile.icon}</span>
        <span className="text-sm text-[#ffffff] mr-2 italic whitespace-nowrap">
          {displayFile.name}
        </span>
        <div className="opacity-0 group-hover:opacity-100 hover:bg-[#4E4E4E] rounded p-0.5 transition-opacity">
          <X className="w-3 h-3 text-gray-200" />
        </div>
      </div>
      <div className="h-full bg-transparent px-3 flex items-center min-w-fit border-r border-r-[#252526] pr-2 text-[#969696] hover:bg-[#2A2D2E] cursor-pointer opacity-70">
        <span className="mr-2 text-[10px] font-bold w-4 text-center">
          <TSXIcon color="blue" />
        </span>
        <span className="text-sm italic">layout.tsx</span>
      </div>
    </header>
  );
};
