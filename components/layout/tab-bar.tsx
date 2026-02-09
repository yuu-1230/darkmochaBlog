"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const TabBar = () => {
  const pathname = usePathname();

  // パスとファイル名のマッピング
  const getFileInfo = (path: string) => {
    if (path === "/")
      return { name: "page.tsx", icon: "TSX", color: "text-yellow-400" };
    if (path.startsWith("/blog/"))
      return { name: "post.mdx", icon: "MD", color: "text-blue-300" };
    if (path === "/about")
      return { name: "readme.md", icon: "i", color: "text-blue-400" };
    return { name: "layout.tsx", icon: "TSX", color: "text-blue-400" };
  };

  const currentFile = getFileInfo(pathname);

  return (
    <header className="h-9 bg-[#252526] flex items-center overflow-x-auto select-none scrollbar-hide shrink-0">
      {/* Active Tab (現在のページ) */}
      <div className="h-full bg-[#1E1E1E] px-3 flex items-center min-w-fit border-t border-t-transparent border-r border-r-[#252526] pr-2 relative group cursor-pointer border-t-[1px] border-t-transparent data-[state=active]:border-t-blue-400">
        <span
          className={cn(
            "mr-2 text-xs font-bold w-4 text-center",
            currentFile.color,
          )}
        >
          {currentFile.icon}
        </span>
        <span className="text-sm text-[#ffffff] mr-2 italic">
          {currentFile.name}
        </span>
        <X className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded p-0.5" />
      </div>

      {/* Inactive Tab  */}
      <div className="h-full bg-transparent px-3 flex items-center min-w-fit border-r border-r-[#252526] pr-2 text-[#969696] hover:bg-[#2A2D2E] cursor-pointer opacity-70">
        <span className="text-blue-400 mr-2 text-xs font-bold w-4 text-center">
          TSX
        </span>
        <span className="text-sm italic">layout.tsx</span>
      </div>
    </header>
  );
};
