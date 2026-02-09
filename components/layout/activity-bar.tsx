import React from "react";
import {
  Files,
  Search,
  GitGraph,
  Bug,
  Settings,
  UserCircle,
} from "lucide-react";

export const ActivityBar = () => {
  return (
    <aside className="w-12 bg-[#333333] flex flex-col items-center py-4 z-40 shrink-0 select-none h-full border-r border-[#252526]">
      {/* 上部アイコン群 */}
      <div className="flex flex-col gap-6 w-full items-center">
        {/* Active State (Files) */}
        <div className="cursor-pointer border-l-2 border-white w-full flex justify-center py-1">
          <Files className="w-6 h-6 text-white" />
        </div>

        {/* Inactive Icons */}
        <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center transition-opacity">
          <Search className="w-6 h-6 text-[#858585]" />
        </div>
        <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center transition-opacity">
          <GitGraph className="w-6 h-6 text-[#858585]" />
        </div>
        <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center transition-opacity">
          <Bug className="w-6 h-6 text-[#858585]" />
        </div>
      </div>

      {/* 下部アイコン群 */}
      <div className="mt-auto flex flex-col gap-6 mb-4 w-full items-center">
        <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center transition-opacity">
          <UserCircle className="w-6 h-6 text-[#858585]" />
        </div>
        <div className="cursor-pointer opacity-50 hover:opacity-100 w-full flex justify-center transition-opacity">
          <Settings className="w-6 h-6 text-[#858585]" />
        </div>
      </div>
    </aside>
  );
};
