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
    // MainLayout側ですでに <aside> で囲んでいますが、コンポーネント単体としても独立させるために <nav> を使用
    <nav
      aria-label="Activity Bar"
      className="w-12 bg-[#333333] flex flex-col items-center py-4 z-40 shrink-0 select-none h-full border-r border-[#252526]"
    >
      <div
        role="group"
        aria-label="Primary views"
        className="flex flex-col gap-6 w-full items-center"
      >
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Explorer" // アイコンの意味をテキストで定義
          aria-expanded={isSidebarOpen} // サイドバーが開いているか閉じているかの状態を伝える
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
        </button>

        <button
          type="button"
          aria-label="Search"
          className="opacity-50 hover:opacity-100 w-full flex justify-center transition-opacity border-l-2 border-transparent"
        >
          <Search className="w-6 h-6 text-[#858585]" />
        </button>
        <button
          type="button"
          aria-label="Source Control"
          className="opacity-50 hover:opacity-100 w-full flex justify-center transition-opacity border-l-2 border-transparent"
        >
          <GitGraph className="w-6 h-6 text-[#858585]" />
        </button>
        <button
          type="button"
          aria-label="Run and Debug"
          className="opacity-50 hover:opacity-100 w-full flex justify-center transition-opacity border-l-2 border-transparent"
        >
          <Bug className="w-6 h-6 text-[#858585]" />
        </button>
      </div>

      {/* 下部アイコン群 */}
      <div
        role="group"
        aria-label="Settings and Accounts"
        className="mt-auto flex flex-col gap-6 mb-4 w-full items-center"
      >
        <button
          type="button"
          aria-label="Accounts"
          className="opacity-50 hover:opacity-100 w-full flex justify-center border-l-2 border-transparent"
        >
          <UserCircle className="w-6 h-6 text-[#858585]" />
        </button>
        <button
          type="button"
          aria-label="Manage"
          className="opacity-50 hover:opacity-100 w-full flex justify-center border-l-2 border-transparent"
        >
          <Settings className="w-6 h-6 text-[#858585]" />
        </button>
      </div>
    </nav>
  );
};
