"use client"; // 必要ならつける（親がclientならなくても動きますが明示）

import React from "react";
import {
  Files,
  Search,
  GitGraph,
  Bug,
  Settings,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// 親から受け取るデータの型定義
type ActivityBarProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export const ActivityBar = ({
  isSidebarOpen,
  onToggleSidebar,
}: ActivityBarProps) => {
  return (
    <aside className="w-12 bg-[#333333] flex flex-col items-center py-4 z-40 shrink-0 select-none h-full border-r border-[#252526]">
      {/* 上部アイコン群 */}
      <div className="flex flex-col gap-6 w-full items-center">
        {/* --- Files Icon (Toggle Button) --- */}
        <div
          onClick={onToggleSidebar} // クリックで切り替え
          className={cn(
            "cursor-pointer w-full flex justify-center py-1 transition-all border-l-2 hover:opacity-100",
            // サイドバーが開いている時は「白線＋白アイコン」、閉じている時は「透明線＋グレーアイコン」
            isSidebarOpen ?
              "border-white opacity-100"
            : "border-transparent opacity-50 text-[#858585]",
          )}
        >
          <Files
            className={cn(
              "w-6 h-6",
              isSidebarOpen ? "text-white" : "text-[#858585]",
            )}
          />
        </div>

        {/* Inactive Icons (Search, Git...) */}
        {/* これらは今回は機能させず、常に非アクティブ表示にします */}
        <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center transition-opacity border-l-2 border-transparent">
          <Search className="w-6 h-6 text-[#858585]" />
        </div>
        <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center transition-opacity border-l-2 border-transparent">
          <GitGraph className="w-6 h-6 text-[#858585]" />
        </div>
        <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center transition-opacity border-l-2 border-transparent">
          <Bug className="w-6 h-6 text-[#858585]" />
        </div>
      </div>

      {/* 下部アイコン群 */}
      <div className="mt-auto flex flex-col gap-6 mb-4 w-full items-center">
        <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center border-l-2 border-transparent">
          <UserCircle className="w-6 h-6 text-[#858585]" />
        </div>
        <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center border-l-2 border-transparent">
          <Settings className="w-6 h-6 text-[#858585]" />
        </div>
      </div>
    </aside>
  );
};
