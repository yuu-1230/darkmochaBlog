import React from "react";
import { Files, Search, GitGraph, Bug, Settings, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarView } from "./main-layout";

type ActivityBarProps = {
  activeView: SidebarView;
  isSidebarOpen: boolean;
  onToggleSidebar: (view: SidebarView) => void;
};

export const ActivityBar = ({ activeView, isSidebarOpen, onToggleSidebar }: ActivityBarProps) => {
  return (
    <nav className="w-12 bg-[#333333] flex flex-col items-center py-4 z-40 shrink-0 select-none h-full border-r border-[#252526]">
      <div className="flex flex-col gap-6 w-full items-center">
        {/* Explorer ボタン (ファイルアイコン) */}
        <button
          type="button"
          onClick={() => onToggleSidebar("explorer")}
          className={cn(
            "cursor-pointer w-full flex justify-center py-1 transition-all border-l-2",
            activeView === "explorer" && isSidebarOpen ? "border-white opacity-100" : "border-transparent opacity-50 text-[#858585]",
          )}
        >
          <Files className={cn("w-6 h-6", activeView === "explorer" && isSidebarOpen ? "text-white" : "text-[#858585]")} />
        </button>

        {/* Outline ボタン (検索アイコンを代用) */}
        <button
          type="button"
          onClick={() => onToggleSidebar("toc")}
          className={cn(
            "cursor-pointer w-full flex justify-center py-1 transition-all border-l-2",
            activeView === "toc" && isSidebarOpen ? "border-white opacity-100" : "border-transparent opacity-50 text-[#858585]",
          )}
        >
          <Search className={cn("w-6 h-6", activeView === "toc" && isSidebarOpen ? "text-white" : "text-[#858585]")} />
        </button>

        <GitGraph className="w-6 h-6 text-[#858585] opacity-50" />
        <Bug className="w-6 h-6 text-[#858585] opacity-50" />
      </div>
      <div className="mt-auto flex flex-col gap-6 mb-4 w-full items-center">
        <UserCircle className="w-6 h-6 text-[#858585] opacity-50" />
        <Settings className="w-6 h-6 text-[#858585] opacity-50" />
      </div>
    </nav>
  );
};