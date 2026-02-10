import React from "react";
import { Minus, Square, X, Menu } from "lucide-react";

interface TitleBarProps {
  isMobile?: boolean;
  onToggleSidebar?: () => void;
}

export const TitleBar = ({
  isMobile = false,
  onToggleSidebar,
}: TitleBarProps) => {
  return (
    <div className="h-10 md:h-8 bg-[#181818] flex items-center justify-between px-3 select-none text-[#CCCCCC] text-[13px] border-b border-[#1E1E1E] w-full shrink-0">
      {/* 左側: メニューボタン & タイトル */}
      <div className="flex items-center gap-3">
        {/* スマホのみメニューボタンを表示 */}
        {isMobile && (
          <button
            onClick={onToggleSidebar}
            className="p-1 hover:bg-[#333] rounded text-[#CCCCCC]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="font-medium text-xs tracking-wide opacity-90 truncate">
          DARKMOCHA_BLOG
        </div>
      </div>

      {/* 右側: ウィンドウ操作ボタン (PCのみ表示) */}
      {!isMobile && (
        <div className="flex items-center gap-3">
          <Minus className="w-4 h-4 hover:bg-white/10 rounded cursor-pointer p-0.5" />
          <Square className="w-3.5 h-3.5 hover:bg-white/10 rounded cursor-pointer p-0.5" />
          <X className="w-4 h-4 hover:bg-[#E81123] hover:text-white rounded cursor-pointer transition-colors p-0.5" />
        </div>
      )}
    </div>
  );
};
