import React from "react";
import {
  Minus,
  Square,
  X,
  ArrowLeft,
  ArrowRight,
  Search,
  LayoutTemplate,
  Sidebar as SidebarIcon,
  PanelBottom,
} from "lucide-react";
import { VscVscode } from "react-icons/vsc";

export const TitleBar = () => {
  return (
    <div className="h-8 bg-[#181818] flex items-center justify-between px-2 select-none text-[#CCCCCC] text-[13px] border-b border-[#1E1E1E] w-full shrink-0">
      {/* 左側: ロゴ & メニュー */}
      <div className="flex items-center gap-4">
        {/* VS Code Logo (青) */}
        <div className="flex items-center justify-center pl-1">
          {/* react-icons が入っていない場合は lucide の <Code2 className="w-4 h-4 text-[#007ACC]" /> で代用可 */}
          <VscVscode className="w-4 h-4 text-[#007ACC]" />
        </div>

        {/* メニューバー (File, Edit...) */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            File
          </span>
          <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            Edit
          </span>
          <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            Selection
          </span>
          <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            View
          </span>
          <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            Go
          </span>
          <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            Run
          </span>
          <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            Terminal
          </span>
          <span className="hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            Help
          </span>
        </div>
      </div>

      {/* 中央: ナビゲーション & コマンドパレット */}
      <div className="flex items-center gap-3 flex-1 justify-center max-w-2xl px-4">
        {/* ナビゲーション矢印 */}
        <div className="hidden sm:flex items-center gap-2 text-gray-400">
          <ArrowLeft className="w-4 h-4 hover:text-white cursor-pointer" />
          <ArrowRight className="w-4 h-4 hover:text-white cursor-pointer" />
        </div>

        {/* 検索窓 (コマンドパレット風) */}
        <div className="flex items-center bg-[#2A2D2E] border border-[#3C3C3C] rounded-md px-2 py-0.5 w-full max-w-md text-gray-400 hover:border-[#555] cursor-pointer group">
          <Search className="w-3.5 h-3.5 mr-2 group-hover:text-white" />
          <span className="text-xs truncate group-hover:text-white">
            darkmocha_blog
          </span>
        </div>
      </div>

      {/* 右側: レイアウト操作 & ウィンドウボタン */}
      <div className="flex items-center gap-2">
        {/* レイアウト切り替えアイコン群 */}
        <div className="hidden sm:flex items-center gap-2 pr-3 border-r border-gray-700 mr-1 text-gray-400">
          <SidebarIcon className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
          <PanelBottom className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
          <LayoutTemplate className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
        </div>

        {/* ウィンドウ操作ボタン (飾り) */}
        <div className="flex items-center gap-3 pl-2">
          <Minus className="w-4 h-4 hover:bg-white/10 rounded cursor-pointer" />
          <Square className="w-3.5 h-3.5 hover:bg-white/10 rounded cursor-pointer" />
          <X className="w-4 h-4 hover:bg-[#E81123] hover:text-white rounded cursor-pointer transition-colors" />
        </div>
      </div>
    </div>
  );
};
